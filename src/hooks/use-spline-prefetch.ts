"use client";

import { useCallback } from "react";
import ReactDOM from "react-dom";
import { useTheme } from "next-themes";
import { useMediaQuery } from "@/hooks/use-media-query";
import { splineScenes } from "@/config/spline-scenes";

// Module-scoped guards so repeated hovers across the session don't re-issue
// the same network requests. `preloadedScenes` mirrors what react-dom does
// internally for `ReactDOM.preload` (it dedupes by href), but tracking the
// dynamic-import flag here lets us avoid even calling the import wrapper.
let chunkPrefetched = false;
const preloadedScenes = new Set<string>();

/**
 * Returns a callback that, when invoked on a desktop-with-hover device,
 * preloads the hero Spline scene + warms the dynamic `./spline-scene` chunk
 * so an SPA navigation to `/` doesn't pay the cold Spline cost.
 *
 * Wire it to `onPointerEnter` / `onFocus` on any in-app link to `/`.
 */
export function useSplinePrefetch(): () => void {
  const { resolvedTheme } = useTheme();
  const isDesktop = useMediaQuery(
    "(min-width: 1024px) and (hover: hover) and (pointer: fine)",
  );

  return useCallback(() => {
    if (isDesktop !== true) return;

    const sceneUrl =
      resolvedTheme === "dark"
        ? splineScenes.heroDark()
        : splineScenes.heroLight();

    if (!preloadedScenes.has(sceneUrl)) {
      preloadedScenes.add(sceneUrl);
      ReactDOM.preload(sceneUrl, { as: "fetch", crossOrigin: "anonymous" });
    }

    if (!chunkPrefetched) {
      chunkPrefetched = true;
      void import("@/components/home/spline-scene");
    }
  }, [isDesktop, resolvedTheme]);
}
