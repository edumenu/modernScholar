import { describe, it, expect } from "vitest"
import { computeMonthCounts, filterAndSort } from "../scholarship-utils"
import { AWARD_MAX, AWARD_MIN, type Scholarship } from "@/data/scholarships"
import type { Tag } from "@/lib/eligibility"

/** Build a minimal Scholarship fixture; overrides win. */
function makeScholarship(overrides: Partial<Scholarship> = {}): Scholarship {
  return {
    id: "fixture",
    name: "Fixture Scholarship",
    deadline: "March 1",
    deadlineYear: 2027,
    awardAmount: "$1,000",
    classification: ["Undergraduate"],
    link: "https://example.com",
    openDate: null,
    eligibility: "",
    eligibilityTags: [],
    season: "spring",
    description: "",
    provider: "Test Provider",
    ...overrides,
  }
}

// Pin "today" so expired vs active is deterministic across the suite.
// All March 2026 entries are expired relative to this clock; March 2027 is active.
const TODAY = new Date(2026, 9, 1) // October 1, 2026

describe("filterAndSort — month filter", () => {
  it("month='march' includes March entries regardless of year", () => {
    const items: Scholarship[] = [
      makeScholarship({ id: "mar-2026", deadline: "March 15", deadlineYear: 2026 }),
      makeScholarship({ id: "mar-2027", deadline: "March 15", deadlineYear: 2027 }),
      makeScholarship({ id: "apr-2026", deadline: "April 15", deadlineYear: 2026 }),
    ]

    const result = filterAndSort(items, "All", "", "deadline", [], null, "march", TODAY)
    const ids = result.map((r) => r.scholarship.id)

    expect(ids).toContain("mar-2026")
    expect(ids).toContain("mar-2027")
    expect(ids).not.toContain("apr-2026")
    expect(result).toHaveLength(2)
  })

  it("month='all' applies no month filter", () => {
    const items: Scholarship[] = [
      makeScholarship({ id: "jan", deadline: "January 5", deadlineYear: 2027 }),
      makeScholarship({ id: "jul", deadline: "July 20", deadlineYear: 2027 }),
      makeScholarship({ id: "dec", deadline: "December 31", deadlineYear: 2027 }),
    ]

    const result = filterAndSort(items, "All", "", "deadline", [], null, "all", TODAY)
    expect(result).toHaveLength(3)
  })

  it("month filter is case-insensitive against deadline strings", () => {
    const items: Scholarship[] = [
      // Deadlines in source data use capitalized month names; filter token is lowercase.
      makeScholarship({ id: "may", deadline: "May 10", deadlineYear: 2027 }),
      makeScholarship({ id: "june", deadline: "June 10", deadlineYear: 2027 }),
    ]

    const result = filterAndSort(items, "All", "", "deadline", [], null, "may", TODAY)
    expect(result.map((r) => r.scholarship.id)).toEqual(["may"])
  })
})

describe("filterAndSort — expired tier ordering", () => {
  it("places all active before any expired under sort='deadline'", () => {
    const items: Scholarship[] = [
      // Expired with the earliest deadline — would otherwise sort first by date.
      makeScholarship({ id: "expired-early", deadline: "January 1", deadlineYear: 2026 }),
      // Active, later deadline.
      makeScholarship({ id: "active-late", deadline: "December 31", deadlineYear: 2027 }),
      // Active, earlier deadline.
      makeScholarship({ id: "active-mid", deadline: "November 15", deadlineYear: 2026 }),
      // Another expired entry.
      makeScholarship({ id: "expired-mid", deadline: "May 1", deadlineYear: 2026 }),
    ]

    const result = filterAndSort(items, "All", "", "deadline", [], null, "all", TODAY)
    const ids = result.map((r) => r.scholarship.id)

    // Active block first, sorted ascending by deadline; expired block last.
    expect(ids).toEqual(["active-mid", "active-late", "expired-early", "expired-mid"])
  })

  it("places all active before any expired under sort='amount' even when expired has highest $", () => {
    const items: Scholarship[] = [
      // Expired but huge award — must NOT bubble to the top.
      makeScholarship({
        id: "expired-rich",
        deadline: "January 1",
        deadlineYear: 2026,
        awardAmount: "$50,000",
      }),
      // Active but small award.
      makeScholarship({
        id: "active-poor",
        deadline: "December 1",
        deadlineYear: 2027,
        awardAmount: "$500",
      }),
      // Active mid.
      makeScholarship({
        id: "active-mid",
        deadline: "November 1",
        deadlineYear: 2027,
        awardAmount: "$5,000",
      }),
    ]

    const result = filterAndSort(items, "All", "", "amount", [], null, "all", TODAY)
    const ids = result.map((r) => r.scholarship.id)

    // Active descending by amount, then expired last regardless of size.
    expect(ids).toEqual(["active-mid", "active-poor", "expired-rich"])
  })
})

