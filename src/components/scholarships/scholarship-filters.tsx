"use client"

import { useMemo, useRef, useState } from "react";
import { motion, LayoutGroup } from "motion/react"
import { Icon } from "@iconify/react"
import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"
import {
  EDUCATION_LEVELS,
  type Scholarship,
} from "@/data/scholarships";
import { Button } from "@/components/ui/button/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu/dropdown-menu";
import { Input } from "@/components/ui/input/input"
import { ScholarshipFiltersMobile } from "./scholarship-filters-mobile";
import { FilterSheet } from "./filter-sheet";
import { MonthDropdown } from "./month-dropdown";
import {
  type ScholarshipFiltersValue,
} from "@/hooks/use-scholarship-filters"
import { computeMonthCounts } from "@/lib/scholarship-utils"

export type GridLayout = "grid" | "list"

interface ScholarshipFiltersProps {
  filters: ScholarshipFiltersValue
  resultCount: number
  seasonalScholarships: Scholarship[]
}

export function ScholarshipFilters({
  filters,
  resultCount,
  seasonalScholarships,
}: ScholarshipFiltersProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchOpen, setSearchOpen] = useState(false);

  const isMobile = useMediaQuery("(max-width: 1023px)");

  const monthCounts = useMemo(
    () => computeMonthCounts(seasonalScholarships),
    [seasonalScholarships],
  );

  if (isMobile === null) {
    return <div className="min-h-24" />;
  }

  if (isMobile) {
    return (
      <ScholarshipFiltersMobile
        filters={filters}
        resultCount={resultCount}
        seasonalScholarships={seasonalScholarships}
      />
    );
  }

  return (
    <div className="flex flex-col">
      {/* Row 1: Education level tabs + Search */}
      <div className="flex items-center justify-between gap-4 pb-3 shadow-[0_1px_0_0_rgba(32,26,25,0.05)]">
        {/* Left: Education level tabs */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
          <LayoutGroup>
            <div
              className="flex items-center gap-1 py-2"
              role="group"
              aria-label="Filter by education level"
            >
              {EDUCATION_LEVELS.map((level) => {
                const isActive = filters.activeFilter === level;
                const count = filters.levelCounts[level];
                return (
                  <div key={level} className="relative">
                    {isActive && (
                      <motion.span
                        layoutId="scholarship-filter-highlight"
                        className="absolute inset-0 rounded-full bg-primary"
                        transition={{
                          type: "spring",
                          stiffness: 350,
                          damping: 30,
                        }}
                      />
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      noRipple={isActive}
                      onClick={() => filters.setActiveFilter(level)}
                      aria-pressed={isActive}
                      className={cn(
                        "relative z-1 text-sm md:text-base shadow-none",
                        isActive
                          ? "text-primary-foreground hover:text-primary-foreground hover:bg-transparent dark:hover:bg-transparent"
                          : "text-on-surface/60 hover:text-primary-400",
                      )}
                    >
                      {level}
                      <span
                        className={cn(
                          "ml-1 inline-flex size-6 items-center justify-center rounded-full text-[10px] font-medium",
                          isActive
                            ? "bg-white/30 text-on-primary dark:bg-white/20"
                            : "bg-on-surface/8 text-on-surface/50",
                        )}
                      >
                        {count}
                      </span>
                    </Button>
                  </div>
                );
              })}
            </div>
          </LayoutGroup>
        </div>

        {/* Right: Collapsible search */}
        <div className="shrink-0">
          <motion.div
            role="search"
            aria-label="Search scholarships"
            initial={false}
            animate={{ width: searchOpen ? 240 : 36 }}
            transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
            className={cn(
              "flex h-9 shrink-0 items-center overflow-hidden rounded-full border border-outline-variant/30",
              searchOpen
                ? "gap-2 bg-white/20 px-2.5 dark:bg-white/5"
                : "justify-center bg-surface-container-low/50",
            )}
          >
            <button
              type="button"
              aria-label={searchOpen ? "Collapse search" : "Expand search"}
              aria-expanded={searchOpen}
              aria-controls="scholarship-search-input"
              onClick={() => {
                if (searchOpen) {
                  filters.setSearchQuery("");
                  setSearchOpen(false);
                  inputRef.current?.blur();
                } else {
                  setSearchOpen(true);
                  requestAnimationFrame(() => inputRef.current?.focus());
                }
              }}
              className="flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-full outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
            >
              <Icon
                icon="solar:magnifer-linear"
                className={cn(
                  "size-4.5 transition-colors",
                  searchOpen
                    ? "text-on-surface/50 dark:text-white/50"
                    : "text-on-surface/60 dark:text-white/50",
                )}
              />
            </button>
            <div
              className={cn(
                "flex min-w-0 items-center overflow-hidden",
                searchOpen ? "flex-1" : "invisible w-0",
              )}
            >
              <Input
                ref={inputRef}
                id="scholarship-search-input"
                type="search"
                value={filters.searchQuery}
                onChange={(e) => filters.setSearchQuery(e.target.value)}
                onFocus={() => setSearchOpen(true)}
                onBlur={() => {
                  if (!filters.searchQuery) setSearchOpen(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    filters.setSearchQuery("");
                    inputRef.current?.blur();
                  }
                }}
                placeholder="Search..."
                aria-label="Search scholarships"
                aria-hidden={!searchOpen}
                tabIndex={searchOpen ? 0 : -1}
                className="h-auto border-0 bg-transparent px-0 py-0 ring-0 focus-visible:border-0 focus-visible:ring-0"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Row 2: Layout toggle (left) + Month + Sort + Filters (right) */}
      <div className="flex items-center justify-between pt-3">
        {/* Left: Layout toggle */}
        <div className="flex items-center gap-1 rounded-full bg-muted/80 p-1 dark:bg-white/10">
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Grid layout"
            aria-pressed={filters.layout === "grid"}
            onClick={() => filters.setLayout("grid")}
            className={cn(
              "rounded-full",
              filters.layout === "grid"
                ? "bg-white/60 text-on-surface dark:bg-white/20"
                : "text-on-surface/60 hover:text-on-surface",
            )}
          >
            <Icon icon="solar:widget-3-line-duotone" className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="List layout"
            aria-pressed={filters.layout === "list"}
            onClick={() => filters.setLayout("list")}
            className={cn(
              "rounded-full",
              filters.layout === "list"
                ? "bg-white/60 text-on-surface dark:bg-white/20"
                : "text-on-surface/60 hover:text-on-surface",
            )}
          >
            <Icon icon="solar:hamburger-menu-line-duotone" className="size-4" />
          </Button>
        </div>

        {/* Right: Month + Sort + Filters */}
        <div className="flex items-center gap-2">
          <MonthDropdown
            month={filters.month}
            onMonthChange={filters.setMonth}
            monthCounts={monthCounts}
            totalCount={seasonalScholarships.length}
            variant="outline"
            triggerClassName="shrink-0 rounded-full"
          />
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="outline"
                  size="sm"
                  className="shrink-0 rounded-full"
                >
                  Sort
                  <Icon
                    data-icon="inline-end"
                    icon="solar:sort-vertical-linear"
                    className="size-4"
                  />
                </Button>
              }
            />
            <DropdownMenuContent align="end" sideOffset={6}>
              <DropdownMenuGroup>
                <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                <DropdownMenuRadioGroup
                  value={filters.sortBy}
                  onValueChange={filters.setSortBy}
                >
                  <DropdownMenuRadioItem value="deadline">
                    Deadline
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="amount">
                    Amount
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <FilterSheet
            selectedTags={filters.selectedTags}
            onTagsChange={filters.setSelectedTags}
            awardRange={filters.awardRange}
            onAwardRangeChange={filters.setAwardRange}
            seasonalScholarships={seasonalScholarships}
            filteredCount={resultCount}
          />
        </div>
      </div>
    </div>
  );
}
