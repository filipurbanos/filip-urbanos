import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/cms/auth";
import { createId, readCms, writeCms } from "@/lib/cms/store";
import type { Photo } from "@/lib/cms/types";

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
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadDir, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(uploadDir, filename), buffer);

  const photo: Photo = {
    id: createId("p"),
    src: `/uploads/${filename}`,
    alt: alt || file.name,
    caption,
    albumId,
    createdAt: new Date().toISOString(),
  };

  const data = await readCms();
  data.photos.unshift(photo);
  await writeCms(data);
  return NextResponse.json({ photos: data.photos });
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

  const data = await readCms();
  const photo = data.photos.find((item) => item.id === id);
  data.photos = data.photos.filter((item) => item.id !== id);
  await writeCms(data);

  if (photo?.src.startsWith("/uploads/")) {
    const filePath = path.join(process.cwd(), "public", photo.src);
    await fs.unlink(filePath).catch(() => undefined);
  }

  return NextResponse.json({ photos: data.photos });
}
