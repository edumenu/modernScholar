import { BlogGridSkeleton } from "@/components/blog/blog-grid-skeleton"
import { Skeleton } from "@/components/ui/skeleton"

function BlogHeroSkeleton() {
  return (
    <div className="flex flex-col gap-4 pt-2 pb-2">
      <Skeleton className="h-16 w-3/4 max-w-xl rounded-2xl md:h-24 lg:h-28" />
      <Skeleton className="h-5 w-full max-w-2xl rounded-lg" />
      <Skeleton className="h-5 w-5/6 max-w-2xl rounded-lg" />
    </div>
  )
}

export default function Loading() {
  return (
    <div className="page-padding-y flex h-auto flex-col gap-16">
      <BlogHeroSkeleton />
      <BlogGridSkeleton />
    </div>
  )
}
