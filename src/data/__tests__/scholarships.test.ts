import { describe, it, expect } from "vitest"
import {
  isScholarshipActive,
  parseAwardAmount,
  getClassificationTint,
  CLASSIFICATION_TINTS,
  CLASSIFICATION_COLORS,
  scholarships,
  type Scholarship,
  type EducationLevel,
} from "../scholarships"
import { parseDeadlineDate } from "@/lib/scholarship-utils"

describe("isScholarshipActive", () => {
  const baseScholarship: Scholarship = {
    id: "test",
    name: "Test",
    deadline: "March 1",
    deadlineYear: 2027,
    awardAmount: "$1,000",
    classification: ["Undergraduate"],
    link: "https://example.com",
    openDate: null,
    eligibility: "",
    season: "spring",
    description: "",
    provider: "Test",
    eligibilityTags: [],
  }

  it("returns true when deadline is in the future", () => {
    const today = new Date(2027, 1, 15) // Feb 15, 2027 — before March 1, 2027
    expect(isScholarshipActive(baseScholarship, today)).toBe(true)
  })

  it("returns false when deadline has already passed", () => {
    const today = new Date(2027, 5, 1) // June 1, 2027 — after March 1, 2027
    expect(isScholarshipActive(baseScholarship, today)).toBe(false)
  })

  it("returns true when deadline is exactly today", () => {
    const today = new Date(2027, 2, 1) // March 1, 2027
    expect(isScholarshipActive(baseScholarship, today)).toBe(true)
  })
})

describe("parseAwardAmount", () => {
  it("parses simple dollar amount", () => {
    expect(parseAwardAmount("$10,000")).toBe(10000)
  })

  it("parses complex award string with single dollar amount", () => {
    expect(parseAwardAmount("105 scholarships at $25,000 each")).toBe(25000)
  })

  it("returns 0 for no dollar amount", () => {
    expect(parseAwardAmount("Varies")).toBe(0)
  })

  it("parses small amounts", () => {
    expect(parseAwardAmount("$500")).toBe(500)
  })

  it("returns the largest amount when multiple are present", () => {
    expect(parseAwardAmount("$5,000 per year (Total: $20,000)")).toBe(20000)
    expect(parseAwardAmount("$2,000 to $7,500")).toBe(7500)
  })
})

describe("CLASSIFICATION_COLORS", () => {
  const levels: EducationLevel[] = ["High School", "Undergraduate", "Graduate", "K-8", "K-12"]

  it.each(levels)("returns bg and text for %s", (level) => {
    const colors = CLASSIFICATION_COLORS[level]
    expect(colors.bg).toBeTruthy()
    expect(colors.text).toBeTruthy()
  })
})

describe("CLASSIFICATION_TINTS", () => {
  const levels: EducationLevel[] = ["High School", "Undergraduate", "Graduate", "K-8", "K-12"]

  it.each(levels)("returns bg, border, accent, text, and muted for %s", (level) => {
    const tint = CLASSIFICATION_TINTS[level]
    expect(tint.bg).toBeTruthy()
    expect(tint.border).toBeTruthy()
    expect(tint.accent).toBeTruthy()
    expect(tint.text).toBeTruthy()
    expect(tint.muted).toBeTruthy()
  })
})

describe("getClassificationTint", () => {
  it("returns tint based on first classification", () => {
    const tint = getClassificationTint(["Graduate", "Undergraduate"])
    expect(tint.bg).toBe("bg-white dark:bg-surface-container-low")
    expect(tint.border).toBe("border-t-4 border-tertiary-600")
    expect(tint.text).toBe("text-on-surface")
  })

  it("returns fallback for unknown classification", () => {
    const tint = getClassificationTint([] as unknown as EducationLevel[])
    expect(tint.bg).toBe("bg-surface-container")
    expect(tint.border).toBe("border-t-4 border-outline-variant")
  })
})

// Data integrity guards. These run against the live enriched dataset and
// would have caught the prior duplicate-id (March 31 cohort) and "Feburary"
// regressions — keep them so the next pipeline run can't silently reintroduce
// either class of defect.
describe("scholarships dataset integrity", () => {
  it("has unique ids across the entire corpus", () => {
    const ids = scholarships.map((s) => s.id)
    const seen = new Set<string>()
    const duplicates: string[] = []
    for (const id of ids) {
      if (seen.has(id)) duplicates.push(id)
      seen.add(id)
    }
    expect(duplicates).toEqual([])
    expect(seen.size).toBe(scholarships.length)
  })

  it("every deadline parses to a valid timestamp", () => {
    const unparseable = scholarships.filter(
      (s) => parseDeadlineDate(s.deadline, s.deadlineYear) === 0,
    )
    expect(unparseable).toEqual([])
  })

  it("every deadline uses correctly spelled month names", () => {
    const valid =
      /^(January|February|March|April|May|June|July|August|September|October|November|December) \d{1,2}$/
    const malformed = scholarships
      .map((s) => ({ id: s.id, deadline: s.deadline }))
      .filter((s) => !valid.test(s.deadline))
    expect(malformed).toEqual([])
  })
})

