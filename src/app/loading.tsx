export default function Loading() {
  return (
    <div className="flex min-h-[60vh] flex-col gap-8 py-16">
      {/* Hero placeholder */}
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="h-4 w-24 animate-pulse rounded-full bg-surface-container" />
        <div className="h-10 w-80 max-w-full animate-pulse rounded-2xl bg-surface-container" />
        <div className="h-5 w-96 max-w-full animate-pulse rounded-xl bg-surface-container" />
      </div>

      {/* Content grid placeholder */}
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col gap-4 rounded-2xl bg-surface-container-low p-6"
          >
            <div className="h-40 animate-pulse rounded-xl bg-surface-container" />
            <div className="h-4 w-3/4 animate-pulse rounded-full bg-surface-container" />
            <div className="h-3 w-1/2 animate-pulse rounded-full bg-surface-container" />
          </div>
        ))}
      </div>
    </div>
  )
}
