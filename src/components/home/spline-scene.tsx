"use client"

import { useState } from "react";
import Spline from "@splinetool/react-spline";

const DEFAULT_SCENE_URL =
  "https://prod.spline.design/JY2cfwfllYa7FSve/scene.splinecode";

export function SplineScene({
  className,
  scene = DEFAULT_SCENE_URL,
}: {
  className?: string;
  scene?: string;
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={className} style={{ position: "relative" }}>
      {!loaded && (
        <div className="flex size-full items-center justify-center">
          <div className="size-12 animate-pulse rounded-full bg-surface-container" />
        </div>
      )}
      <Spline
        scene={scene}
        onLoad={() => setLoaded(true)}
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
