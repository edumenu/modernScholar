import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="page-padding-y flex flex-col gap-8">
      <div className="max-w-2xl">
        <Skeleton className="h-9 w-64 rounded-xl md:h-11" />
        <div className="mt-4 flex flex-col gap-2">
          <Skeleton className="h-4 w-full rounded-lg" />
          <Skeleton className="h-4 w-11/12 rounded-lg" />
          <Skeleton className="h-4 w-3/4 rounded-lg" />
        </div>
        <div className="mt-4 flex flex-col gap-2">
          <Skeleton className="h-3 w-2/3 rounded-lg" />
          <Skeleton className="h-3 w-1/2 rounded-lg" />
        </div>
      </div>
    </div>
  )
}
