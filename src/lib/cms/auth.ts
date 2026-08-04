const COOKIE = "fu_admin_session";

const DEV_SECRET = "dev-filip-admin-secret-change-me";
const DEV_PASSWORD = "filip-admin";

function isProd() {
  return process.env.NODE_ENV === "production";
}

/** Session signing secret. Required in production. */
export function adminSecret(): string | null {
  const value = process.env.ADMIN_SECRET?.trim();
  if (value) return value;
  if (isProd()) return null;
  return DEV_SECRET;
}

/** Bootstrap password when data/auth.json is missing. Required in production. */
export function adminPassword(): string | null {
  const value = process.env.ADMIN_PASSWORD?.trim();
  if (value) return value;
  if (isProd()) return null;
  return DEV_PASSWORD;
}

async function hmac(payload: string, secret: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(payload));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function signSession(
  expiresAt: number,
  epoch = 0,
): Promise<string> {
  const secret = adminSecret();
  if (!secret) {
    throw new Error("ADMIN_SECRET is not configured");
  }
  const payload = `ok.${expiresAt}.${epoch}`;
  const sig = await hmac(payload, secret);
  return `${payload}.${sig}`;
}

export async function verifySession(
  token: string | undefined,
): Promise<boolean> {
  const secret = adminSecret();
  if (!secret || !token) return false;
  const parts = token.split(".");
  // Legacy 3-part tokens are rejected (force re-login after deploy).
  if (parts.length !== 4) return false;
  const [ok, exp, epochRaw, sig] = parts;
  if (ok !== "ok") return false;
  const expiresAt = Number(exp);
  const epoch = Number(epochRaw);
  if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) return false;
  if (!Number.isFinite(epoch)) return false;
  const payload = `${ok}.${exp}.${epoch}`;
  const expected = await hmac(payload, secret);
  const { timingSafeEqualHex } = await import("@/lib/cms/secure-json");
  if (!timingSafeEqualHex(sig, expected)) return false;

  try {
    const { authEpoch } = await import("@/lib/cms/password");
    const current = await authEpoch();
    return epoch === current;
  } catch {
    return false;
  }
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const { cookies } = await import("next/headers");
  const jar = await cookies();
  return verifySession(jar.get(COOKIE)?.value);
}

export function sessionCookieOptions(token: string) {
  return {
    name: COOKIE,
    value: token,
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  };
}

export { COOKIE };
