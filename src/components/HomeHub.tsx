"use client";

import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { useLocale } from "@/lib/locale";
import { routes } from "@/lib/routes";
import type { Content } from "@/content/types";

const cards: { key: keyof Content["homeHub"]["cards"]; href: string }[] = [
  { key: "about", href: routes.about },
  { key: "journey", href: routes.journey },
  { key: "results", href: routes.results },
  { key: "usa", href: routes.usa },
  { key: "media", href: routes.media },
  { key: "partners", href: routes.partners },
];

export function HomeHub() {
  const { t } = useLocale();

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
            <p className="eyebrow">{t.homeHub.eyebrow}</p>
            <h2 className="section-title">{t.homeHub.title}</h2>
            <p className="section-lead">{t.homeHub.lead}</p>
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
                    {t.homeHub.cards[card.key]}
                  </span>
                  <span className="home-card__go" aria-hidden="true">
                    →
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
