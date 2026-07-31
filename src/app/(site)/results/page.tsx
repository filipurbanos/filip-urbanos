import type { Metadata } from "next";
import { ResultsView } from "@/components/page-views/ResultsView";
import { sortByDateAsc, sortByDateDesc } from "@/lib/cms/dates";
import { readCms } from "@/lib/cms/store";

export const metadata: Metadata = {
  title: "Výsledky",
  description:
    "Aktuálny turnaj, kalendár a výsledky Filipa Urbánoša — ITF, UTR, ATP.",
};

export const dynamic = "force-dynamic";

export default async function ResultsPage() {
  const data = await readCms();
  const live =
    data.tournaments.find((tournament) => tournament.status === "live") || null;
  const completed = sortByDateDesc(
    data.tournaments.filter((tournament) => tournament.status === "completed"),
  ).map((tournament) => ({
    date: tournament.date,
    event: tournament.event,
    place: tournament.place,
    surface: tournament.surface,
    resultSingles: tournament.resultSingles || "—",
    resultDoubles: tournament.resultDoubles || "—",
  }));
  const upcoming = sortByDateAsc(
    data.tournaments.filter((tournament) => tournament.status === "upcoming"),
  ).map((tournament) => ({
    date: tournament.date,
    event: tournament.event,
    place: tournament.place,
    surface: tournament.surface,
    url: tournament.url || undefined,
  }));

  return (
    <div className="page">
      <ResultsView
        live={live}
        completed={completed.length ? completed : undefined}
        upcoming={upcoming.length ? upcoming : undefined}
      />
    </div>
  );
}
