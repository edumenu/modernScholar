import { cn } from "@/lib/utils"

export function PageShell({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <main
      id="main-content"
      className={cn(
        "mx-auto w-full max-w-7xl flex-1 px-6 md:px-8",
        "[&>*+*]:mt-22",
        className,
      )}
    >
      {children}
    </main>
  );
}