describe("filterAndSort — interaction: month + eligibility tag hard filter", () => {
  it("intersects month filter with eligibility-tag hard filter", () => {
    const stemTags: Tag[] = ["Major-Specific:STEM/Engineering"]
    const items: Scholarship[] = [
      // March + STEM → should pass both filters.
      makeScholarship({
        id: "mar-stem",
        deadline: "March 10",
        deadlineYear: 2027,
        eligibilityTags: ["Major-Specific:STEM/Engineering"],
      }),
      // March but no STEM tag → fails eligibility.
      makeScholarship({
        id: "mar-arts",
        deadline: "March 10",
        deadlineYear: 2027,
        eligibilityTags: ["Major-Specific:Arts/Theater"],
      }),
      // STEM but wrong month → fails month.
      makeScholarship({
        id: "apr-stem",
        deadline: "April 10",
        deadlineYear: 2027,
        eligibilityTags: ["Major-Specific:STEM/Engineering"],
      }),
      // Neither → fails both.
      makeScholarship({
        id: "apr-arts",
        deadline: "April 10",
        deadlineYear: 2027,
        eligibilityTags: ["Major-Specific:Arts/Theater"],
      }),
    ]

    const result = filterAndSort(
      items,
      "All",
      "",
      "deadline",
      stemTags,
      null,
      "march",
      TODAY,
    )

    expect(result.map((r) => r.scholarship.id)).toEqual(["mar-stem"])
  })
})

describe("computeMonthCounts", () => {
  it("counts scholarships into their deadline-month bucket", () => {
    const corpus: Scholarship[] = [
      makeScholarship({ id: "a", deadline: "March 15" }),
      makeScholarship({ id: "b", deadline: "March 31" }),
      makeScholarship({ id: "c", deadline: "December 1" }),
      makeScholarship({ id: "d", deadline: "July 4" }),
    ]
    const counts = computeMonthCounts(corpus)
    expect(counts.march).toBe(2)
    expect(counts.december).toBe(1)
    expect(counts.july).toBe(1)
    expect(counts.january).toBe(0)
  })

  it("is case-insensitive on the leading month token", () => {
    const corpus: Scholarship[] = [
      makeScholarship({ id: "a", deadline: "march 1" }),
      makeScholarship({ id: "b", deadline: "MARCH 5" }),
    ]
    expect(computeMonthCounts(corpus).march).toBe(2)
  })

  it("ignores rows whose deadline doesn't start with a known month token", () => {
    const corpus: Scholarship[] = [
      makeScholarship({ id: "a", deadline: "Rolling" }),
      makeScholarship({ id: "b", deadline: "TBD" }),
      makeScholarship({ id: "c", deadline: "March 1" }),
    ]
    const counts = computeMonthCounts(corpus)
    expect(counts.march).toBe(1)
    const total = Object.values(counts).reduce((a, b) => a + b, 0)
    expect(total).toBe(1)
  })
})

