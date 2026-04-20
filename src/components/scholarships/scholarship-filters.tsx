"use client"

import { useRef, useState, type Dispatch, type SetStateAction } from "react"
import { motion, LayoutGroup } from "motion/react"
import { Icon } from "@iconify/react"
import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"
import {
  scholarships as allScholarships,
  SCHOLARSHIP_CATEGORIES,
  type ScholarshipCategory,
} from "@/data/scholarships"
import { Button } from "@/components/ui/button/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu/dropdown-menu"
import { glassPill } from "@/components/ui/styles"
import { Input } from "@/components/ui/input/input"
import { ScholarshipFiltersMobile } from "./scholarship-filters-mobile"
import { ProfileSetupTrigger } from "@/components/ui/profile-setup"

export type GridLayout = "bento" | "uniform"

type TagFilters = Record<"featured" | "popular" | "new" | "topPick", boolean>

interface ScholarshipFiltersProps {
  activeFilter: ScholarshipCategory
  onFilterChange: (category: ScholarshipCategory) => void
  layout: GridLayout
  onLayoutChange: (layout: GridLayout) => void
  searchQuery: string
  onSearchChange: (query: string) => void
  tagFilters: TagFilters
  onTagFiltersChange: Dispatch<SetStateAction<TagFilters>> | ((updater: TagFilters | ((prev: TagFilters) => TagFilters)) => void)
  sortBy: string
  onSortByChange: (sort: string) => void
  resultCount: number
}

/** Derive category counts from the full dataset */
const categoryCounts = SCHOLARSHIP_CATEGORIES.reduce(
  (acc, cat) => {
    acc[cat] =
      cat === "All"
        ? allScholarships.length
        : allScholarships.filter((s) => s.category === cat).length
    return acc
  },
  {} as Record<ScholarshipCategory, number>,
)

