"use client"

import { useEffect, useMemo, useCallback } from "react"
import {
  useQueryState,
  parseAsInteger,
  parseAsString,
  parseAsArrayOf,
} from "nuqs"
import {
  EDUCATION_LEVELS,
  type EducationLevelFilter,
  AWARD_MIN,
  AWARD_MAX,
  type Scholarship,
} from "@/data/scholarships"
import { ALL_TAGS, type Tag } from "@/lib/eligibility"
import type { GridLayout } from "@/components/scholarships/scholarship-filters"
import {
  MONTHS,
  MONTH_LABELS,
  type Month,
  type MonthFilter,
} from "@/lib/constants"

export { MONTHS, MONTH_LABELS }
export type { Month, MonthFilter }

const VALID_SORTS = ["deadline", "amount"] as const
type SortValue = (typeof VALID_SORTS)[number]

const VALID_LAYOUTS = ["grid", "list"] as const
type LayoutValue = (typeof VALID_LAYOUTS)[number]

const VALID_MONTH_VALUES = [...MONTHS, "all"] as const

export type ScholarshipFiltersValue = {
  activeFilter: EducationLevelFilter
  layout: GridLayout
  searchQuery: string
  sortBy: string
  selectedTags: Tag[]
  month: Month | "all"
  page: number
  awardRange: [number, number]
  levelCounts: Record<EducationLevelFilter, number>
  hasActiveFilters: boolean
  setActiveFilter: (level: EducationLevelFilter) => void
  setLayout: (layout: GridLayout) => void
  setSearchQuery: (query: string) => void
  setSortBy: (sort: string) => void
  setSelectedTags: (tags: Tag[]) => void
  setMonth: (month: Month | "all") => void
  setPage: (page: number) => void
  setAwardRange: (range: [number, number]) => void
  clearAll: () => void
}

