"use client";

import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { useLocale } from "@/lib/locale";
import { routes } from "@/lib/routes";
import type { Content } from "@/content/types";

const cards: {
  key: keyof Content["nav"];
  href: string;
  sk: string;
  en: string;
}[] = [
  {
    key: "about",
    href: routes.about,
    sk: "Kto je Filip a kam smeruje.",
    en: "Who Filip is and where he’s headed.",
  },
  {
    key: "journey",
    href: routes.journey,
    sk: "Od Slovenska cez Barcelonu do USA.",
    en: "From Slovakia through Barcelona to the USA.",
  },
  {
    key: "results",
    href: routes.results,
    sk: "Výsledky, kalendár a rebríčky.",
    en: "Results, calendar, and rankings.",
  },
  {
    key: "usa",
    href: routes.usa,
    sk: "Štúdium a tenis v Spojených štátoch.",
    en: "Study and tennis in the United States.",
  },
  {
    key: "media",
    href: routes.media,
    sk: "Fotky, videá, novinky a press.",
    en: "Photos, videos, news, and press.",
  },
  {
    key: "partners",
    href: routes.partners,
    sk: "Partnerstvá, media kit a spolupráca.",
    en: "Partnerships, media kit, and collaboration.",
  },
];

export function HomeHub() {
  const { t, locale } = useLocale();

  return (
    <>
      <section className="section home-signal">
        <div className="shell">
          <div className="home-signal__grid">
            {t.profile.facts.slice(0, 4).map((fact, i) => (
              <Reveal key={fact.label} delay={i * 60}>
                <article className="home-signal__item">
                  <p className="home-signal__label">{fact.label}</p>
                  <p className="home-signal__value">{fact.value}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section home-hub">
        <div className="shell">
          <Reveal>
            <p className="eyebrow">
              {locale === "sk" ? "Objavovať" : "Explore"}
            </p>
            <h2 className="section-title">
              {locale === "sk"
                ? "Celý príbeh na jednom webe"
                : "The full story, page by page"}
            </h2>
            <p className="section-lead">
              {locale === "sk"
                ? "Športový profil, cesta, výsledky, USA kapitola, médiá a partnerstvá — každá časť má vlastnú stránku."
                : "Athlete profile, journey, results, USA chapter, media, and partnerships — each part has its own page."}
            </p>
          </Reveal>

          <div className="home-hub__grid">
            {cards.map((card, i) => (
              <Reveal key={card.href} delay={i * 50}>
                <Link href={card.href} className="home-card">
                  <span className="home-card__index">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="home-card__label">{t.nav[card.key]}</span>
                  <span className="home-card__text">
                    {locale === "sk" ? card.sk : card.en}
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
