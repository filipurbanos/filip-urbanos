import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/cms/auth-server";
import { mutateCms, readCms } from "@/lib/cms/store";
import type { Ranking } from "@/lib/cms/types";
import { handleCmsWriteError } from "@/lib/cms/write-helpers";

const allowedSystems: Ranking["system"][] = [
  "ITF Junior",
  "ITF Doubles",
  "UTR",
  "UTR Doubles",
  "ATP",
  "Tennis Europe",
];

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const data = await readCms();
  return NextResponse.json({ rankings: data.rankings });
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as { rankings?: Partial<Ranking>[] };
  const input = Array.isArray(body.rankings) ? body.rankings : [];
  const map = new Map<string, Ranking>();

  for (const item of input) {
    const system = String(item.system || "") as Ranking["system"];
    if (!allowedSystems.includes(system)) continue;
    map.set(system, {
      system,
      value: String(item.value || "").trim(),
      note: String(item.note || "").trim(),
    });
  }

  const next = allowedSystems.map((system) => {
    const fromBody = map.get(system);
    return (
      fromBody || {
        system,
        value: "",
        note: "",
      }
    );
  });

  try {
    const data = await mutateCms((data) => {
      data.rankings = next;
    });
    return NextResponse.json({ rankings: data.rankings });
  } catch (error) {
    return handleCmsWriteError(error);
  }
}
