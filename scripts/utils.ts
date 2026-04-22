import Papa from "papaparse"
import slugify from "slugify"
import fs from "fs"

// --- Types ---

export type EducationLevel =
  | "High School"
  | "Undergraduate"
  | "Graduate"
  | "K-8"
  | "K-12"

export type Season = "winter" | "spring" | "summer" | "fall"

export interface CsvRow {
  Deadline: string
  "Scholarship Name": string
  "Award amount": string
  Classification: string
  Link: string
  "Open date": string
  Eligibility: string
}

export interface EnrichedScholarship {
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

export interface LinkReport {
  url: string
  slug: string
  name: string
  status: "alive" | "redirect" | "dead" | "unknown"
  statusCode: number | null
  redirectUrl: string | null
}

// --- Month typo corrections ---

const MONTH_CORRECTIONS: Record<string, string> = {
  janurary: "January",
  feburary: "February",
  febuary: "February",
  marh: "March",
  apirl: "April",
  aprile: "April",
  juen: "June",
  juyl: "July",
  agust: "August",
  augst: "August",
  septmber: "September",
  ocotber: "October",
  novmber: "November",
  decmber: "December",
}

// --- Season mapping ---

const MONTH_TO_SEASON: Record<string, Season> = {
  december: "winter",
  january: "winter",
  february: "winter",
  march: "spring",
  april: "spring",
  may: "spring",
  june: "summer",
  july: "summer",
  august: "summer",
  september: "fall",
  october: "fall",
  november: "fall",
}

// --- Month index (0-based) for date parsing ---

const MONTH_INDEX: Record<string, number> = {
  january: 0,
  february: 1,
  march: 2,
  april: 3,
  may: 4,
  june: 5,
  july: 6,
  august: 7,
  september: 8,
  october: 9,
  november: 10,
  december: 11,
}

// --- Valid education levels ---

const VALID_LEVELS: Record<string, EducationLevel> = {
  "high school": "High School",
  undergraduate: "Undergraduate",
  graduate: "Graduate",
  "k-8": "K-8",
  "k-12": "K-12",
}

// --- Pure utility functions ---

export function correctMonthTypo(month: string): string {
  const lower = month.toLowerCase().trim()
  return MONTH_CORRECTIONS[lower] ?? month.trim()
}

export function extractMonth(deadline: string): string | null {
  const corrected = correctMonthTypo(deadline.split(/\s+/)[0])
  const lower = corrected.toLowerCase()
  if (MONTH_TO_SEASON[lower]) {
    return corrected.charAt(0).toUpperCase() + corrected.slice(1).toLowerCase()
  }
  return null
}

export function deriveSeason(deadline: string): Season {
  const month = extractMonth(deadline)
  if (!month) return "fall" // fallback
  return MONTH_TO_SEASON[month.toLowerCase()] ?? "fall"
}

/**
 * Derive the deadline year from a "Month Day" string.
 * If the deadline hasn't passed yet this year, returns this year.
 * If it has already passed, returns next year.
 * Accepts an optional `referenceDate` for testability (defaults to now).
 */
export function deriveDeadlineYear(
  deadline: string,
  referenceDate: Date = new Date()
): number {
  const month = extractMonth(deadline)
  if (!month) return referenceDate.getFullYear()

  const monthIdx = MONTH_INDEX[month.toLowerCase()]
  if (monthIdx === undefined) return referenceDate.getFullYear()

  const parts = deadline.trim().split(/\s+/)
  const day = parts.length > 1 ? parseInt(parts[1], 10) : 1
  const dayNum = isNaN(day) ? 1 : day

  const currentYear = referenceDate.getFullYear()
  const deadlineThisYear = new Date(currentYear, monthIdx, dayNum)

  // Compare date only (ignore time)
  const today = new Date(
    referenceDate.getFullYear(),
    referenceDate.getMonth(),
    referenceDate.getDate()
  )

  return deadlineThisYear >= today ? currentYear : currentYear + 1
}

export function normalizeClassification(raw: string): EducationLevel[] {
  if (!raw || !raw.trim()) return []

  const parts = raw.split(/[,&]/).map((s) => s.trim().toLowerCase())
  const result: EducationLevel[] = []

  for (const part of parts) {
    const normalized = VALID_LEVELS[part]
    if (normalized && !result.includes(normalized)) {
      result.push(normalized)
    }
  }

  return result
}

export function generateSlug(name: string, deadline: string): string {
  const raw = `${name}-${deadline}`
  return slugify(raw, { lower: true, strict: true })
}

export function parseCsv(filePath: string): CsvRow[] {
  const content = fs.readFileSync(filePath, "utf-8")
  const result = Papa.parse<CsvRow>(content, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.trim(),
  })

  return result.data.filter(
    (row) => row["Scholarship Name"] && row["Scholarship Name"].trim() !== ""
  )
}

export function cleanUrl(url: string): string {
  return url.trim().replace(/\s+/g, "")
}

export function extractDomain(url: string): string {
  try {
    const hostname = new URL(url).hostname
    return hostname.replace(/^www\./, "")
  } catch {
    return ""
  }
}

export function formatProviderFromDomain(domain: string): string {
  return domain
    .split(".")
    .slice(0, -1)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}
