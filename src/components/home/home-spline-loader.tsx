"use client";

import { useEffect, useState, type ReactNode } from "react";
import {
  FullScreenLogoLoader,
  type LogoLoaderVariant,
} from "@/components/ui/logo-loader/logo-loader";
import { useHeroLoaderStore } from "@/stores/hero-loader-store";

const MIN_LOADER_MS = 0;
const SAFETY_TIMEOUT_MS = 8000;
const FADE_MS = 150;

// Set by Header on any in-app pathname change. Presence means the user has
// already navigated within the tab session, so a subsequent visit to `/`
// doesn't need the splash — they're not seeing the brand for the first time.
export const SPA_SESSION_FLAG = "ms-spa-session";

// Swap between the two production loader animations. "stroke-draw" renders
// the wordmark as outlines that draw on tip-by-tip (intrinsically kinetic);
// "mask-sweep" slides a feathered gradient mask top-down across the filled
// wordmark.
const LOADER_VARIANT: LogoLoaderVariant = "stroke-draw";

// Rendered from `(home)/layout.tsx` so it sits OUTSIDE the page-level Suspense
// boundary. That way the FullScreenLogoLoader markup is part of the initial
// SSR paint (not stashed in a `<div hidden id="S:N">` placeholder), and its
// `fixed inset-0 z-100` covers the layout's Header from the very first frame.
//
// We deliberately do NOT use AnimatePresence + conditional render: that
// destroys and recreates the inner DOM each visibility toggle, which restarts
// the loader animation partway through. Instead, FullScreenLogoLoader is
// rendered once and its container's opacity transitions in/out via CSS — the
// animated element underneath stays the same DOM node for the lifetime of
// the route, so its animation runs as a single uninterrupted cycle.
//
// We also wrap the route's children and apply `inert` to that wrapper while
// the overlay is shown. This prevents keyboard users from tabbing into the
// visually obscured content underneath the loader.
export function HomeSplineLoader({ children }: { children: ReactNode }) {
  const splineReady = useHeroLoaderStore((s) => s.splineReady);
  const setSplineReady = useHeroLoaderStore((s) => s.setSplineReady);
  // First render must match SSR (loader visible). We read the SPA-session flag
  // in the post-mount effect instead, then collapse the loader immediately.
  const [minElapsed, setMinElapsed] = useState(false);
  const [unmountAfterFade, setUnmountAfterFade] = useState(false);

  // Reset on mount so that re-entering the home route always shows the loader
  // (a previous visit may have left `splineReady` true in the global store).
  // On SPA nav (session flag present) we short-circuit: mark Spline ready,
  // flush the floor timer, and unmount the overlay on the very next render.
  useEffect(() => {
    if (window.sessionStorage.getItem(SPA_SESSION_FLAG) === "true") {
      setSplineReady(true);
      setMinElapsed(true);
      setUnmountAfterFade(true);
      return;
    }
    setSplineReady(false);
    const t = window.setTimeout(() => setMinElapsed(true), MIN_LOADER_MS);
    return () => window.clearTimeout(t);
  }, [setSplineReady]);

  // Safety net: release the overlay if Spline's CDN never reports back.
  useEffect(() => {
    if (splineReady) return;
    const t = window.setTimeout(() => setSplineReady(true), SAFETY_TIMEOUT_MS);
    return () => window.clearTimeout(t);
  }, [splineReady, setSplineReady]);

  const show = !(splineReady && minElapsed);

  // Once the loader has finished fading out, remove it from the DOM so
  // pointer events / aria semantics behave correctly. This is a *one-way*
  // transition — the loader never reappears after the first fade-out.
  useEffect(() => {
    if (show || unmountAfterFade) return;
    const t = window.setTimeout(() => setUnmountAfterFade(true), FADE_MS + 50);
    return () => window.clearTimeout(t);
  }, [show, unmountAfterFade]);

  return (
    <>
      {!unmountAfterFade && (
        <div
          aria-hidden={!show}
          // While fading out, mark the overlay inert so it can't intercept
          // tab focus or clicks on its way out.
          inert={!show}
          style={{
            opacity: show ? 1 : 0,
            pointerEvents: show ? "auto" : "none",
            transition: `opacity ${FADE_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`,
          }}
        >
          <FullScreenLogoLoader variant={LOADER_VARIANT} />
        </div>
      )}
      <div inert={show}>{children}</div>
    </>
  );
}
