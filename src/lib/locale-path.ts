import type { Locale } from "@/content/types";

export const LOCALE_COOKIE = "fu-locale";

export function isLocale(value: string | null | undefined): value is Locale {
  return value === "sk" || value === "en";
}

/** Strip `/en` prefix for matching routes and active nav. */
export function stripLocalePath(pathname: string): string {
  if (pathname === "/en") return "/";
  if (pathname.startsWith("/en/")) {
    const rest = pathname.slice(3);
    return rest.startsWith("/") ? rest : `/${rest}`;
  }
  return pathname;
}

/** Build a public path for the given locale. */
export function localePath(locale: Locale, path: string): string {
  const normalized = path === "" ? "/" : path.startsWith("/") ? path : `/${path}`;
  if (locale === "sk") return normalized;
  if (normalized === "/") return "/en";
  return `/en${normalized}`;
}
