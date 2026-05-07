import { describe, it, expect } from "vitest"
import {
  isExpired,
  getReopenLabel,
  getExpiredBadge,
} from "../expired-status"
import type { Scholarship } from "@/data/scholarships"

/** Build a minimal Scholarship-shaped fixture. Only fields the helpers
 *  actually read (deadline, deadlineYear, openDate) need to be meaningful. */
function makeScholarship(overrides: Partial<Scholarship> = {}): Scholarship {
  return {
    id: "test-1",
    name: "Test Scholarship",
    deadline: "March 15",
    deadlineYear: 2026,
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
  } as Scholarship
}

describe("isExpired", () => {
  it("returns true when the deadline is strictly before today", () => {
    const scholarship = makeScholarship({
      deadline: "January 1",
      deadlineYear: 2026,
    })
    // Today is well after the deadline
    const today = new Date(2026, 5, 1) // June 1, 2026
    expect(isExpired(scholarship, today)).toBe(true)
  })

  it("returns false when the deadline is after today", () => {
    const scholarship = makeScholarship({
      deadline: "December 31",
      deadlineYear: 2026,
    })
    const today = new Date(2026, 0, 15) // January 15, 2026
    expect(isExpired(scholarship, today)).toBe(false)
  })
})

describe("getReopenLabel", () => {
  it("returns 'Check back in {deadlineYear + 1}' regardless of openDate", () => {
    const scholarship = makeScholarship({
      openDate: "January 1",
      deadlineYear: 2026,
    })
    expect(getReopenLabel(scholarship)).toBe("Check back in 2027")
  })

  it("returns 'Check back in {deadlineYear + 1}' when openDate is null", () => {
    const scholarship = makeScholarship({
      openDate: null,
      deadlineYear: 2026,
    })
    expect(getReopenLabel(scholarship)).toBe("Check back in 2027")
  })

  it("returns the year fallback for ambiguous text like 'TBD'", () => {
    const scholarship = makeScholarship({
      openDate: "TBD",
      deadlineYear: 2025,
    })
    expect(getReopenLabel(scholarship)).toBe("Check back in 2026")
  })
})

describe("getExpiredBadge", () => {
  it("composes isExpired=true with the year fallback when expired", () => {
    const scholarship = makeScholarship({
      deadline: "January 1",
      deadlineYear: 2026,
      openDate: "September 1",
    })
    const today = new Date(2026, 5, 1) // after deadline
    expect(getExpiredBadge(scholarship, today)).toEqual({
      isExpired: true,
      label: "Check back in 2027",
    })
  })

  it("composes isExpired=true with the year fallback when openDate is null", () => {
    const scholarship = makeScholarship({
      deadline: "January 1",
      deadlineYear: 2026,
      openDate: null,
    })
    const today = new Date(2026, 5, 1)
    expect(getExpiredBadge(scholarship, today)).toEqual({
      isExpired: true,
      label: "Check back in 2027",
    })
  })

  it("returns isExpired=false and label=null when the scholarship is still active", () => {
    const scholarship = makeScholarship({
      deadline: "December 31",
      deadlineYear: 2026,
      openDate: "September 1",
    })
    const today = new Date(2026, 0, 15) // before deadline
    expect(getExpiredBadge(scholarship, today)).toEqual({
      isExpired: false,
      label: null,
    })
  })
})
