import { withRetry } from "@/lib/admin/retry";
import { createId, mutateCms } from "@/lib/cms/store";
import type { Video } from "@/lib/cms/types";

export type VideoUploadPayload = {
  title: string;
  description: string;
  albumId: string;
  fileName?: string;
};

export function parseVideoUploadPayload(
  raw: string | null | undefined,
): VideoUploadPayload | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<VideoUploadPayload>;
    return {
      title: String(parsed.title || "").trim(),
      description: String(parsed.description || "").trim(),
      albumId: String(parsed.albumId || "").trim(),
      fileName: parsed.fileName ? String(parsed.fileName) : undefined,
    };
  } catch {
    return null;
  }
}

function titleFromPayload(payload: VideoUploadPayload, blobUrl: string): string {
  if (payload.title) return payload.title;
  if (payload.fileName) {
    return payload.fileName.replace(/\.[^.]+$/, "") || "Video";
  }
  const tail = blobUrl.split("/").pop() || "Video";
  return tail.replace(/\.[^.]+$/, "") || "Video";
}

/** Idempotent — same URL updates metadata instead of duplicating. */
export async function upsertVideoRecord(input: {
  url: string;
  title?: string;
  description?: string;
  albumId?: string;
  fileName?: string;
}): Promise<Video[]> {
  const url = input.url.trim();
  if (!url) {
    throw new Error("Chýba URL videa");
  }

  const data = await withRetry(
    () =>
      mutateCms((draft) => {
        const existing = draft.videos.find((video) => video.url === url);
        if (existing) {
          if (input.title?.trim()) existing.title = input.title.trim();
          if (input.description !== undefined) {
            existing.description = input.description.trim();
          }
          if (input.albumId !== undefined && input.albumId) {
            existing.albumId = input.albumId;
          }
          return;
        }

        const payload: VideoUploadPayload = {
          title: input.title?.trim() || "",
          description: input.description?.trim() || "",
          albumId: input.albumId?.trim() || "",
          fileName: input.fileName,
        };

        const video: Video = {
          id: createId("v"),
          title: titleFromPayload(payload, url),
          url,
          description: payload.description,
          albumId: payload.albumId,
          createdAt: new Date().toISOString(),
        };
        draft.videos.unshift(video);
      }),
    { attempts: 5, delayMs: 250, label: "CMS write conflict" },
  );

  return data.videos;
}
