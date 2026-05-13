import type { Metadata } from "next"
import { NotFoundClient } from "@/components/ui/four-oh-four/not-found-client"
import { PageTransition } from "@/components/ui/page-transition"

export const metadata: Metadata = {
  title: "Page Not Found | Modern Scholar",
  robots: { index: false },
}

export default function NotFound() {
  return (
    <PageTransition>
      <NotFoundClient />
    </PageTransition>
  )
}
