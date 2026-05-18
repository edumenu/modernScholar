"use client"

import { useMemo, useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Icon } from "@iconify/react"
import { cn } from "@/lib/utils"
import { useScrollLock } from "@/hooks/use-scroll-lock"
import {
  ELIGIBILITY_FLAT_TAGS,
  ELIGIBILITY_CATEGORIES,
  getEligibilityCategory,
  type EligibilityCategory,
  type Tag,
} from "@/lib/eligibility"
import {
  EDUCATION_LEVELS,
  type Scholarship,
} from "@/data/scholarships"
import { Button } from "@/components/ui/button/button"
import { Checkbox } from "@/components/ui/checkbox/checkbox"
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
import { AWARD_MIN, AWARD_MAX } from "@/data/scholarships"
import { AwardRangeFilter } from "./award-range-filter"
import { MonthDropdown } from "./month-dropdown"
import {
  type ScholarshipFiltersValue,
} from "@/hooks/use-scholarship-filters"
// import { computeMonthCounts } from "@/lib/scholarship-utils"

const SORT_OPTIONS = [
  { value: "deadline", label: "Deadline" },
  { value: "amount", label: "Amount" },
] as const

interface ScholarshipFiltersMobileProps {
  filters: ScholarshipFiltersValue;
  resultCount: number;
  // seasonalScholarships: Scholarship[]
}

