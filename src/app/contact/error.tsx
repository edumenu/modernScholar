"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Icon } from "@iconify/react"

export default function ContactError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="page-padding-y flex min-h-[calc(100vh-7rem)] flex-col items-center justify-center text-center">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-tertiary">
        Contact unavailable
      </p>
      <h1 className="mt-6 font-heading text-2xl font-medium tracking-tight text-on-surface md:text-3xl">
        The contact page hit a snag
      </h1>
      <p className="mx-auto mt-3 max-w-md text-base text-on-surface-variant">
        You can still reach us by email at{" "}
        <a
          href="mailto:dearmodernscholar@gmail.com"
          className="text-primary underline underline-offset-2"
        >
          dearmodernscholar@gmail.com
        </a>
        .
      </p>
      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
        <button
          onClick={reset}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-neu-primary transition-all hover:text-white outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 active:translate-y-px"
        >
          <Icon icon="solar:refresh-linear" width={16} height={16} />
          Try Again
        </button>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-full border-2 border-border bg-input/30 px-5 py-2.5 text-sm font-medium text-on-surface shadow-neu-outline transition-all hover:text-primary outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 active:translate-y-px"
        >
          Go Home
        </Link>
      </div>
    </main>
  )
}
