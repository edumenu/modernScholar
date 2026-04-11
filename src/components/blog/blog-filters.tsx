"use client"

import { useRef, useState } from "react"
import { motion, LayoutGroup } from "motion/react"
import { Icon } from "@iconify/react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button/button"
import { Input } from "@/components/ui/input/input"

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
                    layoutId="filter-highlight"
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
        />
      </motion.div>
    </div>
  );
}
