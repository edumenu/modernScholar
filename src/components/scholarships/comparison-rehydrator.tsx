"use client"

import { useEffect } from "react"
import { useComparisonStore } from "@/stores/comparison"

/**
 * Pulls persisted comparison selections out of localStorage after the first
 * client render. Pairs with `skipHydration: true` on the Zustand persist
 * middleware so SSR HTML (empty store) matches initial client HTML, avoiding
 * a hydration mismatch when localStorage already has saved selections.
 */
export function ComparisonRehydrator() {
  useEffect(() => {
    useComparisonStore.persist.rehydrate()
  }, [])
  return null
}
