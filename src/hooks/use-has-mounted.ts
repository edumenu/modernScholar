"use client"

import { useSyncExternalStore } from "react"

const noopSubscribe = () => () => {}

/**
 * `true` after the component has mounted on the client. Use to gate reads from
 * client-only sources (e.g. Zustand persist, localStorage) so the first render
 * matches the server-rendered HTML and React doesn't log a hydration mismatch.
 *
 * Implemented with `useSyncExternalStore` so React's server-snapshot path
 * always returns `false`, then flips to `true` on the client after hydration —
 * without a `setState` inside `useEffect`.
 */
export function useHasMounted(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  )
}
