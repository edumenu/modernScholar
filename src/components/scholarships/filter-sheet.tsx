"use client"

import { useState, useMemo, useCallback } from "react"
import { Icon } from "@iconify/react"
import { motion, AnimatePresence } from "motion/react"
import { cn } from "@/lib/utils"
import {
  ELIGIBILITY_FLAT_TAGS,
  ELIGIBILITY_CATEGORIES,
  getEligibilityTagLabel,
  getEligibilityCategory,
  type EligibilityCategory,
  type Tag,
} from "@/lib/eligibility"
import {
  AWARD_MIN,
  AWARD_MAX,
  isScholarshipActive,
  type EducationLevelFilter,
  type Scholarship,
} from "@/data/scholarships"
import { MONTH_LABELS, type Month } from "@/hooks/use-scholarship-filters"
import { SESSION_DATE } from "@/lib/session-date"
import { Button } from "@/components/ui/button/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet/sheet"
import { Checkbox } from "@/components/ui/checkbox/checkbox"
import { AwardRangeFilter } from "./award-range-filter"

interface FilterSheetProps {
  selectedTags: Tag[]
  onTagsChange: (tags: Tag[]) => void
  awardRange: [number, number]
  onAwardRangeChange: (range: [number, number]) => void
  seasonalScholarships: Scholarship[]
  filteredCount: number
}

