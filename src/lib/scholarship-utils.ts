import type { Scholarship, EducationLevelFilter } from "@/data/scholarships"
import { parseAwardAmount, getEligibilityCategory, AWARD_MIN, AWARD_MAX } from "@/data/scholarships"

/** Parse deadline string + year into a timestamp for sorting. */
export function parseDeadlineDate(deadline: string, deadlineYear: number): number {
  return new Date(`${deadline}, ${deadlineYear}`).getTime() || 0
}

/**
 * Check if a scholarship matches the selected eligibility tags.
 * - Within a category: OR (match any selected sub-option)
 * - Across categories/flat tags: AND (must match all)
 */
export function matchesEligibilityTags(
  scholarship: Scholarship,
  selectedTags: string[],
): boolean {
  if (selectedTags.length === 0) return true

  const tags = scholarship.eligibilityTags ?? []

  // Group selected tags by category (null = flat tag)
  const groups = new Map<string | null, string[]>()
  for (const tag of selectedTags) {
    const category = getEligibilityCategory(tag)
    const key = category ?? tag // flat tags are their own group key
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key)!.push(tag)
  }

  // AND across groups: every group must have at least one match
  for (const [, groupTags] of groups) {
    const hasMatch = groupTags.some((t) => tags.includes(t))
    if (!hasMatch) return false
  }

  return true
}

/**
 * Filters and sorts a scholarship list for display.
 *
 * Returns every item — items not matching `level` are included at the end
 * with `matches: false` so they render dimmed rather than disappearing,
 * preserving pagination counts.
 *
 * Eligibility tags apply as a hard filter — non-matching scholarships
 * are excluded entirely.
 */
export function filterAndSort(
  items: Scholarship[],
  level: EducationLevelFilter,
  searchQuery: string,
  sortBy: string,
  eligibilityTags: string[] = [],
  awardRange: [number, number] | null = null,
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
    if (!matchesEligibilityTags(s, eligibilityTags)) return false
    // Award range hard filter
    if (isRangeActive) {
      const amount = parseAwardAmount(s.awardAmount)
      // "Varies" (amount=0) excluded when range is narrowed
      if (amount === 0) return false
      if (amount < awardRange[0] || amount > awardRange[1]) return false
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
}
