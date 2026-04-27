import { describe, it, expect } from "vitest"
import {
  correctMonthTypo,
  extractMonth,
  deriveSeason,
  deriveDeadlineYear,
  normalizeClassification,
  generateSlug,
  extractDomain,
  formatProviderFromDomain,
  cleanUrl,
  generateDescription,
} from "./utils"

describe("correctMonthTypo", () => {
  it("corrects common misspellings", () => {
    expect(correctMonthTypo("Feburary")).toBe("February")
    expect(correctMonthTypo("Janurary")).toBe("January")
    expect(correctMonthTypo("Agust")).toBe("August")
  })

  it("passes through correct months unchanged", () => {
    expect(correctMonthTypo("January")).toBe("January")
    expect(correctMonthTypo("March")).toBe("March")
    expect(correctMonthTypo("December")).toBe("December")
  })

  it("trims whitespace", () => {
    expect(correctMonthTypo("  January ")).toBe("January")
  })
})

describe("extractMonth", () => {
  it("extracts month from deadline string", () => {
    expect(extractMonth("January 1")).toBe("January")
    expect(extractMonth("March 15")).toBe("March")
    expect(extractMonth("December 31")).toBe("December")
  })

  it("handles month typos", () => {
    expect(extractMonth("Feburary 1")).toBe("February")
  })

  it("returns null for invalid months", () => {
    expect(extractMonth("Varies")).toBeNull()
    expect(extractMonth("")).toBeNull()
  })
})

describe("deriveSeason", () => {
  it("maps winter months correctly", () => {
    expect(deriveSeason("December 1")).toBe("winter")
    expect(deriveSeason("January 15")).toBe("winter")
    expect(deriveSeason("February 28")).toBe("winter")
  })

  it("maps spring months correctly", () => {
    expect(deriveSeason("March 1")).toBe("spring")
    expect(deriveSeason("April 15")).toBe("spring")
    expect(deriveSeason("May 31")).toBe("spring")
  })

  it("maps summer months correctly", () => {
    expect(deriveSeason("June 1")).toBe("summer")
    expect(deriveSeason("July 4")).toBe("summer")
    expect(deriveSeason("August 15")).toBe("summer")
  })

  it("maps fall months correctly", () => {
    expect(deriveSeason("September 1")).toBe("fall")
    expect(deriveSeason("October 31")).toBe("fall")
    expect(deriveSeason("November 15")).toBe("fall")
  })

  it("handles typos", () => {
    expect(deriveSeason("Feburary 1")).toBe("winter")
  })

  it("falls back to fall for invalid deadlines", () => {
    expect(deriveSeason("Varies")).toBe("fall")
  })
})

describe("deriveDeadlineYear", () => {
  it("returns current year when deadline is in the future", () => {
    const ref = new Date(2026, 3, 22) // April 22, 2026
    expect(deriveDeadlineYear("June 1", ref)).toBe(2026)
    expect(deriveDeadlineYear("December 31", ref)).toBe(2026)
  })

  it("returns next year when deadline has already passed", () => {
    const ref = new Date(2026, 3, 22) // April 22, 2026
    expect(deriveDeadlineYear("January 1", ref)).toBe(2027)
    expect(deriveDeadlineYear("March 15", ref)).toBe(2027)
  })

  it("returns current year when deadline is today", () => {
    const ref = new Date(2026, 3, 22) // April 22, 2026
    expect(deriveDeadlineYear("April 22", ref)).toBe(2026)
  })

  it("returns next year when deadline was yesterday", () => {
    const ref = new Date(2026, 3, 22) // April 22, 2026
    expect(deriveDeadlineYear("April 21", ref)).toBe(2027)
  })

  it("handles month typos", () => {
    const ref = new Date(2026, 0, 10) // January 10, 2026
    expect(deriveDeadlineYear("Feburary 13", ref)).toBe(2026)
  })

  it("falls back to current year for invalid deadlines", () => {
    const ref = new Date(2026, 5, 1)
    expect(deriveDeadlineYear("Varies", ref)).toBe(2026)
  })
})