export function FilterSheet({
  selectedTags,
  onTagsChange,
  awardRange,
  onAwardRangeChange,
  seasonalScholarships,
  filteredCount,
}: FilterSheetProps) {
  const [open, setOpen] = useState(false)
  const [expandedCategory, setExpandedCategory] = useState<EligibilityCategory | null>(null)

  const tagCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const s of seasonalScholarships) {
      if (!isScholarshipActive(s, SESSION_DATE)) continue
      for (const tag of s.eligibilityTags ?? []) {
        counts[tag] = (counts[tag] || 0) + 1
      }
    }
    return counts
  }, [seasonalScholarships])

  const toggleTag = (tag: Tag) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter((t) => t !== tag))
    } else {
      onTagsChange([...selectedTags, tag])
    }
  }

  const isAwardRangeActive = awardRange[0] !== AWARD_MIN || awardRange[1] !== AWARD_MAX
  const activeCount = selectedTags.length + (isAwardRangeActive ? 1 : 0)

  const clearAll = () => {
    onTagsChange([])
    onAwardRangeChange([AWARD_MIN, AWARD_MAX])
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="shrink-0 rounded-full"
        onClick={() => setOpen(true)}
      >
        Filters
        {activeCount > 0 && (
          <span className="flex size-5 items-center justify-center rounded-full bg-primary text-[11px] font-medium text-primary-foreground">
            {activeCount}
          </span>
        )}
        <Icon
          data-icon="inline-end"
          icon="solar:filter-line-duotone"
          className="size-4"
        />
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="right"
          overlayClassName="bg-black/20 backdrop-blur-none"
          className="data-[side=right]:sm:max-w-sm data-[side=right]:lg:max-w-md"
        >
          <SheetHeader>
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.1,
              }}
            >
              <SheetTitle className="font-heading text-lg">Filters</SheetTitle>
            </motion.div>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-6 pb-6">
            <div className="flex flex-col gap-6">
              {/* Award Amount Slider */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.32,
                  ease: [0.22, 1, 0.36, 1],
                  delay: 0.16,
                }}
              >
                <AwardRangeFilter
                  value={awardRange}
                  onValueChange={onAwardRangeChange}
                />
              </motion.div>

              {/* Separator */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, delay: 0.22 }}
                className="h-px bg-outline-variant/10"
              />

              {/* Eligibility: Flat tags */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.32,
                  ease: [0.22, 1, 0.36, 1],
                  delay: 0.24,
                }}
                className="flex flex-col gap-1"
              >
                <h3 className="mb-2 text-sm font-medium text-on-surface/70">
                  Eligibility
                </h3>
                {ELIGIBILITY_FLAT_TAGS.map((tag) => (
                  <div
                    key={tag}
                    className="flex items-center justify-between rounded-lg px-1 py-1.5 transition-colors hover:bg-surface-container-low/60"
                  >
                    <Checkbox
                      checked={selectedTags.includes(tag)}
                      onCheckedChange={() => toggleTag(tag)}
                    >
                      {tag}
                    </Checkbox>
                    {(tagCounts[tag] ?? 0) > 0 && (
                      <span className="text-xs tabular-nums text-on-surface/40">
                        {tagCounts[tag]}
                      </span>
                    )}
                  </div>
                ))}
              </motion.div>

              {/* Separator */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, delay: 0.3 }}
                className="h-px bg-outline-variant/10"
              />

              {/* Eligibility: Category accordions */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.32,
                  ease: [0.22, 1, 0.36, 1],
                  delay: 0.32,
                }}
                className="flex flex-col gap-1"
              >
                {(
                  Object.keys(ELIGIBILITY_CATEGORIES) as EligibilityCategory[]
                ).map((category) => {
                  const subOptions = ELIGIBILITY_CATEGORIES[category];
                  const isExpanded = expandedCategory === category;
                  const selectedInCategory = selectedTags.filter(
                    (t) => getEligibilityCategory(t) === category,
                  ).length;

                  return (
                    <div key={category}>
                      <button
                        type="button"
                        aria-expanded={isExpanded}
                        aria-controls={`filter-category-${category.replace(/\//g, "-")}`}
                        onClick={() =>
                          setExpandedCategory((prev) =>
                            prev === category ? null : category,
                          )
                        }
                        className={cn(
                          "flex w-full items-center gap-2.5 rounded-lg px-1 py-2 text-sm font-medium text-on-surface/80 outline-none transition-colors",
                          "hover:bg-surface-container-low/60 focus-visible:ring-[3px] focus-visible:ring-ring/50",
                        )}
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
                          <span className="flex size-5 items-center justify-center rounded-full bg-secondary/20 text-[10px] font-medium text-secondary-800 dark:bg-secondary/30 dark:text-secondary-200">
                            {selectedInCategory}
                          </span>
                        )}
                      </button>
                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <motion.div
                            id={`filter-category-${category.replace(/\//g, "-")}`}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{
                              duration: 0.22,
                              ease: [0.22, 1, 0.36, 1],
                            }}
                            className="overflow-hidden"
                          >
                            <div className="flex flex-col gap-1 pb-1 pl-6">
                              {subOptions.map((subOption) => {
                                // TS doesn't narrow template literals to a Tag literal-union member;
                                // ELIGIBILITY_CATEGORIES entries map to valid Tags by construction.
                                const fullTag =
                                  `${category}:${subOption}` as Tag;
                                return (
                                  <div
                                    key={fullTag}
                                    className="flex items-center justify-between rounded-lg px-1 py-1.5 transition-colors hover:bg-surface-container-low/60"
                                  >
                                    <Checkbox
                                      checked={selectedTags.includes(fullTag)}
                                      onCheckedChange={() => toggleTag(fullTag)}
                                    >
                                      {subOption}
                                    </Checkbox>
                                    {(tagCounts[fullTag] ?? 0) > 0 && (
                                      <span className="text-xs tabular-nums text-on-surface/40">
                                        {tagCounts[fullTag]}
                                      </span>
                                    )}
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
              </motion.div>
            </div>
          </div>

          {/* Sticky footer with live count */}
          <SheetFooter className="border-t border-outline-variant/10">
            <div className="flex w-full items-center justify-between">
              <span className="text-sm text-on-surface-variant">
                Showing{" "}
                <span className="font-medium text-on-surface">
                  {filteredCount}
                </span>{" "}
                {filteredCount === 1 ? "scholarship" : "scholarships"}
              </span>
              {activeCount > 0 && (
                <button
                  type="button"
                  onClick={clearAll}
                  className="text-sm font-medium text-primary underline-offset-2 hover:underline"
                >
                  Clear all
                </button>
              )}
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}

const SORT_LABELS: Record<string, string> = {
  deadline: "Deadline",
  amount: "Amount",
}

/** Active filter strip showing every active filter (search, level, sort, award range, tags)
 *  as removable chips. Parent must wrap in AnimatePresence and conditionally render. */
export function ActiveFilterStrip({
  searchQuery,
  onSearchClear,
  level,
  onLevelClear,
  sortBy,
  onSortClear,
  selectedTags,
  onTagsChange,
  awardRange,
  onAwardRangeChange,
  month = "all",
  onMonthClear,
  onClearAll,
}: {
  searchQuery: string
  onSearchClear: () => void
  level: EducationLevelFilter
  onLevelClear: () => void
  sortBy: string
  onSortClear: () => void
  selectedTags: Tag[]
  onTagsChange: (tags: Tag[]) => void
  awardRange: [number, number]
  onAwardRangeChange: (range: [number, number]) => void
  month?: Month | "all"
  onMonthClear?: () => void
  onClearAll: () => void
}) {
  const trimmedQuery = searchQuery.trim()
  const hasSearch = trimmedQuery.length > 0
  const hasLevel = level !== "All"
  const hasSort = sortBy !== "deadline"
  const hasMonth = month !== "all"
  const isAwardRangeActive =
    awardRange[0] !== AWARD_MIN || awardRange[1] !== AWARD_MAX

  const removeTag = useCallback(
    (tag: Tag) => onTagsChange(selectedTags.filter((t) => t !== tag)),
    [selectedTags, onTagsChange],
  )

  const resetAwardRange = useCallback(
    () => onAwardRangeChange([AWARD_MIN, AWARD_MAX]),
    [onAwardRangeChange],
  )

  const awardChipLabel = useMemo((): string => {
    const fmt = (v: number) => `$${v.toLocaleString("en-US")}`
    const minChanged = awardRange[0] !== AWARD_MIN
    const maxChanged = awardRange[1] !== AWARD_MAX
    if (minChanged && maxChanged)
      return `${fmt(awardRange[0])} – ${fmt(awardRange[1])}`
    if (minChanged) return `Min ${fmt(awardRange[0])}`
    return `Max ${fmt(awardRange[1])}`
  }, [awardRange])

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="flex items-center gap-2 overflow-x-auto scrollbar-none"
    >
      <span className="shrink-0 text-xs text-on-surface/40">Filtered by:</span>
      <AnimatePresence mode="popLayout">
        {hasSearch && (
          <motion.button
            key="search-query"
            type="button"
            layout
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85, x: -4 }}
            transition={{ duration: 0.12 }}
            onClick={onSearchClear}
            aria-label={`Clear search "${trimmedQuery}"`}
            className="flex shrink-0 cursor-pointer items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary-800 transition-colors hover:bg-primary/20 dark:text-primary-200"
            data-cursor="fade"
          >
            <span className="max-w-[16ch] truncate">
              &ldquo;{trimmedQuery}&rdquo;
            </span>
            <Icon icon="solar:close-circle-linear" className="size-3.5" />
          </motion.button>
        )}
        {hasLevel && (
          <motion.button
            key="active-level"
            type="button"
            layout
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85, x: -4 }}
            transition={{ duration: 0.12 }}
            onClick={onLevelClear}
            aria-label={`Clear ${level} education level`}
            className="flex shrink-0 cursor-pointer items-center gap-1 rounded-full bg-tertiary/10 px-2.5 py-1 text-xs font-medium text-tertiary-800 transition-colors hover:bg-tertiary/20 dark:text-tertiary-200"
            data-cursor="fade"
          >
            {level}
            <Icon icon="solar:close-circle-linear" className="size-3.5" />
          </motion.button>
        )}
        {hasSort && (
          <motion.button
            key="active-sort"
            type="button"
            layout
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85, x: -4 }}
            transition={{ duration: 0.12 }}
            onClick={onSortClear}
            aria-label="Reset sort to default"
            className="flex shrink-0 cursor-pointer items-center gap-1 rounded-full bg-on-surface/10 px-2.5 py-1 text-xs font-medium text-on-surface transition-colors hover:bg-on-surface/15"
            data-cursor="fade"
          >
            Sort: {SORT_LABELS[sortBy] ?? sortBy}
            <Icon icon="solar:close-circle-linear" className="size-3.5" />
          </motion.button>
        )}
        {hasMonth && onMonthClear && (
          <motion.button
            key="active-month"
            type="button"
            layout
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85, x: -4 }}
            transition={{ duration: 0.12 }}
            onClick={onMonthClear}
            aria-label={`Clear ${MONTH_LABELS[month]} filter`}
            className="flex shrink-0 cursor-pointer items-center gap-1 rounded-full bg-secondary/10 px-2.5 py-1 text-xs font-medium text-secondary-800 transition-colors hover:bg-secondary/20 dark:text-secondary-200"
            data-cursor="fade"
          >
            {MONTH_LABELS[month]}
            <Icon icon="solar:close-circle-linear" className="size-3.5" />
          </motion.button>
        )}
        {isAwardRangeActive && (
          <motion.button
            key="award-range"
            type="button"
            layout
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85, x: -4 }}
            transition={{ duration: 0.12 }}
            onClick={resetAwardRange}
            className="flex shrink-0 cursor-pointer items-center gap-1 rounded-full bg-secondary/10 px-2.5 py-1 text-xs font-medium text-secondary-800 transition-colors hover:bg-secondary/20 dark:text-secondary-200"
            data-cursor="fade"
          >
            {awardChipLabel}
            <Icon icon="solar:close-circle-linear" className="size-3.5" />
          </motion.button>
        )}
        {selectedTags.map((tag) => (
          <motion.button
            key={tag}
            type="button"
            layout
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85, x: -4 }}
            transition={{ duration: 0.12 }}
            onClick={() => removeTag(tag)}
            className="flex shrink-0 items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary-800 transition-colors hover:bg-primary/20 dark:text-primary-200"
            data-cursor="fade"
          >
            {getEligibilityTagLabel(tag)}
            <Icon icon="solar:close-circle-linear" className="size-3.5" />
          </motion.button>
        ))}
      </AnimatePresence>
      <button
        type="button"
        onClick={onClearAll}
        className="shrink-0 text-xs cursor-pointer text-on-surface/50 underline-offset-2 hover:text-on-surface hover:underline"
        data-cursor="fade"
      >
        Clear all
      </button>
    </motion.div>
  );
}
