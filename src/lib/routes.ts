export const routes = {
  home: "/",
  about: "/about",
  journey: "/journey",
  results: "/results",
  usa: "/usa",
  media: "/media",
  partners: "/partners",
  contact: "/contact",
  admin: "/admin",
  adminLogin: "/admin/login",
} as const;

export type AppRoute = (typeof routes)[keyof typeof routes];