describe("normalizeClassification", () => {
  it("normalizes single values", () => {
    expect(normalizeClassification("High school")).toEqual(["High School"])
    expect(normalizeClassification("Undergraduate")).toEqual(["Undergraduate"])
    expect(normalizeClassification("Graduate")).toEqual(["Graduate"])
    expect(normalizeClassification("K-8")).toEqual(["K-8"])
    expect(normalizeClassification("K-12")).toEqual(["K-12"])
  })

  it("splits on &", () => {
    expect(normalizeClassification("High school & Undergraduate")).toEqual([
      "High School",
      "Undergraduate",
    ])
  })

  it("splits on comma", () => {
    expect(
      normalizeClassification("High school, undergraduate, graduate")
    ).toEqual(["High School", "Undergraduate", "Graduate"])
  })

  it("handles mixed separators", () => {
    expect(normalizeClassification("Undergraduate & Graduate")).toEqual([
      "Undergraduate",
      "Graduate",
    ])
  })

  it("deduplicates", () => {
    expect(
      normalizeClassification("High school & High school")
    ).toEqual(["High School"])
  })

  it("returns empty array for empty input", () => {
    expect(normalizeClassification("")).toEqual([])
    expect(normalizeClassification("  ")).toEqual([])
  })

  it("skips invalid classifications", () => {
    expect(normalizeClassification("PhD")).toEqual([])
    expect(normalizeClassification("High school & PhD")).toEqual([
      "High School",
    ])
  })
})

describe("generateSlug", () => {
  it("generates lowercase slugs", () => {
    const slug = generateSlug("Gates Scholarship", "January 1")
    expect(slug).toBe("gates-scholarship-january-1")
  })

  it("strips special characters", () => {
    const slug = generateSlug("STEM $1,000 Award!", "March 15")
    expect(slug).toBe("stem-dollar1000-award-march-15")
  })

  it("handles different deadlines for same name", () => {
    const slug1 = generateSlug("Test Scholarship", "January 1")
    const slug2 = generateSlug("Test Scholarship", "June 15")
    expect(slug1).not.toBe(slug2)
  })
})

describe("extractDomain", () => {
  it("extracts domain without www", () => {
    expect(extractDomain("https://www.example.com/path")).toBe("example.com")
  })

  it("extracts domain without www prefix", () => {
    expect(extractDomain("https://scholarships.org/apply")).toBe(
      "scholarships.org"
    )
  })

  it("returns empty string for invalid URLs", () => {
    expect(extractDomain("not-a-url")).toBe("")
  })
})

describe("formatProviderFromDomain", () => {
  it("formats domain as provider name", () => {
    expect(formatProviderFromDomain("example.com")).toBe("Example")
    expect(formatProviderFromDomain("my-scholarships.org")).toBe(
      "My-scholarships"
    )
  })
})

describe("cleanUrl", () => {
  it("trims whitespace", () => {
    expect(cleanUrl("  https://example.com  ")).toBe("https://example.com")
  })

  it("removes internal whitespace", () => {
    expect(cleanUrl("https://example .com/path")).toBe(
      "https://example.com/path"
    )
  })
})

describe("generateDescription", () => {
  it("returns ogDescription when text is too short", () => {
    expect(generateDescription("short", "Test Scholarship", "A great scholarship for students."))
      .toBe("A great scholarship for students.")
  })

  it("returns empty string when both text and ogDescription are empty", () => {
    expect(generateDescription("short", "Test Scholarship", null)).toBe("")
  })

  it("filters out boilerplate lines", () => {
    const text = [
      "The ABC Scholarship awards $5,000 to eligible undergraduate students pursuing STEM degrees.",
      "Cookie Policy - We use cookies to improve your experience.",
      "Follow us on Facebook and Instagram for updates.",
      "Subscribe to our newsletter for the latest news.",
      "Students must maintain a 3.0 GPA to remain eligible for the award.",
    ].join("\n")
    const result = generateDescription(text, "ABC Scholarship", null)
    expect(result).not.toContain("Cookie")
    expect(result).not.toContain("Facebook")
    expect(result).not.toContain("newsletter")
    expect(result.toLowerCase()).toContain("scholarship")
  })

  it("prefers lines with scholarship keywords", () => {
    const text = [
      "Welcome to our organization founded in 1995 with a mission to support communities.",
      "The scholarship provides $10,000 annually to eligible students pursuing higher education.",
      "Our campus is located in downtown Portland with beautiful architecture.",
      "Apply now to receive financial aid for your college education program.",
    ].join("\n")
    const result = generateDescription(text, "Test Grant", null)
    expect(result).toContain("scholarship")
    expect(result).not.toContain("Portland")
  })

  it("caps output at ~500 characters on a sentence boundary", () => {
    const longSentence = "This scholarship program offers funding to students who demonstrate academic excellence and community involvement. "
    const text = longSentence.repeat(10)
    const result = generateDescription(text, "Test Scholarship", null)
    expect(result.length).toBeLessThanOrEqual(510)
    expect(result.endsWith(".")).toBe(true)
  })

  it("falls back to ogDescription when extracted content is too short", () => {
    const text = "Some text that is long enough to pass the initial check but has no relevant scholarship content at all, just random words about weather and cooking recipes."
    const ogDesc = "A prestigious scholarship providing $25,000 to outstanding students in engineering fields."
    const result = generateDescription(text, "Engineering Award", ogDesc)
    expect(result.length).toBeGreaterThan(30)
  })
})
