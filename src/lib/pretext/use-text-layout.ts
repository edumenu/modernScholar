"use client";

import { useMemo, useState, useEffect } from "react";
import {
  prepare,
  layout,
  type PreparedText,
} from "@chenglou/pretext";

/** Module-level cache for prepared text */
const prepareCache = new Map<string, PreparedText>();

function getCacheKey(text: string, font: string): string {
  return `${font}|${text}`;
}

function getPrepared(text: string, font: string): PreparedText {
  const key = getCacheKey(text, font);
  let prepared = prepareCache.get(key);
  if (!prepared) {
    prepared = prepare(text, font);
    prepareCache.set(key, prepared);
  }
  return prepared;
}

function measure(text: string, font: string, maxWidth: number, lineHeight: number) {
  const prepared = getPrepared(text, font);
  const result = layout(prepared, maxWidth, lineHeight);
  return { height: result.height, lineCount: result.lineCount, isReady: true };
}

export interface UseTextLayoutOptions {
  text: string;
  font: string;
  /** System fallback font for CLS prevention (e.g. "700 48px serif") */
  fallbackFont?: string;
  maxWidth: number | null;
  lineHeight: number;
}

export interface UseTextLayoutResult {
  height: number;
  lineCount: number;
  isReady: boolean;
}

const EMPTY: UseTextLayoutResult = { height: 0, lineCount: 0, isReady: false };

/**
 * Measures text layout dimensions using pretext's prepare() + layout().
 * Lighter than useTextLines — returns only height and line count, not line content.
 * Useful for overflow detection, uniform card heights, and space reservation.
 */
export function useTextLayout({
  text,
  font,
  fallbackFont,
  maxWidth,
  lineHeight,
}: UseTextLayoutOptions): UseTextLayoutResult {
  // Synchronous measurement — no setState in an effect
  const initial = useMemo(() => {
    if (typeof window === "undefined" || maxWidth === null || maxWidth <= 0)
      return EMPTY;

    const measureFont =
      typeof document !== "undefined" && document.fonts.check(font)
        ? font
        : (fallbackFont ?? font);

    return measure(text, measureFont, maxWidth, lineHeight);
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
    return measure(text, font, maxWidth, lineHeight);
  }, [fontLoaded, text, font, maxWidth, lineHeight, initial]);

  return result;
}
