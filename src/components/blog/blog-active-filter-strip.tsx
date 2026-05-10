"use client"

import { motion, AnimatePresence } from "motion/react"
import { Icon } from "@iconify/react"

interface BlogActiveFilterStripProps {
  searchQuery: string
  onSearchClear: () => void
  activeCategory: string
  onCategoryClear: () => void
  onClearAll: () => void
}

export function BlogActiveFilterStrip({
  searchQuery,
  onSearchClear,
  activeCategory,
  onCategoryClear,
  onClearAll,
}: BlogActiveFilterStripProps) {
  const trimmedQuery = searchQuery.trim()
  const hasSearch = trimmedQuery.length > 0
  const hasCategory = activeCategory !== "All"

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
        {hasCategory && (
          <motion.button
            key="active-category"
            type="button"
            layout
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85, x: -4 }}
            transition={{ duration: 0.12 }}
            onClick={onCategoryClear}
            aria-label={`Clear category ${activeCategory}`}
            className="flex shrink-0 cursor-pointer items-center gap-1 rounded-full bg-secondary/10 px-2.5 py-1 text-xs font-medium text-secondary-800 transition-colors hover:bg-secondary/20 dark:text-secondary-200"
            data-cursor="fade"
          >
            {activeCategory}
            <Icon icon="solar:close-circle-linear" className="size-3.5" />
          </motion.button>
        )}
      </AnimatePresence>
      <button
        type="button"
        onClick={onClearAll}
        className="shrink-0 cursor-pointer text-xs text-on-surface/50 underline-offset-2 hover:text-on-surface hover:underline"
        data-cursor="fade"
      >
        Clear all
      </button>
    </motion.div>
  );
}
