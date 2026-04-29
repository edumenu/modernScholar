import type { Scholarship, EducationLevelFilter } from "@/data/scholarships"
import { parseAwardAmount } from "@/data/scholarships"

/** Parse deadline string + year into a timestamp for sorting. */
export function parseDeadlineDate(deadline: string, deadlineYear: number): number {
  return new Date(`${deadline}, ${deadlineYear}`).getTime() || 0
}

/**
 * Filters and sorts a scholarship list for display.
 *
 * Returns every item — items not matching `level` are included at the end
 * with `matches: false` so they render dimmed rather than disappearing,
 * preserving pagination counts.
 */
export function filterAndSort(
  items: Scholarship[],
  level: EducationLevelFilter,
  searchQuery: string,
  sortBy: string,
): { scholarship: Scholarship; matches: boolean }[] {
  const query = searchQuery.toLowerCase().trim()

  const filtered = items.filter((s) => {
    if (query) {
      const haystack =
        `${s.name} ${s.eligibility} ${s.description} ${s.provider}`.toLowerCase()
      if (!haystack.includes(query)) return false
    }
    return true
  })

  if (sortBy === "amount") {
    filtered.sort((a, b) => parseAwardAmount(b.awardAmount) - parseAwardAmount(a.awardAmount))
  } else {
    filtered.sort(
      (a, b) =>
        parseDeadlineDate(a.deadline, a.deadlineYear) -
        parseDeadlineDate(b.deadline, b.deadlineYear),
    )
  }

  if (level === "All") {
    return filtered.map((s) => ({ scholarship: s, matches: true }))
  }

  const matching = filtered.filter((s) => s.classification.includes(level as Exclude<EducationLevelFilter, "All">))
  const nonMatching = filtered.filter((s) => !s.classification.includes(level as Exclude<EducationLevelFilter, "All">))
  return [
    ...matching.map((s) => ({ scholarship: s, matches: true })),
    ...nonMatching.map((s) => ({ scholarship: s, matches: false })),
  ]
}
