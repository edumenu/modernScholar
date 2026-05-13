import { Skeleton } from "@/components/ui/skeleton"

function FilterBarSkeleton() {
  return (
    <div className="flex items-center justify-between border-b border-outline-variant pb-2 dark:border-white/10">
      {/* Category pills */}
      <div className="flex items-center gap-1 overflow-hidden py-2">
        {[48, 88, 80, 96, 72].map((w, i) => (
          <Skeleton
            key={i}
            className="h-9 shrink-0 rounded-full"
            style={{ width: w }}
          />
        ))}
      </div>

      {/* Search toggle */}
      <Skeleton className="size-9 shrink-0 rounded-full" />
    </div>
  )
}

function BlogCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-outline-variant/40 bg-surface-container-low">
      {/* Image */}
      <Skeleton className="w-full aspect-video rounded-none" />

      {/* Content */}
      <div className="flex flex-1 flex-col gap-3 p-6">
        {/* Category badge */}
        <Skeleton className="h-5 w-24 rounded-full" />

        {/* Title (2 lines) */}
        <div className="flex flex-col gap-2">
          <Skeleton className="h-6 w-full rounded-lg" />
          <Skeleton className="h-6 w-3/4 rounded-lg" />
        </div>

        {/* Excerpt (2 lines) */}
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-4 w-full rounded-lg" />
          <Skeleton className="h-4 w-2/3 rounded-lg" />
        </div>

        {/* Author row */}
        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <Skeleton className="size-7 rounded-full" />
            <div className="flex flex-col gap-1">
              <Skeleton className="h-3 w-20 rounded-full" />
              <Skeleton className="h-2.5 w-14 rounded-full" />
            </div>
          </div>
          <Skeleton className="h-8 w-28 rounded-full" />
        </div>
      </div>
    </div>
  )
}

export function BlogGridSkeleton() {
  // Render the worst-case grid layout (9 cards, no featured hero).
  //
  // The real grid renders a featured hero + 8 cards only on page 1 when a
  // post is explicitly marked featured. On page 2+ — and on page 1 with no
  // featured — it renders 9 plain cards. The previous skeleton always
  // included a 21:9 hero placeholder, which briefly flashed and disappeared
  // on page 2+. Matching the 9-card case eliminates that CLS at the cost of
  // a one-frame mismatch on page 1 where the featured hero pops in.
  return (
    <div className="flex flex-col gap-8">
      <FilterBarSkeleton />

      <div className="grid grid-cols-1 gap-6 pt-2 pb-10 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <BlogCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}
