import { Skeleton } from "@/components/ui/skeleton"

function FilterBarSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {/* Row 1: Education level tabs + search */}
      <div className="flex items-center justify-between gap-4 pb-3 shadow-[0_1px_0_0_rgba(32,26,25,0.05)]">
        <div className="flex items-center gap-2 overflow-hidden">
          {[80, 64, 56, 72, 88, 64].map((w, i) => (
            <Skeleton
              key={i}
              className="h-9 shrink-0 rounded-full"
              style={{ width: w }}
            />
          ))}
        </div>
        <div className="hidden shrink-0 items-center gap-2 lg:flex">
          <Skeleton className="size-9 rounded-full" />
        </div>
      </div>

      {/* Row 2: Layout toggle + sort + filters */}
      <div className="hidden items-center justify-between lg:flex">
        <div className="flex items-center gap-1 rounded-full bg-muted/50 p-1">
          <Skeleton className="size-7 rounded-full" />
          <Skeleton className="size-7 rounded-full" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-16 rounded-full" />
          <Skeleton className="h-9 w-20 rounded-full" />
        </div>
      </div>
    </div>
  )
}

function GridSkeleton() {
  return (
    <div className="grid w-full gap-4 pt-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 12 }).map((_, i) => (
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
      <GridSkeleton />
      <PaginationSkeleton />
    </div>
  )
}
