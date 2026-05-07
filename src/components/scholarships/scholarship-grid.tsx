"use client"

import { useState, useCallback, useEffect, useMemo } from "react"
import { AnimatePresence, motion } from "motion/react"
import { useLenis } from "lenis/react"
import { Icon } from "@iconify/react"
import { cn } from "@/lib/utils"
import { scholarships as allScholarships } from "@/data/scholarships"
import { filterAndSort } from "@/lib/scholarship-utils"
import { useScholarshipFilters } from "@/hooks/use-scholarship-filters"
import { SESSION_DATE } from "@/lib/session-date"
import { ScholarshipFilters } from "./scholarship-filters"
import { ActiveFilterStrip } from "./filter-sheet"
import { ScholarshipCard } from "./scholarship-card"
import { ScholarshipListCardSpread } from "./scholarship-list-card"
import { ExpandedScholarship } from "./expanded-scholarship"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination"
import {
  PaginationLinkInkSpread,
  PaginationPreviousInkSpread,
  PaginationNextInkSpread,
  PaginationEllipsisInkSpread,
} from "@/components/ui/pagination/pagination-ink-spread"
import { Button } from "@/components/ui/button/button"
import { ComparisonSheet } from "./comparison-sheet"
import { ComparisonFab } from "./comparison-fab"

const PAGE_SIZE = 12

/* -- Main Component -- */

