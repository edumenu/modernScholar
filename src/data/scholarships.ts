import enrichedData from "./scholarships-enriched.json"

// --- Active types ---

export type EducationLevel =
  | "High School"
  | "Undergraduate"
  | "Graduate"
  | "K-8"
  | "K-12"

export type Season = "winter" | "spring" | "summer" | "fall"

export const EDUCATION_LEVELS = [
  "All",
  "High School",
  "Undergraduate",
  "Graduate",
  "K-8",
  "K-12",
] as const

export type EducationLevelFilter = (typeof EDUCATION_LEVELS)[number]

export const SEASONS = ["winter", "spring", "summer", "fall"] as const

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
  eligibilityTags?: string[]
  season: Season
  description: string
  provider: string
}

// --- Eligibility tag constants ---

export const AWARD_MIN = 0
export const AWARD_MAX = 100_000

export const ELIGIBILITY_FLAT_TAGS = [
  "Need-Based", "Merit-Based", "First-Generation",
  "State-Specific", "Athletic", "Creative/Arts",
] as const

export type EligibilityFlatTag = (typeof ELIGIBILITY_FLAT_TAGS)[number]

export const ELIGIBILITY_CATEGORIES = {
  "Gender-Specific": ["Women", "Men"],
  "Race/Ethnicity": ["African American/Black", "Hispanic/Latino", "Jewish"],
  "Disability/Health": ["Vision", "Hearing", "Learning Disability", "Cancer/Chronic Illness", "Mental Health"],
  "Major-Specific": ["STEM/Engineering", "Business/Accounting", "Healthcare/Nursing", "Arts/Theater", "Agriculture", "Law", "Architecture"],
  "Military/Veterans": ["Active Duty", "Veteran", "Military Dependent"],
} as const

export type EligibilityCategory = keyof typeof ELIGIBILITY_CATEGORIES

/** Check if a tag string is a flat (non-category) eligibility tag */
export function isEligibilityFlatTag(tag: string): boolean {
  return (ELIGIBILITY_FLAT_TAGS as readonly string[]).includes(tag)
}

/** Extract the category name from a colon-delimited tag, or null for flat tags */
export function getEligibilityCategory(tag: string): string | null {
  const idx = tag.indexOf(":")
  return idx === -1 ? null : tag.slice(0, idx)
}

/** Extract the sub-option from a colon-delimited tag, or null for flat tags */
export function getEligibilitySubOption(tag: string): string | null {
  const idx = tag.indexOf(":")
  return idx === -1 ? null : tag.slice(idx + 1)
}

/** Get a display-friendly label for a tag (sub-option if category, or the tag itself) */
export function getEligibilityTagLabel(tag: string): string {
  return getEligibilitySubOption(tag) ?? tag
}

/** All enriched scholarships from the scraping pipeline */
export const scholarships: Scholarship[] = enrichedData as Scholarship[]

// --- Season utilities ---

const MONTH_TO_SEASON: Record<number, Season> = {
  0: "winter",   // January
  1: "winter",   // February
  2: "spring",   // March
  3: "spring",   // April
  4: "spring",   // May
  5: "summer",   // June
  6: "summer",   // July
  7: "summer",   // August
  8: "fall",     // September
  9: "fall",     // October
  10: "fall",    // November
  11: "winter",  // December
}

export function getCurrentSeason(referenceDate: Date = new Date()): Season {
  return MONTH_TO_SEASON[referenceDate.getMonth()]
}

export function getNextSeason(season: Season): Season {
  const order: Season[] = ["winter", "spring", "summer", "fall"]
  const idx = order.indexOf(season)
  return order[(idx + 1) % order.length]
}

/** Check if a scholarship is visible: in the given season and deadline not yet passed */
export function isScholarshipVisible(
  scholarship: Scholarship,
  season: Season,
  today: Date = new Date(),
): boolean {
  if (scholarship.season !== season) return false

  const deadlineDate = new Date(
    `${scholarship.deadline}, ${scholarship.deadlineYear}`,
  )
  return deadlineDate.getTime() >= today.getTime()
}

/** Get all visible scholarships for the current season */
export function getSeasonalScholarships(
  allScholarships: Scholarship[] = scholarships,
  referenceDate: Date = new Date(),
): Scholarship[] {
  const season = getCurrentSeason(referenceDate)
  return allScholarships.filter((s) => isScholarshipVisible(s, season, referenceDate))
}

/** Parse first dollar amount from a free-text award string: "$10,000" → 10000 */
export function parseAwardAmount(awardAmount: string): number {
  const match = awardAmount.match(/\$[\d,]+/)
  if (!match) return 0
  return Number(match[0].replace(/[$,]/g, "")) || 0
}

/** Classification-driven accent stripe + neutral card surface for WCAG-AA contrast */
export const CLASSIFICATION_TINTS: Record<EducationLevel, { bg: string; border: string; accent: string; text: string; muted: string }> = {
  "High School": {
    // bg: "bg-surface-container-highest",
    bg: "bg-white dark:bg-surface-container-low",
    border: "border-t-4 border-primary-400",
    accent: "from-primary/40",
    text: "text-on-surface",
    muted: "text-on-surface-variant",
  },
  Undergraduate: {
    // bg: "bg-surface-container-highest",
    bg: "bg-white dark:bg-surface-container-low",
    border: "border-t-4 border-secondary-600",
    accent: "from-secondary/40",
    text: "text-on-surface",
    muted: "text-on-surface-variant",
  },
  Graduate: {
    // bg: "bg-surface-container-highest",
    bg: "bg-white dark:bg-surface-container-low",
    border: "border-t-4 border-tertiary-600",
    accent: "from-tertiary/40",
    text: "text-on-surface",
    muted: "text-on-surface-variant",
  },
  "K-8": {
    // bg: "bg-surface-container-highest",
    bg: "bg-white dark:bg-surface-container-low",
    border: "border-t-4 border-primary-300",
    accent: "from-primary/30",
    text: "text-on-surface",
    muted: "text-on-surface-variant",
  },
  "K-12": {
    // bg: "bg-surface-container-highest",
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
