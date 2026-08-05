import { NextResponse } from "next/server";
import { sessionCookieOptions, signSession } from "@/lib/cms/auth";
import { authEpoch, verifyPassword } from "@/lib/cms/password";
import { clientIp, takeRateLimit } from "@/lib/cms/rate-limit";

export async function POST(request: Request) {
  const ip = clientIp(request);
  const limit = await takeRateLimit(`login:${ip}`, 8, 15 * 60 * 1000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Príliš veľa pokusov. Skús neskôr." },
      {
        status: 429,
        headers: { "Retry-After": String(limit.retryAfterSec) },
      },
    );
  }

  const body = (await request.json()) as { password?: string };
  if (!body.password || !(await verifyPassword(body.password))) {
    return NextResponse.json({ error: "Nesprávne heslo" }, { status: 401 });
  }

  try {
    const epoch = await authEpoch();
    const token = await signSession(
      Date.now() + 1000 * 60 * 60 * 24 * 7,
      epoch,
    );
    const response = NextResponse.json({ ok: true });
    const cookie = sessionCookieOptions(token);
    response.cookies.set(cookie.name, cookie.value, cookie);
    return response;
  } catch {
    return NextResponse.json(
      { error: "Admin nie je nakonfigurovaný (ADMIN_SECRET)" },
      { status: 500 },
    );
  }
}
