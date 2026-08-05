"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useLocale } from "@/lib/locale";
import { mediaAssets } from "@/lib/media";
import { localePath } from "@/lib/locale-path";
import { routes } from "@/lib/routes";

export function Hero() {
  const { t, locale } = useLocale();
  const [heroSrc, setHeroSrc] = useState<string>(mediaAssets.hero);
  const [usingFallback, setUsingFallback] = useState(false);
  const nameParts = t.hero.headline.trim().split(/\s+/);
  const firstName = nameParts[0] || t.hero.headline;
  const lastName = nameParts.slice(1).join(" ");

  return (
    <section className="hero" id="top" aria-label={t.hero.role}>
      <div className="hero__media" aria-hidden="true">
        <Image
          className={`hero__photo ${usingFallback ? "is-fallback" : ""}`}
          src={heroSrc}
          alt=""
          fill
          priority
          sizes="100vw"
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
          <span>{firstName}</span>
          {lastName ? (
            <>
              {" "}
              <span className="hero__outline">{lastName}</span>
            </>
          ) : null}
        </h1>
        <p className="hero__tagline">{t.hero.tagline}</p>
        <p className="hero__lead">{t.hero.lead}</p>
        <div className="hero__actions">
          <Link className="btn btn--primary" href={localePath(locale, routes.results)}>
            {t.hero.ctaPrimary}
            <span aria-hidden="true">↗</span>
          </Link>
          <Link className="btn btn--ghost" href={localePath(locale, routes.partners)}>
            {t.hero.ctaSecondary}
          </Link>
        </div>
      </div>
    </section>
  );
}
