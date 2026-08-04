import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/cms/auth";

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
 * Only issues tokens to authenticated admins.
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
      onBeforeGenerateToken: async (pathname) => {
        if (!pathname.startsWith("uploads/")) {
          throw new Error("Neplatná cesta uploadu");
        }
        return {
          allowedContentTypes: ALLOWED,
          maximumSizeInBytes: 150 * 1024 * 1024,
          addRandomSuffix: false,
          allowOverwrite: true,
        };
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload zlyhal";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
