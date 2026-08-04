/** Public site origin for sitemap, OG, and absolute URLs. */
export function siteUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    "https://filip-urbanos.vercel.app";
  return raw.replace(/\/$/, "");
}
