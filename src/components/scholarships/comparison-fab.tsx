"use client"

import { motion, AnimatePresence } from "motion/react"
import { Icon } from "@iconify/react"
import { useComparisonStore } from "@/stores/comparison"

export function ComparisonFab() {
  const { selectedIds, openSheet } = useComparisonStore()

  return (
    <AnimatePresence>
      {selectedIds.length > 0 && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          onClick={openSheet}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-100 shadow-lg transition-shadow hover:shadow-xl"
          aria-label={`Compare ${selectedIds.length} scholarships`}
        >
          <Icon icon="solar:sort-horizontal-linear" className="size-5" />
          Compare
          <span className="flex size-6 items-center justify-center rounded-full bg-white/20 text-xs font-semibold">
            {selectedIds.length}
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  )
}
