import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  COOKIE,
  sessionCookieOptions,
  sessionEpoch,
  verifySession,
} from "@/lib/cms/auth";
import { authEpoch } from "@/lib/cms/password";
import { LOCALE_COOKIE } from "@/lib/locale-path";

function localeCookie(locale: "sk" | "en") {
  return {
    name: LOCALE_COOKIE,
    value: locale,
    path: "/",
    sameSite: "lax" as const,
    maxAge: 60 * 60 * 24 * 365,
  };
}

async function handleAdmin(request: NextRequest) {
  const { pathname } = request.nextUrl;
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

/**
 * Node proxy: admin auth (HMAC + epoch) + `/en` locale rewrites.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    return handleAdmin(request);
  }

  if (pathname.startsWith("/api") || pathname.startsWith("/_next")) {
    return NextResponse.next();
  }

  const requestHeaders = new Headers(request.headers);

  if (pathname === "/en" || pathname.startsWith("/en/")) {
    const stripped =
      pathname === "/en" ? "/" : pathname.slice(3) || "/";
    const url = request.nextUrl.clone();
    url.pathname = stripped.startsWith("/") ? stripped : `/${stripped}`;
    requestHeaders.set("x-locale", "en");
    const res = NextResponse.rewrite(url, {
      request: { headers: requestHeaders },
    });
    res.cookies.set(localeCookie("en"));
    return res;
  }

  // Public SK URLs
  if (
    pathname === "/" ||
    pathname === "/about" ||
    pathname === "/journey" ||
    pathname === "/results" ||
    pathname === "/usa" ||
    pathname === "/media" ||
    pathname === "/partners" ||
    pathname === "/contact"
  ) {
    requestHeaders.set("x-locale", "sk");
    const res = NextResponse.next({
      request: { headers: requestHeaders },
    });
    res.cookies.set(localeCookie("sk"));
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/",
    "/about",
    "/journey",
    "/results",
    "/usa",
    "/media",
    "/partners",
    "/contact",
    "/en",
    "/en/:path*",
  ],
};
