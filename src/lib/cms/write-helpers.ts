import { NextResponse } from "next/server";
import { CmsConflictError } from "@/lib/cms/store";

export function cmsConflictResponse() {
  return NextResponse.json(
    { error: "Konflikt zápisu — obnov stránku a skús znova." },
    { status: 409 },
  );
}

/** Returns a 409 response for conflicts, otherwise `null`. */
export function cmsWriteErrorResponse(error: unknown): NextResponse | null {
  if (error instanceof CmsConflictError) {
    return cmsConflictResponse();
  }
  return null;
}

export function handleCmsWriteError(error: unknown): NextResponse {
  const response = cmsWriteErrorResponse(error);
  if (response) return response;
  throw error;
}
