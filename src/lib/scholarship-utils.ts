import type { Scholarship, EducationLevelFilter } from "@/data/scholarships"
import { parseAwardAmount, AWARD_MIN, AWARD_MAX } from "@/data/scholarships"
import { matches, type Tag } from "@/lib/eligibility"
import { isExpired } from "@/lib/expired-status"
import { MONTHS, type Month, type MonthFilter } from "@/hooks/use-scholarship-filters"

export type { Month, MonthFilter }

/** Parse deadline string + year into a timestamp for sorting. */
export function parseDeadlineDate(deadline: string, deadlineYear: number): number {
  return new Date(`${deadline}, ${deadlineYear}`).getTime() || 0
}

/** Extract the lowercase month token from a "Month Day" deadline string. */
function getDeadlineMonth(deadline: string): string {
  return deadline.split(/\s+/)[0]?.toLowerCase() ?? ""
}

/** Count scholarships per deadline month. Drives the Month dropdown badges
 *  on both desktop and mobile filter components. */
export function computeMonthCounts(corpus: Scholarship[]): Record<Month, number> {
  const counts = MONTHS.reduce(
    (acc, m) => {
      acc[m] = 0
      return acc
    },
    {} as Record<Month, number>,
  )
  for (const s of corpus) {
    const token = getDeadlineMonth(s.deadline) as Month
    if (token in counts) counts[token] += 1
  }
  return counts
}

/**
 * Filters and sorts a scholarship list for display.
 *
 * Returns every item — items not matching `level` are included with
 * `matches: false` so they render dimmed rather than disappearing,
 * preserving pagination counts.
 *
 * Eligibility tags, award range, and `month` apply as hard filters —
 * non-matching scholarships are excluded entirely.
 *
 * After the user-selected sort runs, the result is partitioned into
 * `[active, expired]` and concatenated so expired scholarships always
 * sort last regardless of the chosen sort mode. The `matches` (filter-
 * mismatch) and `expired` dim signals compose at the card layer.
 */
export function filterAndSort(
  items: Scholarship[],
  level: EducationLevelFilter,
  searchQuery: string,
  sortBy: string,
  selectedTags: Tag[] = [],
  awardRange: [number, number] | null = null,
  month: MonthFilter = "all",
  today: Date = new Date(),
): { scholarship: Scholarship; matches: boolean }[] {
  const query = searchQuery.toLowerCase().trim()
  const isRangeActive = awardRange !== null && (awardRange[0] !== AWARD_MIN || awardRange[1] !== AWARD_MAX)

  const filtered = items.filter((s) => {
    // Text search
    if (query) {
      const haystack =
        `${s.name} ${s.eligibility} ${s.description} ${s.provider}`.toLowerCase()
      if (!haystack.includes(query)) return false
    }
    // Eligibility hard filter
    if (!matches(s, selectedTags)) return false
    // Award range hard filter
    if (isRangeActive) {
      const amount = parseAwardAmount(s.awardAmount)
      // "Varies" rows (parsed amount of 0) drop out as soon as the user narrows
      // the range — including any expired ones — since we have no way to
      // satisfy a numeric bound. Acceptable trade-off; surface in product copy
      // if users complain.
      if (amount === 0) return false
      if (amount < awardRange[0] || amount > awardRange[1]) return false
    }
    // Month hard filter — match deadline-month regardless of year
    if (month !== "all") {
      if (getDeadlineMonth(s.deadline) !== month) return false
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

  // Build level-tier rows first (matching first, non-matching dimmed last).
  const leveled: { scholarship: Scholarship; matches: boolean }[] =
    level === "All"
      ? filtered.map((s) => ({ scholarship: s, matches: true }))
      : (() => {
          const matching: { scholarship: Scholarship; matches: boolean }[] = []
          const nonMatching: { scholarship: Scholarship; matches: boolean }[] = []
          for (const s of filtered) {
            if (s.classification.includes(level as Exclude<EducationLevelFilter, "All">)) {
              matching.push({ scholarship: s, matches: true })
            } else {
              nonMatching.push({ scholarship: s, matches: false })
            }
          }
          return [...matching, ...nonMatching]
        })()

  // Expired tier always wins — partition after every other ordering rule
  // so expired scholarships sort last regardless of sort mode or level tier.
  const active: { scholarship: Scholarship; matches: boolean }[] = []
  const expired: { scholarship: Scholarship; matches: boolean }[] = []
  for (const row of leveled) {
    if (isExpired(row.scholarship, today)) {
      expired.push(row)
    } else {
      active.push(row)
    }
  }
  return [...active, ...expired]
}
