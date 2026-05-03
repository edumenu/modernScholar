"use client"

import { useState, useMemo, useCallback } from "react"
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

export type ScholarshipFiltersValue = {
  activeFilter: EducationLevelFilter
  layout: GridLayout
  searchQuery: string
  sortBy: string
  selectedTags: Tag[]
  page: number
  awardRange: [number, number]
  levelCounts: Record<EducationLevelFilter, number>
  hasActiveFilters: boolean
  setActiveFilter: (level: EducationLevelFilter) => void
  setLayout: (layout: GridLayout) => void
  setSearchQuery: (query: string) => void
  setSortBy: (sort: string) => void
  setSelectedTags: (tags: Tag[]) => void
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

  const [layout, setLayout] = useState<GridLayout>("grid")

  const activeFilter = activeFilterUrl as EducationLevelFilter

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
    awardRange[1] !== AWARD_MAX

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
        setSortByUrl(sort === "deadline" ? null : sort)
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

  const clearAll = useCallback(() => {
    setActiveFilterUrl(null)
    setSearchQueryUrl(null)
    setSortByUrl(null)
    setTagsUrl(null)
    setMinUrl(null)
    setMaxUrl(null)
    setPageUrl(null)
  }, [
    setActiveFilterUrl,
    setSearchQueryUrl,
    setSortByUrl,
    setTagsUrl,
    setMinUrl,
    setMaxUrl,
    setPageUrl,
  ])

  return {
    activeFilter,
    layout,
    searchQuery: searchQueryUrl,
    sortBy: sortByUrl,
    selectedTags,
    page: pageUrl,
    awardRange,
    levelCounts,
    hasActiveFilters,
    setActiveFilter,
    setLayout,
    setSearchQuery,
    setSortBy,
    setSelectedTags,
    setPage,
    setAwardRange,
    clearAll,
  }
}
