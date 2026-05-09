import { ScholarshipGridSkeleton } from "@/components/scholarships/scholarship-grid-skeleton"
import { Skeleton } from "@/components/ui/skeleton"

function ScholarshipHeroSkeleton() {
  return (
    <div className="flex flex-col gap-4 pt-2 pb-2">
      <Skeleton className="h-12 w-2/3 max-w-xl rounded-2xl md:h-16 lg:h-20" />
      <Skeleton className="h-5 w-full max-w-2xl rounded-lg" />
      <Skeleton className="h-5 w-4/5 max-w-2xl rounded-lg" />
      {/* Stats row */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2">
        <Skeleton className="h-4 w-28 rounded-full" />
        <Skeleton className="h-4 w-32 rounded-full" />
        <Skeleton className="h-4 w-24 rounded-full" />
        <Skeleton className="h-5 w-28 rounded-full" />
      </div>
    </div>
  )
}

export default function Loading() {
  return (
    <div className="page-padding-y flex h-auto flex-col gap-16">
      <ScholarshipHeroSkeleton />
      <ScholarshipGridSkeleton />
    </div>
  )
}
