import type { Ranking, RankingSystem } from "@/lib/cms/types";

export const RANKING_SYSTEMS: RankingSystem[] = [
  "ITF Junior",
  "ITF Doubles",
  "UTR",
  "UTR Doubles",
  "ATP",
  "Tennis Europe",
];

const PLACEHOLDER_VALUES = new Set([
  "live",
  "tbc",
  "cieľ",
  "ciel",
  "goal",
  "—",
  "-",
  "n/a",
  "na",
  "tba",
  "tbd",
]);

/** True when a ranking value is safe to show on the public site. */
export function isPublishedRankingValue(value: string) {
  const v = value.trim().toLowerCase();
  if (!v) return false;
  return !PLACEHOLDER_VALUES.has(v);
}

export function filterPublishedRankings(items: Ranking[]) {
  return items.filter((item) => isPublishedRankingValue(item.value));
}

export function emptyRankingsTemplate(): Ranking[] {
  return RANKING_SYSTEMS.map((system) => ({
    system,
    value: "",
    note: "",
  }));
}
