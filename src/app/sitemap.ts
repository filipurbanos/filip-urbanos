import type { MetadataRoute } from "next";
import { localePath } from "@/lib/locale-path";
import { routes } from "@/lib/routes";
import { siteUrl } from "@/lib/site-url";

const publicPaths = [
  routes.home,
  routes.about,
  routes.journey,
  routes.results,
  routes.usa,
  routes.media,
  routes.partners,
  routes.contact,
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const now = new Date();

  return publicPaths.flatMap((path) => {
    const skPath = localePath("sk", path);
    const enPath = localePath("en", path);
    const skUrl = skPath === "/" ? base : `${base}${skPath}`;
    const enUrl = enPath === "/" ? `${base}/en` : `${base}${enPath}`;
    const freq = path === "/" ? ("weekly" as const) : ("monthly" as const);
    const priority = path === "/" ? 1 : 0.8;
    const alternates = {
      languages: {
        sk: skUrl,
        en: enUrl,
      },
    };

    return [
      {
        url: skUrl,
        lastModified: now,
        changeFrequency: freq,
        priority,
        alternates,
      },
      {
        url: enUrl,
        lastModified: now,
        changeFrequency: freq,
        priority: priority * 0.95,
        alternates,
      },
    ];
  });
}
