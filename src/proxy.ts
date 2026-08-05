import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  COOKIE,
  sessionCookieOptions,
  sessionEpoch,
  verifySession,
} from "@/lib/cms/auth";
import { authEpoch } from "@/lib/cms/password";

/**
 * Node proxy (Next.js 16): admin gate with HMAC + password-epoch check.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const token = request.cookies.get(COOKIE)?.value;
  const hmacOk = await verifySession(token);

  let epochOk = false;
  if (hmacOk) {
    const cookieEpoch = sessionEpoch(token);
    if (cookieEpoch !== null) {
      try {
        epochOk = cookieEpoch === (await authEpoch());
      } catch {
        epochOk = false;
      }
    }
  }

  const authed = hmacOk && epochOk;

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);

  if (pathname === "/admin/login") {
    if (authed) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next({
      request: { headers: requestHeaders },
    });
  }

  if (!authed) {
    const res = NextResponse.redirect(new URL("/admin/login", request.url));
    if (token) {
      res.cookies.set({
        ...sessionCookieOptions(""),
        value: "",
        maxAge: 0,
      });
    }
    return res;
  }

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: ["/admin/:path*"],
};
