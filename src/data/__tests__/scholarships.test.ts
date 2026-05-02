import { describe, it, expect } from "vitest"
import {
  isScholarshipVisible,
  parseAwardAmount,
  getClassificationTint,
  CLASSIFICATION_TINTS,
  CLASSIFICATION_COLORS,
  type Scholarship,
  type EducationLevel,
} from "../scholarships"

describe("isScholarshipVisible", () => {
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

  it("returns true for matching season with future deadline", () => {
    const today = new Date(2027, 1, 15) // Feb 15, 2027
    expect(isScholarshipVisible(baseScholarship, "spring", today)).toBe(true)
  })

  it("returns false for wrong season", () => {
    const today = new Date(2027, 1, 15)
    expect(isScholarshipVisible(baseScholarship, "fall", today)).toBe(false)
  })

  it("returns false for past deadline", () => {
    const today = new Date(2027, 5, 1) // June 1, 2027 — after March 1
    expect(isScholarshipVisible(baseScholarship, "spring", today)).toBe(false)
  })

  it("returns true when deadline is today", () => {
    const today = new Date(2027, 2, 1) // March 1, 2027
    expect(isScholarshipVisible(baseScholarship, "spring", today)).toBe(true)
  })
})

describe("parseAwardAmount", () => {
  it("parses simple dollar amount", () => {
    expect(parseAwardAmount("$10,000")).toBe(10000)
  })

  it("parses complex award string (first dollar amount)", () => {
    expect(parseAwardAmount("105 scholarships at $25,000 each")).toBe(25000)
  })

  it("returns 0 for no dollar amount", () => {
    expect(parseAwardAmount("Varies")).toBe(0)
  })

  it("parses small amounts", () => {
    expect(parseAwardAmount("$500")).toBe(500)
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
    expect(tint.bg).toBe("bg-surface-container-low")
    expect(tint.border).toBe("border-t-4 border-tertiary-600")
    expect(tint.text).toBe("text-on-surface")
  })

  it("returns fallback for unknown classification", () => {
    const tint = getClassificationTint([] as unknown as EducationLevel[])
    expect(tint.bg).toBe("bg-surface-container")
    expect(tint.border).toBe("border-t-4 border-outline-variant")
  })
})

