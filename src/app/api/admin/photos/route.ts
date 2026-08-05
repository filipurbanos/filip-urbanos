import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/cms/auth-server";
import { createId, mutateCms, readCms } from "@/lib/cms/store";
import { deleteUpload, saveUpload } from "@/lib/cms/storage";
import type { Photo } from "@/lib/cms/types";
import { handleCmsWriteError } from "@/lib/cms/write-helpers";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const data = await readCms();
  return NextResponse.json({ photos: data.photos });
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await request.formData();
  const file = form.get("file");
  const alt = String(form.get("alt") || "");
  const caption = String(form.get("caption") || "");
  const albumId = String(form.get("albumId") || "");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Chýba súbor" }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Len obrázky" }, { status: 400 });
  }

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const filename = `${createId("img")}.${ext}`;
  const src = await saveUpload({
    filename,
    body: Buffer.from(await file.arrayBuffer()),
    contentType: file.type || "image/jpeg",
  });

  const photo: Photo = {
    id: createId("p"),
    src,
    alt: alt || file.name,
    caption,
    albumId,
    createdAt: new Date().toISOString(),
  };

  try {
    const data = await mutateCms((data) => {
      data.photos.unshift(photo);
    });
    return NextResponse.json({ photos: data.photos });
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
    let removedSrc = "";
    const data = await mutateCms((data) => {
      const photo = data.photos.find((item) => item.id === id);
      removedSrc = photo?.src || "";
      data.photos = data.photos.filter((item) => item.id !== id);
    });
    if (removedSrc) {
      await deleteUpload(removedSrc);
    }
    return NextResponse.json({ photos: data.photos });
  } catch (error) {
    return handleCmsWriteError(error);
  }
}
