"use client";

import Link from "next/link";
import Image from "next/image";
import { ContactDetails } from "@/components/ContactDetails";
import { Reveal } from "@/components/Reveal";
import { Section, SectionHeader } from "@/components/Section";
import type { Partner } from "@/lib/cms/types";
import { useLocale } from "@/lib/locale";
import { routes } from "@/lib/routes";

export function Gallery({
  photos,
  omitHeader = false,
}: {
  photos?: { id: string; src: string; alt: string; caption: string }[];
  omitHeader?: boolean;
}) {
  const { t } = useLocale();
  const list = photos ?? [];

  return (
    <Section id="gallery" className="media">
      {omitHeader ? null : <SectionHeader {...t.gallery} />}
      {list.length > 0 ? (
        <div className={`gallery-grid ${omitHeader ? "gallery-grid--flush" : ""}`}>
          {list.map((photo, i) => (
            <Reveal key={photo.id} delay={i * 50}>
              <figure className="gallery-item">
                <div className="gallery-item__media">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"
                  />
                </div>
                {photo.caption ? <figcaption>{photo.caption}</figcaption> : null}
              </figure>
            </Reveal>
          ))}
        </div>
      ) : (
        <>
          <div
            className={`media__stage ${omitHeader ? "media__stage--flush" : ""}`}
            aria-hidden="true"
          >
            <div className="media__panel media__panel--a" />
            <div className="media__panel media__panel--b" />
            <div className="media__panel media__panel--c" />
          </div>
          <Reveal delay={120}>
            <p className="placeholder-note">{t.gallery.placeholder}</p>
          </Reveal>
        </>
      )}
    </Section>
  );
}

export function Videos({
  videos,
}: {
  videos?: { id: string; title: string; url: string }[];
}) {
  const { t } = useLocale();
  const list = videos ?? [];

  return (
    <Section id="videos" className="videos">
      <SectionHeader {...t.videos} />
      {list.length > 0 ? (
        <div className="video-grid">
          {list.map((video, i) => (
            <Reveal key={video.id} delay={i * 70}>
              <a
                className="video-slot video-slot--link"
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>{video.title}</span>
              </a>
            </Reveal>
          ))}
        </div>
      ) : (
        <Reveal delay={160}>
          <p className="placeholder-note">{t.videos.placeholder}</p>
        </Reveal>
      )}
    </Section>
  );
}

