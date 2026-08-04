import { promises as fs } from "fs";
import path from "path";
import { parseCmsData, readCms, writeCms } from "@/lib/cms/store";
import type { Album, CmsData } from "@/lib/cms/types";

export type SeedAlbumSyncResult = {
  addedAlbums: string[];
  linkedTournaments: string[];
  linkedVideos: string[];
  albums: Album[];
};

async function readSeedCms(): Promise<CmsData | null> {
  try {
    const raw = await fs.readFile(
      path.join(process.cwd(), "data", "content.json"),
      "utf8",
    );
    return parseCmsData(JSON.parse(raw) as Partial<CmsData>);
  } catch {
    return null;
  }
}

/**
 * Adds missing seed albums into live CMS and fills empty albumId links
 * on matching tournaments/videos. Never overwrites existing albumIds.
 */
export async function syncSeedAlbums(): Promise<SeedAlbumSyncResult> {
  const seed = await readSeedCms();
  if (!seed) {
    throw new Error("Seed content.json is missing");
  }

  const data = await readCms();
  const result = {
    addedAlbums: [] as string[],
    linkedTournaments: [] as string[],
    linkedVideos: [] as string[],
  };

  const albumIds = new Set(data.albums.map((album) => album.id));
  for (const album of seed.albums) {
    if (albumIds.has(album.id)) continue;
    data.albums.push(album);
    albumIds.add(album.id);
    result.addedAlbums.push(album.title);
  }

  for (const seedTournament of seed.tournaments) {
    if (!seedTournament.albumId || !albumIds.has(seedTournament.albumId)) {
      continue;
    }
    const live = data.tournaments.find(
      (tournament) =>
        tournament.id === seedTournament.id ||
        tournament.event === seedTournament.event,
    );
    if (!live || live.albumId) continue;
    live.albumId = seedTournament.albumId;
    result.linkedTournaments.push(live.event);
  }

  for (const seedVideo of seed.videos) {
    if (!seedVideo.albumId || !albumIds.has(seedVideo.albumId)) continue;
    const live = data.videos.find(
      (video) =>
        video.id === seedVideo.id || video.title === seedVideo.title,
    );
    if (!live || live.albumId) continue;
    live.albumId = seedVideo.albumId;
    result.linkedVideos.push(live.title);
  }

  await writeCms(data);
  return { ...result, albums: data.albums };
}
