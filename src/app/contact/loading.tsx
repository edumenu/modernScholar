import { Skeleton } from "@/components/ui/skeleton"

function ContactHeroSkeleton() {
  return (
    <div className="flex flex-col gap-4 pt-2 pb-2">
      <Skeleton className="h-12 w-2/3 max-w-lg rounded-2xl md:h-16 lg:h-20" />
      <Skeleton className="h-5 w-full max-w-2xl rounded-lg" />
      <Skeleton className="h-5 w-4/5 max-w-xl rounded-lg" />
    </div>
  )
}

function ContactFormSkeleton() {
  return (
    <div className="rounded-3xl bg-[#f9edea] p-8 dark:bg-[#140f0e] md:p-12">
      <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
        {/* Left: 3D scene / illustration placeholder */}
        <div className="flex items-center justify-center">
          <Skeleton className="aspect-4/3 w-full rounded-3xl lg:aspect-auto lg:h-120" />
        </div>

        {/* Right: form / contact content */}
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <Skeleton className="h-9 w-48 rounded-xl md:h-11 lg:h-12" />
            <Skeleton className="h-5 w-full max-w-md rounded-lg" />
            <Skeleton className="h-5 w-4/5 max-w-md rounded-lg" />
          </div>

          {/* Question routing tiles */}
          <div className="grid grid-cols-3 gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-2 rounded-2xl bg-surface-container-low p-4"
              >
                <Skeleton className="size-6 rounded-full" />
                <Skeleton className="h-3 w-20 rounded-full" />
                <Skeleton className="h-2.5 w-16 rounded-full" />
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="flex flex-col gap-6">
            <Skeleton className="h-12 w-40 rounded-full" />
            <div className="flex items-center gap-3">
              <Skeleton className="h-4 w-56 rounded-full" />
              <Skeleton className="size-9 rounded-full" />
            </div>
            <Skeleton className="h-4 w-72 max-w-full rounded-full" />
            <div className="flex items-center gap-2">
              <Skeleton className="size-5 rounded-full" />
              <Skeleton className="h-4 w-64 max-w-full rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ContactFAQSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-3 w-12 rounded-full" />
        <Skeleton className="h-7 w-56 rounded-xl md:h-9" />
      </div>
      <div className="flex flex-col gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between rounded-2xl bg-surface-container-low px-6 py-5"
          >
            <Skeleton className="h-5 w-3/5 max-w-md rounded-lg" />
            <Skeleton className="size-5 shrink-0 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Loading() {
  return (
    <div className="page-padding-y flex min-h-screen flex-col gap-16">
      <ContactHeroSkeleton />
      <ContactFormSkeleton />
      <ContactFAQSkeleton />
    </div>
  )
}
