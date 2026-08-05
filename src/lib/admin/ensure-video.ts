import { wait, withRetry } from "@/lib/admin/retry";
import type { Video } from "@/lib/cms/types";

type VideoSavePayload = {
  title: string;
  url: string;
  description: string;
  albumId: string;
};

/** After Blob upload, confirm the CMS record exists (callback + client fallback). */
export async function ensureVideoInGallery(
  blobUrl: string,
  payload: VideoSavePayload,
  saveRecord: (payload: VideoSavePayload) => Promise<Video[]>,
  fetchVideos: () => Promise<Video[] | null>,
): Promise<Video[]> {
  try {
    const videos = await withRetry(
      () => saveRecord({ ...payload, url: blobUrl }),
      { attempts: 5, delayMs: 400, label: "Uloženie do galérie zlyhalo" },
    );
    if (videos.some((video) => video.url === blobUrl)) return videos;
  } catch {
    // Blob callback may have already written — poll below.
  }

  for (let attempt = 0; attempt < 8; attempt += 1) {
    await wait(500 + attempt * 300);
    const fresh = await fetchVideos();
    if (fresh?.some((video) => video.url === blobUrl)) return fresh;

    try {
      const videos = await saveRecord({ ...payload, url: blobUrl });
      if (videos.some((video) => video.url === blobUrl)) return videos;
    } catch {
      // Keep polling until timeout.
    }
  }

  throw new Error(
    "Súbor je nahraný, ale nepodarilo sa ho potvrdiť v galérii. Obnov stránku — ak video stále chýba, skús ho upraviť cez zoznam nižšie.",
  );
}
