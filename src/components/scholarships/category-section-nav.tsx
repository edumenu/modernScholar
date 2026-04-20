"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import type { ScholarshipCategory } from "@/data/scholarships"

interface CategorySectionNavProps {
  categories: ScholarshipCategory[]
}

export function CategorySectionNav({ categories }: CategorySectionNavProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      let current: string | null = null

      for (const cat of categories) {
        const el = document.getElementById(`category-section-${cat}`)
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= 150) {
            current = cat
          }
        }
      }

      setActiveCategory(current)
      setIsVisible(current !== null)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [categories])

  return (
    <AnimatePresence>
      {isVisible && activeCategory && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed left-1/2 top-20 z-30 -translate-x-1/2"
        >
          <div className="flex items-center gap-2 rounded-full border border-outline-variant/30 bg-surface-container/90 px-4 py-2 shadow-lg backdrop-blur-md dark:bg-surface-container/90 dark:border-outline-variant/20">
            <span className="size-2 rounded-full bg-primary" />
            <span className="text-sm font-medium text-on-surface">
              {activeCategory}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

interface CategoryDividerProps {
  category: string
  count: number
}

export function CategoryDivider({ category, count }: CategoryDividerProps) {
  return (
    <div
      id={`category-section-${category}`}
      className="flex items-center gap-4 pt-10 pb-4 scroll-mt-24"
    >
      <h3 className="font-heading text-2xl font-medium text-on-surface md:text-3xl">
        {category}
      </h3>
      <span className="text-sm text-on-surface-variant">
        {count} {count === 1 ? "scholarship" : "scholarships"}
      </span>
      <div className="flex-1 border-t border-outline-variant/30" />
    </div>
  )
}
