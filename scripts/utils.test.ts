import { describe, it, expect } from "vitest"
import {
  correctMonthTypo,
  extractMonth,
  deriveSeason,
  normalizeClassification,
  generateSlug,
  extractDomain,
  formatProviderFromDomain,
  cleanUrl,
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
