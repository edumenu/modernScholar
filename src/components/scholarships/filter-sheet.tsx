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
  AWARD_MIN,
  AWARD_MAX,
  type EligibilityCategory,
  type Scholarship,
} from "@/data/scholarships"
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
  selectedTags: string[]
  onTagsChange: (tags: string[]) => void
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
      for (const tag of s.eligibilityTags ?? []) {
        counts[tag] = (counts[tag] || 0) + 1
      }
    }
    return counts
  }, [seasonalScholarships])

  const toggleTag = (tag: string) => {
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
          <span className="flex size-5 items-center justify-center rounded-full bg-primary text-[11px] font-medium text-white">
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
            <SheetTitle className="font-heading text-lg">Filters</SheetTitle>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-6 pb-6">
            <div className="flex flex-col gap-6">
              {/* Award Amount Slider */}
              <AwardRangeFilter
                value={awardRange}
                onValueChange={onAwardRangeChange}
              />

              {/* Separator */}
              <div className="h-px bg-outline-variant/10" />

              {/* Eligibility: Flat tags */}
              <div className="flex flex-col gap-1">
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
              </div>

              {/* Separator */}
              <div className="h-px bg-outline-variant/10" />

              {/* Eligibility: Category accordions */}
              <div className="flex flex-col gap-1">
                {(Object.keys(ELIGIBILITY_CATEGORIES) as EligibilityCategory[]).map(
                  (category) => {
                    const subOptions = ELIGIBILITY_CATEGORIES[category]
                    const isExpanded = expandedCategory === category
                    const selectedInCategory = selectedTags.filter(
                      (t) => getEligibilityCategory(t) === category,
                    ).length

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
                              transition={{ duration: 0.2, ease: "easeOut" }}
                              className="overflow-hidden"
                            >
                              <div className="flex flex-col gap-1 pb-1 pl-6">
                                {subOptions.map((subOption) => {
                                  const fullTag = `${category}:${subOption}`
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
                                  )
                                })}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )
                  },
                )}
              </div>
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
  )
}

/** Active filter strip showing selected eligibility tags and award range as removable chips.
 *  Parent must wrap in AnimatePresence and conditionally render for exit animation. */
export function ActiveFilterStrip({
  selectedTags,
  onTagsChange,
  awardRange,
  onAwardRangeChange,
}: {
  selectedTags: string[]
  onTagsChange: (tags: string[]) => void
  awardRange: [number, number]
  onAwardRangeChange: (range: [number, number]) => void
}) {
  const isAwardRangeActive = awardRange[0] !== AWARD_MIN || awardRange[1] !== AWARD_MAX

  const removeTag = useCallback(
    (tag: string) => onTagsChange(selectedTags.filter((t) => t !== tag)),
    [selectedTags, onTagsChange],
  )

  const resetAwardRange = useCallback(
    () => onAwardRangeChange([AWARD_MIN, AWARD_MAX]),
    [onAwardRangeChange],
  )

  const clearAll = useCallback(() => {
    onTagsChange([])
    onAwardRangeChange([AWARD_MIN, AWARD_MAX])
  }, [onTagsChange, onAwardRangeChange])

  const awardChipLabel = useMemo((): string => {
    const fmt = (v: number) => `$${v.toLocaleString("en-US")}`
    const minChanged = awardRange[0] !== AWARD_MIN
    const maxChanged = awardRange[1] !== AWARD_MAX
    if (minChanged && maxChanged) return `${fmt(awardRange[0])} – ${fmt(awardRange[1])}`
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
            className="flex shrink-0 items-center gap-1 rounded-full bg-secondary/10 px-2.5 py-1 text-xs font-medium text-secondary-800 transition-colors hover:bg-secondary/20 dark:text-secondary-200"
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
          >
            {getEligibilityTagLabel(tag)}
            <Icon icon="solar:close-circle-linear" className="size-3.5" />
          </motion.button>
        ))}
      </AnimatePresence>
      <button
        type="button"
        onClick={clearAll}
        className="shrink-0 text-xs text-on-surface/50 underline-offset-2 hover:text-on-surface hover:underline"
      >
        Clear all
      </button>
    </motion.div>
  )
}
