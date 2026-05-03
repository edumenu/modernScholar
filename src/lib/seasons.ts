export type Season = "winter" | "spring" | "summer" | "fall";

export const SEASONS = ["winter", "spring", "summer", "fall"] as const;

const MONTH_INDEX_TO_SEASON: Readonly<Record<number, Season>> = {
  0: "winter",
  1: "winter",
  2: "spring",
  3: "spring",
  4: "spring",
  5: "summer",
  6: "summer",
  7: "summer",
  8: "fall",
  9: "fall",
  10: "fall",
  11: "winter",
};

const MONTH_NAMES: readonly string[] = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];

const MONTH_NAME_TO_INDEX: ReadonlyMap<string, number> = new Map(
  MONTH_NAMES.map((name, index) => [name, index]),
);

export function seasonForMonthIndex(monthIndex: number): Season {
  return MONTH_INDEX_TO_SEASON[monthIndex];
}

export function seasonForMonthName(name: string): Season | undefined {
  const index = MONTH_NAME_TO_INDEX.get(name.trim().toLowerCase());
  if (index === undefined) return undefined;
  return MONTH_INDEX_TO_SEASON[index];
}

export function getCurrentSeason(referenceDate: Date = new Date()): Season {
  return seasonForMonthIndex(referenceDate.getMonth());
}

export function getNextSeason(season: Season): Season {
  const currentIndex = SEASONS.indexOf(season);
  return SEASONS[(currentIndex + 1) % SEASONS.length];
}
