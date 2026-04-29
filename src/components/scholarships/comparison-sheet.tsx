"use client"

import { useMemo } from "react"
import { Icon } from "@iconify/react"
import { useComparisonStore } from "@/stores/comparison"
import { useScrollLock } from "@/hooks/use-scroll-lock"
import {
  scholarships,
  type Scholarship,
  CLASSIFICATION_COLORS,
} from "@/data/scholarships"
import { Button } from "@/components/ui/button/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet/sheet"
import { ComparisonSheetAuditLedger } from "./comparison-sheet-audit-ledger"
import { cn } from "@/lib/utils"

export function ComparisonSheet() {
  const { selectedIds, remove, clear, isSheetOpen, closeSheet } =
    useComparisonStore()

  const selected = useMemo(
    () =>
      selectedIds
        .map((id) => scholarships.find((s) => s.id === id))
        .filter(Boolean) as Scholarship[],
    [selectedIds],
  )

  useScrollLock(isSheetOpen)

  return (
    <Sheet
      open={isSheetOpen}
      onOpenChange={(open) => {
        if (!open) closeSheet()
      }}
    >
      <SheetContent
        side="right"
        className="data-[side=right]:sm:max-w-xl data-[side=right]:lg:max-w-4xl"
      >
        <SheetHeader>
          <SheetTitle className="font-heading text-lg">
            Compare Scholarships
          </SheetTitle>
          <SheetDescription className="text-on-surface-variant">
            {selected.length}/3 selected &mdash;{" "}
            {selected.length < 2
              ? "select at least 2 to compare"
              : "side-by-side comparison below"}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 pb-6">
          {/* Selected scholarships row */}
          <div className="flex items-center gap-3 pb-6">
            {selected.map((s) => {
              const color = CLASSIFICATION_COLORS[s.classification[0]]
              return (
                <div
                  key={s.id}
                  className="group relative flex items-center gap-2 rounded-full border border-outline-variant/30 py-1 pl-1 pr-3"
                >
                  <div className={cn("size-6 shrink-0 rounded-full", color?.bg ?? "bg-surface-container")} />
                  <span className="text-xs font-medium text-on-surface line-clamp-1 max-w-24">
                    {s.name}
                  </span>
                  <button
                    onClick={() => remove(s.id)}
                    className="ml-1 flex size-4 shrink-0 items-center justify-center rounded-full opacity-0 transition-opacity group-hover:opacity-100 hover:bg-on-surface/10"
                    aria-label={`Remove ${s.name} from comparison`}
                  >
                    <Icon icon="solar:close-circle-bold" className="size-3.5 text-on-surface-variant" />
                  </button>
                </div>
              )
            })}
            {Array.from({ length: 3 - selected.length }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="size-8 shrink-0 rounded-full border-2 border-dashed border-outline-variant/30"
              />
            ))}
          </div>

          {/* Comparison content */}
          {selected.length >= 2 ? (
            <ComparisonSheetAuditLedger items={selected} onRemove={remove} />
          ) : (
            <div className="flex flex-col items-center gap-4 py-12 text-center">
              <div className="flex size-16 items-center justify-center rounded-2xl bg-surface-container">
                <Icon
                  icon="solar:sort-horizontal-linear"
                  className="size-8 text-on-surface-variant/40"
                />
              </div>
              <p className="text-sm text-on-surface-variant max-w-xs">
                Select at least 2 scholarships from the grid to see a
                side-by-side comparison here.
              </p>
            </div>
          )}
        </div>

        <SheetFooter className="flex-row justify-end gap-2 border-t border-outline-variant/20">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              clear()
            }}
          >
            Clear All
          </Button>
          <SheetClose
            render={<Button size="sm" />}
          >
            Done
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
