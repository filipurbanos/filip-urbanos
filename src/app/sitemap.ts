import type { MetadataRoute } from "next";
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

  return publicPaths.map((path) => ({
    url: path === "/" ? base : `${base}${path}`,
    lastModified: now,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.8,
  }));
}
