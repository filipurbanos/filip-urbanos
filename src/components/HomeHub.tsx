"use client";

import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { useLocale } from "@/lib/locale";
import { localePath } from "@/lib/locale-path";
import { routes } from "@/lib/routes";
import type { Content } from "@/content/types";

const cards: {
  key: keyof Content["homeHub"]["cards"];
  href: string;
  featured?: boolean;
}[] = [
  { key: "about", href: routes.about, featured: true },
  { key: "results", href: routes.results, featured: true },
  { key: "usa", href: routes.usa, featured: true },
  { key: "journey", href: routes.journey },
  { key: "media", href: routes.media },
  { key: "partners", href: routes.partners },
];

export function HomeHub() {
  const { t, locale } = useLocale();

  return (
    <section className="section home-hub">
      <div className="shell">
        <Reveal>
          <p className="eyebrow">{t.homeHub.eyebrow}</p>
          <h2 className="section-title">{t.homeHub.title}</h2>
          <p className="section-lead">{t.homeHub.lead}</p>
        </Reveal>

        <div className="home-hub__grid">
          {cards.map((card, i) => (
            <Reveal key={card.href} delay={i * 50}>
              <Link
                href={localePath(locale, card.href)}
                className={`home-card${card.featured ? " home-card--featured" : ""}`}
              >
                <span className="home-card__label">{t.nav[card.key]}</span>
                <span className="home-card__text">
                  {t.homeHub.cards[card.key]}
                </span>
                <span className="home-card__go" aria-hidden="true">
                  →
                </span>
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal delay={280}>
          <div className="home-hub__cta">
            <Link className="btn btn--primary" href={localePath(locale, routes.contact)}>
              {t.nav.contact}
              <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
