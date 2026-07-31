import type { Content, Locale } from "./types";
import { en } from "./en";
import { sk } from "./sk";

export const dictionaries: Record<Locale, Content> = { sk, en };

export const mediaLinks = {
  itf: "https://www.itftennis.com/en/players/filip-urbanos/800621234/svk/jt/S/overview/",
  bta: "https://www.btatennis.com/bta-players/filip-urbanos",
  sponsoo: "https://www.sponsoo.com/p/filipurbanos",
  instagram: "https://www.instagram.com/filipurbanos/",
  email: "mailto:urbanosfilip33@gmail.com",
} as const;
