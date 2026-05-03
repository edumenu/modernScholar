import { describe, it, expect } from "vitest"
import { classify, matches, ALL_TAGS, type Tag } from "../eligibility"

describe("classify", () => {
  it("returns Need-Based and Merit-Based for prose with financial need + GPA", () => {
    const result = classify(
      "Be a graduating senior with a minimum 3.75 GPA and demonstrated financial need",
    )
    expect(result).toContain("Need-Based")
    expect(result).toContain("Merit-Based")
  })

  it("returns [] for empty input", () => {
    expect(classify("")).toEqual([])
  })

  it("returns [] for prose with no rule matches", () => {
    expect(classify("Open to all students")).toEqual([])
  })
})

describe("matches", () => {
  it("returns true for empty selection", () => {
    const eligibilityTags: Tag[] = []
    expect(matches({ eligibilityTags }, [])).toBe(true)
  })

  it("returns false when selected tag absent from scholarship", () => {
    expect(
      matches(
        { eligibilityTags: ["Need-Based"] as const },
        ["Merit-Based"] as const,
      ),
    ).toBe(false)
  })

  it("returns true when scholarship contains the selected tag", () => {
    expect(
      matches(
        { eligibilityTags: ["Need-Based", "Merit-Based"] as const },
        ["Need-Based"] as const,
      ),
    ).toBe(true)
  })

  it("returns true on OR within category, AND across categories", () => {
    expect(
      matches(
        {
          eligibilityTags: [
            "Race/Ethnicity:Hispanic/Latino",
            "Need-Based",
          ] as const,
        },
        [
          "Race/Ethnicity:African American/Black",
          "Race/Ethnicity:Hispanic/Latino",
          "Need-Based",
        ] as const,
      ),
    ).toBe(true)
  })
})

describe("classify round-trip integrity", () => {
  const fixtures: string[] = [
    "Be a graduating senior with a minimum 3.75 GPA and demonstrated financial need",
    "Open to first-generation college students from California pursuing engineering",
    "Female student majoring in nursing or healthcare",
    "African American or Hispanic students with a 3.5 GPA",
    "Active duty military or veteran with chronic illness or cancer history",
    "Legally blind students pursuing law school",
    "Jewish student studying architecture",
    "Performing arts and creative writing scholarship for theatre majors",
    "Pell eligible male student with mental health advocacy experience",
    "NCAA athlete pursuing business or accounting major",
  ]

  it("every tag returned by classify over a corpus is in ALL_TAGS", () => {
    const all = new Set<Tag>()
    for (const text of fixtures) {
      for (const tag of classify(text)) {
        all.add(tag)
      }
    }
    expect(all.size).toBeGreaterThan(0)
    for (const tag of all) {
      expect(ALL_TAGS).toContain(tag)
    }
  })
})
