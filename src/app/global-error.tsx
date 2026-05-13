"use client"

import "./globals.css"
import { Poppins, Noto_Serif } from "next/font/google"
import { cn } from "@/lib/utils"
import { GlobalErrorClient } from "@/components/ui/global-error/global-error-client"

// global-error.tsx replaces the root layout entirely (per Next.js App Router
// convention), so it must define its own <html> and <body> tags and re-load
// the fonts + globals.css that the regular layout normally provides.
const notoSerif = Noto_Serif({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["400", "700"],
})

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
})

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html
      lang="en"
      className={cn("relative h-full", poppins.variable, notoSerif.variable)}
    >
      <body className="min-h-full flex flex-col bg-surface text-on-surface overflow-x-hidden">
        <GlobalErrorClient error={error} reset={reset} />
      </body>
    </html>
  )
}
