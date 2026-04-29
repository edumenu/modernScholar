"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Icon } from "@iconify/react"
import { useLenis } from "lenis/react"
import { cn } from "@/lib/utils"
import {
  EDUCATION_LEVELS,
  type EducationLevelFilter,
} from "@/data/scholarships"
import { Button } from "@/components/ui/button/button"
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet/sheet"
import { Input } from "@/components/ui/input/input"
import type { GridLayout } from "./scholarship-filters"

const SORT_OPTIONS = [
  { value: "deadline", label: "Deadline" },
  { value: "amount", label: "Amount" },
] as const

interface ScholarshipFiltersMobileProps {
  activeFilter: EducationLevelFilter
  onFilterChange: (level: EducationLevelFilter) => void
  layout: GridLayout
  onLayoutChange: (layout: GridLayout) => void
  searchQuery: string
  onSearchChange: (query: string) => void
  sortBy: string
  onSortByChange: (sort: string) => void
  resultCount: number
}

export function ScholarshipFiltersMobile({
  activeFilter,
  onFilterChange,
  layout,
  onLayoutChange,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortByChange,
  resultCount,
}: ScholarshipFiltersMobileProps) {
  const [sheetOpen, setSheetOpen] = useState(false)
  const lenis = useLenis()

  useEffect(() => {
    if (!lenis || !sheetOpen) return
    lenis.stop()
    return () => {
      lenis.start()
    }
  }, [sheetOpen, lenis])

  const hasActiveFilters =
    activeFilter !== "All" || sortBy !== "deadline"

  const filterBadgeCount =
    (activeFilter !== "All" ? 1 : 0) +
    (sortBy !== "deadline" ? 1 : 0)

  const clearFilters = () => {
    onFilterChange("All")
    onSortByChange("deadline")
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Full-width search bar */}
      <div className="flex items-center gap-2 rounded-full border border-outline-variant/30 bg-white/20 px-3 py-2 focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/20 dark:bg-white/5">
        <Icon
          icon="solar:magnifer-linear"
          className="size-4.5 shrink-0 text-on-surface/50 dark:text-white/50"
        />
        <Input
          type="search"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Escape") onSearchChange("")
          }}
          placeholder="Search scholarships"
          aria-label="Search scholarships"
          className="h-auto border-0 bg-transparent px-0 py-0 ring-0 focus-visible:border-0 focus-visible:ring-0"
        />
      </div>

      {/* Layout toggle + Filters button */}
      <div className="flex w-full items-center justify-between pt-2">
        <div className="flex items-center gap-1 rounded-full bg-white/30 p-1 dark:bg-white/10">
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Bento layout"
            aria-pressed={layout === "bento"}
            onClick={() => onLayoutChange("bento")}
            className={cn(
              "rounded-full",
              layout === "bento"
                ? "bg-white/60 text-on-surface dark:bg-white/20"
                : "text-on-surface/60 hover:text-on-surface",
            )}
          >
            <Icon icon="solar:widget-4-line-duotone" className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Grid layout"
            aria-pressed={layout === "uniform"}
            onClick={() => onLayoutChange("uniform")}
            className={cn(
              "rounded-full",
              layout === "uniform"
                ? "bg-white/60 text-on-surface dark:bg-white/20"
                : "text-on-surface/60 hover:text-on-surface",
            )}
          >
            <Icon icon="solar:widget-3-line-duotone" className="size-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-sm text-on-surface/50 underline-offset-2 hover:text-on-surface hover:underline"
            >
              Clear
            </button>
          )}
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="sm"
                  className="shrink-0 rounded-full bg-surface-container-low/80 text-on-surface hover:bg-surface-container dark:bg-surface-container-low/80 dark:hover:bg-surface-container"
                />
              }
            >
              Filters
              {hasActiveFilters && (
                <span className="flex size-5 items-center justify-center rounded-full bg-primary text-[11px] font-medium text-on-primary">
                  {filterBadgeCount}
                </span>
              )}
              <Icon
                data-icon="inline-end"
                icon="solar:filter-line-duotone"
                className="size-4"
              />
            </SheetTrigger>
            <SheetContent
              side="bottom"
              className="max-h-[85vh] overflow-y-auto rounded-t-2xl"
            >
              <SheetHeader className="flex-row items-center justify-between pr-12">
                <SheetTitle>Filters</SheetTitle>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="text-sm font-medium text-primary underline-offset-2 hover:underline"
                  >
                    Clear All
                  </button>
                )}
              </SheetHeader>

              <div className="flex flex-col gap-6 px-6 pb-6">
                {/* Education level chips */}
                <div>
                  <h3 className="mb-3 text-sm font-medium text-on-surface/70">
                    Education Level
                  </h3>
                  <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter by education level">
                    {EDUCATION_LEVELS.map((level) => {
                      const isActive = activeFilter === level
                      return (
                        <Button
                          key={level}
                          variant={isActive ? "default" : "ghost"}
                          size="sm"
                          role="tab"
                          aria-selected={isActive}
                          onClick={() => {
                            onFilterChange(level)
                            setSheetOpen(false)
                          }}
                          className={cn(
                            "rounded-full",
                            isActive
                              ? "bg-primary/30 shadow-none dark:bg-primary"
                              : "bg-white/20 text-on-surface/60 dark:bg-white/10",
                          )}
                        >
                          {level}
                        </Button>
                      )
                    })}
                  </div>
                </div>

                {/* Sort options */}
                <div>
                  <h3 className="mb-3 text-sm font-medium text-on-surface/70">
                    Sort By
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {SORT_OPTIONS.map(({ value, label }) => {
                      const isActive = sortBy === value
                      return (
                        <button
                          key={value}
                          type="button"
                          onClick={() => onSortByChange(value)}
                          className={cn(
                            "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                            isActive
                              ? "bg-primary text-on-primary"
                              : "bg-white/20 text-on-surface/60 hover:bg-white/30 dark:bg-white/10 dark:hover:bg-white/15",
                          )}
                        >
                          {label}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>

              <SheetFooter>
                <SheetClose render={<Button className="w-full" />}>
                  Apply Filters
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Result count feedback */}
      <AnimatePresence>
        {(searchQuery || hasActiveFilters) && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="text-sm text-on-surface-variant"
          >
            {resultCount} {resultCount === 1 ? "scholarship" : "scholarships"}{" "}
            found
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}
