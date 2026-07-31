"use client";

import {
  Calendar,
  LiveTournament,
  Rankings,
  Results,
} from "@/components/AthleteSections";
import { PageBanner } from "@/components/PageBanner";
import type { Tournament } from "@/lib/cms/types";
import { useLocale } from "@/lib/locale";

export function ResultsView({
  live,
  completed,
  upcoming,
}: {
  live?: Tournament | null;
  completed?: {
    date: string;
    event: string;
    place: string;
    surface: string;
    resultSingles: string;
    resultDoubles: string;
  }[];
  upcoming?: {
    date: string;
    event: string;
    place: string;
    surface: string;
    url?: string;
  }[];
}) {
  const { t } = useLocale();

  return (
    <>
      <PageBanner
        eyebrow={t.results.eyebrow}
        title={t.results.title}
        lead={t.results.lead}
      />
      <LiveTournament
        tournament={
          live
            ? {
                date: live.date,
                event: live.event,
                place: live.place,
                surface: live.surface,
                notes: live.notes,
                url: live.url,
                matches: live.matches,
              }
            : null
        }
      />
      <Calendar items={upcoming} />
      <Results items={completed} />
      <Rankings />
    </>
  );
}
