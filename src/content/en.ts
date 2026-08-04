import type { Content } from "./types";

export const en: Content = {
  meta: {
    title: "Filip Urbanos | Tennis",
    description:
      "Official site of Slovak junior tennis player Filip Urbanos — profile, journey, results, USA chapter, media, and partnerships.",
  },
  nav: {
    about: "Story",
    journey: "Journey",
    results: "Results",
    usa: "USA",
    media: "Media",
    partners: "Partners",
    contact: "Contact",
  },
  hero: {
    role: "Slovak junior tennis player",
    headline: "Ready for the next point.",
    lead: "From Slovakia to Florida. Study, discipline, and elite training with one aim — build a professional tennis career.",
    ctaPrimary: "View results",
    ctaSecondary: "Become a partner",
    chapterLabel: "Current chapter",
    chapterValue: "Florida, USA",
  },
  homeHub: {
    eyebrow: "Explore",
    title: "The full story, page by page",
    lead: "Athlete profile, journey, results, USA chapter, media, and partnerships — each part has its own page.",
    cards: {
      about: "Who Filip is and where he’s headed.",
      journey: "From Slovakia through Barcelona to the USA.",
      results: "Results, calendar, and rankings.",
      usa: "Study and tennis in the United States.",
      media: "Photos, videos, news, and press.",
      partners: "Partnerships, media kit, and collaboration.",
    },
  },
  about: {
    eyebrow: "About Filip",
    title: "Ambition, discipline, growth",
    lead: "A Slovak junior building a career through training, the international circuit, and a next chapter in the USA.",
    paragraphs: [
      "Filip Urbanos is a 196 cm right-hander with a hard-court preference. He has played tennis since age four or five and now competes on the ITF Junior Tour.",
      "His aim is clear: grow as a player and as a person — through tough matches, quality preparation, and combining study with tennis in the United States.",
    ],
  },
  journey: {
    eyebrow: "One direction",
    title: "Forward.",
    lead: "Each chapter added pace, tougher opponents, and a clearer aim.",
    chapters: [
      {
        year: "01",
        title: "Slovakia",
        body: "Where the love for tennis and the first big ambitions began.",
      },
      {
        year: "02",
        title: "Barcelona",
        body: "International training and a new view of the game.",
      },
      {
        year: "03",
        title: "Florida",
        body: "Study and training at Inspiration Academy, building match experience in the USA.",
      },
      {
        year: "04",
        title: "Future",
        body: "College tennis and a long-term path toward the professional tour.",
      },
    ],
  },
  profile: {
    eyebrow: "Player profile",
    title: "Quick facts",
    lead: "A fast overview for coaches, media, recruiting, and partners.",
    facts: [
      { label: "Country", value: "Slovakia" },
      { label: "Height", value: "196 cm" },
      { label: "Plays", value: "Right-handed" },
      { label: "Surface", value: "Hard" },
      { label: "Started", value: "Age 4–5" },
      { label: "Goal", value: "Top 20 ATP" },
    ],
  },
  results: {
    eyebrow: "Results",
    title: "Completed tournaments",
    lead: "Completed tournaments and milestones. Follow the live event above — scores update after each match.",
    columns: {
      date: "Date",
      event: "Event",
      place: "Place",
      surface: "Surface",
      singles: "Singles",
      doubles: "Doubles",
    },
    items: [
      {
        date: "2026-02",
        event: "J30 Nairobi",
        place: "Nairobi, Kenya",
        surface: "Hard",
        resultSingles: "Seeded #2",
        resultDoubles: "—",
      },
      {
        date: "2025",
        event: "Slovak Championships — doubles",
        place: "Slovakia",
        surface: "Hard",
        resultSingles: "—",
        resultDoubles: "Runner-up",
      },
    ],
  },
  live: {
    eyebrow: "Current tournament",
    title: "In play",
    lead: "Live event — we’ll add each match result here. When it ends, it moves to completed.",
    badge: "LIVE",
    empty: "No live tournament is set right now.",
    drawLabel: "Draw / live scoring",
    matchesLabel: "Matches",
    noMatches: "Matches will appear once the tournament starts.",
    resultLabels: {
      scheduled: "Scheduled",
      win: "Win",
      loss: "Loss",
      retired: "Retired",
      walkover: "Walkover",
    },
  },
  calendar: {
    eyebrow: "Calendar",
    title: "Upcoming tournaments",
    lead: "Circuit plan — venues and dates can shift with draws and travel.",
    items: [
      {
        date: "Aug 2026",
        event: "ITF Junior Circuit",
        place: "Europe · TBC",
        surface: "Hard",
      },
      {
        date: "Sep 2026",
        event: "ITF Junior Circuit",
        place: "Europe · TBC",
        surface: "Clay / Hard",
      },
    ],
    note: "The live tournament is above. Manage the calendar in admin → Tournaments.",
  },
  rankings: {
    eyebrow: "Rankings",
    title: "ITF · UTR · ATP",
    lead: "Live positions will be maintained ongoing. Below are starting values / placeholders to confirm.",
    items: [
      {
        system: "ITF Junior",
        value: "Live",
        note: "Official profile on itftennis.com",
      },
      {
        system: "UTR",
        value: "TBC",
        note: "To confirm with current rating",
      },
      {
        system: "ATP",
        value: "Goal",
        note: "Long-term aim: Top 20",
      },
      {
        system: "Tennis Europe",
        value: "~150",
        note: "Historical junior milestone",
      },
    ],
  },
  training: {
    eyebrow: "Training",
    title: "Preparation for the next level",
    lead: "Tennis, conditioning, recovery, and mental work — the rhythm between tournaments.",
    items: [
      {
        title: "On court",
        body: "Technique, patterns, serve and return under international pressure.",
      },
      {
        title: "Conditioning",
        body: "Strength, mobility, and endurance for a 196 cm frame — without unnecessary injury risk.",
      },
      {
        title: "Recovery",
        body: "Physio, sleep, and recovery as part of performance, not an afterthought.",
      },
    ],
  },
  usa: {
    eyebrow: "USA",
    title: "Florida — study and tennis",
    lead: "Inspiration Academy in Bradenton combines school and high-performance tennis — Filip’s current USA chapter.",
    points: [
      "Study and daily training at Inspiration Academy in Florida.",
      "Hard-court rhythm, strong competition, and a clear daily plan.",
      "Match experience on the UTR and American junior circuit.",
      "Aim: college tennis and a long-term path to the pro tour.",
    ],
    school: {
      eyebrow: "The school",
      title: "Inspiration Academy",
      lead: "A private school in Bradenton, FL, that pairs academics with a tennis academy — one campus, one rhythm.",
      facts: [
        { label: "Location", value: "Bradenton, Florida" },
        { label: "Academics", value: "Secondary · grades 6–12 + post-grad" },
        { label: "Model", value: "Small groups · mentorship learning" },
        { label: "Tennis", value: "Full-time academy on hard courts" },
      ],
      paragraphs: [
        "Inspiration Academy is a day and boarding school built around personal instruction. Academics run alongside sport so players can handle coursework and a demanding training week.",
        "The tennis academy on the same campus gives Filip daily hard-court work, match prep, and access to events around Bradenton / Sarasota — including UTR events like Battle on the Bay.",
        "For Filip it’s the natural next step after Bratislava → Barcelona → USA: school, training, and competition in one place.",
      ],
      linkLabel: "inspirationacademy.com",
      linkHref: "https://inspirationacademy.com/",
    },
    life: {
      eyebrow: "Day to day",
      title: "What the Florida chapter means",
      lead: "It’s not just “moving to the USA” — it’s a regime where school and tennis reinforce each other.",
      items: [
        {
          title: "School + court",
          body: "The day is built around learning and training. Small classes and a mentorship model make it possible to manage both.",
        },
        {
          title: "Hard-court rhythm",
          body: "Florida means outdoor hard courts, heat, and a dense calendar. Filip learns American tempo against strong competition.",
        },
        {
          title: "Matches nearby",
          body: "UTR and junior events in Bradenton / Sarasota build experience without flying halfway around the world every weekend.",
        },
        {
          title: "Next goal",
          body: "College tennis in the USA and growth toward the pro tour — Inspiration Academy is a practical platform for that path.",
        },
      ],
    },
  },
  gallery: {
    eyebrow: "Photos from the road",
    title: "Media.",
    lead: "Tournaments, training, and moments from Filip’s tennis journey — grouped by event.",
    placeholder: "More photos later — first court selection is live now.",
  },
  albums: {
    all: "All",
    uncategorized: "Uncategorized",
    tabsLabel: "Albums",
    videosLabel: "Videos",
  },
  videos: {
    eyebrow: "Video gallery",
    title: "Matches, highlights, preparation",
    lead: "Short clips and longer pieces. YouTube / Instagram embeds come next.",
    placeholder: "Videos coming soon — highlight and interview links welcome.",
  },
  news: {
    eyebrow: "News",
    title: "What’s new",
    lead: "Short updates from the circuit, preparation, and the USA chapter. Full blog follows with admin.",
    items: [
      {
        date: "2026",
        title: "Official website is live",
        excerpt:
          "A home for profile, results, media, and partnerships — in Slovak and English.",
      },
      {
        date: "2026",
        title: "Florida chapter",
        excerpt:
          "Study and training at Inspiration Academy — the current chapter after Barcelona.",
      },
    ],
  },
  press: {
    eyebrow: "Press",
    title: "Interviews and coverage",
    lead: "Links for journalists and fans. Media kit is listed separately below.",
    items: [
      {
        type: "Profile",
        title: "ITF Junior Player Profile",
        source: "itftennis.com",
        href: "https://www.itftennis.com/en/players/filip-urbanos/800621234/svk/jt/S/overview/",
      },
      {
        type: "Academy",
        title: "Barcelona Tennis Academy — player profile",
        source: "btatennis.com",
        href: "https://www.btatennis.com/bta-players/filip-urbanos",
      },
      {
        type: "Partnerships",
        title: "Sponsoo — sponsorship profile",
        source: "sponsoo.com",
        href: "https://www.sponsoo.com/p/filipurbanos",
      },
      {
        type: "Social",
        title: "Instagram @filipurbanos",
        source: "instagram.com",
        href: "https://www.instagram.com/filipurbanos/",
      },
    ],
  },
  partners: {
    eyebrow: "Partners",
    title: "Brands with Filip",
    lead: "Thank you to the partners behind the journey — from training to tournaments.",
    mainLabel: "Main partner",
    othersLabel: "Partners",
    emptyNote: "More partners will be added soon.",
    visitLabel: "Visit website",
  },
  sponsors: {
    eyebrow: "For sponsors",
    title: "Why partner with Filip",
    lead: "A long-term partnership with a junior building international visibility and a clear goal.",
    offerTitle: "What a partner gets",
    offers: [
      "Logo visibility on clothing and equipment",
      "Mentions on Instagram and in media posts",
      "Brand presence at tournaments",
      "Access to the media kit and content collaboration",
    ],
    usageTitle: "Where support goes",
    usage: [
      "Travel and lodging for ITF events",
      "Rackets, strings, shoes, and apparel",
      "Coaching, conditioning, and physiotherapy",
      "Study and training block in the USA",
      "Photo and video production",
    ],
    cta: "Talk partnerships",
  },
  mediaKit: {
    eyebrow: "Media Kit",
    title: "Downloadable assets",
    lead: "Logo, bio, high-res photos, and press copy — prepared as a downloadable pack.",
    items: [
      { title: "Bio (SK / EN)", meta: "PDF · soon" },
      { title: "Photo selection", meta: "ZIP · soon" },
      { title: "Logos and brand assets", meta: "ZIP · soon" },
      { title: "Fact sheet", meta: "PDF · soon" },
    ],
    cta: "Request media kit",
  },
  collaborate: {
    eyebrow: "Collaborate",
    title: "How partnership starts",
    lead: "A simple path — from first email to activation on court and in media.",
    steps: [
      {
        title: "1. Brief",
        body: "Share brand goals, budget, and collaboration type.",
      },
      {
        title: "2. Proposal",
        body: "We shape a format: apparel, content, event presence, or a package.",
      },
      {
        title: "3. Activation",
        body: "Kickoff, assets, and reporting through the season.",
      },
    ],
    cta: "Start a partnership",
  },
  community: {
    eyebrow: "Community",
    title: "Charity and community",
    lead: "Space for work that matters beyond the scoreboard.",
    note: "This section goes live when projects are ready — kids’ clinics, charity events, local tennis.",
  },
  faq: {
    eyebrow: "FAQ",
    title: "Frequently asked questions",
    lead: "Quick answers for media, partners, and fans.",
    items: [
      {
        q: "Where does Filip train?",
        a: "The path ran through Love 4 Tennis in Bratislava and Barcelona Tennis Academy. The current chapter is study and training at Inspiration Academy in Florida.",
      },
      {
        q: "How can I sponsor Filip?",
        a: "Write to urbanosfilip33@gmail.com with a brand brief. We’ll propose a collaboration and share the media kit. The main partner is AGROMEPA, s.r.o.",
      },
      {
        q: "Where are official results?",
        a: "On the ITF profile and increasingly here under Results.",
      },
      {
        q: "Is the site available in English?",
        a: "Yes — use the SK / EN toggle in the header.",
      },
    ],
  },
  contact: {
    eyebrow: "Contact",
    title: "Let’s talk",
    lead: "Media, tournaments, recruiting, and partnerships — write and we’ll get back to you.",
    emailLabel: "Email",
    socialLabel: "Instagram",
    partnerLabel: "Partnerships",
    partnerBody:
      "Send a short brand brief and goal — we’ll come back with a format that fits.",
    mediaLabel: "Media & invites",
    mediaBody:
      "Interviews, photo/video requests, and tournament invites go through the same inbox.",
    cta: "Send an email",
    detailsTitle: "Contact details",
    role: "Junior tennis player · Slovakia → Florida",
    baseLabel: "Base",
    baseValue: "Inspiration Academy · Florida, USA",
    itfLabel: "ITF profile",
    responseLabel: "Response",
    responseValue: "Usually within 2–3 days",
    igCta: "Open Instagram",
  },
  footer: {
    rights: "© Filip Urbanos. All rights reserved.",
    tagline: "Slovakia → USA",
  },
};
