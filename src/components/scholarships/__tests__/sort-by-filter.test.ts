import { describe, it, expect } from "vitest"
import { sortByFilter } from "../scholarship-grid"
import type { Scholarship } from "@/data/scholarships"

const mockScholarships: Scholarship[] = [
  {
    id: "1",
    title: "Tech Award",
    provider: "Tech Co",
    amount: "$5,000",
    deadline: "May 1, 2026",
    rating: 4.5,
    image: "/test.jpg",
    category: "Technology",
  },
  {
    id: "2",
    title: "Art Grant",
    provider: "Art Co",
    amount: "$3,000",
    deadline: "June 1, 2026",
    rating: 4.2,
    image: "/test.jpg",
    category: "Arts",
  },
  {
    id: "3",
    title: "STEM Fund",
    provider: "STEM Co",
    amount: "$7,000",
    deadline: "July 1, 2026",
    rating: 4.8,
    image: "/test.jpg",
    tag: "Featured",
    category: "STEM",
  },
  {
    id: "4",
    title: "General Award",
    provider: "Gen Co",
    amount: "$4,000",
    deadline: "Aug 1, 2026",
    rating: 4.0,
    image: "/test.jpg",
    category: "General",
  },
]

describe("sortByFilter", () => {
  it('returns all items as matching when filter is "All"', () => {
    const result = sortByFilter(mockScholarships, "All")
    expect(result).toHaveLength(4)
    expect(result.every((r) => r.matches)).toBe(true)
    expect(result.map((r) => r.scholarship.id)).toEqual(["1", "2", "3", "4"])
  })

  it("sorts matching items to the top", () => {
    const result = sortByFilter(mockScholarships, "Arts")
    expect(result[0].scholarship.id).toBe("2")
    expect(result[0].matches).toBe(true)
  })

  it("marks non-matching items as not matching", () => {
    const result = sortByFilter(mockScholarships, "Arts")
    const nonMatching = result.filter((r) => !r.matches)
    expect(nonMatching).toHaveLength(3)
    expect(nonMatching.map((r) => r.scholarship.id)).toEqual(["1", "3", "4"])
  })

  it("preserves original order within matching group", () => {
    const withTwoTech: Scholarship[] = [
      ...mockScholarships,
      {
        id: "5",
        title: "Tech Grant 2",
        provider: "Tech Co 2",
        amount: "$6,000",
        deadline: "Sep 1, 2026",
        rating: 4.3,
        image: "/test.jpg",
        category: "Technology",
      },
    ]
    const result = sortByFilter(withTwoTech, "Technology")
    const matching = result.filter((r) => r.matches)
    expect(matching.map((r) => r.scholarship.id)).toEqual(["1", "5"])
  })

  it("preserves original order within non-matching group", () => {
    const result = sortByFilter(mockScholarships, "STEM")
    const nonMatching = result.filter((r) => !r.matches)
    expect(nonMatching.map((r) => r.scholarship.id)).toEqual(["1", "2", "4"])
  })

  it("returns all as non-matching when no items match the filter", () => {
    const result = sortByFilter(mockScholarships, "Medical")
    expect(result.every((r) => !r.matches)).toBe(true)
    expect(result).toHaveLength(4)
  })
})

