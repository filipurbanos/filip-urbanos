import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/cms/auth-server";
import { createId, mutateCms, readCms } from "@/lib/cms/store";
import { deleteUpload, saveUpload } from "@/lib/cms/storage";
import type { Video } from "@/lib/cms/types";
import { handleCmsWriteError, cmsWriteErrorResponse } from "@/lib/cms/write-helpers";

const VIDEO_TYPES = new Set([
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "video/x-m4v",
  "application/octet-stream",
]);

const MAX_BYTES = 150 * 1024 * 1024; // 150 MB

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function extFromName(name: string, contentType: string) {
  const fromName = name.split(".").pop()?.toLowerCase();
  if (fromName && /^(mp4|webm|mov|m4v)$/.test(fromName)) {
    return fromName === "qt" ? "mov" : fromName;
  }
  if (contentType.includes("webm")) return "webm";
  if (contentType.includes("quicktime")) return "mov";
  return "mp4";
}

async function readBodyWithLimit(
  body: ReadableStream<Uint8Array>,
  maxBytes: number,
): Promise<Buffer> {
  const reader = body.getReader();
  const chunks: Uint8Array[] = [];
  let written = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (!value) continue;
    written += value.byteLength;
    if (written > maxBytes) {
      reader.cancel().catch(() => undefined);
      throw new Error("TOO_LARGE");
    }
    chunks.push(value);
  }

  return Buffer.concat(chunks.map((c) => Buffer.from(c)));
}

