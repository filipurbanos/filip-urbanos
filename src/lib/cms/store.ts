import type {
  Album,
  CmsData,
  Photo,
  Tournament,
  TournamentStatus,
  Video,
} from "@/lib/cms/types";
import { readCmsJson, writeCmsJson } from "@/lib/cms/storage";

const empty: CmsData = {
  tournaments: [],
  albums: [],
  photos: [],
  videos: [],
  partners: [],
};

function normalizeStatus(status: unknown): TournamentStatus {
  if (status === "live" || status === "completed" || status === "upcoming") {
    return status;
  }
  return "upcoming";
}

function normalizeTournament(
  raw: Partial<Tournament> & { result?: string },
): Tournament {
  const legacyResult = String(raw.result || "");
  return {
    id: String(raw.id || createId("t")),
    date: String(raw.date || ""),
    event: String(raw.event || "Turnaj"),
    place: String(raw.place || ""),
    surface: String(raw.surface || "Hard"),
    status: normalizeStatus(raw.status),
    resultSingles: String(raw.resultSingles || legacyResult || ""),
    resultDoubles: String(raw.resultDoubles || ""),
    notes: String(raw.notes || ""),
    url: String(raw.url || ""),
    albumId: String(raw.albumId || ""),
    matches: Array.isArray(raw.matches)
      ? raw.matches.map((match) => ({
          id: String(match.id || createId("m")),
          round: String(match.round || ""),
          opponent: String(match.opponent || ""),
          score: String(match.score || ""),
          result:
            match.result === "win" ||
            match.result === "loss" ||
            match.result === "retired" ||
            match.result === "walkover" ||
            match.result === "scheduled"
              ? match.result
              : "scheduled",
          date: String(match.date || ""),
          notes: String(match.notes || ""),
        }))
      : [],
  };
}

function normalizeAlbum(raw: Partial<Album>): Album {
  return {
    id: String(raw.id || createId("a")),
    title: String(raw.title || "Album"),
    date: String(raw.date || ""),
    description: String(raw.description || ""),
    createdAt: String(raw.createdAt || new Date().toISOString()),
  };
}

function normalizePhoto(raw: Partial<Photo>): Photo {
  return {
    id: String(raw.id || createId("p")),
    src: String(raw.src || ""),
    alt: String(raw.alt || ""),
    caption: String(raw.caption || ""),
    albumId: String(raw.albumId || ""),
    createdAt: String(raw.createdAt || new Date().toISOString()),
  };
}

function normalizeVideo(raw: Partial<Video>): Video {
  return {
    id: String(raw.id || createId("v")),
    title: String(raw.title || "Video"),
    url: String(raw.url || ""),
    description: String(raw.description || ""),
    albumId: String(raw.albumId || ""),
    createdAt: String(raw.createdAt || new Date().toISOString()),
  };
}

export async function readCms(): Promise<CmsData> {
  try {
    const raw = await readCmsJson();
    if (!raw) return empty;
    const parsed = JSON.parse(raw) as Partial<CmsData>;
    return {
      tournaments: (parsed.tournaments ?? []).map((item) =>
        normalizeTournament(item as Partial<Tournament>),
      ),
      albums: (parsed.albums ?? []).map((item) =>
        normalizeAlbum(item as Partial<Album>),
      ),
      photos: (parsed.photos ?? []).map((item) =>
        normalizePhoto(item as Partial<Photo>),
      ),
      videos: (parsed.videos ?? []).map((item) =>
        normalizeVideo(item as Partial<Video>),
      ),
      partners: parsed.partners ?? [],
    };
  } catch {
    return empty;
  }
}

export async function writeCms(data: CmsData): Promise<void> {
  await writeCmsJson(`${JSON.stringify(data, null, 2)}\n`);
}

export function createId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}
