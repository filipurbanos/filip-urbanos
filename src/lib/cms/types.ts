export type TournamentStatus = "upcoming" | "live" | "completed";

export type MatchResult =
  | "scheduled"
  | "win"
  | "loss"
  | "retired"
  | "walkover";

export type PartnerTier = "main" | "partner";
export type RankingSystem = "ITF Junior" | "UTR" | "ATP" | "Tennis Europe";

export type Match = {
  id: string;
  round: string;
  opponent: string;
  score: string;
  result: MatchResult;
  date: string;
  notes: string;
};

export type Tournament = {
  id: string;
  date: string;
  event: string;
  place: string;
  surface: string;
  status: TournamentStatus;
  resultSingles: string;
  resultDoubles: string;
  notes: string;
  url: string;
  /** Optional album with photos/videos for this event */
  albumId: string;
  matches: Match[];
};

export type Album = {
  id: string;
  title: string;
  date: string;
  description: string;
  createdAt: string;
};

export type Photo = {
  id: string;
  src: string;
  alt: string;
  caption: string;
  albumId: string;
  createdAt: string;
};

export type Video = {
  id: string;
  title: string;
  url: string;
  description: string;
  albumId: string;
  createdAt: string;
};

export type Partner = {
  id: string;
  name: string;
  url: string;
  logo: string;
  tier: PartnerTier;
  description: string;
  order: number;
};

export type Ranking = {
  system: RankingSystem;
  value: string;
  note: string;
};

export type CmsData = {
  tournaments: Tournament[];
  albums: Album[];
  photos: Photo[];
  videos: Video[];
  partners: Partner[];
  rankings: Ranking[];
};
