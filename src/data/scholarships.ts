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
  season: Season
  image: string
  description: string
  provider: string
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

/** Warm cream palette for card gradients */
const GRADIENT_PALETTE = [
  "#f4e8e5", "#f5eae7", "#f6ecea", "#f7eeec", "#f8f1ef",
  "#f9f3f2", "#faf5f4", "#fbf8f7", "#fcfaf9", "#fdfcfc", "#ffffff",
] as const

/** Generate a deterministic gradient from a scholarship ID */
export function generateGradient(id: string): string {
  let hash = 0
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash)
  }
  const abs = Math.abs(hash)
  const idx1 = abs % GRADIENT_PALETTE.length
  let idx2 = (abs >>> 8) % GRADIENT_PALETTE.length
  if (idx2 === idx1) idx2 = (idx2 + 1) % GRADIENT_PALETTE.length
  const angle = 120 + (abs % 80) // 120–199deg
  return `linear-gradient(${angle}deg, ${GRADIENT_PALETTE[idx1]}, ${GRADIENT_PALETTE[idx2]})`
}

// --- Commented-out legacy types (preserved for reference) ---

// export const SCHOLARSHIP_CATEGORIES = [
//   "All", "Technology", "STEM", "General", "Arts", "Business", "Science", "Medical",
// ] as const
// export type ScholarshipCategory = (typeof SCHOLARSHIP_CATEGORIES)[number]
// export type ScholarshipTag = "Featured" | "Popular" | "New" | "Top Pick"
