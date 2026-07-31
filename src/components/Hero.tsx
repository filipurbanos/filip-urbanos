"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLocale } from "@/lib/locale";
import { mediaAssets } from "@/lib/media";
import { routes } from "@/lib/routes";

function splitHeadline(headline: string) {
  const parts = headline.trim().split(/\s+/);
  if (parts.length < 2) {
    return { before: headline, accent: "", after: "" };
  }
  // Highlight the penultimate word (ďalší / next)
  const accentIndex = Math.max(0, parts.length - 2);
  return {
    before: parts.slice(0, accentIndex).join(" "),
    accent: parts[accentIndex],
    after: parts.slice(accentIndex + 1).join(" "),
  };
}

export function Hero() {
  const { t, locale } = useLocale();
  const [heroSrc, setHeroSrc] = useState<string>(mediaAssets.hero);
  const [usingFallback, setUsingFallback] = useState(false);
  const { before, accent, after } = splitHeadline(t.hero.headline);

  useEffect(() => {
    setHeroSrc(mediaAssets.hero);
    setUsingFallback(false);
  }, []);

  return (
    <section className="hero" id="top" aria-label="Hero">
      <div className="hero__media" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className={`hero__photo ${usingFallback ? "is-fallback" : ""}`}
          src={heroSrc}
          alt=""
          onError={() => {
            if (!usingFallback) {
              setHeroSrc(mediaAssets.heroFallback);
              setUsingFallback(true);
            }
          }}
        />
        <div className="hero__veil" />
      </div>

      <div className="hero__content">
        <p className="hero__role">
          <span className="hero__role-line" />
          {t.hero.role}
        </p>
        <h1 className="hero__headline">
          {before ? <span>{before} </span> : null}
          {accent ? <span className="hero__outline">{accent}</span> : null}
          {after ? <span> {after}</span> : null}
        </h1>
        <p className="hero__lead">{t.hero.lead}</p>
        <div className="hero__actions">
          <Link className="btn btn--primary" href={routes.results}>
            {t.hero.ctaPrimary}
            <span aria-hidden="true">↗</span>
          </Link>
          <Link className="btn btn--ghost" href={routes.partners}>
            {t.hero.ctaSecondary}
          </Link>
        </div>

        <div className="hero__chapter">
          <p className="hero__chapter-label">
            {locale === "sk" ? "Aktuálna kapitola" : "Current chapter"}
          </p>
          <p className="hero__chapter-value">Florida, USA</p>
        </div>
      </div>
    </section>
  );
}
