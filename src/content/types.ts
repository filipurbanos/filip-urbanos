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
    tagline: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  homeHub: {
    eyebrow: string;
    title: string;
    lead: string;
    cards: {
      about: string;
      results: string;
      usa: string;
    };
    moreLabel: string;
  };
  about: SectionCopy & {
    outlineTitle: string;
    photoAlt: string;
    paragraphs: string[];
  };
  journey: SectionCopy & {
    outlineTitle: string;
    chapters: { year: string; title: string; body: string }[];
  };
  profile: SectionCopy & {
    facts: { label: string; value: string }[];
  };
  results: SectionCopy & {
    pageTitle: string;
    pageLead: string;
    outlineTitle: string;
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
    detailNotes: string;
    detailMatches: string;
    detailMedia: string;
    detailLink: string;
    expandLabel: string;
    collapseLabel: string;
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
    empty: string;
    note: string;
    linkLabel: string;
  };
  rankings: SectionCopy & {
    empty: string;
    profileLink: string;
    systems: Record<string, string>;
    items: { system: string; value: string; note: string }[];
  };
  training: SectionCopy & {
    items: { title: string; body: string }[];
  };
  usa: SectionCopy & {
    outlineTitle: string;
    photoAlt: string;
    photoCaption: string;
    schoolBadge: string;
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
    outlineTitle: string;
  };
  albums: {
    all: string;
    allLead: string;
    uncategorized: string;
    indexLabel: string;
    back: string;
    videosLabel: string;
    empty: string;
    emptyIndex: string;
  };
  news: SectionCopy & {
    items: { date: string; title: string; excerpt: string }[];
  };
  press: SectionCopy & {
    items: { type: string; title: string; source: string; href: string }[];
  };
  partners: SectionCopy & {
    outlineTitle: string;
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
  faq: SectionCopy & {
    items: { q: string; a: string }[];
  };
  contact: SectionCopy & {
    outlineTitle: string;
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
    form: {
      eyebrow: string;
      title: string;
      lead: string;
      name: string;
      email: string;
      topic: string;
      message: string;
      submit: string;
      sending: string;
      success: string;
      error: string;
      topics: {
        partner: string;
        media: string;
        other: string;
      };
    };
  };
  footer: {
    rights: string;
    tagline: string;
    instagram: string;
  };
  chrome: {
    menu: string;
    nav: string;
    lang: string;
  };
};
