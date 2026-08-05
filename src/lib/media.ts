/**
 * Drop Filip’s real photos here (filenames stay the same):
 * - public/media/hero.jpg           → homepage hero
 * - public/media/page-about-banner.jpg → Príbeh banner
 * - public/media/filip-about.jpg    → Príbeh body photo
 * - public/media/page-journey.jpg   → Cesta
 * - public/media/page-results-banner.jpg → Výsledky
 * - public/media/page-usa.jpg       → USA banner
 * - public/media/filip-usa.jpg      → USA body photo
 * - public/media/page-media.jpg     → Médiá
 * - public/media/page-partners.jpg  → Partneri
 * - public/media/filip-nairobi-ready.jpg → J30 Nairobi album
 * - public/media/filip-nairobi-match.mp4  → J30 Nairobi album video
 */
export const mediaAssets = {
  hero: "/media/hero.jpg",
  heroFallback: "/media/hero-fallback.svg",
  about: "/media/page-about-banner.jpg",
  aboutPortrait: "/media/filip-about.jpg",
  journey: "/media/page-journey.jpg",
  results: "/media/page-results-banner.jpg",
  usa: "/media/page-usa.jpg",
  usaPortrait: "/media/filip-usa.jpg",
  media: "/media/page-media.jpg",
  partners: "/media/page-partners.jpg",
  contact: "/media/page-contact.jpg",
  inspirationLogo: "/media/inspiration-academy/logo.png",
  inspirationLion: "/media/inspiration-academy/lion.jpg",
  inspirationMark: "/media/inspiration-academy/lion-mark.png",
} as const;
