import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="bg-background fixed inset-0 z-100 flex flex-col gap-1 overflow-hidden">
      <Skeleton className="h-16 w-full shrink-0 md:h-20 lg:h-[40vh]" />
      <Skeleton className="h-16 w-full shrink-0 md:h-20 lg:h-[40vh]" />
      <Skeleton className="h-16 w-full shrink-0 md:h-20 lg:h-[40vh]" />
      <Skeleton className="w-full flex-1 rounded-lg" />
    </div>
  );
}
