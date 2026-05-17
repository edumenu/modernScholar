"use client"

import { useCallback, useSyncExternalStore } from "react"
import { Icon } from "@iconify/react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface ShareDockProps {
  url: string
  title: string
  excerpt?: string
}

const buttonClasses = cn(
  "inline-flex size-10 items-center justify-center rounded-full",
  "bg-surface-container text-on-surface",
  "border border-outline-variant/30 dark:border-outline-variant/20",
  "transition-colors hover:bg-surface-container-high hover:text-primary",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
  "cursor-pointer",
)

// useSyncExternalStore lets us read browser-only capabilities without
// triggering React 19's "no setState in effect" rule and without risking a
// hydration mismatch — server snapshot stays stable, client snapshot reflects
// the real navigator.
const subscribeNoop = () => () => {}
const getNativeShareSnapshot = () =>
  typeof navigator !== "undefined" && typeof navigator.share === "function"
const getServerSnapshotFalse = () => false

export function ShareDock({ url, title, excerpt }: ShareDockProps) {
  const canNativeShare = useSyncExternalStore(
    subscribeNoop,
    getNativeShareSnapshot,
    getServerSnapshotFalse,
  )
  const resolvedUrl = useSyncExternalStore(
    subscribeNoop,
    () => (typeof window !== "undefined" ? window.location.href : url),
    () => url,
  )

  const copyToClipboard = useCallback(async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(resolvedUrl)
        toast.success("Link copied to clipboard")
        return
      }
      toast.error("Copying isn't supported in this browser")
    } catch {
      toast.error("Couldn't copy link")
    }
  }, [resolvedUrl])

  const handleNativeShare = useCallback(async () => {
    const shareData = {
      title,
      text: excerpt ?? title,
      url: resolvedUrl,
    }
    try {
      if (
        typeof navigator !== "undefined" &&
        typeof navigator.share === "function"
      ) {
        await navigator.share(shareData)
        return
      }
      await copyToClipboard()
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return
      await copyToClipboard()
    }
  }, [title, excerpt, resolvedUrl, copyToClipboard])

  const twitterHref = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
    resolvedUrl,
  )}&text=${encodeURIComponent(title)}`
  const linkedInHref = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
    resolvedUrl,
  )}`

  return (
    <div
      className="flex flex-col gap-3 rounded-2xl bg-surface-container-low p-4 shadow-md dark:bg-surface-container-low"
      aria-label="Share this article"
    >
      <span className="text-xs font-medium uppercase tracking-wider text-on-surface-variant">
        Share
      </span>
      <div className="flex flex-row flex-wrap items-center gap-2">
        {canNativeShare && (
          <button
            type="button"
            onClick={handleNativeShare}
            className={buttonClasses}
            aria-label="Share this article"
          >
            <Icon icon="solar:share-linear" className="size-4" />
          </button>
        )}
        <a
          href={twitterHref}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonClasses}
          aria-label="Share on X"
        >
          <Icon icon="mdi:twitter" className="size-4" />
        </a>
        <a
          href={linkedInHref}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonClasses}
          aria-label="Share on LinkedIn"
        >
          <Icon icon="mdi:linkedin" className="size-4" />
        </a>
        <button
          type="button"
          onClick={copyToClipboard}
          className={buttonClasses}
          aria-label="Copy link to article"
        >
          <Icon icon="solar:copy-linear" className="size-4" />
        </button>
      </div>
    </div>
  )
}
