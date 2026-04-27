"use client"

import { useState, useCallback, useEffect, useMemo, useRef } from "react"
import { AnimatePresence, motion } from "motion/react"
import { useLenis } from "lenis/react"
import { Icon } from "@iconify/react"
import Image from "next/image"
import {
  useQueryState,
  parseAsInteger,
  parseAsString,
} from "nuqs"
import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"
import {
  scholarships as allScholarships,
  type Scholarship,
  type EducationLevelFilter,
  getCurrentSeason,
  getNextSeason,
  isScholarshipVisible,
  parseAwardAmount,
  generateGradient,
} from "@/data/scholarships"
import { ScholarshipFilters, type GridLayout } from "./scholarship-filters"
import { ScholarshipCard } from "./scholarship-card"
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

/* -- Helpers -- */

/** Parse deadline string + year into a Date for sorting */
function parseDeadlineDate(deadline: string, deadlineYear: number): number {
  return new Date(`${deadline}, ${deadlineYear}`).getTime() || 0
}

/** Full filtering pipeline: search + education level, then sort */
export function filterAndSort(
  items: Scholarship[],
  level: EducationLevelFilter,
  searchQuery: string,
  sortBy: string,
): { scholarship: Scholarship; matches: boolean }[] {
  const query = searchQuery.toLowerCase().trim()

  // Text search across name, eligibility, description, provider
  const filtered = items.filter((s) => {
    if (query) {
      const haystack =
        `${s.name} ${s.eligibility} ${s.description} ${s.provider}`.toLowerCase()
      if (!haystack.includes(query)) return false
    }
    return true
  })

  // Sort
  if (sortBy === "amount") {
    filtered.sort((a, b) => parseAwardAmount(b.awardAmount) - parseAwardAmount(a.awardAmount))
  } else {
    // deadline (default): soonest first
    filtered.sort(
      (a, b) =>
        parseDeadlineDate(a.deadline, a.deadlineYear) -
        parseDeadlineDate(b.deadline, b.deadlineYear),
    )
  }

  // Education level: matching first, non-matching dimmed
  if (level === "All") {
    return filtered.map((s) => ({ scholarship: s, matches: true }))
  }

  const matching = filtered.filter((s) => s.classification.includes(level as Exclude<EducationLevelFilter, "All">))
  const nonMatching = filtered.filter((s) => !s.classification.includes(level as Exclude<EducationLevelFilter, "All">))
  return [
    ...matching.map((s) => ({ scholarship: s, matches: true })),
    ...nonMatching.map((s) => ({ scholarship: s, matches: false })),
  ]
}

const PAGE_SIZE = 12

/** Bento blocks render 10 cards in the 4-column pattern. */
const BENTO_CHUNK = 10

/* -- Main Component -- */

