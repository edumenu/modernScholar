"use client"

import { useEffect } from "react"
import { NotFoundClient } from "@/components/ui/four-oh-four/not-found-client"

export default function BlogError({
  error,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return <NotFoundClient />
}
