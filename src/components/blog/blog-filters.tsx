"use client"

import { useRef, useState, useEffect, useMemo } from "react"
import { motion, LayoutGroup } from "motion/react"
import { Icon } from "@iconify/react"
import { useLenis } from "lenis/react"
import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Button } from "@/components/ui/button/button"
import { Input } from "@/components/ui/input/input"
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet/sheet"

interface BlogFiltersProps {
  categories: string[]
  activeCategory: string
  onCategoryChange: (category: string) => void
  searchQuery: string
  onSearchChange: (query: string) => void
}

export function BlogFilters({
  categories,
  activeCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
}: BlogFiltersProps) {
  const [searchOpen, setSearchOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const isMobile = useMediaQuery("(max-width: 1023px)")

  const [sheetOpen, setSheetOpen] = useState(false)
  const lenis = useLenis()

  useEffect(() => {
    if (!lenis || !sheetOpen) return
    lenis.stop()
    return () => {
      lenis.start()
    }
  }, [sheetOpen, lenis])

  const hasActiveFilter = activeCategory !== "All"

  // Dynamic filter count: category + search
  const activeFilterCount = useMemo(() => {
    let count = 0
    if (activeCategory !== "All") count++
    if (searchQuery.trim()) count++
    return count
  }, [activeCategory, searchQuery])

  if (isMobile === null) {
    return <div className="min-h-14" />
  }

  if (isMobile) {
    return (
      <div className="flex flex-col gap-3">
        {/* Full-width search */}
        <div className="flex items-center gap-2 rounded-full border border-outline-variant/30 bg-white/20 px-3 py-2 dark:bg-white/5">
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
            placeholder="Search articles"
            aria-label="Search articles"
            className="h-auto border-0 bg-transparent px-0 py-0 ring-0 focus-visible:border-0 focus-visible:ring-0"
          />
        </div>

        {/* Filters button */}
        <div className="flex w-full items-center justify-end pt-2">
          <div className="flex items-center gap-2">
            {hasActiveFilter && (
              <button
                type="button"
                onClick={() => onCategoryChange("All")}
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
                    className="shrink-0 rounded-full border border-outline-variant/30 bg-surface-container-low/50 text-on-surface hover:bg-surface-container dark:bg-surface-container-low dark:hover:bg-surface-container"
                  />
                }
              >
                Filters
                {activeFilterCount > 0 && (
                  <span className="flex size-5 items-center justify-center rounded-full bg-primary text-[11px] font-medium text-on-primary">
                    {activeFilterCount}
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
                  {hasActiveFilter && (
                    <button
                      type="button"
                      onClick={() => onCategoryChange("All")}
                      className="text-sm font-medium text-primary underline-offset-2 hover:underline"
                    >
                      Clear All
                    </button>
                  )}
                </SheetHeader>

                <div className="flex flex-col gap-6 px-6 pb-6">
                  <div>
                    <h3 className="mb-3 text-sm font-medium text-on-surface/70">
                      Category
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((category) => {
                        const isActive = activeCategory === category
                        return (
                          <Button
                            key={category}
                            variant={isActive ? "default" : "ghost"}
                            size="sm"
                            onClick={() => onCategoryChange(category)}
                            className={cn(
                              "rounded-full",
                              isActive
                                ? "bg-primary/30 shadow-none dark:bg-primary"
                                : "bg-white/20 text-on-surface/60 dark:bg-white/10",
                            )}
                          >
                            {category}
                          </Button>
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
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between border-b border-outline-variant pb-2 dark:border-white/10">
      <LayoutGroup>
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-2 w-full">
          {categories.map((category) => {
            const isActive = activeCategory === category;
            return (
              <div key={category} className="relative">
                {isActive && (
                  <motion.span
                    layoutId="blog-filter-highlight"
                    className="absolute inset-0 rounded-full bg-primary/30 dark:bg-primary"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <Button
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onCategoryChange(category)}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "relative z-1 text-sm md:text-base",
                    isActive
                      ? "shadow-none"
                      : "text-on-surface/60 hover:text-primary-400",
                  )}
                >
                  {category}
                </Button>
              </div>
            );
          })}
        </div>
      </LayoutGroup>

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
            if (!searchQuery) setSearchOpen(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              onSearchChange("");
              inputRef.current?.blur();
            }
          }}
          placeholder="Search articles"
          aria-label="Search articles"
          className={cn(
            "h-auto border-0 bg-transparent px-0 py-0 ring-0 focus-visible:border-0 focus-visible:ring-0",
            !searchOpen && "w-0",
          )}
        />
      </motion.div>
    </div>
  );
}