export function ScholarshipGrid() {
  const [activeFilter, setActiveFilter] = useState<EducationLevelFilter>("All")
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [isClosing, setIsClosing] = useState(false)
  const [layout, setLayout] = useState<GridLayout>("bento")
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
  const now = useMemo(() => new Date(), [])
  const currentSeason = useMemo(() => getCurrentSeason(now), [now])
  const nextSeason = useMemo(() => getNextSeason(currentSeason), [currentSeason])

  const seasonalScholarships = useMemo(
    () => allScholarships.filter((s) => isScholarshipVisible(s, currentSeason, now)),
    [currentSeason, now],
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
    setIsClosing(false)
    setExpandedId(id)
  }, [])

  const handleClose = useCallback(() => {
    setIsClosing(true)
    requestAnimationFrame(() => {
      setExpandedId(null)
    })
  }, [])

  const restorePreviousFocus = useCallback(() => {
    setIsClosing(false)
    const target = previousFocusRef.current
    if (target && typeof target.focus === "function") {
      target.focus()
    }
    previousFocusRef.current = null
  }, [])

  // Lock scroll when expanded
  useEffect(() => {
    if (!lenis) return
    if (expandedId) {
      lenis.stop()
    } else {
      lenis.start()
    }
    return () => {
      lenis.start()
    }
  }, [expandedId, lenis])

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

  const isGradientImage = (image: string) => image === "gradient"

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
            {layout === "bento" ? (
              <motion.div
                key="bento"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="flex w-full flex-col gap-4 pb-10 pt-2"
              >
                {chunkItems(visibleItems, BENTO_CHUNK).map(
                  (chunk, chunkIdx) => (
                    <BentoBlock
                      key={chunkIdx}
                      items={chunk}
                      expandedId={expandedId}
                      onExpand={handleExpand}
                    />
                  ),
                )}
              </motion.div>
            ) : (
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
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
              onClick={handleClose}
              onKeyDown={(e) => {
                if (e.key === "Tab") {
                  const modal = e.currentTarget.querySelector<HTMLElement>(
                    "[data-modal-content]",
                  )
                  if (!modal) return
                  const focusable = modal.querySelectorAll<HTMLElement>(
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
            >
              <motion.div
                data-modal-content
                role="dialog"
                aria-modal="true"
                aria-label={expandedScholarship.name}
                onClick={(e) => e.stopPropagation()}
                {...(!isClosing && {
                  layoutId: `card-${expandedScholarship.id}`,
                })}
                className={cn(
                  "relative flex w-full max-w-3xl flex-col overflow-hidden rounded-3xl",
                  "bg-background shadow-xl dark:shadow-2xl",
                  "max-h-[85vh]",
                )}
              >
                {/* Image section */}
                <div className="relative min-h-48 w-full shrink-0 sm:min-h-100">
                  {isGradientImage(expandedScholarship.image) ? (
                    <div
                      className="absolute inset-0"
                      style={{
                        background: generateGradient(expandedScholarship.id),
                      }}
                    />
                  ) : (
                    <Image
                      src={expandedScholarship.image}
                      alt={expandedScholarship.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 800px"
                      priority
                    />
                  )}

                  <div className="absolute inset-0 bg-linear-to-b from-black/20 via-transparent to-black/70" />

                  <button
                    onClick={handleClose}
                    className="absolute right-6 top-6 z-10 flex size-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
                    aria-label="Close"
                    autoFocus
                  >
                    <Icon
                      icon="solar:close-circle-linear"
                      className="size-8 cursor-pointer"
                    />
                  </button>

                  <div className="absolute inset-0 flex flex-col justify-between p-8 md:p-12">
                    {/* Education level badges */}
                    <div className="flex flex-wrap items-center gap-2">
                      {expandedScholarship.classification.map((level) => (
                        <span
                          key={level}
                          className="inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white shadow-[2px_2px_4px_rgba(0,0,0,0.1),-1px_-1px_3px_rgba(255,255,255,0.1)]"
                        >
                          {level}
                        </span>
                      ))}
                    </div>

                    <h2 className="font-heading text-3xl font-medium leading-tight text-white md:text-4xl lg:text-5xl">
                      {expandedScholarship.name}
                    </h2>
                  </div>
                </div>

                {/* Content section */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                  className="flex shrink flex-col gap-4 overflow-y-auto bg-background p-8 md:px-12 md:py-10"
                >
                  {expandedScholarship.description && (
                    <p className="text-sm leading-relaxed text-on-surface/70 md:text-base">
                      {expandedScholarship.description}
                    </p>
                  )}

                  <p className="text-base text-on-surface/90 md:text-lg">
                    {expandedScholarship.provider}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-on-surface/80 md:text-base">
                    <span className="font-medium text-on-surface">
                      {expandedScholarship.awardAmount}
                    </span>
                    <span>&middot;</span>
                    <span>
                      Deadline: {expandedScholarship.deadline},{" "}
                      {expandedScholarship.deadlineYear}
                    </span>
                    {expandedScholarship.openDate && (
                      <>
                        <span>&middot;</span>
                        <span>Opens: {expandedScholarship.openDate}</span>
                      </>
                    )}
                  </div>

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
                      <Icon icon="solar:share-linear" className="size-4" />
                    </Button>
                  </div>
                </motion.div>
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

type SortedItem = { scholarship: Scholarship; matches: boolean }

function chunkItems(items: SortedItem[], size: number): SortedItem[][] {
  const out: SortedItem[][] = []
  for (let i = 0; i < items.length; i += size)
    out.push(items.slice(i, i + size))
  return out
}

interface BentoBlockProps {
  items: SortedItem[]
  expandedId: string | null
  onExpand: (id: string) => void
}

function BentoBlock({ items, expandedId, onExpand }: BentoBlockProps) {
  const isDesktop = useMediaQuery("(min-width: 1024px)")

  const renderCard = (item: SortedItem, disableLayout = false) => (
    <ScholarshipCard
      scholarship={item.scholarship}
      dimmed={!item.matches}
      isExpanded={expandedId === item.scholarship.id}
      disableLayoutAnimation={disableLayout}
      onExpand={onExpand}
    />
  )

  const renderedCols = useMemo(() => {
    const distribute = (n: number): [number, number, number, number] => {
      if (n >= 10) return [2, 3, 3, 2]
      if (n === 9) return [2, 3, 2, 2]
      if (n === 8) return [2, 2, 2, 2]
      if (n === 7) return [2, 2, 2, 1]
      if (n === 6) return [2, 2, 1, 1]
      if (n === 5) return [2, 1, 1, 1]
      if (n === 4) return [1, 1, 1, 1]
      if (n === 3) return [1, 1, 1, 0]
      if (n === 2) return [1, 1, 0, 0]
      if (n === 1) return [1, 0, 0, 0]
      return [0, 0, 0, 0]
    }
    const capacities = distribute(items.length)

    const fillOrder: number[] = []
    for (let c = 0; c < 4; c++) if (capacities[c] >= 1) fillOrder.push(c)
    for (let c = 0; c < 4; c++) if (capacities[c] >= 3) fillOrder.push(c)
    for (let c = 0; c < 4; c++) if (capacities[c] >= 2) fillOrder.push(c)

    const cols: SortedItem[][] = [[], [], [], []]
    items.forEach((item, i) => {
      cols[fillOrder[i]].push(item)
    })
    return cols
      .map((col, idx) => ({ col, idx }))
      .filter(({ col }) => col.length > 0)
  }, [items])

  if (isDesktop === null) {
    return <div className="min-h-205" />
  }

  if (!isDesktop) {
    return (
      <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2">
        {items.map((item) => (
          <div key={item.scholarship.id} className="aspect-3/4 w-full">
            {renderCard(item, true)}
          </div>
        ))}
      </div>
    )
  }

  const isFullChunk = items.length >= BENTO_CHUNK
  const heightClass = isFullChunk ? "min-h-[820px]" : "min-h-[400px]"

  return (
    <div className={cn("flex gap-4 items-stretch", heightClass)}>
      {renderedCols.map(({ col, idx }) => {
        const isOuter = idx === 0 || idx === 3
        const colClass = isOuter
          ? "flex w-[230px] shrink-0 flex-col gap-4 xl:w-[325px]"
          : "flex flex-1 min-w-0 flex-col gap-4"
        return (
          <div key={idx} className={colClass}>
            {col.map((item) => (
              <div key={item.scholarship.id} className="flex-1 min-h-0">
                {renderCard(item)}
              </div>
            ))}
          </div>
        )
      })}
    </div>
  )
}
