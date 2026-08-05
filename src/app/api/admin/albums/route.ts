import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/cms/auth-server";
import { createId, mutateCms, readCms } from "@/lib/cms/store";
import type { Album } from "@/lib/cms/types";
import { handleCmsWriteError } from "@/lib/cms/write-helpers";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const data = await readCms();
  return NextResponse.json({ albums: data.albums });
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as Partial<Album> & { id?: string };

  if (!body.id && !body.title?.trim()) {
    return NextResponse.json({ error: "Chýba názov" }, { status: 400 });
  }

  try {
    const data = await mutateCms((data) => {
      if (body.id) {
        data.albums = data.albums.map((item) =>
          item.id === body.id
            ? {
                ...item,
                title: body.title?.trim() || item.title,
                date: body.date?.trim() ?? item.date,
                description: body.description?.trim() ?? item.description,
              }
            : item,
        );
      } else {
        const album: Album = {
          id: createId("a"),
          title: body.title!.trim(),
          date: body.date?.trim() || "",
          description: body.description?.trim() || "",
          createdAt: new Date().toISOString(),
        };
        data.albums.unshift(album);
      }
    });
    return NextResponse.json({ albums: data.albums });
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
    const data = await mutateCms((data) => {
      data.albums = data.albums.filter((item) => item.id !== id);
      data.photos = data.photos.map((photo) =>
        photo.albumId === id ? { ...photo, albumId: "" } : photo,
      );
      data.videos = data.videos.map((video) =>
        video.albumId === id ? { ...video, albumId: "" } : video,
      );
      data.tournaments = data.tournaments.map((tournament) =>
        tournament.albumId === id ? { ...tournament, albumId: "" } : tournament,
      );
    });
    return NextResponse.json({ albums: data.albums });
  } catch (error) {
    return handleCmsWriteError(error);
  }
}
