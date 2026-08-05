import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
import type {
  Album,
  CmsData,
  Photo,
  Ranking,
  Tournament,
  TournamentStatus,
  Video,
} from "@/lib/cms/types";
import { RANKING_SYSTEMS } from "@/lib/cms/rankings";
import { readCmsJson, writeCmsJson } from "@/lib/cms/storage";

export const CMS_CACHE_TAG = "cms";

const empty: CmsData = {
  revision: 0,
  tournaments: [],
  albums: [],
  photos: [],
  videos: [],
  partners: [],
  rankings: [],
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

function normalizeRankings(raw: unknown): Ranking[] {
  const list = Array.isArray(raw) ? raw : [];
  const bySystem = new Map<string, Ranking>();

  for (const item of list) {
    const system = String((item as { system?: unknown })?.system || "").trim();
    if (!RANKING_SYSTEMS.includes(system as Ranking["system"])) continue;
    bySystem.set(system, {
      system: system as Ranking["system"],
      value: String((item as { value?: unknown })?.value || "").trim(),
      note: String((item as { note?: unknown })?.note || "").trim(),
    });
  }

  return RANKING_SYSTEMS.map((system) => {
    const existing = bySystem.get(system);
    if (existing) return existing;
    return { system, value: "", note: "" };
  });
}

export function parseCmsData(parsed: Partial<CmsData>): CmsData {
  const revisionRaw = Number((parsed as { revision?: unknown }).revision);
  return {
    revision: Number.isFinite(revisionRaw) && revisionRaw >= 0 ? revisionRaw : 0,
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
    rankings: normalizeRankings((parsed as { rankings?: unknown }).rankings),
  };
}

export class CmsUnavailableError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "CmsUnavailableError";
  }
}

export class CmsConflictError extends Error {
  constructor(message = "CMS write conflict") {
    super(message);
    this.name = "CmsConflictError";
  }
}

async function loadCmsUncached(): Promise<CmsData> {
  let raw: string | null;
  try {
    raw = await readCmsJson();
  } catch (error) {
    throw new CmsUnavailableError("CMS storage is temporarily unavailable", {
      cause: error,
    });
  }

  if (!raw) return { ...empty, rankings: normalizeRankings([]) };

  try {
    const parsed = JSON.parse(raw) as Partial<CmsData>;
    return parseCmsData(parsed);
  } catch (error) {
    throw new CmsUnavailableError("CMS content could not be parsed", {
      cause: error,
    });
  }
}

/** Fresh read — admin APIs and mutations. */
export async function readCms(): Promise<CmsData> {
  return loadCmsUncached();
}

/** Cached read for public pages (invalidated via CMS_CACHE_TAG). */
export const readCmsCached = unstable_cache(
  async () => loadCmsUncached(),
  ["cms-content"],
  { tags: [CMS_CACHE_TAG], revalidate: 120 },
);

export function revalidateCmsCache() {
  revalidateTag(CMS_CACHE_TAG, "max");
  revalidatePath("/media");
  revalidatePath("/en/media");
  revalidatePath("/results");
  revalidatePath("/en/results");
}

async function persistCms(data: CmsData): Promise<void> {
  await writeCmsJson(`${JSON.stringify(data, null, 2)}\n`);
  revalidateCmsCache();
}

/**
 * Direct write. Prefer `mutateCms` for concurrent-safe updates.
 * Still bumps nothing — caller must set revision.
 */
export async function writeCms(data: CmsData): Promise<void> {
  await persistCms(data);
}

/**
 * Read → mutate → CAS revision check → write, with retries.
 * Mutator may mutate the draft in place or return a new object.
 */
export async function mutateCms(
  mutator: (data: CmsData) => void | CmsData | Promise<void | CmsData>,
): Promise<CmsData> {
  const maxAttempts = 4;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const current = await loadCmsUncached();
    const baseRevision = current.revision;
    const draft = structuredClone(current);
    const maybe = await mutator(draft);
    const next = maybe ?? draft;
    next.revision = baseRevision + 1;

    const latest = await loadCmsUncached();
    if (latest.revision !== baseRevision) {
      continue;
    }

    await persistCms(next);
    return next;
  }

  throw new CmsConflictError(
    "CMS write conflict — refresh and try again",
  );
}

export function createId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}
