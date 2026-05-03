import { describe, it, expect, vi } from "vitest"
import type { ReactNode } from "react"
import { renderHook, act } from "@testing-library/react"
import { NuqsTestingAdapter } from "nuqs/adapters/testing"
import { useScholarshipFilters } from "../use-scholarship-filters"
import { AWARD_MIN, AWARD_MAX, type Scholarship } from "@/data/scholarships"

const fixtures: Scholarship[] = [
  {
    id: "s1",
    name: "Undergrad Merit Award",
    deadline: "2026-06-01",
    deadlineYear: 2026,
    awardAmount: "$5,000",
    classification: ["Undergraduate"],
    link: "https://example.com/s1",
    openDate: null,
    eligibility: "Undergraduate students",
    eligibilityTags: ["Merit-Based"],
    season: "spring",
    description: "Merit-based award",
    provider: "Provider A",
  },
  {
    id: "s2",
    name: "Undergrad Need Grant",
    deadline: "2026-07-15",
    deadlineYear: 2026,
    awardAmount: "$2,500",
    classification: ["Undergraduate"],
    link: "https://example.com/s2",
    openDate: null,
    eligibility: "Need-based",
    eligibilityTags: ["Need-Based"],
    season: "summer",
    description: "Need-based grant",
    provider: "Provider B",
  },
  {
    id: "s3",
    name: "Graduate Research Fellowship",
    deadline: "2026-09-01",
    deadlineYear: 2026,
    awardAmount: "$10,000",
    classification: ["Graduate"],
    link: "https://example.com/s3",
    openDate: null,
    eligibility: "Graduate research",
    eligibilityTags: [],
    season: "fall",
    description: "Research fellowship",
    provider: "Provider C",
  },
  {
    id: "s4",
    name: "High School Arts Prize",
    deadline: "2026-04-01",
    deadlineYear: 2026,
    awardAmount: "$1,000",
    classification: ["High School"],
    link: "https://example.com/s4",
    openDate: null,
    eligibility: "High school arts",
    eligibilityTags: [],
    season: "spring",
    description: "Arts prize",
    provider: "Provider D",
  },
]

function wrapper(searchParams: string = "") {
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <NuqsTestingAdapter searchParams={searchParams} hasMemory>
        {children}
      </NuqsTestingAdapter>
    )
  }
  return Wrapper
}