export function useScholarshipFilters(args: {
  scholarships: Scholarship[]
  onFilterChangeWhileExpanded?: () => void
}): ScholarshipFiltersValue {
  const { scholarships, onFilterChangeWhileExpanded } = args

  const [pageUrl, setPageUrl] = useQueryState(
    "page",
    parseAsInteger.withDefault(1),
  )
  const [searchQueryUrl, setSearchQueryUrl] = useQueryState(
    "q",
    parseAsString.withDefault(""),
  )
  const [sortByUrl, setSortByUrl] = useQueryState(
    "sort",
    parseAsString.withDefault("deadline"),
  )
  const [activeFilterUrl, setActiveFilterUrl] = useQueryState(
    "level",
    parseAsString.withDefault("All"),
  )
  const [tagsUrl, setTagsUrl] = useQueryState(
    "tags",
    parseAsArrayOf(parseAsString).withDefault([]),
  )
  const [minUrl, setMinUrl] = useQueryState(
    "min",
    parseAsInteger.withDefault(AWARD_MIN),
  )
  const [maxUrl, setMaxUrl] = useQueryState(
    "max",
    parseAsInteger.withDefault(AWARD_MAX),
  )
  const [layoutUrl, setLayoutUrl] = useQueryState(
    "layout",
    parseAsString.withDefault("grid"),
  )
  const [monthUrl, setMonthUrl] = useQueryState(
    "month",
    parseAsString.withDefault("all"),
  )

  const activeFilter = activeFilterUrl as EducationLevelFilter
  const layout: GridLayout = layoutUrl === "list" ? "list" : "grid"
  const month: Month | "all" = (
    VALID_MONTH_VALUES as readonly string[]
  ).includes(monthUrl)
    ? (monthUrl as Month | "all")
    : "all"

  const selectedTags = useMemo<Tag[]>(
    // .includes() can't narrow t: string against a readonly Tag tuple; the cast
    // widens for the runtime check, the type predicate narrows the result.
    () =>
      tagsUrl.filter((t): t is Tag =>
        (ALL_TAGS as readonly string[]).includes(t),
      ),
    [tagsUrl],
  )

  const awardRange = useMemo<[number, number]>(
    () => [minUrl, maxUrl],
    [minUrl, maxUrl],
  )

  const levelCounts = useMemo(
    () =>
      EDUCATION_LEVELS.reduce(
        (acc, level) => {
          acc[level] =
            level === "All"
              ? scholarships.length
              : scholarships.filter((s) =>
                  s.classification.includes(
                    level as Exclude<EducationLevelFilter, "All">,
                  ),
                ).length
          return acc
        },
        {} as Record<EducationLevelFilter, number>,
      ),
    [scholarships],
  )

  const hasActiveFilters =
    activeFilter !== "All" ||
    searchQueryUrl !== "" ||
    sortByUrl !== "deadline" ||
    selectedTags.length > 0 ||
    awardRange[0] !== AWARD_MIN ||
    awardRange[1] !== AWARD_MAX ||
    month !== "all"

  // Mount-only sanitization: drop unknown levels/sorts/layouts, clamp + swap
  // inverted ranges, prune unknown tags. Nuqs setters call router.replace, so
  // shared links are rewritten without a navigation. Subsequent user input
  // flows through the typed setters so this only needs to fire once.
  useEffect(() => {
    let didSanitize = false
    if (
      !(EDUCATION_LEVELS as readonly string[]).includes(activeFilterUrl)
    ) {
      setActiveFilterUrl(null)
      didSanitize = true
    }
    if (!(VALID_SORTS as readonly string[]).includes(sortByUrl)) {
      setSortByUrl(null)
      didSanitize = true
    }
    if (!(VALID_LAYOUTS as readonly string[]).includes(layoutUrl)) {
      setLayoutUrl(null)
    }
    if (!(VALID_MONTH_VALUES as readonly string[]).includes(monthUrl)) {
      setMonthUrl(null)
      didSanitize = true
    }
    const cMin = Math.max(AWARD_MIN, Math.min(AWARD_MAX, minUrl))
    const cMax = Math.max(AWARD_MIN, Math.min(AWARD_MAX, maxUrl))
    if (cMin > cMax) {
      // Inverted range (?min=99999&max=10): revert both to defaults rather
      // than silently swap-and-activate. A swap would misrepresent the
      // pasted URL's intent and leave a stale active-filter chip on screen.
      if (minUrl !== AWARD_MIN) {
        setMinUrl(null)
        didSanitize = true
      }
      if (maxUrl !== AWARD_MAX) {
        setMaxUrl(null)
        didSanitize = true
      }
    } else {
      if (cMin !== minUrl) {
        setMinUrl(cMin === AWARD_MIN ? null : cMin)
        didSanitize = true
      }
      if (cMax !== maxUrl) {
        setMaxUrl(cMax === AWARD_MAX ? null : cMax)
        didSanitize = true
      }
    }
    const validTags = tagsUrl.filter((t) =>
      (ALL_TAGS as readonly string[]).includes(t),
    )
    if (validTags.length !== tagsUrl.length) {
      setTagsUrl(validTags.length === 0 ? null : validTags)
      didSanitize = true
    }
    // Any sanitization that changes the visible result set invalidates the
    // current page index — reset to page 1 so a stale `?page=N` against a
    // sanitized corpus doesn't render an empty page.
    if (didSanitize) {
      setPageUrl(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const runFilterUpdate = useCallback(
    (apply: () => void) => {
      if (onFilterChangeWhileExpanded) {
        onFilterChangeWhileExpanded()
        requestAnimationFrame(apply)
      } else {
        apply()
      }
    },
    [onFilterChangeWhileExpanded],
  )

  const setActiveFilter = useCallback(
    (level: EducationLevelFilter) => {
      runFilterUpdate(() => {
        setActiveFilterUrl(level === "All" ? null : level)
        setPageUrl(null)
      })
    },
    [runFilterUpdate, setActiveFilterUrl, setPageUrl],
  )

  const setSearchQuery = useCallback(
    (query: string) => {
      runFilterUpdate(() => {
        setSearchQueryUrl(query || null)
        setPageUrl(null)
      })
    },
    [runFilterUpdate, setSearchQueryUrl, setPageUrl],
  )

  const setSortBy = useCallback(
    (sort: string) => {
      runFilterUpdate(() => {
        const next = (VALID_SORTS as readonly string[]).includes(sort)
          ? (sort as SortValue)
          : "deadline"
        setSortByUrl(next === "deadline" ? null : next)
        setPageUrl(null)
      })
    },
    [runFilterUpdate, setSortByUrl, setPageUrl],
  )

  const setSelectedTags = useCallback(
    (tags: Tag[]) => {
      runFilterUpdate(() => {
        // Nuqs setter is typed string[]; Tag extends string so this is safe at
        // runtime, and hydration filters against ALL_TAGS to drop unknowns.
        setTagsUrl(tags.length === 0 ? null : (tags as string[]))
        setPageUrl(null)
      })
    },
    [runFilterUpdate, setTagsUrl, setPageUrl],
  )

  const setMonth = useCallback(
    (next: Month | "all") => {
      runFilterUpdate(() => {
        const validated: Month | "all" = (
          VALID_MONTH_VALUES as readonly string[]
        ).includes(next)
          ? next
          : "all"
        setMonthUrl(validated === "all" ? null : validated)
        setPageUrl(null)
      })
    },
    [runFilterUpdate, setMonthUrl, setPageUrl],
  )

  const setAwardRange = useCallback(
    (range: [number, number]) => {
      runFilterUpdate(() => {
        setMinUrl(range[0] === AWARD_MIN ? null : range[0])
        setMaxUrl(range[1] === AWARD_MAX ? null : range[1])
        setPageUrl(null)
      })
    },
    [runFilterUpdate, setMinUrl, setMaxUrl, setPageUrl],
  )

  const setPage = useCallback(
    (page: number) => {
      setPageUrl(page === 1 ? null : page)
    },
    [setPageUrl],
  )

  const setLayout = useCallback(
    (next: GridLayout) => {
      const validated: LayoutValue = next === "list" ? "list" : "grid"
      setLayoutUrl(validated === "grid" ? null : validated)
    },
    [setLayoutUrl],
  )

  const clearAll = useCallback(() => {
    setActiveFilterUrl(null)
    setSearchQueryUrl(null)
    setSortByUrl(null)
    setTagsUrl(null)
    setMinUrl(null)
    setMaxUrl(null)
    setPageUrl(null)
    setLayoutUrl(null)
    setMonthUrl(null)
  }, [
    setActiveFilterUrl,
    setSearchQueryUrl,
    setSortByUrl,
    setTagsUrl,
    setMinUrl,
    setMaxUrl,
    setPageUrl,
    setLayoutUrl,
    setMonthUrl,
  ])

  return {
    activeFilter,
    layout,
    searchQuery: searchQueryUrl,
    sortBy: sortByUrl,
    selectedTags,
    month,
    page: pageUrl,
    awardRange,
    levelCounts,
    hasActiveFilters,
    setActiveFilter,
    setLayout,
    setSearchQuery,
    setSortBy,
    setSelectedTags,
    setMonth,
    setPage,
    setAwardRange,
    clearAll,
  }
}
