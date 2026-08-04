"use client";

import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { useLocale } from "@/lib/locale";
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
  const { t } = useLocale();
  const signalFacts = t.homeHub.signalKeys
    .map((key) => t.profile.facts.find((fact) => fact.label === key))
    .filter((fact): fact is { label: string; value: string } => Boolean(fact));

  return (
    <>
      <section className="section home-signal" aria-label={t.profile.title}>
        <div className="shell">
          <div className="home-signal__grid">
            {signalFacts.map((fact, i) => {
              const isGoal =
                fact.label === "Cieľ" || fact.label === "Goal";
              return (
                <Reveal key={fact.label} delay={i * 60}>
                  <article
                    className={`home-signal__item${isGoal ? " home-signal__item--accent" : ""}`}
                  >
                    <p className="home-signal__label">{fact.label}</p>
                    <p className="home-signal__value">{fact.value}</p>
                  </article>
                </Reveal>
              );
            })}
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
                <Link
                  href={card.href}
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
              <Link className="btn btn--primary" href={routes.contact}>
                {t.nav.contact}
                <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
