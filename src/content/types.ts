export type Locale = "sk" | "en";

export type SectionCopy = {
  eyebrow: string;
  title: string;
  lead: string;
};

export type Content = {
  meta: {
    title: string;
    description: string;
  };
  nav: {
    about: string;
    journey: string;
    results: string;
    usa: string;
    media: string;
    partners: string;
    contact: string;
  };
  hero: {
    role: string;
    headline: string;
    lead: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  about: SectionCopy & {
    paragraphs: string[];
  };
  journey: SectionCopy & {
    chapters: { year: string; title: string; body: string }[];
  };
  profile: SectionCopy & {
    facts: { label: string; value: string }[];
  };
  results: SectionCopy & {
    columns: {
      date: string;
      event: string;
      place: string;
      surface: string;
      singles: string;
      doubles: string;
    };
    items: {
      date: string;
      event: string;
      place: string;
      surface: string;
      resultSingles: string;
      resultDoubles: string;
    }[];
  };
  live: SectionCopy & {
    badge: string;
    empty: string;
    drawLabel: string;
    matchesLabel: string;
    noMatches: string;
    resultLabels: {
      scheduled: string;
      win: string;
      loss: string;
      retired: string;
      walkover: string;
    };
  };
  calendar: SectionCopy & {
    items: {
      date: string;
      event: string;
      place: string;
      surface: string;
      url?: string;
    }[];
    note: string;
  };
  rankings: SectionCopy & {
    items: { system: string; value: string; note: string }[];
  };
  training: SectionCopy & {
    items: { title: string; body: string }[];
  };
  usa: SectionCopy & {
    points: string[];
    school: {
      eyebrow: string;
      title: string;
      lead: string;
      facts: { label: string; value: string }[];
      paragraphs: string[];
      linkLabel: string;
      linkHref: string;
    };
    life: {
      eyebrow: string;
      title: string;
      lead: string;
      items: { title: string; body: string }[];
    };
  };
  gallery: SectionCopy & {
    placeholder: string;
  };
  albums: {
    all: string;
    uncategorized: string;
    tabsLabel: string;
    videosLabel: string;
  };
  videos: SectionCopy & {
    placeholder: string;
  };
  news: SectionCopy & {
    items: { date: string; title: string; excerpt: string }[];
  };
  press: SectionCopy & {
    items: { type: string; title: string; source: string; href: string }[];
  };
  partners: SectionCopy & {
    mainLabel: string;
    othersLabel: string;
    emptyNote: string;
    visitLabel: string;
  };
  sponsors: SectionCopy & {
    offerTitle: string;
    offers: string[];
    usageTitle: string;
    usage: string[];
    cta: string;
  };
  mediaKit: SectionCopy & {
    items: { title: string; meta: string }[];
    cta: string;
  };
  collaborate: SectionCopy & {
    steps: { title: string; body: string }[];
    cta: string;
  };
  community: SectionCopy & {
    note: string;
  };
  faq: SectionCopy & {
    items: { q: string; a: string }[];
  };
  contact: SectionCopy & {
    emailLabel: string;
    socialLabel: string;
    partnerLabel: string;
    partnerBody: string;
    mediaLabel: string;
    mediaBody: string;
    cta: string;
    detailsTitle: string;
    role: string;
    baseLabel: string;
    baseValue: string;
    itfLabel: string;
    responseLabel: string;
    responseValue: string;
    igCta: string;
  };
  footer: {
    rights: string;
    tagline: string;
  };
};
