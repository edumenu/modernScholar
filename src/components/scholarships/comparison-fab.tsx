"use client"

import { motion, AnimatePresence } from "motion/react"
import { Icon } from "@iconify/react"
import { useComparisonStore } from "@/stores/comparison"
import { useHasMounted } from "@/hooks/use-has-mounted"
import { Button } from "@/components/ui/button/button";

export function ComparisonFab() {
  // Selector form: this FAB only needs the count + the sheet-open trigger.
  const count = useComparisonStore((s) => s.selectedIds.length)
  const openSheet = useComparisonStore((s) => s.openSheet)
  // FAB visibility depends on the persisted store; gate so the SSR-empty
  // selectedIds state matches the first client render and we don't get a
  // hydration mismatch the moment localStorage hydrates.
  const hasMounted = useHasMounted()
  const visibleCount = hasMounted ? count : 0

  return (
    <AnimatePresence>
      {visibleCount > 0 && (
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
            aria-label="Open comparison sheet"
            animateIcon
          >
            <Icon
              icon="solar:sort-horizontal-linear"
              className="size-5"
              data-icon="inline-start"
            />
            Compare
            <span className="flex size-6 items-center mx-1 justify-center rounded-full bg-white/20 text-xs font-semibold">
              {visibleCount}
            </span>
          </Button>
          {/* Live region announces the count separately so the button's
              accessible name stays static and SR users get a polite update
              when membership changes. */}
          <span className="sr-only" aria-live="polite">
            {visibleCount} selected
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
