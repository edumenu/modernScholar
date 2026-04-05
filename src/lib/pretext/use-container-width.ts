"use client";

import { useState, useEffect, type RefObject } from "react";

/**
 * Tracks a container element's width via ResizeObserver.
 * Returns `null` before first measurement (SSR-safe).
 */
export function useContainerWidth(
  ref: RefObject<HTMLElement | null>
): number | null {
  const [width, setWidth] = useState<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        setWidth(entry.contentBoxSize[0]?.inlineSize ?? entry.contentRect.width);
      }
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);

  return width;
}
