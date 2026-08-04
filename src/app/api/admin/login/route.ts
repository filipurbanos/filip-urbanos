import { NextResponse } from "next/server";
import {
  sessionCookieOptions,
  signSession,
} from "@/lib/cms/auth";
import { verifyPassword } from "@/lib/cms/password";

export async function POST(request: Request) {
  const body = (await request.json()) as { password?: string };
  if (!body.password || !(await verifyPassword(body.password))) {
    return NextResponse.json({ error: "Nesprávne heslo" }, { status: 401 });
  }

  try {
    const token = await signSession(Date.now() + 1000 * 60 * 60 * 24 * 7);
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