describe("filterAndSort — award range and Varies handling", () => {
  it("drops Varies rows (parsed amount of 0) when the range is narrowed", () => {
    const items: Scholarship[] = [
      makeScholarship({ id: "varies", awardAmount: "Varies" }),
      makeScholarship({ id: "fixed", awardAmount: "$2,500" }),
    ]
    const result = filterAndSort(items, "All", "", "deadline", [], [1000, 5000], "all", TODAY)
    expect(result.map((r) => r.scholarship.id)).toEqual(["fixed"])
  })

  it("keeps Varies rows when the range is at default bounds (range inactive)", () => {
    const items: Scholarship[] = [
      makeScholarship({ id: "varies", awardAmount: "Varies" }),
      makeScholarship({ id: "fixed", awardAmount: "$2,500" }),
    ]
    const result = filterAndSort(
      items,
      "All",
      "",
      "deadline",
      [],
      [AWARD_MIN, AWARD_MAX],
      "all",
      TODAY,
    )
    expect(result.map((r) => r.scholarship.id).sort()).toEqual(["fixed", "varies"])
  })

  it("excludes rows whose parsed award is outside the active range", () => {
    const items: Scholarship[] = [
      makeScholarship({ id: "below", awardAmount: "$500" }),
      makeScholarship({ id: "inside", awardAmount: "$2,500" }),
      makeScholarship({ id: "above", awardAmount: "$10,000" }),
    ]
    const result = filterAndSort(items, "All", "", "deadline", [], [1000, 5000], "all", TODAY)
    expect(result.map((r) => r.scholarship.id)).toEqual(["inside"])
  })
})

describe("filterAndSort — level two-tier partition", () => {
  it("places level-matching items first and level-mismatched dimmed at the tail", () => {
    const items: Scholarship[] = [
      makeScholarship({
        id: "ug-only",
        classification: ["Undergraduate"],
        deadline: "March 1",
        deadlineYear: 2027,
      }),
      makeScholarship({
        id: "grad-only",
        classification: ["Graduate"],
        deadline: "February 1",
        deadlineYear: 2027,
      }),
      makeScholarship({
        id: "ug-and-grad",
        classification: ["Undergraduate", "Graduate"],
        deadline: "April 1",
        deadlineYear: 2027,
      }),
    ]
    const result = filterAndSort(
      items,
      "Undergraduate",
      "",
      "deadline",
      [],
      null,
      "all",
      TODAY,
    )

    expect(result.map((r) => r.scholarship.id)).toEqual([
      "ug-only",
      "ug-and-grad",
      "grad-only",
    ])
    expect(result.find((r) => r.scholarship.id === "grad-only")?.matches).toBe(false)
    expect(result.find((r) => r.scholarship.id === "ug-only")?.matches).toBe(true)
  })

  it("with level=All, every row is marked matches=true", () => {
    const items: Scholarship[] = [
      makeScholarship({
        id: "a",
        classification: ["High School"],
        deadlineYear: 2027,
      }),
      makeScholarship({
        id: "b",
        classification: ["Graduate"],
        deadlineYear: 2027,
      }),
    ]
    const result = filterAndSort(items, "All", "", "deadline", [], null, "all", TODAY)
    expect(result.every((r) => r.matches)).toBe(true)
  })
})

describe("filterAndSort — text search", () => {
  it("matches across name, eligibility, description, and provider (case-insensitive)", () => {
    const items: Scholarship[] = [
      makeScholarship({ id: "by-name", name: "Robotics Future Award" }),
      makeScholarship({
        id: "by-provider",
        name: "Generic",
        provider: "ROBOTICS Foundation",
      }),
      makeScholarship({
        id: "by-description",
        name: "Generic",
        description: "Funds robotics research.",
      }),
      makeScholarship({ id: "no-match", name: "Music Grant" }),
    ]
    const result = filterAndSort(items, "All", "robotics", "deadline", [], null, "all", TODAY)
    const ids = result.map((r) => r.scholarship.id).sort()
    expect(ids).toEqual(["by-description", "by-name", "by-provider"])
  })
})
