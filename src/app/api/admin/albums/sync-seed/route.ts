import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/cms/auth-server";
import { CmsConflictError } from "@/lib/cms/store";
import { syncSeedAlbums } from "@/lib/cms/sync-seed-albums";
import { cmsConflictResponse } from "@/lib/cms/write-helpers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await syncSeedAlbums();
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof CmsConflictError) {
      return cmsConflictResponse();
    }
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Sync zo seedu zlyhal",
      },
      { status: 500 },
    );
  }
}
