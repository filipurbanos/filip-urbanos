/**
 * Drop Filip’s real photos here (filenames stay the same):
 * - public/media/hero.jpg        → homepage hero
 * - public/media/page-about.jpg  → optional page banners
 * - public/media/page-usa.jpg
 * Until files exist, the site uses branded SVG / CSS fallbacks.
 */
export const mediaAssets = {
  hero: "/media/hero.jpg",
  heroFallback: "/media/hero-fallback.svg",
  about: "/media/page-about.jpg",
  usa: "/media/page-usa.jpg",
  journey: "/media/page-journey.jpg",
  media: "/media/page-media.jpg",
  inspirationLogo: "/media/inspiration-academy/logo.png",
  inspirationLion: "/media/inspiration-academy/lion.jpg",
  inspirationMark: "/media/inspiration-academy/lion-mark.png",
} as const;
