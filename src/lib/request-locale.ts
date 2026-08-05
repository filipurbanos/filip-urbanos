import { cookies, headers } from "next/headers";
import type { Locale } from "@/content/types";
import { isLocale, LOCALE_COOKIE } from "@/lib/locale-path";

/** Locale for the current request: URL (`x-locale`) wins, then cookie. */
export async function getRequestLocale(): Promise<Locale> {
  const headerLocale = (await headers()).get("x-locale");
  if (isLocale(headerLocale)) return headerLocale;

  const jar = await cookies();
  const cookieLocale = jar.get(LOCALE_COOKIE)?.value;
  if (isLocale(cookieLocale)) return cookieLocale;

  return "sk";
}
