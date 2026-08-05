import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/cms/auth-server";
import {
  parseVideoUploadPayload,
  upsertVideoRecord,
} from "@/lib/cms/videos";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED = [
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "video/x-m4v",
  "application/octet-stream",
];

/**
 * Client uploads go browser → Vercel Blob (bypasses the ~4.5MB serverless body limit).
 * onUploadCompleted writes the gallery record when the blob lands.
 */
export async function POST(request: Request): Promise<NextResponse> {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        if (!pathname.startsWith("uploads/")) {
          throw new Error("Neplatná cesta uploadu");
        }
        return {
          allowedContentTypes: ALLOWED,
          maximumSizeInBytes: 150 * 1024 * 1024,
          addRandomSuffix: false,
          allowOverwrite: true,
          tokenPayload: clientPayload,
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        const payload = parseVideoUploadPayload(tokenPayload);
        if (!payload) return;

        await upsertVideoRecord({
          url: blob.url,
          title: payload.title,
          description: payload.description,
          albumId: payload.albumId,
          fileName: payload.fileName,
        });
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload zlyhal";
    console.error("Blob upload handler failed:", error);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