export function ScholarshipFiltersMobile({
  filters,
  resultCount,
  // seasonalScholarships,
}: ScholarshipFiltersMobileProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] =
    useState<EligibilityCategory | null>(null);

  useScrollLock(sheetOpen);

  // const monthCounts = useMemo(
  //   () => computeMonthCounts(seasonalScholarships),
  //   [seasonalScholarships],
  // )

  const isAwardRangeActive =
    filters.awardRange[0] !== AWARD_MIN || filters.awardRange[1] !== AWARD_MAX;
  const hasSearch = filters.searchQuery.trim().length > 0;
  const hasMonth = filters.month !== "all";
  // Includes month so the "Clear" link is reachable when month is the only
  // active filter. Filter sheet's badge stays month-exclusive on purpose —
  // month lives outside the sheet, alongside Sort/Filters.
  const hasActiveFilters =
    hasSearch ||
    filters.activeFilter !== "All" ||
    filters.sortBy !== "deadline" ||
    filters.selectedTags.length > 0 ||
    isAwardRangeActive ||
    hasMonth;

  const filterBadgeCount =
    (hasSearch ? 1 : 0) +
    (filters.activeFilter !== "All" ? 1 : 0) +
    (filters.sortBy !== "deadline" ? 1 : 0) +
    filters.selectedTags.length +
    (isAwardRangeActive ? 1 : 0);

  const clearFilters = () => {
    filters.clearAll();
  };

  const toggleTag = (tag: string) => {
    // Caller passes the constructed `${category}:${subOption}` literal — narrow
    // back to Tag at this boundary; ELIGIBILITY_CATEGORIES guarantees validity.
    const t = tag as Tag;
    if (filters.selectedTags.includes(t)) {
      filters.setSelectedTags(filters.selectedTags.filter((x) => x !== t));
    } else {
      filters.setSelectedTags([...filters.selectedTags, t]);
    }
  };

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
          value={filters.searchQuery}
          onChange={(e) => filters.setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Escape") filters.setSearchQuery("");
          }}
          placeholder="Search scholarships"
          aria-label="Search scholarships"
          className="h-auto border-0 bg-transparent px-0 py-0 ring-0 focus-visible:border-0 focus-visible:ring-0"
        />
      </div>

      {/* Layout toggle + Month dropdown + Filters button */}
      <div className="flex w-full items-center justify-between pt-2">
        <div className="flex items-center gap-1 rounded-full bg-white/30 p-1 dark:bg-white/10">
          <Button
            variant="ghost"
            size="icon"
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
            size="icon"
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

        <div className="flex items-center gap-1.5 sm:gap-2">
          <MonthDropdown
            month={filters.month}
            onMonthChange={filters.setMonth}
            // monthCounts={monthCounts}
            // totalCount={seasonalScholarships.length}
            variant="ghost"
            triggerClassName="shrink-0 rounded-full bg-surface-container-low/80 text-on-surface hover:bg-surface-container dark:bg-surface-container-low/80 dark:hover:bg-surface-container"
          />
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
                  size="default"
                  aria-label="Filters"
                  className="shrink-0 rounded-full bg-surface-container-low/80 text-on-surface hover:bg-surface-container dark:bg-surface-container-low/80 dark:hover:bg-surface-container"
                />
              }
            >
              {/* Word hides below 360px so the row fits a 320px viewport without
                  overflow. Icon + count badge keep the trigger discoverable. */}
              <span className="max-[359px]:hidden">Filters</span>
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
                  <div
                    className="flex flex-wrap gap-2"
                    role="group"
                    aria-label="Filter by education level"
                  >
                    {EDUCATION_LEVELS.map((level) => {
                      const isActive = filters.activeFilter === level;
                      return (
                        <Button
                          key={level}
                          variant={isActive ? "default" : "ghost"}
                          size="sm"
                          aria-pressed={isActive}
                          onClick={() => {
                            filters.setActiveFilter(level);
                            setSheetOpen(false);
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
                      );
                    })}
                  </div>
                </div>

                {/* Award Amount Slider */}
                <AwardRangeFilter
                  value={filters.awardRange}
                  onValueChange={filters.setAwardRange}
                />

                {/* Eligibility tags */}
                <div>
                  <h3 className="mb-3 text-sm font-medium text-on-surface/70">
                    Eligibility
                  </h3>
                  {/* Flat tags as checkboxes */}
                  <div
                    className="flex flex-col gap-1"
                    role="group"
                    aria-label="Filter by eligibility"
                  >
                    {ELIGIBILITY_FLAT_TAGS.map((tag) => (
                      <div key={tag} className="rounded-lg px-1 py-1.5">
                        <Checkbox
                          checked={filters.selectedTags.includes(tag)}
                          onCheckedChange={() => toggleTag(tag)}
                        >
                          {tag}
                        </Checkbox>
                      </div>
                    ))}
                  </div>

                  {/* Category accordions */}
                  <div className="mt-3 flex flex-col gap-1">
                    {(
                      Object.keys(
                        ELIGIBILITY_CATEGORIES,
                      ) as EligibilityCategory[]
                    ).map((category) => {
                      const subOptions = ELIGIBILITY_CATEGORIES[category];
                      const isExpanded = expandedCategory === category;
                      const selectedInCategory = filters.selectedTags.filter(
                        (t) => getEligibilityCategory(t) === category,
                      ).length;

                      return (
                        <div key={category}>
                          <button
                            type="button"
                            aria-expanded={isExpanded}
                            aria-controls={`mobile-filter-category-${category.replace(/\//g, "-")}`}
                            onClick={() =>
                              setExpandedCategory((prev) =>
                                prev === category ? null : category,
                              )
                            }
                            className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-on-surface/70 transition-colors hover:bg-white/10"
                          >
                            <Icon
                              icon="solar:alt-arrow-right-line-duotone"
                              className={cn(
                                "size-4 transition-transform duration-200",
                                isExpanded && "rotate-90",
                              )}
                            />
                            <span className="flex-1 text-left">{category}</span>
                            {selectedInCategory > 0 && (
                              <span className="flex size-5 items-center justify-center rounded-full bg-primary text-[11px] font-medium text-on-primary">
                                {selectedInCategory}
                              </span>
                            )}
                          </button>
                          <AnimatePresence initial={false}>
                            {isExpanded && (
                              <motion.div
                                id={`mobile-filter-category-${category.replace(/\//g, "-")}`}
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{
                                  duration: 0.22,
                                  ease: [0.4, 0, 0.2, 1],
                                }}
                                className="overflow-hidden"
                              >
                                <div className="flex flex-col gap-1 px-6 pb-2 pt-1">
                                  {subOptions.map((subOption) => {
                                    // See toggleTag note: template-literal cast narrows to Tag.
                                    const fullTag =
                                      `${category}:${subOption}` as Tag;
                                    return (
                                      <div
                                        key={fullTag}
                                        className="rounded-lg py-1"
                                      >
                                        <Checkbox
                                          checked={filters.selectedTags.includes(
                                            fullTag,
                                          )}
                                          onCheckedChange={() =>
                                            toggleTag(fullTag)
                                          }
                                        >
                                          {subOption}
                                        </Checkbox>
                                      </div>
                                    );
                                  })}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
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
                      const isActive = filters.sortBy === value;
                      return (
                        <button
                          key={value}
                          type="button"
                          onClick={() => filters.setSortBy(value)}
                          className={cn(
                            "min-h-11 rounded-full px-5 py-3 text-sm font-medium transition-colors",
                            isActive
                              ? "bg-primary text-on-primary"
                              : "bg-white/20 text-on-surface/60 hover:bg-white/30 dark:bg-white/10 dark:hover:bg-white/15",
                          )}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <SheetFooter>
                <SheetClose render={<Button className="w-full" />}>
                  Done
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Result count feedback */}
      <AnimatePresence>
        {(filters.searchQuery || hasActiveFilters) && (
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
  );
}