export function ScholarshipFilters({
  activeFilter,
  onFilterChange,
  layout,
  onLayoutChange,
  searchQuery,
  onSearchChange,
  tagFilters,
  onTagFiltersChange,
  sortBy,
  onSortByChange,
  resultCount,
}: ScholarshipFiltersProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [searchOpen, setSearchOpen] = useState(false)

  const isMobile = useMediaQuery("(max-width: 1023px)")

  if (isMobile === null) {
    return <div className="min-h-24" />
  }

  if (isMobile) {
    return (
      <ScholarshipFiltersMobile
        activeFilter={activeFilter}
        onFilterChange={onFilterChange}
        layout={layout}
        onLayoutChange={onLayoutChange}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        tagFilters={tagFilters}
        onTagFiltersChange={onTagFiltersChange as Dispatch<SetStateAction<TagFilters>>}
        sortBy={sortBy}
        onSortByChange={onSortByChange}
        resultCount={resultCount}
      />
    )
  }

  return (
    <div className="flex items-center justify-between gap-4 border-b border-outline-variant pb-3 dark:border-white/10">
      {/* Left: Category tabs */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
        <LayoutGroup>
          <div className="flex items-center gap-1 py-2">
            {SCHOLARSHIP_CATEGORIES.map((category) => {
              const isActive = activeFilter === category
              const count = categoryCounts[category]
              return (
                <div key={category} className="relative">
                  {isActive && (
                    <motion.span
                      layoutId="scholarship-filter-highlight"
                      className="absolute inset-0 rounded-full bg-primary/30 dark:bg-primary"
                      transition={{
                        type: "spring",
                        stiffness: 350,
                        damping: 30,
                      }}
                    />
                  )}
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    onClick={() => onFilterChange(category)}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "relative z-1 text-sm md:text-base",
                      isActive
                        ? "shadow-none"
                        : "text-on-surface/60 hover:text-primary-400",
                    )}
                  >
                    {category}
                    <span
                      className={cn(
                        "ml-1 inline-flex size-5 items-center justify-center rounded-full text-[10px] font-medium",
                        isActive
                          ? "bg-white/30 text-on-primary dark:bg-white/20"
                          : "bg-on-surface/8 text-on-surface/50",
                      )}
                    >
                      {count}
                    </span>
                  </Button>
                </div>
              )
            })}
          </div>
        </LayoutGroup>
      </div>

      {/* Right: Search + Layout toggle + Sort + Filters dropdown */}
      <div className="flex shrink-0 items-center gap-2">
        {/* Collapsible search */}
        <motion.div
          initial={false}
          animate={{ width: searchOpen ? 240 : 36 }}
          transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
          className={cn(
            "flex h-9 shrink-0 cursor-text items-center overflow-hidden rounded-full border border-outline-variant/30",
            searchOpen
              ? "gap-2 bg-white/20 px-2.5 dark:bg-white/5"
              : "justify-center bg-surface-container-low/50",
          )}
          onClick={() => inputRef.current?.focus()}
        >
          <Icon
            icon="solar:magnifer-linear"
            className={cn(
              "size-4.5 shrink-0 transition-colors",
              searchOpen
                ? "text-on-surface/50 dark:text-white/50"
                : "text-on-surface/60 dark:text-white/50",
            )}
          />
          <Input
            ref={inputRef}
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={() => setSearchOpen(true)}
            onBlur={() => {
              if (!searchQuery) setSearchOpen(false)
            }}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                onSearchChange("")
                inputRef.current?.blur()
              }
            }}
            placeholder="Search..."
            aria-label="Search scholarships"
            className={cn(
              "h-auto border-0 bg-transparent px-0 py-0 ring-0 focus-visible:border-0 focus-visible:ring-0",
              !searchOpen && "w-0",
            )}
          />
        </motion.div>
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

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  glassPill,
                  "shrink-0 text-on-surface hover:bg-white/40 dark:hover:bg-white/20",
                )}
              />
            }
          >
            Sort
            <Icon
              data-icon="inline-end"
              icon="solar:sort-vertical-linear"
              className="size-4"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={6}>
            <DropdownMenuGroup>
              <DropdownMenuLabel>Sort By</DropdownMenuLabel>
              <DropdownMenuRadioGroup
                value={sortBy}
                onValueChange={onSortByChange}
              >
                <DropdownMenuRadioItem value="deadline">
                  Deadline
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="amount">
                  Amount
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="rating">
                  Rating
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  glassPill,
                  "shrink-0 text-on-surface hover:bg-white/40 dark:hover:bg-white/20",
                )}
              />
            }
          >
            Filters
            <Icon
              data-icon="inline-end"
              icon="solar:filter-line-duotone"
              className="size-4"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={6}>
            <DropdownMenuGroup>
              <DropdownMenuLabel>Tags</DropdownMenuLabel>
              <DropdownMenuCheckboxItem
                checked={tagFilters.featured}
                onCheckedChange={(checked) =>
                  (onTagFiltersChange as (updater: (prev: TagFilters) => TagFilters) => void)(
                    (prev) => ({ ...prev, featured: checked }),
                  )
                }
              >
                Featured
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={tagFilters.popular}
                onCheckedChange={(checked) =>
                  (onTagFiltersChange as (updater: (prev: TagFilters) => TagFilters) => void)(
                    (prev) => ({ ...prev, popular: checked }),
                  )
                }
              >
                Popular
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={tagFilters.new}
                onCheckedChange={(checked) =>
                  (onTagFiltersChange as (updater: (prev: TagFilters) => TagFilters) => void)(
                    (prev) => ({ ...prev, new: checked }),
                  )
                }
              >
                New
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={tagFilters.topPick}
                onCheckedChange={(checked) =>
                  (onTagFiltersChange as (updater: (prev: TagFilters) => TagFilters) => void)(
                    (prev) => ({ ...prev, topPick: checked }),
                  )
                }
              >
                Top Pick
              </DropdownMenuCheckboxItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <ProfileSetupTrigger />
      </div>
    </div>
  )
}
