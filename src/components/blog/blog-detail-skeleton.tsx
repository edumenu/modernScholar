import { Skeleton } from "@/components/ui/skeleton"

function SidebarSkeleton() {
  return (
    <div className="sticky top-32 hidden lg:flex flex-col gap-6">
      {/* Metadata card */}
      <div className="flex flex-col gap-4 rounded-2xl bg-surface-container-low p-6 shadow-md dark:bg-surface-container-low">
        {/* Category */}
        <div>
          <Skeleton className="h-3 w-16 rounded-full" />
          <Skeleton className="mt-2 h-6 w-24 rounded-full" />
        </div>
        {/* Published */}
        <div>
          <Skeleton className="h-3 w-16 rounded-full" />
          <Skeleton className="mt-1 h-4 w-28 rounded-full" />
        </div>
        {/* Read Time */}
        <div>
          <Skeleton className="h-3 w-16 rounded-full" />
          <Skeleton className="mt-1 h-4 w-16 rounded-full" />
        </div>
      </div>

      {/* Reading progress card */}
      <div className="flex flex-col gap-3 rounded-2xl bg-surface-container-low p-6 shadow-md dark:bg-surface-container-low">
        <Skeleton className="h-3 w-24 rounded-full" />
        <Skeleton className="h-1.5 w-full rounded-full" />
        <div className="mt-2 flex flex-col gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-full rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  )
}

function ContentSkeleton() {
  return (
    <>
      {/* Title */}
      <div className="flex flex-col gap-2">
        <Skeleton className="h-10 w-full rounded-xl md:h-12" />
        <Skeleton className="h-10 w-3/4 rounded-xl md:h-12" />
      </div>

      {/* Excerpt */}
      <div className="mt-4 flex flex-col gap-2">
        <Skeleton className="h-5 w-full rounded-lg" />
        <Skeleton className="h-5 w-5/6 rounded-lg" />
      </div>

      {/* Hero image */}
      <Skeleton className="mt-8 aspect-video w-full rounded-2xl" />

      {/* Prose sections */}
      <div className="mt-10 max-w-prose space-y-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-3">
            {i > 0 && <div className="border-t border-outline-variant/20 pt-8 mt-8" />}
            <Skeleton className="h-7 w-2/3 rounded-lg" />
            <div className="mt-2 flex flex-col gap-2">
              <Skeleton className="h-4 w-full rounded-lg" />
              <Skeleton className="h-4 w-full rounded-lg" />
              <Skeleton className="h-4 w-11/12 rounded-lg" />
              <Skeleton className="h-4 w-4/5 rounded-lg" />
            </div>
          </div>
        ))}
      </div>

      {/* Author bio card */}
      <div className="mt-12 flex items-center gap-4 rounded-2xl bg-surface-container-low p-6 shadow-xs dark:bg-surface-container-low">
        <Skeleton className="size-14 shrink-0 rounded-full" />
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-4 w-32 rounded-full" />
          <Skeleton className="h-3 w-20 rounded-full" />
        </div>
      </div>
    </>
  )
}

function RelatedPostsSkeleton() {
  return (
    <div className="mt-16">
      <div className="mb-8 flex items-center justify-between">
        <Skeleton className="h-8 w-48 rounded-xl" />
        <div className="flex items-center gap-3">
          <Skeleton className="size-8 rounded-full" />
          <Skeleton className="size-8 rounded-full" />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex flex-col overflow-hidden rounded-2xl">
            <Skeleton className="aspect-video w-full rounded-none" />
            <div className="flex flex-col gap-2 p-4">
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-5 w-full rounded-lg" />
              <Skeleton className="h-5 w-3/4 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function BlogDetailSkeleton() {
  return (
    <div className="page-padding-y flex gap-20 flex-col">
      {/* Back button */}
      <Skeleton className="h-8 w-32 rounded-lg" />

      {/* Main grid: sidebar + content */}
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[260px_1fr]">
        {/* Content — order matches blog-detail.tsx */}
        <div className="relative order-first lg:order-last">
          <ContentSkeleton />
        </div>

        {/* Sidebar */}
        <aside className="order-last lg:order-first">
          <SidebarSkeleton />
        </aside>
      </div>

      {/* Related posts */}
      <RelatedPostsSkeleton />
    </div>
  )
}