export function ScholarshipGrid() {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const lenis = useLenis()

  // Full active corpus — no seasonal filtering. Expired tier handled inside filterAndSort.
  const corpus = allScholarships

  const filters = useScholarshipFilters({
    scholarships: corpus,
    onFilterChangeWhileExpanded: () => setExpandedId(null),
  })

  const sortedItems = useMemo(
    () =>
      filterAndSort(
        corpus,
        filters.activeFilter,
        filters.searchQuery,
        filters.sortBy,
        filters.selectedTags,
        filters.awardRange,
        filters.month,
        SESSION_DATE,
      ),
    [
      corpus,
      filters.activeFilter,
      filters.searchQuery,
      filters.sortBy,
      filters.selectedTags,
      filters.awardRange,
      filters.month,
    ],
  )

  // totalPages counts all items (matching + dimmed) intentionally — users can
  // page through non-matching scholarships rather than having them disappear.
  const totalPages = Math.max(1, Math.ceil(sortedItems.length / PAGE_SIZE))
  const safePage = Math.min(Math.max(1, filters.page), totalPages)
  const start = (safePage - 1) * PAGE_SIZE
  const visibleItems = sortedItems.slice(start, start + PAGE_SIZE)
  const expandedScholarship = expandedId
    ? (corpus.find((s) => s.id === expandedId) ?? null)
    : null

  // Normalize URL if requested page is out of range
  useEffect(() => {
    if (filters.page !== safePage) {
      filters.setPage(safePage)
    }
  }, [filters, safePage])

  // Recalculate Lenis scroll height whenever visible content changes
  useEffect(() => {
    if (!lenis) return
    const timer = setTimeout(() => lenis.resize(), 100)
    return () => clearTimeout(timer)
  }, [
    safePage,
    filters.activeFilter,
    filters.layout,
    lenis,
    filters.searchQuery,
    filters.sortBy,
    filters.selectedTags,
    filters.awardRange,
    filters.month,
  ])

  const goToPage = useCallback(
    (n: number) => {
      const clamped = Math.min(Math.max(1, n), totalPages)
      filters.setPage(clamped)
      const el = document.getElementById("scholarship-grid-top")
      if (el && lenis) lenis.scrollTo(el, { offset: -80 })
    },
    [totalPages, filters, lenis],
  )

  const pageNumbers = getPageNumbers(safePage, totalPages)

  const handleExpand = useCallback((id: string) => {
    setExpandedId(id)
  }, [])

  const handleClose = useCallback(() => {
    setExpandedId(null)
  }, [])

  const resultCount = sortedItems.filter((i) => i.matches).length

  // Education level empty state
  const isLevelEmpty =
    filters.activeFilter !== "All" &&
    sortedItems.filter((i) => i.matches).length === 0

  // Detect "all-dimmed page": every visible card is dimmed but matches exist
  // elsewhere — surface a Jump-to-page-N banner so users don't read this as
  // a broken filter.
  const allOnPageDimmed =
    visibleItems.length > 0 && visibleItems.every((i) => !i.matches)
  const firstMatchingIdx = sortedItems.findIndex((i) => i.matches)
  const firstMatchingPage =
    firstMatchingIdx >= 0
      ? Math.floor(firstMatchingIdx / PAGE_SIZE) + 1
      : null
  const showDimmedPageBanner =
    allOnPageDimmed &&
    resultCount > 0 &&
    firstMatchingPage !== null &&
    firstMatchingPage !== safePage

  return (
    <div
      id="scholarship-grid-top"
      className="flex w-full flex-col gap-8 scroll-mt-20"
    >
      <ScholarshipFilters
        filters={filters}
        resultCount={resultCount}
        seasonalScholarships={corpus}
      />

      {/* Active filter strip */}
      <AnimatePresence>
        {filters.hasActiveFilters && (
          <ActiveFilterStrip
            key="active-filter-strip"
            searchQuery={filters.searchQuery}
            onSearchClear={() => filters.setSearchQuery("")}
            level={filters.activeFilter}
            onLevelClear={() => filters.setActiveFilter("All")}
            sortBy={filters.sortBy}
            onSortClear={() => filters.setSortBy("deadline")}
            selectedTags={filters.selectedTags}
            onTagsChange={filters.setSelectedTags}
            awardRange={filters.awardRange}
            onAwardRangeChange={filters.setAwardRange}
            month={filters.month}
            onMonthClear={() => filters.setMonth("all")}
            onClearAll={filters.clearAll}
          />
        )}
      </AnimatePresence>

      {/* Defensive empty state: catalog is empty entirely */}
      {corpus.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center gap-4 py-24"
        >
          <Icon
            icon="solar:calendar-mark-linear"
            className="size-16 text-on-surface/20"
          />
          <p className="text-lg font-medium text-on-surface/60">
            No scholarships in our catalog right now. Check back soon.
          </p>
        </motion.div>
      ) : sortedItems.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center gap-4 py-24"
        >
          <Icon
            icon="solar:magnifer-zoom-in-linear"
            className="size-16 text-on-surface/20"
          />
          <p className="text-lg font-medium text-on-surface/60">
            No scholarships found
          </p>
          <p className="max-w-sm text-center text-sm text-on-surface-variant">
            Try adjusting your search, education level, or eligibility filters
            to discover more opportunities.
          </p>
          <Button variant="outline" size="sm" onClick={filters.clearAll}>
            Clear all filters
          </Button>
        </motion.div>
      ) : (
        <>
          {/* Education level empty state hint */}
          {isLevelEmpty && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl bg-surface-container-low/60 px-6 py-4 text-center text-sm text-on-surface-variant"
              role="status"
            >
              No {filters.activeFilter} scholarships match. Try removing filters
              or browsing all levels.
            </motion.div>
          )}

          {/* All-dimmed page hint */}
          {showDimmedPageBanner && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center gap-3 rounded-xl bg-surface-container-low/60 px-6 py-4 text-center text-sm text-on-surface-variant sm:flex-row sm:justify-between sm:text-left"
              role="status"
            >
              <span>
                None of the scholarships on this page match your current filters.
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(firstMatchingPage)}
              >
                Jump to page {firstMatchingPage}
              </Button>
            </motion.div>
          )}

          {/* Grid renders in one of two layouts */}
          <AnimatePresence mode="wait">
            {filters.layout === "grid" ? (
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="grid w-full gap-4 pb-10 pt-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
              >
                {visibleItems.map(({ scholarship, matches }) => (
                  <div key={scholarship.id} className="aspect-3/4 w-full">
                    <ScholarshipCard
                      scholarship={scholarship}
                      dimmed={!matches}
                      isExpanded={expandedId === scholarship.id}
                      onExpand={handleExpand}
                    />
                  </div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="flex w-full flex-col gap-1 pb-10 pt-2"
              >
                {visibleItems.map(({ scholarship, matches }) => (
                  <ScholarshipListCardSpread
                    key={scholarship.id}
                    scholarship={scholarship}
                    dimmed={!matches}
                    onExpand={handleExpand}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col items-center gap-2">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPreviousInkSpread
                      href="#"
                      aria-disabled={safePage === 1}
                      className={cn(
                        safePage === 1 && "pointer-events-none opacity-50",
                      )}
                      onClick={(e) => {
                        e.preventDefault()
                        if (safePage > 1) goToPage(safePage - 1)
                      }}
                    />
                  </PaginationItem>

                  {pageNumbers.map((p, i) =>
                    p === "ellipsis" ? (
                      <PaginationItem key={`ellipsis-is-${i}`}>
                        <PaginationEllipsisInkSpread />
                      </PaginationItem>
                    ) : (
                      <PaginationItem key={`is-${p}`}>
                        <PaginationLinkInkSpread
                          href="#"
                          isActive={p === safePage}
                          onClick={(e) => {
                            e.preventDefault()
                            goToPage(p)
                          }}
                        >
                          {p}
                        </PaginationLinkInkSpread>
                      </PaginationItem>
                    ),
                  )}

                  <PaginationItem>
                    <PaginationNextInkSpread
                      href="#"
                      aria-disabled={safePage === totalPages}
                      className={cn(
                        safePage === totalPages &&
                          "pointer-events-none opacity-50",
                      )}
                      onClick={(e) => {
                        e.preventDefault()
                        if (safePage < totalPages) goToPage(safePage + 1)
                      }}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}

      {/* Comparison Sheet + FAB */}
      <ComparisonSheet />
      <ComparisonFab />

      <ExpandedScholarship scholarship={expandedScholarship} onClose={handleClose} />
    </div>
  )
}

/* -- Utilities -- */

function getPageNumbers(
  current: number,
  total: number,
): (number | "ellipsis")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }
  const pages: (number | "ellipsis")[] = [1]
  const left = Math.max(2, current - 1)
  const right = Math.min(total - 1, current + 1)
  if (left > 2) pages.push("ellipsis")
  for (let p = left; p <= right; p++) pages.push(p)
  if (right < total - 1) pages.push("ellipsis")
  pages.push(total)
  return pages
}

