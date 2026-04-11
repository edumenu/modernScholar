import { useSyncExternalStore } from "react"

/**
 * Returns `null` on the server / first render (not yet known),
 * then `true` or `false` once the client has evaluated the query.
 */
export function useMediaQuery(query: string): boolean | null {
  return useSyncExternalStore(
    (callback) => {
      const mql = window.matchMedia(query)
      mql.addEventListener("change", callback)
      return () => mql.removeEventListener("change", callback)
    },
    () => window.matchMedia(query).matches,
    () => null
  )
}