export function News() {
  const { t } = useLocale();

  return (
    <Section id="news" className="news">
      <SectionHeader {...t.news} />
      <div className="news__list">
        {t.news.items.map((item, i) => (
          <Reveal key={item.title} delay={i * 70}>
            <article className="news-item">
              <time>{item.date}</time>
              <h3>{item.title}</h3>
              <p>{item.excerpt}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

export function Press() {
  const { t } = useLocale();

  return (
    <Section id="press" className="press">
      <SectionHeader {...t.press} />
      <div className="media__links">
        {t.press.items.map((item, i) => (
          <Reveal key={item.title} delay={i * 60}>
            <a
              className="media-link"
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="media-link__type">{item.type}</span>
              <span className="media-link__title">{item.title}</span>
              <span className="media-link__source">{item.source}</span>
            </a>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

export function PartnersList({ partners }: { partners: Partner[] }) {
  const { t } = useLocale();
  const sorted = [...partners].sort(
    (a, b) => a.order - b.order || a.name.localeCompare(b.name),
  );
  const main = sorted.filter((p) => p.tier === "main");
  const others = sorted.filter((p) => p.tier !== "main");

  return (
    <Section id="partners" className="partners partners--live">
      {main.length > 0 ? (
        <div className="partners__main">
          <p className="partners__tier">{t.partners.mainLabel}</p>
          {main.map((partner, i) => (
            <Reveal key={partner.id} delay={i * 60}>
              <PartnerCard partner={partner} featured visitLabel={t.partners.visitLabel} />
            </Reveal>
          ))}
        </div>
      ) : null}

      {others.length > 0 ? (
        <div className="partners__others">
          <p className="partners__tier">{t.partners.othersLabel}</p>
          <div className="partners__grid">
            {others.map((partner, i) => (
              <Reveal key={partner.id} delay={i * 50}>
                <PartnerCard partner={partner} visitLabel={t.partners.visitLabel} />
              </Reveal>
            ))}
          </div>
        </div>
      ) : null}

      {sorted.length === 0 ? (
        <Reveal delay={80}>
          <p className="placeholder-note">{t.partners.emptyNote}</p>
        </Reveal>
      ) : null}
    </Section>
  );
}

function PartnerCard({
  partner,
  featured = false,
  visitLabel,
}: {
  partner: Partner;
  featured?: boolean;
  visitLabel: string;
}) {
  const inner = (
    <>
      {partner.logo ? (
        <Image
          src={partner.logo}
          alt=""
          width={featured ? 224 : 88}
          height={featured ? 76 : 56}
          className="partner-card__logo"
        />
      ) : (
        <span className="partner-card__mark" aria-hidden="true">
          {partner.name.slice(0, 2).toUpperCase()}
        </span>
      )}
      <div className="partner-card__body">
        <h3 className="partner-card__name" style={{ color: "#ffffff" }}>
          {partner.name}
        </h3>
        {partner.description ? <p>{partner.description}</p> : null}
        {partner.url ? (
          <span className="partner-card__link">{visitLabel}</span>
        ) : null}
      </div>
    </>
  );

  const className = `partner-card${featured ? " partner-card--featured" : ""}`;

  if (partner.url) {
    return (
      <a
        className={className}
        href={partner.url}
        target="_blank"
        rel="noopener noreferrer"
      >
        {inner}
      </a>
    );
  }

  return <article className={className}>{inner}</article>;
}

export function Sponsors() {
  const { t } = useLocale();

  return (
    <Section id="sponsors" className="sponsors">
      <SectionHeader {...t.sponsors} />
      <div className="partners__cols">
        <Reveal>
          <div className="partners__block">
            <h3>{t.sponsors.offerTitle}</h3>
            <ul>
              {t.sponsors.offers.map((offer) => (
                <li key={offer}>{offer}</li>
              ))}
            </ul>
          </div>
        </Reveal>
        <Reveal delay={100}>
          <div className="partners__block">
            <h3>{t.sponsors.usageTitle}</h3>
            <ul>
              {t.sponsors.usage.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
      <Reveal delay={160}>
        <Link className="btn btn--primary" href={routes.contact}>
          {t.sponsors.cta}
        </Link>
      </Reveal>
    </Section>
  );
}

export function MediaKit() {
  const { t } = useLocale();

  return (
    <Section id="media-kit" className="media-kit">
      <SectionHeader {...t.mediaKit} />
      <div className="kit__list">
        {t.mediaKit.items.map((item, i) => (
          <Reveal key={item.title} delay={i * 50}>
            <article className="kit-item">
              <h3>{item.title}</h3>
              <p>{item.meta}</p>
            </article>
          </Reveal>
        ))}
      </div>
      <Reveal delay={160}>
        <Link className="btn btn--primary" href={routes.contact}>
          {t.mediaKit.cta}
        </Link>
      </Reveal>
    </Section>
  );
}

export function Collaborate() {
  const { t } = useLocale();

  return (
    <Section id="collaborate" className="collaborate">
      <SectionHeader {...t.collaborate} />
      <div className="steps">
        {t.collaborate.steps.map((step, i) => (
          <Reveal key={step.title} delay={i * 70}>
            <article className="step">
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </article>
          </Reveal>
        ))}
      </div>
      <Reveal delay={160}>
        <Link className="btn btn--primary" href={routes.contact}>
          {t.collaborate.cta}
        </Link>
      </Reveal>
    </Section>
  );
}

export function Faq() {
  const { t } = useLocale();

  return (
    <Section id="faq" className="faq">
      <SectionHeader {...t.faq} />
      <div className="faq__list">
        {t.faq.items.map((item, i) => (
          <Reveal key={item.q} delay={i * 50}>
            <details className="faq-item">
              <summary style={{ color: "#ffffff" }}>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

export function ContactCard() {
  return <ContactDetails />;
}

export function Contact({ omitHeader = false }: { omitHeader?: boolean }) {
  void omitHeader;
  return <ContactDetails />;
}
