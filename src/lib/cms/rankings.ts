import type { Ranking, RankingSystem } from "@/lib/cms/types";

export const RANKING_SYSTEMS: RankingSystem[] = [
  "ITF Junior",
  "ITF Doubles",
  "UTR",
  "UTR Doubles",
  "WTN",
  "WTN Doubles",
  "ATP",
  "Tennis Europe",
];

export type RankingGroupId =
  | "ITF"
  | "UTR"
  | "WTN"
  | "ATP"
  | "Tennis Europe";

export type RankingDiscipline = "singles" | "doubles" | "solo";

export const RANKING_GROUPS: {
  id: RankingGroupId;
  systems: RankingSystem[];
}[] = [
  { id: "ITF", systems: ["ITF Junior", "ITF Doubles"] },
  { id: "UTR", systems: ["UTR", "UTR Doubles"] },
  { id: "WTN", systems: ["WTN", "WTN Doubles"] },
  { id: "ATP", systems: ["ATP"] },
  { id: "Tennis Europe", systems: ["Tennis Europe"] },
];

const DISCIPLINE_BY_SYSTEM: Record<RankingSystem, RankingDiscipline> = {
  "ITF Junior": "singles",
  "ITF Doubles": "doubles",
  UTR: "singles",
  "UTR Doubles": "doubles",
  WTN: "singles",
  "WTN Doubles": "doubles",
  ATP: "solo",
  "Tennis Europe": "solo",
};

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

export function rankingDiscipline(system: RankingSystem): RankingDiscipline {
  return DISCIPLINE_BY_SYSTEM[system];
}

export function groupPublishedRankings(items: Ranking[]) {
  const published = filterPublishedRankings(items);
  const bySystem = new Map(published.map((item) => [item.system, item]));

  return RANKING_GROUPS.map((group) => ({
    id: group.id,
    items: group.systems
      .map((system) => bySystem.get(system))
      .filter((item): item is Ranking => Boolean(item)),
  })).filter((group) => group.items.length > 0);
}

export function emptyRankingsTemplate(): Ranking[] {
  return RANKING_SYSTEMS.map((system) => ({
    system,
    value: "",
    note: "",
  }));
}
