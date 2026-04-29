"use client"

import { useState, useCallback, useEffect, useMemo, useRef } from "react"
import { AnimatePresence, motion } from "motion/react"
import { useLenis } from "lenis/react"
import { Icon } from "@iconify/react"
import { useScrollLock } from "@/hooks/use-scroll-lock"
import {
  useQueryState,
  parseAsInteger,
  parseAsString,
} from "nuqs"
import { cn } from "@/lib/utils"
import {
  scholarships as allScholarships,
  type EducationLevelFilter,
  getCurrentSeason,
  getNextSeason,
  isScholarshipVisible,
  CLASSIFICATION_COLORS,
  getClassificationTint,
} from "@/data/scholarships"
import { filterAndSort } from "@/lib/scholarship-utils"
import { ScholarshipFilters, type GridLayout } from "./scholarship-filters"
import { ScholarshipCard } from "./scholarship-card"
import { ScholarshipListCardSpread } from "./scholarship-list-card"
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

// Snapshot taken at module load; a full page reload is needed to cross season boundaries.
const SESSION_DATE = new Date()

/* -- Main Component -- */

export function ScholarshipGrid() {
  const [activeFilter, setActiveFilter] = useState<EducationLevelFilter>("All")
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [layout, setLayout] = useState<GridLayout>("grid")
  const previousFocusRef = useRef<HTMLElement | null>(null)

  // URL-persisted state
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1))
  const [searchQuery, setSearchQuery] = useQueryState(
    "q",
    parseAsString.withDefault(""),
  )
  const [sortBy, setSortBy] = useQueryState(
    "sort",
    parseAsString.withDefault("deadline"),
  )

  const lenis = useLenis()

  // Get current season and filter scholarships
  const currentSeason = useMemo(() => getCurrentSeason(SESSION_DATE), [])
  const nextSeason = useMemo(() => getNextSeason(currentSeason), [currentSeason])

  const seasonalScholarships = useMemo(
    () => allScholarships.filter((s) => isScholarshipVisible(s, currentSeason, SESSION_DATE)),
    [currentSeason],
  )

  const sortedItems = useMemo(
    () =>
      filterAndSort(
        seasonalScholarships,
        activeFilter,
        searchQuery,
        sortBy,
      ),
    [seasonalScholarships, activeFilter, searchQuery, sortBy],
  )

  // totalPages counts all items (matching + dimmed) intentionally — users can
  // page through non-matching scholarships rather than having them disappear.
  const totalPages = Math.max(1, Math.ceil(sortedItems.length / PAGE_SIZE))
  const safePage = Math.min(Math.max(1, page), totalPages)
  const start = (safePage - 1) * PAGE_SIZE
  const visibleItems = sortedItems.slice(start, start + PAGE_SIZE)
  const expandedScholarship = expandedId
    ? (seasonalScholarships.find((s) => s.id === expandedId) ?? null)
    : null

  // Normalize URL if requested page is out of range
  useEffect(() => {
    if (page !== safePage) {
      setPage(safePage === 1 ? null : safePage)
    }
  }, [page, safePage, setPage])

  // Reset page when filters change
  const handleSearchChange = useCallback(
    (q: string) => {
      setSearchQuery(q || null)
      setPage(null)
    },
    [setSearchQuery, setPage],
  )

  const handleSortChange = useCallback(
    (sort: string) => {
      setSortBy(sort === "deadline" ? null : sort)
      setPage(null)
    },
    [setSortBy, setPage],
  )

  // Recalculate Lenis scroll height whenever visible content changes
  useEffect(() => {
    if (!lenis) return
    const timer = setTimeout(() => lenis.resize(), 100)
    return () => clearTimeout(timer)
  }, [safePage, activeFilter, layout, lenis, searchQuery, sortBy])

  const handleFilterChange = useCallback(
    (level: EducationLevelFilter) => {
      if (expandedId) {
        setExpandedId(null)
        requestAnimationFrame(() => {
          setActiveFilter(level)
          setPage(null)
        })
      } else {
        setActiveFilter(level)
        setPage(null)
      }
    },
    [expandedId, setPage],
  )

  const goToPage = useCallback(
    (n: number) => {
      const clamped = Math.min(Math.max(1, n), totalPages)
      setPage(clamped === 1 ? null : clamped)
      const el = document.getElementById("scholarship-grid-top")
      if (el && lenis) lenis.scrollTo(el, { offset: -80 })
    },
    [totalPages, setPage, lenis],
  )

  const pageNumbers = getPageNumbers(safePage, totalPages)

  const handleExpand = useCallback((id: string) => {
    if (typeof document !== "undefined") {
      const active = document.activeElement as HTMLElement | null
      previousFocusRef.current = active
    }
    setExpandedId(id)
  }, [])

  const handleClose = useCallback(() => {
    setExpandedId(null)
  }, [])

  const restorePreviousFocus = useCallback(() => {
    const target = previousFocusRef.current
    if (target && typeof target.focus === "function") {
      target.focus()
    }
    previousFocusRef.current = null
  }, [])

  // Lock scroll when expanded
  useScrollLock(!!expandedId)

  // Close modal on Escape key
  useEffect(() => {
    if (!expandedId) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose()
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [expandedId, handleClose])

  const clearAllFilters = useCallback(() => {
    setActiveFilter("All")
    setSearchQuery(null)
    setSortBy(null)
    setPage(null)
  }, [setSearchQuery, setSortBy, setPage])

  const resultCount = sortedItems.filter((i) => i.matches).length

  // Season-aware empty state
  const seasonLabel = currentSeason.charAt(0).toUpperCase() + currentSeason.slice(1)
  const nextSeasonLabel = nextSeason.charAt(0).toUpperCase() + nextSeason.slice(1)

  // Education level empty state
  const isLevelEmpty =
    activeFilter !== "All" &&
    sortedItems.filter((i) => i.matches).length === 0

  return (
    <div
      id="scholarship-grid-top"
      className="flex w-full flex-col gap-8 scroll-mt-20"
    >
      <ScholarshipFilters
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
        layout={layout}
        onLayoutChange={setLayout}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        sortBy={sortBy}
        onSortByChange={handleSortChange}
        resultCount={resultCount}
        seasonalScholarships={seasonalScholarships}
      />

      {/* Empty state: no scholarships this season */}
      {seasonalScholarships.length === 0 ? (
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
            No scholarships available this {seasonLabel.toLowerCase()}
          </p>
          <p className="max-w-sm text-center text-sm text-on-surface-variant">
            New scholarships are coming in {nextSeasonLabel}! Check back soon for
            fresh opportunities.
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
            Try adjusting your search or education level filter to discover more
            opportunities.
          </p>
          <Button variant="outline" size="sm" onClick={clearAllFilters}>
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
              No {activeFilter} scholarships this {seasonLabel.toLowerCase()}.
              New scholarships are added each season — check back in{" "}
              {nextSeasonLabel}!
            </motion.div>
          )}

          {/* Grid renders in one of two layouts */}
          <AnimatePresence mode="wait">
            {layout === "grid" ? (
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

      {/* Expanded Card Overlay */}
      <AnimatePresence onExitComplete={restorePreviousFocus}>
        {expandedScholarship && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
              onClick={handleClose}
              aria-hidden="true"
            />

            <motion.div
              key="modal-wrapper"
              className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
              onClick={handleClose}
            >
              <motion.div
                data-modal-content
                role="dialog"
                aria-modal="true"
                aria-labelledby="expanded-dialog-title"
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => {
                  // Focus trap: keep Tab navigation inside the dialog
                  if (e.key === "Tab") {
                    const focusable = e.currentTarget.querySelectorAll<HTMLElement>(
                      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
                    )
                    if (focusable.length === 0) return
                    const first = focusable[0]
                    const last = focusable[focusable.length - 1]
                    if (e.shiftKey && document.activeElement === first) {
                      e.preventDefault()
                      last.focus()
                    } else if (!e.shiftKey && document.activeElement === last) {
                      e.preventDefault()
                      first.focus()
                    }
                  }
                }}
                layoutId={`card-${expandedScholarship.id}`}
                className={cn(
                  "relative flex w-full max-w-3xl flex-col overflow-hidden rounded-3xl",
                  "bg-white shadow-xl dark:bg-surface-container-low dark:shadow-2xl",
                  "max-h-[85vh]",
                )}
              >
                {(() => {
                  const overlayTint = getClassificationTint(expandedScholarship.classification)
                  return (
                    <>
                      {/* Tinted header zone */}
                      <div
                        className={cn(
                          "relative w-full shrink-0 px-8 pb-8 pt-6 md:px-12 md:pt-8 md:pb-10",
                          overlayTint.bg,
                          overlayTint.border,
                        )}
                      >
                        <button
                          onClick={handleClose}
                          className={cn(
                            "absolute right-6 top-6 z-10 flex size-10 items-center justify-center rounded-full transition-colors",
                            "bg-on-surface/10 hover:bg-on-surface/18",
                            overlayTint.text,
                          )}
                          aria-label="Close"
                          autoFocus
                        >
                          <Icon
                            icon="solar:close-circle-linear"
                            className="size-8 cursor-pointer"
                          />
                        </button>

                        <div className="flex flex-col gap-4">
                          {/* Education level badges */}
                          <div className="flex flex-wrap items-center gap-2">
                            {expandedScholarship.classification.map((level) => {
                              const colors = CLASSIFICATION_COLORS[level];
                              return (
                                <span
                                  key={level}
                                  className={cn(
                                    "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
                                    colors.bg,
                                    colors.text,
                                  )}
                                >
                                  {level}
                                </span>
                              );
                            })}
                          </div>

                          <h2
                            id="expanded-dialog-title"
                            className={cn(
                              "font-heading text-3xl font-bold leading-tight md:text-4xl lg:text-5xl",
                              overlayTint.text,
                            )}
                          >
                            {expandedScholarship.name}
                          </h2>

                          {/* Gradient-fade underline */}
                          <div
                            className={cn(
                              "h-px w-2/3 bg-linear-to-r to-transparent",
                              overlayTint.accent,
                            )}
                            aria-hidden="true"
                          />

                          <p
                            className={cn(
                              "text-base font-medium md:text-lg",
                              overlayTint.muted,
                            )}
                          >
                            {expandedScholarship.provider}
                          </p>

                          {/* Amount + deadline */}
                          <div className="flex flex-wrap items-center gap-4">
                            <span className="flex items-center gap-1.5">
                              <Icon
                                icon="solar:money-bag-linear"
                                className={cn("size-5", overlayTint.muted)}
                              />
                              <span
                                className={cn(
                                  "font-heading text-2xl font-bold",
                                  overlayTint.text,
                                )}
                              >
                                {expandedScholarship.awardAmount}
                              </span>
                            </span>
                            <span
                              className={cn(
                                "flex items-center gap-1.5 text-sm",
                                overlayTint.muted,
                              )}
                            >
                              <Icon
                                icon="solar:calendar-linear"
                                className="size-4"
                              />
                              Deadline: {expandedScholarship.deadline},{" "}
                              {expandedScholarship.deadlineYear}
                            </span>
                            {expandedScholarship.openDate && (
                              <span
                                className={cn(
                                  "flex items-center gap-1.5 text-sm",
                                  overlayTint.muted,
                                )}
                              >
                                <Icon
                                  icon="solar:calendar-mark-linear"
                                  className="size-4"
                                />
                                Opens: {expandedScholarship.openDate}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Content body */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.3 }}
                        className="flex shrink flex-col gap-4 overflow-y-auto bg-white p-8 dark:bg-surface-container-low md:px-12 md:py-10"
                      >
                        {expandedScholarship.description && (
                          <p className="text-sm leading-relaxed text-on-surface/70 md:text-base">
                            {expandedScholarship.description}
                          </p>
                        )}

                        {/* Eligibility */}
                        {expandedScholarship.eligibility && (
                          <div className="flex flex-col gap-2">
                            <h3 className="text-sm font-medium text-on-surface/90">
                              Eligibility
                            </h3>
                            <p className="max-h-40 overflow-y-auto text-sm leading-relaxed text-on-surface/70 whitespace-pre-line">
                              {expandedScholarship.eligibility}
                            </p>
                          </div>
                        )}

                        {/* CTA row */}
                        <div className="flex items-center gap-3 border-t border-outline-variant/30 pt-4 dark:border-white/10">
                          <Button
                            size="default"
                            className="flex-1 sm:flex-none"
                            nativeButton={false}
                            render={
                              <a
                                href={expandedScholarship.link}
                                target="_blank"
                                rel="noopener noreferrer"
                              />
                            }
                          >
                            Apply Now
                            <Icon
                              icon="solar:arrow-right-up-linear"
                              data-icon="inline-end"
                            />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon-sm"
                            aria-label="Share scholarship"
                          >
                            <Icon
                              icon="solar:share-linear"
                              className="size-4"
                            />
                          </Button>
                        </div>
                      </motion.div>
                    </>
                  );
                })()}
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
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

