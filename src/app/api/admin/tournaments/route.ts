import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/cms/auth-server";
import { createId, readCms, writeCms } from "@/lib/cms/store";
import type { Match, Tournament, TournamentStatus } from "@/lib/cms/types";

function parseStatus(value: unknown): TournamentStatus {
  if (value === "live" || value === "completed" || value === "upcoming") {
    return value;
  }
  return "upcoming";
}

function parseMatches(value: unknown, fallback: Match[] = []): Match[] {
  if (!Array.isArray(value)) return fallback;
  return value.map((item) => {
    const match = item as Partial<Match>;
    return {
      id: String(match.id || createId("m")),
      round: String(match.round || "").trim(),
      opponent: String(match.opponent || "").trim(),
      score: String(match.score || "").trim(),
      result:
        match.result === "win" ||
        match.result === "loss" ||
        match.result === "retired" ||
        match.result === "walkover" ||
        match.result === "scheduled"
          ? match.result
          : "scheduled",
      date: String(match.date || "").trim(),
      notes: String(match.notes || "").trim(),
    };
  });
}

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const data = await readCms();
  return NextResponse.json({ tournaments: data.tournaments });
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as Partial<Tournament> & { id?: string };
  const data = await readCms();
  const status = parseStatus(body.status);

  if (body.id) {
    data.tournaments = data.tournaments.map((item) => {
      if (item.id !== body.id) {
        // Only one live tournament at a time
        if (status === "live" && item.status === "live") {
          return { ...item, status: "upcoming" as const };
        }
        return item;
      }
      return {
        ...item,
        date: body.date ?? item.date,
        event: body.event ?? item.event,
        place: body.place ?? item.place,
        surface: body.surface ?? item.surface,
        status,
        resultSingles: body.resultSingles ?? item.resultSingles,
        resultDoubles: body.resultDoubles ?? item.resultDoubles,
        notes: body.notes ?? item.notes,
        url: body.url ?? item.url,
        albumId:
          body.albumId !== undefined ? String(body.albumId) : item.albumId,
        matches:
          body.matches !== undefined
            ? parseMatches(body.matches, item.matches)
            : item.matches,
      };
    });
  } else {
    if (status === "live") {
      data.tournaments = data.tournaments.map((item) =>
        item.status === "live" ? { ...item, status: "upcoming" as const } : item,
      );
    }
    const tournament: Tournament = {
      id: createId("t"),
      date: body.date?.trim() || "",
      event: body.event?.trim() || "Turnaj",
      place: body.place?.trim() || "",
      surface: body.surface?.trim() || "Hard",
      status,
      resultSingles: body.resultSingles?.trim() || "",
      resultDoubles: body.resultDoubles?.trim() || "",
      notes: body.notes?.trim() || "",
      url: body.url?.trim() || "",
      albumId: String(body.albumId || "").trim(),
      matches: parseMatches(body.matches),
    };
    data.tournaments.unshift(tournament);
  }

  await writeCms(data);
  return NextResponse.json({ tournaments: data.tournaments });
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
  data.tournaments = data.tournaments.filter((item) => item.id !== id);
  await writeCms(data);
  return NextResponse.json({ tournaments: data.tournaments });
}
