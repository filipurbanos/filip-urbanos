import { promises as fs } from "fs";
import path from "path";
import { mutateCms, parseCmsData } from "@/lib/cms/store";
import type { Album, CmsData, Photo, Tournament, Video } from "@/lib/cms/types";

export type SeedAlbumSyncResult = {
  addedAlbums: string[];
  addedPhotos: string[];
  addedVideos: string[];
  linkedTournaments: string[];
  linkedVideos: string[];
  albums: Album[];
  photos: Photo[];
  videos: Video[];
  tournaments: Tournament[];
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

  let addedAlbums: string[] = [];
  let addedPhotos: string[] = [];
  let addedVideos: string[] = [];
  let linkedTournaments: string[] = [];
  let linkedVideos: string[] = [];

  const data = await mutateCms((data) => {
    addedAlbums = [];
    addedPhotos = [];
    addedVideos = [];
    linkedTournaments = [];
    linkedVideos = [];

    const albumIds = new Set(data.albums.map((album) => album.id));
    for (const album of seed.albums) {
      if (albumIds.has(album.id)) continue;
      data.albums.push(album);
      albumIds.add(album.id);
      addedAlbums.push(album.title);
    }

    const photoIds = new Set(data.photos.map((photo) => photo.id));
    for (const photo of seed.photos) {
      if (photoIds.has(photo.id)) continue;
      data.photos.push(photo);
      photoIds.add(photo.id);
      addedPhotos.push(photo.alt || photo.caption || photo.id);
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
      linkedTournaments.push(live.event);
    }

    for (const seedVideo of seed.videos) {
      if (!seedVideo.albumId || !albumIds.has(seedVideo.albumId)) continue;
      const live = data.videos.find(
        (video) =>
          video.id === seedVideo.id || video.title === seedVideo.title,
      );
      if (live) {
        if (!live.albumId) {
          live.albumId = seedVideo.albumId;
          linkedVideos.push(live.title);
        }
        continue;
      }
      data.videos.push(seedVideo);
      addedVideos.push(seedVideo.title);
    }
  });

  return {
    addedAlbums,
    addedPhotos,
    addedVideos,
    linkedTournaments,
    linkedVideos,
    albums: data.albums,
    photos: data.photos,
    videos: data.videos,
    tournaments: data.tournaments,
  };
}
