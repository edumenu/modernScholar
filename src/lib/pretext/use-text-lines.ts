"use client";

import { useMemo, useState, useEffect } from "react";
import {
  prepareWithSegments,
  layoutWithLines,
  type PreparedTextWithSegments,
  type LayoutLine,
} from "@chenglou/pretext";

/** Module-level cache for prepared text (deterministic for same text+font pair) */
const prepareCache = new Map<string, PreparedTextWithSegments>();

function getCacheKey(text: string, font: string): string {
  return `${font}|${text}`;
}

function getPrepared(text: string, font: string): PreparedTextWithSegments {
  const key = getCacheKey(text, font);
  let prepared = prepareCache.get(key);
  if (!prepared) {
    prepared = prepareWithSegments(text, font);
    prepareCache.set(key, prepared);
  }
  return prepared;
}

function measureLines(text: string, font: string, maxWidth: number, lineHeight: number) {
  const prepared = getPrepared(text, font);
  const result = layoutWithLines(prepared, maxWidth, lineHeight);
  return {
    lines: result.lines.map((l: LayoutLine) => l.text),
    height: result.height,
    lineCount: result.lineCount,
    isReady: true,
  };
}

export interface UseTextLinesOptions {
  text: string;
  font: string;
  /** System fallback font for CLS prevention (e.g. "700 48px serif"). If provided, measures immediately with fallback to reserve space before web font loads. */
  fallbackFont?: string;
  maxWidth: number | null;
  lineHeight: number;
}

export interface UseTextLinesResult {
  lines: string[];
  height: number;
  lineCount: number;
  isReady: boolean;
}

const EMPTY: UseTextLinesResult = { lines: [], height: 0, lineCount: 0, isReady: false };

/**
 * Splits text into its actual rendered lines using pretext measurement.
 * Returns line strings, total height, and count — perfect for line-by-line animation.
 */
export function useTextLines({
  text,
  font,
  fallbackFont,
  maxWidth,
  lineHeight,
}: UseTextLinesOptions): UseTextLinesResult {
  // Synchronous measurement — no setState in an effect
  const initial = useMemo(() => {
    if (typeof window === "undefined" || maxWidth === null || maxWidth <= 0)
      return EMPTY;

    const measureFont =
      typeof document !== "undefined" && document.fonts.check(font)
        ? font
        : (fallbackFont ?? font);

    return measureLines(text, measureFont, maxWidth, lineHeight);
  }, [text, font, fallbackFont, maxWidth, lineHeight]);

  // Track font load state — initialize synchronously to avoid effect setState
  const isFontReady =
    typeof document !== "undefined" && document.fonts.check(font);

  const [fontLoadedAsync, setFontLoadedAsync] = useState(isFontReady);

  useEffect(() => {
    if (isFontReady || typeof document === "undefined") return;
    let cancelled = false;
    document.fonts.ready.then(() => {
      if (!cancelled) {
        prepareCache.delete(getCacheKey(text, font));
        setFontLoadedAsync(true);
      }
    });
    return () => { cancelled = true; };
  }, [text, font, isFontReady]);

  const fontLoaded = isFontReady || fontLoadedAsync;

  // Once font is loaded, re-measure synchronously with the real font
  const result = useMemo(() => {
    if (!fontLoaded || maxWidth === null || maxWidth <= 0) return initial;
    return measureLines(text, font, maxWidth, lineHeight);
  }, [fontLoaded, text, font, maxWidth, lineHeight, initial]);

  return result;
}