async function appendVideo(video: Video) {
  return mutateCms((data) => {
    data.videos.unshift(video);
  });
}

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const data = await readCms();
  return NextResponse.json({ videos: data.videos });
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const contentType = request.headers.get("content-type") || "";

  const fileNameHeader = request.headers.get("x-file-name");
  const isRawUpload =
    Boolean(fileNameHeader) ||
    contentType.startsWith("video/") ||
    contentType === "application/octet-stream";

  if (isRawUpload && !contentType.includes("multipart/form-data")) {
    const { searchParams } = new URL(request.url);
    const title = (searchParams.get("title") || "").trim();
    const description = (searchParams.get("description") || "").trim();
    const albumId = searchParams.get("albumId") || "";
    const originalName = fileNameHeader
      ? decodeURIComponent(fileNameHeader)
      : "video.mp4";

    const declared = Number(request.headers.get("content-length") || 0);
    if (declared > MAX_BYTES) {
      return NextResponse.json(
        { error: "Video je príliš veľké (max 150 MB)" },
        { status: 400 },
      );
    }

    if (
      !VIDEO_TYPES.has(contentType.split(";")[0].trim()) &&
      !/\.(mp4|webm|mov|m4v)$/i.test(originalName)
    ) {
      return NextResponse.json(
        { error: "Povolené formáty: MP4, WebM, MOV" },
        { status: 400 },
      );
    }

    if (!request.body) {
      return NextResponse.json({ error: "Chýba súbor" }, { status: 400 });
    }

    const ext = extFromName(originalName, contentType);
    const filename = `${createId("vid")}.${ext}`;

    try {
      const buffer = await readBodyWithLimit(request.body, MAX_BYTES);
      if (buffer.length === 0) {
        return NextResponse.json({ error: "Prázdny súbor" }, { status: 400 });
      }
      const url = await saveUpload({
        filename,
        body: buffer,
        contentType: contentType.split(";")[0].trim() || "video/mp4",
      });

      const video: Video = {
        id: createId("v"),
        title: title || originalName.replace(/\.[^.]+$/, "") || "Video",
        url,
        description,
        albumId,
        createdAt: new Date().toISOString(),
      };
      const data = await appendVideo(video);
      return NextResponse.json({ videos: data.videos });
    } catch (err) {
      const conflict = cmsWriteErrorResponse(err);
      if (conflict) return conflict;

      const message = err instanceof Error ? err.message : "";
      if (message === "TOO_LARGE") {
        return NextResponse.json(
          { error: "Video je príliš veľké (max 150 MB)" },
          { status: 400 },
        );
      }
      console.error("Video upload failed:", err);
      return NextResponse.json(
        { error: "Nahrávanie súboru zlyhalo. Skús znova." },
        { status: 500 },
      );
    }
  }

  if (contentType.includes("multipart/form-data")) {
    let form: FormData;
    try {
      form = await request.formData();
    } catch {
      return NextResponse.json(
        {
          error:
            "Súbor sa nepodarilo načítať. Obnov stránku a skús znova (upload ide priamo ako stream).",
        },
        { status: 413 },
      );
    }
    const file = form.get("file");
    const title = String(form.get("title") || "").trim();
    const description = String(form.get("description") || "").trim();
    const albumId = String(form.get("albumId") || "");
    const urlField = String(form.get("url") || "").trim();

    if (file instanceof File && file.size > 0) {
      if (file.size > MAX_BYTES) {
        return NextResponse.json(
          { error: "Video je príliš veľké (max 150 MB)" },
          { status: 400 },
        );
      }
      if (
        !VIDEO_TYPES.has(file.type) &&
        !/\.(mp4|webm|mov|m4v)$/i.test(file.name)
      ) {
        return NextResponse.json(
          { error: "Povolené formáty: MP4, WebM, MOV" },
          { status: 400 },
        );
      }

      const ext = extFromName(file.name, file.type);
      const filename = `${createId("vid")}.${ext}`;
      const url = await saveUpload({
        filename,
        body: Buffer.from(await file.arrayBuffer()),
        contentType: file.type || "video/mp4",
      });

      const video: Video = {
        id: createId("v"),
        title: title || file.name.replace(/\.[^.]+$/, "") || "Video",
        url,
        description,
        albumId,
        createdAt: new Date().toISOString(),
      };
      try {
        const data = await appendVideo(video);
        return NextResponse.json({ videos: data.videos });
      } catch (error) {
        return handleCmsWriteError(error);
      }
    }

    if (!urlField) {
      return NextResponse.json(
        { error: "Nahraj súbor alebo vyplň URL" },
        { status: 400 },
      );
    }

    const video: Video = {
      id: createId("v"),
      title: title || "Video",
      url: urlField,
      description,
      albumId,
      createdAt: new Date().toISOString(),
    };
    try {
      const data = await appendVideo(video);
      return NextResponse.json({ videos: data.videos });
    } catch (error) {
      return handleCmsWriteError(error);
    }
  }

  const body = (await request.json()) as Partial<Video> & { id?: string };

  try {
    if (body.id) {
      const data = await mutateCms((data) => {
        data.videos = data.videos.map((item) =>
          item.id === body.id
            ? {
                ...item,
                title: body.title?.trim() || item.title,
                url: body.url?.trim() || item.url,
                description: body.description?.trim() ?? item.description,
                albumId:
                  body.albumId !== undefined
                    ? String(body.albumId)
                    : item.albumId,
              }
            : item,
        );
      });
      return NextResponse.json({ videos: data.videos });
    }

    if (!body.url?.trim()) {
      return NextResponse.json({ error: "Chýba URL" }, { status: 400 });
    }
    const video: Video = {
      id: createId("v"),
      title: body.title?.trim() || "Video",
      url: body.url.trim(),
      description: body.description?.trim() || "",
      albumId: String(body.albumId || ""),
      createdAt: new Date().toISOString(),
    };
    const data = await appendVideo(video);
    return NextResponse.json({ videos: data.videos });
  } catch (error) {
    return handleCmsWriteError(error);
  }
}

export async function DELETE(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  try {
    let removedUrl = "";
    const data = await mutateCms((data) => {
      const video = data.videos.find((item) => item.id === id);
      removedUrl = video?.url || "";
      data.videos = data.videos.filter((item) => item.id !== id);
    });
    if (removedUrl) {
      await deleteUpload(removedUrl);
    }
    return NextResponse.json({ videos: data.videos });
  } catch (error) {
    return handleCmsWriteError(error);
  }
}
