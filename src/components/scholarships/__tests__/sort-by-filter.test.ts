import { describe, it, expect } from "vitest"
import { filterAndSort } from "../scholarship-grid"
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

const noTags = { featured: false, popular: false, new: false, topPick: false }

describe("filterAndSort", () => {
  it('returns all items as matching when filter is "All"', () => {
    const result = filterAndSort(mockScholarships, "All", "", noTags, "deadline")
    expect(result).toHaveLength(4)
    expect(result.every((r) => r.matches)).toBe(true)
  })

  it("sorts matching items to the top by category", () => {
    const result = filterAndSort(mockScholarships, "Arts", "", noTags, "deadline")
    expect(result[0].scholarship.id).toBe("2")
    expect(result[0].matches).toBe(true)
  })

  it("marks non-matching items as not matching", () => {
    const result = filterAndSort(mockScholarships, "Arts", "", noTags, "deadline")
    const nonMatching = result.filter((r) => !r.matches)
    expect(nonMatching).toHaveLength(3)
  })

  it("filters by search query across title", () => {
    const result = filterAndSort(mockScholarships, "All", "tech", noTags, "deadline")
    expect(result).toHaveLength(1)
    expect(result[0].scholarship.id).toBe("1")
  })

  it("filters by search query across provider", () => {
    const result = filterAndSort(mockScholarships, "All", "STEM Co", noTags, "deadline")
    expect(result).toHaveLength(1)
    expect(result[0].scholarship.id).toBe("3")
  })

  it("filters by search query across description", () => {
    const items: Scholarship[] = [
      {
        id: "d1",
        title: "Award",
        provider: "Provider",
        amount: "$1,000",
        deadline: "May 1, 2026",
        rating: 4.0,
        image: "/test.jpg",
        category: "General",
        description: "This is for engineering students",
      },
    ]
    const result = filterAndSort(items, "All", "engineering", noTags, "deadline")
    expect(result).toHaveLength(1)
  })

  it("filters by search query across category", () => {
    const result = filterAndSort(mockScholarships, "All", "technology", noTags, "deadline")
    expect(result).toHaveLength(1)
    expect(result[0].scholarship.id).toBe("1")
  })

  it("filters by tag", () => {
    const tags = { ...noTags, featured: true }
    const result = filterAndSort(mockScholarships, "All", "", tags, "deadline")
    expect(result).toHaveLength(1)
    expect(result[0].scholarship.id).toBe("3")
  })

  it("sorts by amount descending", () => {
    const result = filterAndSort(mockScholarships, "All", "", noTags, "amount")
    expect(result[0].scholarship.id).toBe("3") // $7,000
    expect(result[1].scholarship.id).toBe("1") // $5,000
  })

  it("sorts by rating descending", () => {
    const result = filterAndSort(mockScholarships, "All", "", noTags, "rating")
    expect(result[0].scholarship.id).toBe("3") // 4.8
    expect(result[1].scholarship.id).toBe("1") // 4.5
  })

  it("sorts by deadline ascending (soonest first)", () => {
    const result = filterAndSort(mockScholarships, "All", "", noTags, "deadline")
    expect(result[0].scholarship.id).toBe("1") // May
    expect(result[1].scholarship.id).toBe("2") // June
  })

  it("returns empty when no items match search + category", () => {
    const result = filterAndSort(mockScholarships, "Medical", "", noTags, "deadline")
    // All items present but none match Medical, so all dimmed
    expect(result.every((r) => !r.matches)).toBe(true)
  })

  it("returns empty array when search matches nothing", () => {
    const result = filterAndSort(mockScholarships, "All", "zzzznotfound", noTags, "deadline")
    expect(result).toHaveLength(0)
  })
})
