"use client"

import { motion, AnimatePresence } from "motion/react"
import { Icon } from "@iconify/react"
import { useComparisonStore } from "@/stores/comparison"
import { Button } from "@/components/ui/button/button";

export function ComparisonFab() {
  const { selectedIds, openSheet } = useComparisonStore()

  return (
    <AnimatePresence>
      {selectedIds.length > 0 && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="fixed bottom-6 right-6 z-40"
        >
          <Button
            variant="default"
            size="lg"
            onClick={openSheet}
            className="gap-2.5"
            aria-label={`Compare ${selectedIds.length} scholarships`}
            aria-live="polite"
            animateIcon
          >
            <Icon
              icon="solar:sort-horizontal-linear"
              className="size-5"
              data-icon="inline-start"
            />
            Compare
            <span className="flex size-6 items-center mx-1 justify-center rounded-full bg-white/20 text-xs font-semibold">
              {selectedIds.length}
            </span>
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
