"use client";

import { Reveal } from "@/components/Reveal";
import { Section, SectionHeader } from "@/components/Section";
import { mediaLinks } from "@/content";
import { useLocale } from "@/lib/locale";

export function ContactDetails() {
  const { t } = useLocale();
  const c = t.contact;

  return (
    <Section id="contact-details" className="contact-details">
      <SectionHeader
        eyebrow={c.detailsTitle}
        title={c.title}
        lead={c.role}
      />
      <div className="contact-details__grid">
        <Reveal>
          <article className="contact-details__card">
            <p className="contact-details__label">{c.emailLabel}</p>
            <a href={mediaLinks.email} className="contact-details__value">
              urbanosfilip33@gmail.com
            </a>
            <a className="btn btn--primary" href={mediaLinks.email}>
              {c.cta}
            </a>
          </article>
        </Reveal>
        <Reveal delay={60}>
          <article className="contact-details__card">
            <p className="contact-details__label">{c.socialLabel}</p>
            <a
              href={mediaLinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-details__value"
            >
              @filipurbanos
            </a>
            <a
              className="btn btn--ghost"
              href={mediaLinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
            >
              {c.igCta}
            </a>
          </article>
        </Reveal>
        <Reveal delay={120}>
          <article className="contact-details__card">
            <p className="contact-details__label">{c.baseLabel}</p>
            <p className="contact-details__value">{c.baseValue}</p>
            <p className="contact-details__meta">
              {c.responseLabel}: {c.responseValue}
            </p>
            <a
              className="btn btn--ghost"
              href={mediaLinks.itf}
              target="_blank"
              rel="noopener noreferrer"
            >
              {c.itfLabel} ↗
            </a>
          </article>
        </Reveal>
        <Reveal delay={180}>
          <article className="contact-details__card contact-details__card--wide">
            <p className="contact-details__label">{c.partnerLabel}</p>
            <p className="contact-details__body">{c.partnerBody}</p>
            <p className="contact-details__label">{c.mediaLabel}</p>
            <p className="contact-details__body">{c.mediaBody}</p>
          </article>
        </Reveal>
      </div>
    </Section>
  );
}
