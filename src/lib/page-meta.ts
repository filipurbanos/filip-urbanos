import type { Metadata } from "next";
import { dictionaries } from "@/content";
import type { Locale } from "@/content/types";
import { localePath } from "@/lib/locale-path";
import { getRequestLocale } from "@/lib/request-locale";
import { siteUrl } from "@/lib/site-url";

type PageMetaInput = {
  path: string;
  title: { sk: string; en: string };
  description: { sk: string; en: string };
};

export async function buildPageMetadata({
  path,
  title,
  description,
}: PageMetaInput): Promise<Metadata> {
  const locale = await getRequestLocale();
  const base = siteUrl();
  const skPath = localePath("sk", path);
  const enPath = localePath("en", path);
  const skUrl = skPath === "/" ? base : `${base}${skPath}`;
  const enUrl = enPath === "/" ? `${base}/en` : `${base}${enPath}`;
  const canonical = locale === "en" ? enUrl : skUrl;
  const pageTitle = title[locale];
  const pageDescription = description[locale];

  return {
    title: pageTitle,
    description: pageDescription,
    alternates: {
      canonical,
      languages: {
        "sk-SK": skUrl,
        "en-US": enUrl,
        "x-default": skUrl,
      },
    },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      locale: locale === "en" ? "en_US" : "sk_SK",
      alternateLocale: locale === "en" ? ["sk_SK"] : ["en_US"],
      url: canonical,
    },
  };
}

export async function homeMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const meta = dictionaries[locale].meta;
  return buildPageMetadata({
    path: "/",
    title: {
      sk: dictionaries.sk.meta.title,
      en: dictionaries.en.meta.title,
    },
    description: {
      sk: dictionaries.sk.meta.description,
      en: dictionaries.en.meta.description,
    },
  }).then((m) => ({
    ...m,
    title: {
      absolute: meta.title,
    },
  }));
}

export function dictionaryLocale(locale: Locale) {
  return dictionaries[locale];
}
