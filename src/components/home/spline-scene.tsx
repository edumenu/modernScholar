"use client";

import { useState } from "react";
import Spline from "@splinetool/react-spline";
import { useLenis } from "lenis/react";

interface SplineSceneProps {
  /** Spline CDN URL for the .splinecode scene file. */
  scene: string;
  className?: string;
  /** Called after the Spline runtime reports the scene is loaded. */
  onLoad?: () => void;
}

/**
 * Thin wrapper around @splinetool/react-spline that:
 * - Shows a pulse placeholder until the scene reports loaded
 * - Calls lenis.resize() on load so Lenis recalculates scroll height after
 *   the WebGL canvas inflates the layout
 * Must be dynamically imported with ssr:false (Spline uses WebGL + window).
 */
export function SplineScene({ className, scene, onLoad }: SplineSceneProps) {
  const [loaded, setLoaded] = useState(false);
  const lenis = useLenis();

  return (
    <div className={className} style={{ position: "relative" }}>
      {!loaded && (
        <div className="flex size-full items-center justify-center">
          <div className="size-12 animate-pulse rounded-full bg-surface-container" />
        </div>
      )}
      <Spline
        scene={scene}
        onLoad={() => {
          setLoaded(true);
          lenis?.resize();
          onLoad?.();
        }}
        style={{
          width: "100%",
          height: "100%",
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.5s ease-in-out",
        }}
      />
    </div>
  );
}
