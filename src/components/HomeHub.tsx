"use client";

import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { useLocale } from "@/lib/locale";
import { localePath } from "@/lib/locale-path";
import { routes } from "@/lib/routes";
import type { Content } from "@/content/types";

const chapters: {
  key: keyof Content["homeHub"]["cards"];
  href: string;
}[] = [
  { key: "about", href: routes.about },
  { key: "results", href: routes.results },
  { key: "usa", href: routes.usa },
];

const more: { key: keyof Content["nav"]; href: string }[] = [
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

        <div className="home-hub__grid home-hub__grid--chapters">
          {chapters.map((card, i) => (
            <Reveal key={card.href} delay={i * 50}>
              <Link
                href={localePath(locale, card.href)}
                className="home-card home-card--featured"
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

        <Reveal delay={200}>
          <nav className="home-hub__more" aria-label={t.homeHub.moreLabel}>
            <span className="home-hub__more-label">{t.homeHub.moreLabel}</span>
            {more.map((item) => (
              <Link key={item.href} href={localePath(locale, item.href)}>
                {t.nav[item.key]}
              </Link>
            ))}
            <Link href={localePath(locale, routes.contact)}>{t.nav.contact}</Link>
          </nav>
        </Reveal>
      </div>
    </section>
  );
}
