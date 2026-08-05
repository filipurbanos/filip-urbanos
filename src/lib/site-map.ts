/**
 * Current public site map (kept for orientation; not wired into routing).
 */
export const siteMap = {
  routes: [
    { path: "/", name: "Domov" },
    { path: "/about", name: "O Filipovi (+ profil, tréning)" },
    { path: "/journey", name: "Športová cesta" },
    { path: "/results", name: "Výsledky + kalendár + rebríčky" },
    { path: "/usa", name: "USA – štúdium a tenis" },
    { path: "/media", name: "Albumy, press" },
    { path: "/partners", name: "Partneri + pitch" },
    { path: "/contact", name: "Kontakt a FAQ" },
  ],
  public: [
    { id: "top", name: "Domov / Hero" },
    { id: "home-hub", name: "Tri kapitoly" },
    { id: "news", name: "Novinky" },
    { id: "about", name: "O Filipovi" },
    { id: "profile", name: "Profil hráča" },
    { id: "training", name: "Tréning a príprava" },
    { id: "journey", name: "Športová cesta" },
    { id: "results", name: "Výsledky" },
    { id: "calendar", name: "Kalendár turnajov" },
    { id: "rankings", name: "Rebríčky" },
    { id: "usa", name: "USA – štúdium a tenis" },
    { id: "gallery", name: "Albumy / fotogaléria" },
    { id: "press", name: "Médiá a rozhovory" },
    { id: "partners", name: "Partneri" },
    { id: "sponsors", name: "Pitch pre sponzorov" },
    { id: "faq", name: "FAQ" },
    { id: "contact", name: "Kontakt" },
  ],
  admin: [
    "Dashboard",
    "Turnaje",
    "Albumy",
    "Fotky",
    "Videá",
    "Partneri",
    "Rebríčky / nastavenia",
    "Správy (inquiries)",
  ],
} as const;