describe("useScholarshipFilters", () => {
  describe("hydration", () => {
    it("reads URL params on mount", () => {
      const { result } = renderHook(
        () => useScholarshipFilters({ scholarships: fixtures }),
        {
          wrapper: wrapper(
            "?page=2&q=art&sort=amount&level=Undergraduate&tags=Merit-Based,Need-Based",
          ),
        },
      )

      expect(result.current.page).toBe(2)
      expect(result.current.searchQuery).toBe("art")
      expect(result.current.sortBy).toBe("amount")
      expect(result.current.activeFilter).toBe("Undergraduate")
      expect(result.current.selectedTags).toEqual(
        expect.arrayContaining(["Merit-Based", "Need-Based"]),
      )
      expect(result.current.selectedTags).toHaveLength(2)
    })

    it("silently drops stale tags not in ALL_TAGS", () => {
      const { result } = renderHook(
        () => useScholarshipFilters({ scholarships: fixtures }),
        { wrapper: wrapper("?tags=Need-Based,FakeOldTag") },
      )

      expect(result.current.selectedTags).toEqual(["Need-Based"])
    })

    it("hydrates awardRange from min/max URL params", () => {
      const { result } = renderHook(
        () => useScholarshipFilters({ scholarships: fixtures }),
        { wrapper: wrapper("?min=1500&max=20000") },
      )

      expect(result.current.awardRange).toEqual([1500, 20000])
    })

    it("layout defaults to 'grid' (client-only)", () => {
      const { result } = renderHook(
        () => useScholarshipFilters({ scholarships: fixtures }),
        { wrapper: wrapper("") },
      )

      expect(result.current.layout).toBe("grid")
    })
  })

  describe("page reset rules", () => {
    type Action = (
      f: ReturnType<typeof useScholarshipFilters>,
    ) => void

    it.each<[string, Action]>([
      ["setActiveFilter", (f) => f.setActiveFilter("Graduate")],
      ["setSearchQuery", (f) => f.setSearchQuery("art")],
      ["setSortBy", (f) => f.setSortBy("amount")],
      ["setSelectedTags", (f) => f.setSelectedTags(["Need-Based"])],
      ["setAwardRange", (f) => f.setAwardRange([1000, 5000])],
    ])("%s resets page to default", (_, action) => {
      const { result } = renderHook(
        () => useScholarshipFilters({ scholarships: fixtures }),
        { wrapper: wrapper("?page=3") },
      )

      expect(result.current.page).toBe(3)

      act(() => {
        action(result.current)
      })

      expect(result.current.page).toBe(1)
    })

    it("setPage does NOT reset itself", () => {
      const { result } = renderHook(
        () => useScholarshipFilters({ scholarships: fixtures }),
        { wrapper: wrapper("?page=3") },
      )

      act(() => {
        result.current.setPage(5)
      })

      expect(result.current.page).toBe(5)
    })

    it("setLayout does NOT reset page", () => {
      const { result } = renderHook(
        () => useScholarshipFilters({ scholarships: fixtures }),
        { wrapper: wrapper("?page=3") },
      )

      act(() => {
        result.current.setLayout("list")
      })

      expect(result.current.page).toBe(3)
      expect(result.current.layout).toBe("list")
    })
  })

  describe("derived", () => {
    it("levelCounts reflects input scholarships", () => {
      const { result } = renderHook(
        () => useScholarshipFilters({ scholarships: fixtures }),
        { wrapper: wrapper("") },
      )

      expect(result.current.levelCounts.All).toBe(4)
      expect(result.current.levelCounts.Undergraduate).toBe(2)
      expect(result.current.levelCounts.Graduate).toBe(1)
      expect(result.current.levelCounts["High School"]).toBe(1)
    })

    it("hasActiveFilters defaults to false", () => {
      const { result } = renderHook(
        () => useScholarshipFilters({ scholarships: fixtures }),
        { wrapper: wrapper("") },
      )

      expect(result.current.hasActiveFilters).toBe(false)
    })

    it("hasActiveFilters becomes true on any non-default value", () => {
      const { result } = renderHook(
        () => useScholarshipFilters({ scholarships: fixtures }),
        { wrapper: wrapper("") },
      )

      act(() => {
        result.current.setActiveFilter("Graduate")
      })
      expect(result.current.hasActiveFilters).toBe(true)

      act(() => {
        result.current.clearAll()
      })
      expect(result.current.hasActiveFilters).toBe(false)

      act(() => {
        result.current.setSelectedTags(["Need-Based"])
      })
      expect(result.current.hasActiveFilters).toBe(true)

      act(() => {
        result.current.clearAll()
      })
      expect(result.current.hasActiveFilters).toBe(false)

      act(() => {
        result.current.setAwardRange([1000, 5000])
      })
      expect(result.current.hasActiveFilters).toBe(true)

      act(() => {
        result.current.clearAll()
      })
      expect(result.current.hasActiveFilters).toBe(false)
    })
  })

  describe("onFilterChangeWhileExpanded", () => {
    it("invokes the callback exactly once per filter change when provided", () => {
      const rafSpy = vi
        .spyOn(window, "requestAnimationFrame")
        .mockImplementation((cb) => {
          cb(0)
          return 0
        })

      const onFilterChange = vi.fn()

      const { result } = renderHook(
        () =>
          useScholarshipFilters({
            scholarships: fixtures,
            onFilterChangeWhileExpanded: onFilterChange,
          }),
        { wrapper: wrapper("") },
      )

      act(() => {
        result.current.setActiveFilter("Graduate")
      })
      act(() => {
        result.current.setSearchQuery("art")
      })
      act(() => {
        result.current.setSelectedTags(["Need-Based"])
      })

      expect(onFilterChange).toHaveBeenCalledTimes(3)

      rafSpy.mockRestore()
    })

    it("does NOT invoke when callback is undefined", () => {
      const { result } = renderHook(
        () => useScholarshipFilters({ scholarships: fixtures }),
        { wrapper: wrapper("") },
      )

      expect(() => {
        act(() => {
          result.current.setActiveFilter("Graduate")
        })
      }).not.toThrow()

      expect(result.current.activeFilter).toBe("Graduate")
    })

    it("calls callback on filter change via rAF without breaking state", () => {
      const rafSpy = vi
        .spyOn(window, "requestAnimationFrame")
        .mockImplementation((cb) => {
          cb(0)
          return 0
        })

      const onFilterChange = vi.fn()

      const { result } = renderHook(
        () =>
          useScholarshipFilters({
            scholarships: fixtures,
            onFilterChangeWhileExpanded: onFilterChange,
          }),
        { wrapper: wrapper("") },
      )

      act(() => {
        result.current.setActiveFilter("Graduate")
      })

      expect(onFilterChange).toHaveBeenCalledTimes(1)
      expect(result.current.activeFilter).toBe("Graduate")

      rafSpy.mockRestore()
    })
  })

  describe("clearAll", () => {
    it("resets all filters to defaults", () => {
      const { result } = renderHook(
        () => useScholarshipFilters({ scholarships: fixtures }),
        { wrapper: wrapper("") },
      )

      act(() => {
        result.current.setActiveFilter("Graduate")
      })
      act(() => {
        result.current.setSearchQuery("art")
      })
      act(() => {
        result.current.setSortBy("amount")
      })
      act(() => {
        result.current.setSelectedTags(["Merit-Based"])
      })
      act(() => {
        result.current.setAwardRange([1000, 5000])
      })
      act(() => {
        result.current.setPage(3)
      })

      act(() => {
        result.current.clearAll()
      })

      expect(result.current.activeFilter).toBe("All")
      expect(result.current.searchQuery).toBe("")
      expect(result.current.sortBy).toBe("deadline")
      expect(result.current.selectedTags).toEqual([])
      expect(result.current.awardRange).toEqual([AWARD_MIN, AWARD_MAX])
      expect(result.current.page).toBe(1)
      expect(result.current.hasActiveFilters).toBe(false)
    })

    it("resets layout back to grid", () => {
      const { result } = renderHook(
        () => useScholarshipFilters({ scholarships: fixtures }),
        { wrapper: wrapper("") },
      )

      act(() => {
        result.current.setLayout("list")
      })
      act(() => {
        result.current.clearAll()
      })

      expect(result.current.layout).toBe("grid")
    })
  })
})
