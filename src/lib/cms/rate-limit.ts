type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();

function takeMemoryRateLimit(
  key: string,
  limit: number,
  windowMs: number,
): { ok: boolean; retryAfterSec: number } {
  const now = Date.now();
  const current = buckets.get(key);

  if (!current || now >= current.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfterSec: 0 };
  }

  if (current.count >= limit) {
    return {
      ok: false,
      retryAfterSec: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
    };
  }

  current.count += 1;
  return { ok: true, retryAfterSec: 0 };
}

/**
 * Durable rate limit via Upstash Redis REST when configured.
 * Falls back to in-memory (per instance) when env is missing or Redis fails.
 */
async function takeDurableRateLimit(
  key: string,
  limit: number,
  windowMs: number,
): Promise<{ ok: boolean; retryAfterSec: number } | null> {
  const base = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
  if (!base || !token) return null;

  const redisKey = `fu:rl:${key}`;
  const windowSec = Math.max(1, Math.ceil(windowMs / 1000));

  try {
    const incrRes = await fetch(`${base}/incr/${encodeURIComponent(redisKey)}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!incrRes.ok) return null;
    const incrJson = (await incrRes.json()) as { result?: number };
    const count = Number(incrJson.result || 0);

    if (count === 1) {
      await fetch(
        `${base}/expire/${encodeURIComponent(redisKey)}/${windowSec}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        },
      );
    }

    if (count > limit) {
      const ttlRes = await fetch(
        `${base}/pttl/${encodeURIComponent(redisKey)}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        },
      );
      let retryAfterSec = windowSec;
      if (ttlRes.ok) {
        const ttlJson = (await ttlRes.json()) as { result?: number };
        const pttl = Number(ttlJson.result || 0);
        if (pttl > 0) retryAfterSec = Math.max(1, Math.ceil(pttl / 1000));
      }
      return { ok: false, retryAfterSec };
    }

    return { ok: true, retryAfterSec: 0 };
  } catch (error) {
    console.error("[rate-limit] Upstash failed, using memory", error);
    return null;
  }
}

/**
 * Rate limit (durable when Upstash env is set, otherwise in-memory).
 */
export async function takeRateLimit(
  key: string,
  limit: number,
  windowMs: number,
): Promise<{ ok: boolean; retryAfterSec: number }> {
  const durable = await takeDurableRateLimit(key, limit, windowMs);
  if (durable) return durable;
  return takeMemoryRateLimit(key, limit, windowMs);
}

export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }
  return request.headers.get("x-real-ip") || "unknown";
}
