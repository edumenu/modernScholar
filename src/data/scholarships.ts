import enrichedData from "./scholarships-enriched.json"
import type { Tag } from "@/lib/eligibility"
import type { Season } from "@/lib/seasons"

export type { Season } from "@/lib/seasons"
export { SEASONS, getCurrentSeason, getNextSeason } from "@/lib/seasons"

// --- Active types ---

export type EducationLevel =
  | "High School"
  | "Undergraduate"
  | "Graduate"
  | "K-8"
  | "K-12"

export const EDUCATION_LEVELS = [
  "All",
  "High School",
  "Undergraduate",
  "Graduate",
  "K-8",
  "K-12",
] as const

export type EducationLevelFilter = (typeof EDUCATION_LEVELS)[number]

/** Category-specific pill color classes (bg + text) using design-system shades */
export const CLASSIFICATION_COLORS: Record<EducationLevel, { bg: string; text: string }> = {
  "High School": { bg: "bg-primary-200", text: "text-primary-700" },
  Undergraduate: { bg: "bg-secondary-200", text: "text-secondary-700" },
  Graduate: { bg: "bg-tertiary-200", text: "text-tertiary-700" },
  "K-8": { bg: "bg-primary-100", text: "text-primary-950" },
  "K-12": { bg: "bg-secondary-300", text: "text-secondary-950" },
}

export interface Scholarship {
  id: string
  name: string
  deadline: string
  deadlineYear: number
  awardAmount: string
  classification: EducationLevel[]
  link: string
  openDate: string | null
  eligibility: string
  eligibilityTags: Tag[]
  season: Season
  description: string
  provider: string
}

// --- Eligibility tag constants ---

export const AWARD_MIN = 0
export const AWARD_MAX = 100_000

/** All enriched scholarships from the scraping pipeline */
// JSON literal can't satisfy Tag union without runtime narrowing; cast at the boundary, validation happens in the tagger.
export const scholarships: Scholarship[] = enrichedData as unknown as Scholarship[]

/** Check if a scholarship is active: deadline has not yet passed (no season check). */
export function isScholarshipActive(
  scholarship: Scholarship,
  today: Date = new Date(),
): boolean {
  const deadlineMs =
    new Date(`${scholarship.deadline}, ${scholarship.deadlineYear}`).getTime() || 0
  return deadlineMs >= today.getTime()
}

/** Parse the largest dollar amount from a free-text award string.
 *  "$5,000 per year (Total: $20,000)" → 20000, "$2,000 to $7,500" → 7500.
 *  Returns 0 when no `$N` token is present (e.g. "Varies"). */
export function parseAwardAmount(awardAmount: string): number {
  const matches = awardAmount.match(/\$[\d,]+/g)
  if (!matches) return 0
  let max = 0
  for (const m of matches) {
    const n = Number(m.replace(/[$,]/g, "")) || 0
    if (n > max) max = n
  }
  return max
}

/** Classification-driven accent stripe + neutral card surface for WCAG-AA contrast */
export const CLASSIFICATION_TINTS: Record<EducationLevel, { bg: string; border: string; accent: string; text: string; muted: string }> = {
  "High School": {
    bg: "bg-white dark:bg-surface-container-low",
    border: "border-t-4 border-primary-400",
    accent: "from-primary/40",
    text: "text-on-surface",
    muted: "text-on-surface-variant",
  },
  Undergraduate: {
    bg: "bg-white dark:bg-surface-container-low",
    border: "border-t-4 border-secondary-600",
    accent: "from-secondary/40",
    text: "text-on-surface",
    muted: "text-on-surface-variant",
  },
  Graduate: {
    bg: "bg-white dark:bg-surface-container-low",
    border: "border-t-4 border-tertiary-600",
    accent: "from-tertiary/40",
    text: "text-on-surface",
    muted: "text-on-surface-variant",
  },
  "K-8": {
    bg: "bg-white dark:bg-surface-container-low",
    border: "border-t-4 border-primary-300",
    accent: "from-primary/30",
    text: "text-on-surface",
    muted: "text-on-surface-variant",
  },
  "K-12": {
    bg: "bg-white dark:bg-surface-container-low",
    border: "border-t-4 border-secondary-400",
    accent: "from-secondary/30",
    text: "text-on-surface",
    muted: "text-on-surface-variant",
  },
}

/** Get the tint config for a scholarship based on its primary classification */
export function getClassificationTint(classification: EducationLevel[]) {
  const primary = classification[0]
  return CLASSIFICATION_TINTS[primary] ?? {
    bg: "bg-surface-container",
    border: "border-t-4 border-outline-variant",
    accent: "from-on-surface/20",
    text: "text-on-surface",
    muted: "text-on-surface-variant",
  }
}
