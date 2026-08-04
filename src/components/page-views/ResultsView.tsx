"use client";

import {
  Calendar,
  LiveTournament,
  Rankings,
  Results,
} from "@/components/AthleteSections";
import { PageBanner } from "@/components/PageBanner";
import type { Match, Photo, Ranking, Tournament, Video } from "@/lib/cms/types";
import { useLocale } from "@/lib/locale";

export type CompletedResult = {
  id: string;
  date: string;
  event: string;
  place: string;
  surface: string;
  resultSingles: string;
  resultDoubles: string;
  notes?: string;
  url?: string;
  matches?: Match[];
  photos?: Pick<Photo, "id" | "src" | "alt" | "caption">[];
  videos?: Pick<Video, "id" | "title" | "url">[];
};

export function ResultsView({
  live,
  completed,
  upcoming,
  rankings,
}: {
  live?: Tournament | null;
  completed?: CompletedResult[];
  upcoming?: {
    date: string;
    event: string;
    place: string;
    surface: string;
    url?: string;
  }[];
  rankings?: Ranking[];
}) {
  const { t } = useLocale();

  return (
    <>
      <PageBanner
        eyebrow={t.results.eyebrow}
        title={t.results.title}
        lead={t.results.lead}
      />
      {live ? (
        <LiveTournament
          tournament={{
            date: live.date,
            event: live.event,
            place: live.place,
            surface: live.surface,
            notes: live.notes,
            url: live.url,
            matches: live.matches,
          }}
        />
      ) : null}
      <Calendar items={upcoming} />
      <Results items={completed} />
      <Rankings items={rankings} />
    </>
  );
}
