import { Skeleton } from "@/components/ui/skeleton"

function FilterBarSkeleton() {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-outline-variant pb-3 dark:border-white/10">
      {/* Category tabs */}
      <div className="flex items-center gap-2 overflow-hidden">
        {[80, 64, 56, 72, 88, 64].map((w, i) => (
          <Skeleton
            key={i}
            className="h-9 shrink-0 rounded-full"
            style={{ width: w }}
          />
        ))}
      </div>

      {/* Right controls: search, layout toggle, sort, filters */}
      <div className="hidden shrink-0 items-center gap-2 lg:flex">
        <Skeleton className="size-9 rounded-full" />
        <div className="flex items-center gap-1 rounded-full bg-muted/50 p-1">
          <Skeleton className="size-7 rounded-full" />
          <Skeleton className="size-7 rounded-full" />
        </div>
        <Skeleton className="h-9 w-16 rounded-full" />
        <Skeleton className="h-9 w-20 rounded-full" />
      </div>
    </div>
  )
}

function BentoCardSkeleton() {
  return <Skeleton className="h-full w-full rounded-2xl" />
}

function BentoGridSkeleton() {
  return (
    <div className="hidden gap-4 items-stretch min-h-205 pt-2 lg:flex">
      {/* Column 1 — outer (2 cards) */}
      <div className="flex w-57.5 shrink-0 flex-col gap-4 xl:w-81.25">
        <div className="flex-1 min-h-0"><BentoCardSkeleton /></div>
        <div className="flex-1 min-h-0"><BentoCardSkeleton /></div>
      </div>
      {/* Column 2 — inner (3 cards) */}
      <div className="flex flex-1 min-w-0 flex-col gap-4">
        <div className="flex-1 min-h-0"><BentoCardSkeleton /></div>
        <div className="flex-1 min-h-0"><BentoCardSkeleton /></div>
        <div className="flex-1 min-h-0"><BentoCardSkeleton /></div>
      </div>
      {/* Column 3 — inner (3 cards) */}
      <div className="flex flex-1 min-w-0 flex-col gap-4">
        <div className="flex-1 min-h-0"><BentoCardSkeleton /></div>
        <div className="flex-1 min-h-0"><BentoCardSkeleton /></div>
        <div className="flex-1 min-h-0"><BentoCardSkeleton /></div>
      </div>
      {/* Column 4 — outer (2 cards) */}
      <div className="flex w-[230px] shrink-0 flex-col gap-4 xl:w-[325px]">
        <div className="flex-1 min-h-0"><BentoCardSkeleton /></div>
        <div className="flex-1 min-h-0"><BentoCardSkeleton /></div>
      </div>
    </div>
  )
}

function MobileGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 pt-2 sm:grid-cols-2 lg:hidden">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="aspect-3/4 w-full rounded-2xl" />
      ))}
    </div>
  )
}

function PaginationSkeleton() {
  return (
    <div className="flex items-center justify-center gap-2 pt-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="size-9 rounded-full" />
      ))}
    </div>
  )
}

export function ScholarshipGridSkeleton() {
  return (
    <div className="flex w-full flex-col gap-8">
      <FilterBarSkeleton />
      <BentoGridSkeleton />
      <MobileGridSkeleton />
      <PaginationSkeleton />
    </div>
  )
}
