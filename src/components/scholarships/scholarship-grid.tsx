"use client"

import { useState, useCallback, useEffect, useMemo } from "react"
import { AnimatePresence, motion } from "motion/react"
import { useLenis } from "lenis/react"
import { Icon } from "@iconify/react"
import Image from "next/image"
import {
  useQueryState,
  parseAsInteger,
  parseAsString,
  parseAsArrayOf,
} from "nuqs";
import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"
import {
  scholarships as allScholarships,
  type Scholarship,
  type ScholarshipCategory,
  type ScholarshipTag,
} from "@/data/scholarships";
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
import { Button } from "@/components/ui/button/button";

/* ── Helpers ─────────────────────────────────────────────── */

type TagFilters = Record<"featured" | "popular" | "new" | "topPick", boolean>

const TAG_KEY_TO_LABEL: Record<string, ScholarshipTag> = {
  featured: "Featured",
  popular: "Popular",
  new: "New",
  topPick: "Top Pick",
}

/** Parse "$10,000" → 10000 */
function parseAmount(amount: string): number {
  return Number(amount.replace(/[^0-9.]/g, "")) || 0
}

/** Parse "April 30, 2026" → Date */
function parseDeadline(deadline: string): number {
  return new Date(deadline).getTime() || 0
}

/** Full filtering pipeline: search → tags → category, then sort */
export function filterAndSort(
  items: Scholarship[],
  category: ScholarshipCategory,
  searchQuery: string,
  tagFilters: TagFilters,
  sortBy: string,
): { scholarship: Scholarship; matches: boolean }[] {
  const query = searchQuery.toLowerCase().trim();

  // Determine active tag keys
  const activeTags = Object.entries(tagFilters)
    .filter(([, v]) => v)
    .map(([k]) => TAG_KEY_TO_LABEL[k]);

  // Apply search + tag filters to get the filtered set
  const filtered = items.filter((s) => {
    // Text search across title, provider, description, category
    if (query) {
      const haystack =
        `${s.title} ${s.provider} ${s.description ?? ""} ${s.category}`.toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    // Tag filter (any active tag must match)
    if (activeTags.length > 0 && (!s.tag || !activeTags.includes(s.tag))) {
      return false;
    }
    return true;
  });

  // Sort
  if (sortBy === "amount") {
    filtered.sort((a, b) => parseAmount(b.amount) - parseAmount(a.amount));
  } else if (sortBy === "rating") {
    filtered.sort((a, b) => b.rating - a.rating);
  } else {
    // deadline (default): soonest first
    filtered.sort(
      (a, b) => parseDeadline(a.deadline) - parseDeadline(b.deadline),
    );
  }

  // Category: matching first, non-matching dimmed
  if (category === "All") {
    return filtered.map((s) => ({ scholarship: s, matches: true }));
  }

  const matching = filtered.filter((s) => s.category === category);
  const nonMatching = filtered.filter((s) => s.category !== category);
  return [
    ...matching.map((s) => ({ scholarship: s, matches: true })),
    ...nonMatching.map((s) => ({ scholarship: s, matches: false })),
  ];
}

const PAGE_SIZE = 15;

/** Bento blocks render 10 cards in the Figma 4-column pattern. */
const BENTO_CHUNK = 10

/* ── Main Component ──────────────────────────────────────── */

export function ScholarshipGrid() {
  const [activeFilter, setActiveFilter] = useState<ScholarshipCategory>("All")
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [layout, setLayout] = useState<GridLayout>("bento");

  // URL-persisted state
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [searchQuery, setSearchQuery] = useQueryState(
    "q",
    parseAsString.withDefault(""),
  );
  const [sortBy, setSortBy] = useQueryState(
    "sort",
    parseAsString.withDefault("deadline"),
  );
  const [tagsParam, setTagsParam] = useQueryState(
    "tags",
    parseAsArrayOf(parseAsString).withDefault([]),
  );

  // Derive tagFilters object from URL array
  const tagFilters: TagFilters = useMemo(
    () => ({
      featured: tagsParam.includes("featured"),
      popular: tagsParam.includes("popular"),
      new: tagsParam.includes("new"),
      topPick: tagsParam.includes("topPick"),
    }),
    [tagsParam],
  );

  const setTagFilters = useCallback(
    (updater: TagFilters | ((prev: TagFilters) => TagFilters)) => {
      const next =
        typeof updater === "function" ? updater(tagFilters) : updater;
      const arr = Object.entries(next)
        .filter(([, v]) => v)
        .map(([k]) => k);
      setTagsParam(arr.length > 0 ? arr : null);
    },
    [tagFilters, setTagsParam],
  );

  const lenis = useLenis()

  const sortedItems = useMemo(
    () =>
      filterAndSort(
        allScholarships,
        activeFilter,
        searchQuery,
        tagFilters,
        sortBy,
      ),
    [activeFilter, searchQuery, tagFilters, sortBy],
  );

  const totalPages = Math.max(1, Math.ceil(sortedItems.length / PAGE_SIZE));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const visibleItems = sortedItems.slice(start, start + PAGE_SIZE);
  const expandedScholarship = expandedId
    ? (allScholarships.find((s) => s.id === expandedId) ?? null)
    : null;

  // Normalize URL if requested page is out of range
  useEffect(() => {
    if (page !== safePage) {
      setPage(safePage === 1 ? null : safePage);
    }
  }, [page, safePage, setPage]);

  // Reset page when filters change
  const handleSearchChange = useCallback(
    (q: string) => {
      setSearchQuery(q || null);
      setPage(null);
    },
    [setSearchQuery, setPage],
  );

  const handleSortChange = useCallback(
    (sort: string) => {
      setSortBy(sort === "deadline" ? null : sort);
      setPage(null);
    },
    [setSortBy, setPage],
  );

  // Recalculate Lenis scroll height whenever visible content changes
  useEffect(() => {
    if (!lenis) return;
    const timer = setTimeout(() => lenis.resize(), 100);
    return () => clearTimeout(timer);
  }, [safePage, activeFilter, layout, lenis, searchQuery, sortBy, tagsParam]);

  const handleFilterChange = useCallback(
    (category: ScholarshipCategory) => {
      if (expandedId) {
        setExpandedId(null)
        requestAnimationFrame(() => {
          setActiveFilter(category)
          setPage(null)
        })
      } else {
        setActiveFilter(category)
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
    setExpandedId(id)
  }, [])

  const handleClose = useCallback(() => {
    setExpandedId(null)
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
    setActiveFilter("All");
    setSearchQuery(null);
    setSortBy(null);
    setTagsParam(null);
    setPage(null);
  }, [setSearchQuery, setSortBy, setTagsParam, setPage]);

  const resultCount = sortedItems.filter((i) => i.matches).length;

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
        tagFilters={tagFilters}
        onTagFiltersChange={setTagFilters}
        sortBy={sortBy}
        onSortByChange={handleSortChange}
        resultCount={resultCount}
      />

      {/* Empty state */}
      {sortedItems.length === 0 ? (
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
            Try adjusting your search, filters, or category to discover more
            opportunities.
          </p>
          <Button variant="outline" size="sm" onClick={clearAllFilters}>
            Clear all filters
          </Button>
        </motion.div>
      ) : (
        <>
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
                        e.preventDefault();
                        if (safePage > 1) goToPage(safePage - 1);
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
                            e.preventDefault();
                            goToPage(p);
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
                        e.preventDefault();
                        if (safePage < totalPages) goToPage(safePage + 1);
                      }}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}

      {/* Expanded Card Overlay */}
      <AnimatePresence>
        {expandedScholarship && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              onClick={handleClose}
              aria-hidden="true"
            />

            <div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
              role="dialog"
              aria-modal="true"
              aria-label={expandedScholarship.title}
              onClick={handleClose}
              onKeyDown={(e) => {
                if (e.key === "Tab") {
                  // Basic focus trap: keep focus within modal
                  const modal = e.currentTarget.querySelector<HTMLElement>(
                    "[data-modal-content]",
                  );
                  if (!modal) return;
                  const focusable = modal.querySelectorAll<HTMLElement>(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
                  );
                  if (focusable.length === 0) return;
                  const first = focusable[0];
                  const last = focusable[focusable.length - 1];
                  if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                  } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                  }
                }
              }}
            >
              <motion.div
                data-modal-content
                onClick={(e) => e.stopPropagation()}
                layoutId={`card-${expandedScholarship.id}`}
                className={cn(
                  "relative flex w-full max-w-3xl flex-col overflow-hidden rounded-3xl",
                  "bg-background shadow-xl dark:shadow-2xl",
                  "max-h-[85vh]",
                )}
              >
                {/* Image section */}
                <div className="relative min-h-48 w-full shrink-0 sm:min-h-100">
                  <Image
                    src={expandedScholarship.image}
                    alt={expandedScholarship.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 800px"
                    priority
                  />

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
                    <div className="flex items-center gap-2">
                      {expandedScholarship.tag && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white shadow-[2px_2px_4px_rgba(0,0,0,0.1),-1px_-1px_3px_rgba(255,255,255,0.1)]">
                          <Icon icon="solar:star-bold" className="size-3.5" />
                          {expandedScholarship.tag}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1.5 text-sm font-medium text-white shadow-[2px_2px_4px_rgba(0,0,0,0.1),-1px_-1px_3px_rgba(255,255,255,0.1)]">
                        {expandedScholarship.rating}
                        <Icon
                          icon="solar:star-bold"
                          className="size-3 text-amber-300"
                        />
                      </span>
                    </div>

                    <h2 className="font-heading text-3xl font-medium leading-tight text-white md:text-4xl lg:text-5xl">
                      {expandedScholarship.title}
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
                      {expandedScholarship.amount}
                    </span>
                    <span>&middot;</span>
                    <span>Deadline: {expandedScholarship.deadline}</span>
                  </div>

                  <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-secondary/15 px-4 py-1.5 text-sm font-medium text-secondary">
                    {expandedScholarship.category}
                  </span>

                  {/* CTA row */}
                  <div className="flex items-center gap-3 border-t border-outline-variant/30 pt-4 dark:border-white/10">
                    <Button size="default" className="flex-1 sm:flex-none">
                      Apply Now
                      <Icon
                        icon="solar:arrow-right-linear"
                        data-icon="inline-end"
                      />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon-sm"
                      aria-label="Save scholarship"
                    >
                      <Icon icon="solar:bookmark-linear" className="size-4" />
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
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Utilities ────────────────────────────────────────────── */

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
    out.push(items.slice(i, i + size));
  return out
}

interface BentoBlockProps {
  items: SortedItem[]
  expandedId: string | null
  onExpand: (id: string) => void
}

function BentoBlock({ items, expandedId, onExpand }: BentoBlockProps) {
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const renderCard = (item: SortedItem, disableLayout = false) => (
    <ScholarshipCard
      scholarship={item.scholarship}
      dimmed={!item.matches}
      isExpanded={expandedId === item.scholarship.id}
      disableLayoutAnimation={disableLayout}
      onExpand={onExpand}
    />
  );

  const renderedCols = useMemo(() => {
    const distribute = (n: number): [number, number, number, number] => {
      if (n >= 10) return [2, 3, 3, 2];
      if (n === 9) return [2, 3, 2, 2];
      if (n === 8) return [2, 2, 2, 2];
      if (n === 7) return [2, 2, 2, 1];
      if (n === 6) return [2, 2, 1, 1];
      if (n === 5) return [2, 1, 1, 1];
      if (n === 4) return [1, 1, 1, 1];
      if (n === 3) return [1, 1, 1, 0];
      if (n === 2) return [1, 1, 0, 0];
      if (n === 1) return [1, 0, 0, 0];
      return [0, 0, 0, 0];
    };
    const capacities = distribute(items.length);

    const fillOrder: number[] = [];
    for (let c = 0; c < 4; c++) if (capacities[c] >= 1) fillOrder.push(c);
    for (let c = 0; c < 4; c++) if (capacities[c] >= 3) fillOrder.push(c);
    for (let c = 0; c < 4; c++) if (capacities[c] >= 2) fillOrder.push(c);

    const cols: SortedItem[][] = [[], [], [], []];
    items.forEach((item, i) => {
      cols[fillOrder[i]].push(item);
    });
    return cols
      .map((col, idx) => ({ col, idx }))
      .filter(({ col }) => col.length > 0);
  }, [items]);

  // SSR placeholder
  if (isDesktop === null) {
    return <div className="min-h-205" />;
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
    );
  }

  // Content-aware height: full chunk gets more height, partial gets less
  const isFullChunk = items.length >= BENTO_CHUNK;
  const heightClass = isFullChunk ? "min-h-[820px]" : "min-h-[400px]";

  return (
    <div className={cn("flex gap-4 items-stretch", heightClass)}>
      {renderedCols.map(({ col, idx }) => {
        const isOuter = idx === 0 || idx === 3;
        const colClass = isOuter
          ? "flex w-[230px] shrink-0 flex-col gap-4 xl:w-[325px]"
          : "flex flex-1 min-w-0 flex-col gap-4";
        return (
          <div key={idx} className={colClass}>
            {col.map((item) => (
              <div key={item.scholarship.id} className="flex-1 min-h-0">
                {renderCard(item)}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
