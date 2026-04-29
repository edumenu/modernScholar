import { describe, it, expect } from "vitest"
import { filterAndSort } from "../scholarship-grid"
import type { Scholarship } from "@/data/scholarships"

const mockScholarships: Scholarship[] = [
  {
    id: "1",
    name: "Tech Award",
    provider: "Tech Co",
    awardAmount: "$5,000",
    deadline: "May 1",
    deadlineYear: 2027,
    classification: ["Undergraduate"],
    link: "https://example.com",
    openDate: null,
    eligibility: "Must be enrolled",
    season: "spring",
    description: "",
  },
  {
    id: "2",
    name: "Art Grant",
    provider: "Art Co",
    awardAmount: "$3,000",
    deadline: "June 1",
    deadlineYear: 2027,
    classification: ["High School"],
    link: "https://example.com",
    openDate: null,
    eligibility: "Must be in high school",
    season: "summer",
    description: "",
  },
  {
    id: "3",
    name: "STEM Fund",
    provider: "STEM Co",
    awardAmount: "$7,000",
    deadline: "July 1",
    deadlineYear: 2027,
    classification: ["High School", "Undergraduate"],
    link: "https://example.com",
    openDate: null,
    eligibility: "Open to all",
    season: "summer",
    description: "",
  },
  {
    id: "4",
    name: "General Award",
    provider: "Gen Co",
    awardAmount: "$4,000",
    deadline: "August 1",
    deadlineYear: 2027,
    classification: ["Graduate"],
    link: "https://example.com",
    openDate: null,
    eligibility: "Graduate students only",
    season: "summer",
    description: "",
  },
]

describe("filterAndSort", () => {
  it('returns all items as matching when filter is "All"', () => {
    const result = filterAndSort(mockScholarships, "All", "", "deadline")
    expect(result).toHaveLength(4)
    expect(result.every((r) => r.matches)).toBe(true)
  })

  it("sorts matching items to the top by education level", () => {
    const result = filterAndSort(mockScholarships, "High School", "", "deadline")
    // Items 2 and 3 match High School
    expect(result[0].matches).toBe(true)
    expect(result[1].matches).toBe(true)
    expect(result[2].matches).toBe(false)
  })

  it("matches scholarships with multi-level classification", () => {
    const result = filterAndSort(mockScholarships, "Undergraduate", "", "deadline")
    const matching = result.filter((r) => r.matches)
    // Items 1 (Undergraduate) and 3 (High School + Undergraduate)
    expect(matching).toHaveLength(2)
    expect(matching.map((r) => r.scholarship.id).sort()).toEqual(["1", "3"])
  })

  it("marks non-matching items as not matching", () => {
    const result = filterAndSort(mockScholarships, "High School", "", "deadline")
    const nonMatching = result.filter((r) => !r.matches)
    expect(nonMatching).toHaveLength(2) // items 1 and 4
  })

  it("filters by search query across name", () => {
    const result = filterAndSort(mockScholarships, "All", "tech", "deadline")
    expect(result).toHaveLength(1)
    expect(result[0].scholarship.id).toBe("1")
  })

  it("filters by search query across provider", () => {
    const result = filterAndSort(mockScholarships, "All", "STEM Co", "deadline")
    expect(result).toHaveLength(1)
    expect(result[0].scholarship.id).toBe("3")
  })

  it("filters by search query across eligibility", () => {
    const items: Scholarship[] = [
      {
        id: "d1",
        name: "Award",
        provider: "Provider",
        awardAmount: "$1,000",
        deadline: "May 1",
        deadlineYear: 2027,
        classification: ["Undergraduate"],
        link: "https://example.com",
        openDate: null,
        eligibility: "This is for engineering students",
        season: "spring",
            description: "",
      },
    ]
    const result = filterAndSort(items, "All", "engineering", "deadline")
    expect(result).toHaveLength(1)
  })

  it("sorts by amount descending", () => {
    const result = filterAndSort(mockScholarships, "All", "", "amount")
    expect(result[0].scholarship.id).toBe("3") // $7,000
    expect(result[1].scholarship.id).toBe("1") // $5,000
  })

  it("sorts by deadline ascending (soonest first)", () => {
    const result = filterAndSort(mockScholarships, "All", "", "deadline")
    expect(result[0].scholarship.id).toBe("1") // May
    expect(result[1].scholarship.id).toBe("2") // June
  })

  it("returns all dimmed when no items match education level", () => {
    const result = filterAndSort(mockScholarships, "K-8", "", "deadline")
    expect(result.every((r) => !r.matches)).toBe(true)
  })

  it("returns empty array when search matches nothing", () => {
    const result = filterAndSort(mockScholarships, "All", "zzzznotfound", "deadline")
    expect(result).toHaveLength(0)
  })
})
