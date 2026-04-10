"use client"

import { useState, useRef } from "react"
import { motion } from "motion/react"
import { Icon } from "@iconify/react"
import { cn } from "@/lib/utils"
import {
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
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu/dropdown-menu"
import { glassPill } from "@/components/ui/styles"
import {Input} from "@/components/ui/input/input";

export type GridLayout = "bento" | "uniform"

interface ScholarshipFiltersProps {
  activeFilter: ScholarshipCategory
  onFilterChange: (category: ScholarshipCategory) => void
  layout: GridLayout
  onLayoutChange: (layout: GridLayout) => void
}

export function ScholarshipFilters({
  activeFilter,
  onFilterChange,
  layout,
  onLayoutChange,
}: ScholarshipFiltersProps) {
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const [tagFilters, setTagFilters] = useState({
    featured: false,
    popular: false,
    new: false,
    topPick: false,
  })
  const [sortBy, setSortBy] = useState("deadline")

  return (
    <div className="flex flex-col gap-3">
      {/* Row 1: Category tabs + search */}
      <div className="flex items-center justify-between border-b border-outline-variant pb-2 dark:border-white/10">
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
          {SCHOLARSHIP_CATEGORIES.map((category) => {
            const isActive = activeFilter === category;
            return (
              <Button
                key={category}
                variant={isActive ? "default" : "ghost"}
                size="sm"
                onClick={() => onFilterChange(category)}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "text-base",
                  // isActive
                  //   ? "text-on-surface dark:text-white"
                  //   : "text-on-surface/60 hover:text-on-surface dark:text-white/50 dark:hover:text-white",
                  isActive
                    ? "shadow-none"
                    : "text-on-surface/60 hover:text-primary-400",
                )}
              >
                <span className="relative z-1">{category}</span>
              </Button>
            );
          })}
        </div>

        {/* Search input — expands on focus, collapses on blur when empty */}
        <motion.div
          animate={{ width: searchOpen ? 240 : 36 }}
          transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
          className="flex shrink-0 cursor-text items-center gap-2 overflow-hidden rounded-full px-2.5 py-1.5"
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
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchOpen(true)}
            onBlur={() => {
              if (!searchQuery) setSearchOpen(false);
            }}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setSearchQuery("");
                inputRef.current?.blur();
              }
            }}
            placeholder="Search scholarships"
            aria-label="Search scholarships"
            // className="min-w-0 flex-1 bg-transparent text-sm text-on-surface outline-none placeholder:text-on-surface/40 dark:text-white dark:placeholder:text-white/40"
          />
        </motion.div>
      </div>

      {/* Row 2: Layout toggle + More Filters */}
      <div className="flex w-full justify-between items-center pt-4">
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
            More Filters
            <Icon
              data-icon="inline-end"
              icon="solar:alt-arrow-down-linear"
              className="size-4"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={6}>
            <DropdownMenuGroup>
              <DropdownMenuLabel>Tags</DropdownMenuLabel>
              <DropdownMenuCheckboxItem
                checked={tagFilters.featured}
                onCheckedChange={(checked) =>
                  setTagFilters((prev) => ({ ...prev, featured: checked }))
                }
              >
                Featured
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={tagFilters.popular}
                onCheckedChange={(checked) =>
                  setTagFilters((prev) => ({ ...prev, popular: checked }))
                }
              >
                Popular
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={tagFilters.new}
                onCheckedChange={(checked) =>
                  setTagFilters((prev) => ({ ...prev, new: checked }))
                }
              >
                New
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={tagFilters.topPick}
                onCheckedChange={(checked) =>
                  setTagFilters((prev) => ({ ...prev, topPick: checked }))
                }
              >
                Top Pick
              </DropdownMenuCheckboxItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuLabel>Sort By</DropdownMenuLabel>
              <DropdownMenuRadioGroup value={sortBy} onValueChange={setSortBy}>
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
      </div>
    </div>
  );
}
