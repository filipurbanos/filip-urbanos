"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Reveal } from "@/components/Reveal";
import { Section, SectionHeader } from "@/components/Section";
import { sortByDateDesc, youtubeEmbedUrl } from "@/lib/cms/dates";
import { isPlayableMediaUrl } from "@/lib/cms/media-url";
import type { Match } from "@/lib/cms/types";
import { useLocale } from "@/lib/locale";
import { mediaAssets } from "@/lib/media";
import { routes } from "@/lib/routes";

export function About({ omitHeader = false }: { omitHeader?: boolean }) {
  const { t } = useLocale();

  return (
    <section className="section about" id="about">
      <div className="shell">
        <div className="about__layout">
          <Reveal>
            <figure className="about__photo">
              <Image
                src="/media/filip-backhand.jpg"
                alt={t.about.photoAlt}
                fill
                sizes="(max-width: 900px) 100vw, 50vw"
                style={{ objectFit: "cover", objectPosition: "center top" }}
              />
            </figure>
          </Reveal>
          <div className="about__copy">
            {omitHeader ? null : <SectionHeader {...t.about} />}
            <div
              className={`prose-block ${omitHeader ? "prose-block--flush" : ""}`}
            >
              {t.about.paragraphs.map((p, i) => (
                <Reveal key={p.slice(0, 24)} delay={i * 80}>
                  <p>{p}</p>
                </Reveal>
              ))}
            </div>
            <Reveal delay={200}>
              <div className="about__actions">
                <Link className="btn btn--primary" href={routes.results}>
                  {t.nav.results}
                  <span aria-hidden="true">↗</span>
                </Link>
                <Link className="btn btn--ghost" href={routes.usa}>
                  {t.nav.usa}
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Journey({ omitHeader = false }: { omitHeader?: boolean }) {
  const { t } = useLocale();
  const chapters = t.journey.chapters;

  return (
    <Section id="journey" className="story story--dark">
      {omitHeader ? null : (
        <div className="story__intro">
          <p className="eyebrow">{t.journey.eyebrow}</p>
          <h2 className="section-title section-title--accent">
            {t.journey.title}
          </h2>
          <p className="section-lead">{t.journey.lead}</p>
        </div>
      )}
      <ol className={`path-list ${omitHeader ? "path-list--flush" : ""}`}>
        {chapters.map((chapter, i) => {
          const isLast = i === chapters.length - 1;
          return (
            <Reveal key={chapter.title} delay={i * 80}>
              <li className={`path-row ${isLast ? "is-accent" : ""}`}>
                <span className="path-row__num">{chapter.year}</span>
                <h3 className="path-row__title">{chapter.title}</h3>
                <p className="path-row__body">{chapter.body}</p>
              </li>
            </Reveal>
          );
        })}
      </ol>
    </Section>
  );
}

export function Profile() {
  const { t } = useLocale();

  return (
    <Section id="profile" className="profile">
      <SectionHeader {...t.profile} />
      <div className="profile__grid">
        {t.profile.facts.map((fact, i) => {
          const isGoal = fact.label === "Cieľ" || fact.label === "Goal";
          return (
            <Reveal key={fact.label} delay={i * 60}>
              <article className={`fact${isGoal ? " fact--goal" : ""}`}>
                <p className="fact__label">{fact.label}</p>
                <p className="fact__value">{fact.value}</p>
              </article>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}

type ResultItem = {
  id?: string;
  date: string;
  event: string;
  place: string;
  surface: string;
  resultSingles: string;
  resultDoubles: string;
  notes?: string;
  url?: string;
  matches?: Match[];
  photos?: { id: string; src: string; alt: string; caption: string }[];
  videos?: { id: string; title: string; url: string }[];
};

function canExpand(item: ResultItem) {
  return Boolean(
    item.notes ||
      item.url ||
      (item.matches && item.matches.length > 0) ||
      (item.photos && item.photos.length > 0) ||
      (item.videos && item.videos.length > 0),
  );
}

export function Results({
  items,
  omitHeader = false,
}: {
  items?: ResultItem[];
  omitHeader?: boolean;
}) {
  const { t } = useLocale();
  const list = sortByDateDesc(
    (items ?? t.results.items) as ResultItem[],
  );
  const cols = t.results.columns;
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <Section id="results" className="results">
      {omitHeader ? null : (
        <SectionHeader
          eyebrow={t.results.eyebrow}
          title={t.results.title}
          lead={t.results.lead}
        />
      )}
      <div
        className={`results-table-wrap ${omitHeader ? "results-table-wrap--flush" : ""}`}
      >
        <div
          className="results-table"
          role="table"
          style={{ border: "1px solid rgba(255,255,255,0.18)" }}
        >
          <div
            className="results-table__row results-table__row--head"
            role="row"
            style={{
              display: "grid",
              gridTemplateColumns:
                "6.5rem minmax(12rem, 1.5fr) minmax(9rem, 1.1fr) 6.5rem 7.5rem 8.5rem 2.5rem",
              borderBottom: "1px solid rgba(200,240,0,0.45)",
              background: "rgba(255,255,255,0.04)",
            }}
          >
            {(
              [
                cols.date,
                cols.event,
                cols.place,
                cols.surface,
                cols.singles,
                cols.doubles,
                "",
              ] as const
            ).map((label, index, arr) => (
              <div
                key={`${label}-${index}`}
                role="columnheader"
                style={{
                  color: "#c8f000",
                  padding: "0.85rem 0.9rem",
                  borderRight:
                    index === arr.length - 1
                      ? "none"
                      : "1px solid rgba(255,255,255,0.12)",
                }}
              >
                {label}
              </div>
            ))}
          </div>
          {list.map((item, i) => {
            const rowId = item.id || `${item.event}-${item.date}-${i}`;
            const open = openId === rowId;
            const hasDetail = canExpand(item);
            const cells = [
              item.date || "—",
              item.event,
              item.place || "—",
              item.surface || "—",
              item.resultSingles || "—",
              item.resultDoubles || "—",
            ];

            return (
              <div key={rowId} className="results-table__block">
                <div
                  className={`results-table__row ${hasDetail ? "results-table__row--interactive" : ""} ${open ? "is-open" : ""}`}
                  role="row"
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "6.5rem minmax(12rem, 1.5fr) minmax(9rem, 1.1fr) 6.5rem 7.5rem 8.5rem 2.5rem",
                    borderBottom: open
                      ? "none"
                      : "1px solid rgba(255,255,255,0.14)",
                    cursor: hasDetail ? "pointer" : "default",
                  }}
                  onClick={() => {
                    if (!hasDetail) return;
                    setOpenId(open ? null : rowId);
                  }}
                  onKeyDown={(e) => {
                    if (!hasDetail) return;
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setOpenId(open ? null : rowId);
                    }
                  }}
                  tabIndex={hasDetail ? 0 : undefined}
                  aria-expanded={hasDetail ? open : undefined}
                  aria-label={
                    hasDetail
                      ? open
                        ? t.results.collapseLabel
                        : t.results.expandLabel
                      : undefined
                  }
                >
                  {cells.map((value, index, arr) => (
                    <div
                      key={`${rowId}-${index}`}
                      role="cell"
                      className={
                        index === 1
                          ? "results-table__event"
                          : index >= 4
                            ? "results-table__place"
                            : undefined
                      }
                      style={{
                        color: index === 1 || index >= 4 ? "#ffffff" : "#c5ccd8",
                        padding: "1rem 0.9rem",
                        borderRight: "1px solid rgba(255,255,255,0.1)",
                      }}
                    >
                      {value}
                    </div>
                  ))}
                  <div
                    role="cell"
                    className="results-table__toggle"
                    style={{
                      color: hasDetail ? "#c8f000" : "transparent",
                      padding: "1rem 0.5rem",
                      textAlign: "center",
                    }}
                    aria-hidden
                  >
                    {hasDetail ? (open ? "−" : "+") : ""}
                  </div>
                </div>
                {open && hasDetail ? (
                  <div className="results-detail" role="row">
                    <div className="results-detail__inner" role="cell">
                      {item.notes ? (
                        <div className="results-detail__block">
                          <p className="results-detail__label">
                            {t.results.detailNotes}
                          </p>
                          <p className="results-detail__text">{item.notes}</p>
                        </div>
                      ) : null}

                      {item.matches && item.matches.length > 0 ? (
                        <div className="results-detail__block">
                          <p className="results-detail__label">
                            {t.results.detailMatches}
                          </p>
                          <ul className="results-detail__matches">
                            {item.matches.map((match) => (
                              <li key={match.id}>
                                <strong>{match.round || "—"}</strong>
                                <span>
                                  {match.opponent || "—"}
                                  {match.score ? ` · ${match.score}` : ""}
                                </span>
                                <em>
                                  {t.live.resultLabels[match.result] ||
                                    match.result}
                                </em>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}

                      {(item.photos?.length || item.videos?.length) ? (
                        <div className="results-detail__block">
                          <p className="results-detail__label">
                            {t.results.detailMedia}
                          </p>
                          {item.photos && item.photos.length > 0 ? (
                            <div className="results-detail__photos">
                              {item.photos.map((photo) => (
                                <figure key={photo.id}>
                                  <div className="results-detail__photo">
                                    <Image
                                      src={photo.src}
                                      alt={photo.alt || item.event}
                                      fill
                                      sizes="(max-width: 700px) 50vw, 180px"
                                    />
                                  </div>
                                  {photo.caption ? (
                                    <figcaption>{photo.caption}</figcaption>
                                  ) : null}
                                </figure>
                              ))}
                            </div>
                          ) : null}
                          {item.videos && item.videos.length > 0 ? (
                            <ul className="results-detail__videos">
                              {item.videos.map((video) => {
                                const embed = youtubeEmbedUrl(video.url);
                                return (
                                  <li key={video.id}>
                                    {embed ? (
                                      <div className="results-detail__embed">
                                        <iframe
                                          src={embed}
                                          title={video.title}
                                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                          allowFullScreen
                                        />
                                      </div>
                                    ) : isPlayableMediaUrl(video.url) ? (
                                      <video
                                        controls
                                        playsInline
                                        preload="metadata"
                                        src={video.url}
                                      >
                                        {video.title}
                                      </video>
                                    ) : (
                                      <a
                                        href={video.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        {video.title} ↗
                                      </a>
                                    )}
                                    <p>{video.title}</p>
                                  </li>
                                );
                              })}
                            </ul>
                          ) : null}
                        </div>
                      ) : null}

                      {item.url ? (
                        <a
                          className="results-detail__link"
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {t.results.detailLink} ↗
                        </a>
                      ) : null}
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}

export function LiveTournament({
  tournament,
}: {
  tournament?: {
    date: string;
    event: string;
    place: string;
    surface: string;
    notes: string;
    url: string;
    matches: {
      id: string;
      round: string;
      opponent: string;
      score: string;
      result: string;
      date: string;
      notes: string;
    }[];
  } | null;
}) {
  const { t } = useLocale();

  return (
    <Section id="live" className="live-tour">
      <div className="live-tour__intro">
        <p className="eyebrow">{t.live.eyebrow}</p>
        <div className="live-tour__title-row">
          <h2 className="section-title" style={{ color: "#ffffff" }}>
            {t.live.title}
          </h2>
          {tournament ? (
            <span className="live-tour__badge">{t.live.badge}</span>
          ) : null}
        </div>
        <p className="section-lead">{t.live.lead}</p>
      </div>

      {!tournament ? (
        <p className="placeholder-note">{t.live.empty}</p>
      ) : (
        <article className="live-card">
          <header className="live-card__head">
            <div>
              <p className="live-card__date">{tournament.date}</p>
              <h3 style={{ color: "#ffffff" }}>{tournament.event}</h3>
              <p>
                {[tournament.place, tournament.surface, tournament.notes]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            </div>
            {tournament.url ? (
              <a
                className="btn btn--ghost"
                href={tournament.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t.live.drawLabel}
              </a>
            ) : null}
          </header>
          <div className="live-card__matches">
            <p className="live-card__label">{t.live.matchesLabel}</p>
            {tournament.matches.length === 0 ? (
              <p className="placeholder-note">{t.live.noMatches}</p>
            ) : (
              <div className="match-list">
                {tournament.matches.map((match) => (
                  <article
                    key={match.id}
                    className={`match-row match-row--${match.result}`}
                  >
                    <div className="match-row__meta">
                      <span>{match.round || "—"}</span>
                      {match.date ? <span>{match.date}</span> : null}
                    </div>
                    <div className="match-row__main">
                      <strong style={{ color: "#ffffff" }}>
                        vs {match.opponent || "TBC"}
                      </strong>
                      <span>
                        {t.live.resultLabels[
                          match.result as keyof typeof t.live.resultLabels
                        ] || match.result}
                        {match.score ? ` · ${match.score}` : ""}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </article>
      )}
    </Section>
  );
}

export function Calendar({
  items,
}: {
  items?: {
    date: string;
    event: string;
    place: string;
    surface: string;
    url?: string;
  }[];
}) {
  const { t } = useLocale();
  const list = items ?? t.calendar.items;

  return (
    <Section id="calendar" className="calendar">
      <SectionHeader {...t.calendar} />
      {list.length ? (
        <div className="calendar__list">
          {list.map((item, i) => (
            <Reveal key={`${item.date}-${item.event}-${i}`} delay={i * 70}>
              <article
                className="event"
                style={{
                  background: "#12161e",
                  border: "1px solid rgba(255,255,255,0.12)",
                }}
              >
                <time className="event__date" style={{ color: "#c8f000" }}>
                  {item.date}
                </time>
                <div className="event__main">
                  <h3 style={{ color: "#ffffff" }}>{item.event}</h3>
                  <p style={{ color: "#c5ccd8" }}>{item.place}</p>
                  {item.url ? (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#c8f000" }}
                    >
                      {t.calendar.linkLabel} ↗
                    </a>
                  ) : null}
                </div>
                <span className="event__surface" style={{ color: "#c8f000" }}>
                  {item.surface}
                </span>
              </article>
            </Reveal>
          ))}
        </div>
      ) : (
        <Reveal>
          <p className="placeholder-note">{t.calendar.empty}</p>
        </Reveal>
      )}
      {t.calendar.note ? (
        <Reveal delay={200}>
          <p className="calendar__note">{t.calendar.note}</p>
        </Reveal>
      ) : null}
    </Section>
  );
}

type RankingItem = {
  system: string;
  value: string;
  note: string;
};

function rankingLabel(system: string) {
  if (system === "ITF Junior") return "ITF 2-hra";
  if (system === "ITF Doubles") return "ITF 4-hra";
  if (system === "UTR") return "UTR 2-hra";
  if (system === "UTR Doubles") return "UTR 4-hra";
  return system;
}

export function Rankings({ items }: { items?: RankingItem[] }) {
  const { t } = useLocale();
  const list = items?.length ? items : t.rankings.items;

  return (
    <Section id="rankings" className="rankings" style={{ background: "#0b0d12" }}>
      <Reveal>
        <p className="eyebrow" style={{ color: "#c8f000" }}>
          {t.rankings.eyebrow}
        </p>
        <h2 className="section-title" style={{ color: "#ffffff" }}>
          {t.rankings.title}
        </h2>
        <p className="section-lead" style={{ color: "#c5ccd8" }}>
          {t.rankings.lead}
        </p>
      </Reveal>
      <div className="rankings__grid">
        {list.map((item, i) => (
          <Reveal key={item.system} delay={i * 60}>
            <article
              className="rank-card"
              style={{
                background: "#12161e",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              <p className="rank-card__system" style={{ color: "#c8f000" }}>
                {rankingLabel(item.system)}
              </p>
              <p className="rank-card__value" style={{ color: "#ffffff" }}>
                {item.value}
              </p>
              <p className="rank-card__note" style={{ color: "#c5ccd8" }}>
                {item.note}
              </p>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

export function Training() {
  const { t } = useLocale();

  return (
    <Section id="training" className="training">
      <SectionHeader {...t.training} />
      <div className="training__grid">
        {t.training.items.map((item, i) => (
          <Reveal key={item.title} delay={i * 70}>
            <article className="train-item">
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

export function Usa({ omitHeader = false }: { omitHeader?: boolean }) {
  const { t } = useLocale();
  const school = t.usa.school;
  const life = t.usa.life;

  return (
    <>
      <Section id="usa" className="usa">
        {omitHeader ? null : <SectionHeader {...t.usa} />}
        <div className={`usa-intro ${omitHeader ? "usa-intro--flush" : ""}`}>
          <Reveal>
            <figure className="usa-intro__photo">
              <Image
                src="/media/filip-backhand.jpg"
                alt={t.usa.photoAlt}
                fill
                sizes="(max-width: 900px) 100vw, 45vw"
                style={{ objectFit: "cover" }}
              />
              <figcaption>{t.usa.photoCaption}</figcaption>
            </figure>
          </Reveal>
          <ul className="point-list point-list--flush usa-intro__points">
            {t.usa.points.map((point, i) => (
              <Reveal key={point.slice(0, 20)} delay={i * 70}>
                <li>{point}</li>
              </Reveal>
            ))}
          </ul>
        </div>
      </Section>

      <section className="usa-hero-strip" aria-hidden="true">
        <div className="usa-hero-strip__media">
          <Image
            src={mediaAssets.usa}
            alt=""
            fill
            sizes="100vw"
            style={{ objectFit: "cover" }}
          />
          <div className="usa-hero-strip__veil" />
          <p className="usa-hero-strip__mark">BRADENTON · FL</p>
        </div>
      </section>

      <Section id="usa-school" className="usa-school">
        <div className="usa-school__brand">
          <Reveal>
            <Image
              className="usa-school__logo"
              src={mediaAssets.inspirationLogo}
              alt="Inspiration Academy"
              width={320}
              height={96}
            />
          </Reveal>
        </div>
        <div className="usa-school__layout">
          <div className="usa-school__main">
            <Reveal>
              <p className="eyebrow">{school.eyebrow}</p>
              <h2 className="section-title">{school.title}</h2>
              <p className="section-lead">{school.lead}</p>
            </Reveal>

            <div className="usa-school__facts">
              {school.facts.map((fact, i) => (
                <Reveal key={fact.label} delay={i * 50}>
                  <article className="usa-fact">
                    <p className="usa-fact__label">{fact.label}</p>
                    <p className="usa-fact__value">{fact.value}</p>
                  </article>
                </Reveal>
              ))}
            </div>

            <div className="usa-school__copy">
              {school.paragraphs.map((paragraph, i) => (
                <Reveal key={paragraph.slice(0, 24)} delay={80 + i * 60}>
                  <p>{paragraph}</p>
                </Reveal>
              ))}
              <Reveal delay={260}>
                <a
                  className="usa-school__link"
                  href={school.linkHref}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {school.linkLabel} ↗
                </a>
              </Reveal>
            </div>
          </div>

          <Reveal delay={120}>
            <aside className="usa-school__visual">
              <Image
                src={mediaAssets.inspirationLion}
                alt="Inspiration Academy Lions mascot"
                fill
                sizes="(max-width: 900px) 100vw, 40vw"
                style={{ objectFit: "cover", objectPosition: "center top" }}
              />
              <div className="usa-school__badge">
                <Image
                  src={mediaAssets.inspirationMark}
                  alt=""
                  width={40}
                  height={40}
                  className="usa-school__badge-mark"
                />
                <p>Inspiration Academy Lions</p>
              </div>
            </aside>
          </Reveal>
        </div>
      </Section>

      <Section id="usa-life" className="usa-life">
        <Reveal>
          <p className="eyebrow">{life.eyebrow}</p>
          <h2 className="section-title">{life.title}</h2>
          <p className="section-lead">{life.lead}</p>
        </Reveal>
        <div className="usa-life__grid">
          {life.items.map((item, i) => (
            <Reveal key={item.title} delay={i * 60}>
              <article className="usa-life__item">
                <span className="usa-life__num">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}
