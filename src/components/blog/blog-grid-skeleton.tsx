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

function FeaturedCardSkeleton() {
  return (
    <div className="pt-2">
      <Skeleton className="w-full aspect-21/9 rounded-2xl" />
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
  return (
    <div className="flex flex-col gap-8">
      <FilterBarSkeleton />
      <FeaturedCardSkeleton />

      {/* Standard grid — 8 cards (9 per page minus 1 featured) */}
      <div className="grid grid-cols-1 gap-6 pt-2 pb-10 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <BlogCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}
