"use client"

import {
  motion,
  useTransform,
  useMotionValue,
  type MotionValue,
} from "motion/react";
import { cn } from "@/lib/utils"
import type { WhatsNextPanel } from "./types"
import { OrbitingIcons } from "./orbiting-icons"
import { StaggeredGrid } from "./staggered-grid"
import { PulsingIcon } from "./pulsing-icon"

// Static class map — Tailwind v4 requires complete class strings for detection
const colorClasses = {
  primary: {
    heading: "text-primary-100 dark:text-primary-100",
    body: "text-primary-300 dark:text-primary-200",
  },
  secondary: {
    heading: "text-secondary-100 dark:text-secondary-100",
    body: "text-secondary-300 dark:text-secondary-200",
  },
  tertiary: {
    heading: "text-tertiary-100 dark:text-tertiary-100",
    body: "text-tertiary-300 dark:text-tertiary-200",
  },
} as const

function PanelVisual({ visual }: { visual: WhatsNextPanel["visual"] }) {
  switch (visual) {
    case "orbiting-icons":
      return <OrbitingIcons />
    case "staggered-grid":
      return <StaggeredGrid />
    case "pulsing-icon":
      return <PulsingIcon />
  }
}

interface SlideContentProps {
  panel: WhatsNextPanel;
  scrollYProgress?: MotionValue<number>;
  panelIndex?: number;
  totalPanels?: number;
}

export function SlideContent({
  panel,
  scrollYProgress,
  panelIndex = 0,
  totalPanels = 1,
}: SlideContentProps) {
  const schema = panel.colorSchema ?? "primary";
  const colors = colorClasses[schema];

  // Horizontal parallax: left column leads, right column trails
  const fallback = useMotionValue(0);
  const progress = scrollYProgress ?? fallback;
  const hasParallax = !!scrollYProgress;

  const center = totalPanels > 1 ? panelIndex / (totalPanels - 1) : 0;
  const spread = totalPanels > 1 ? 1 / (totalPanels - 1) : 1;

  const leftX = useTransform(
    progress,
    [center - spread, center, center + spread],
    hasParallax ? [-30, 0, 30] : [0, 0, 0],
  );

  const rightX = useTransform(
    progress,
    [center - spread, center, center + spread],
    hasParallax ? [50, 0, 50] : [0, 0, 0],
  );

  return (
    <div className="grid h-full grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-16">
      {/* ---- Left column: side heading + visual ---- */}
      <motion.div
        className="flex flex-col h-110 gap-6 lg:gap-8"
        style={{ x: leftX, willChange: "transform" }}
      >
        <h2
          className={cn(
            "font-heading text-3xl font-bold leading-tight tracking-tight md:text-4xl lg:text-5xl",
            colors.heading,
          )}
        >
          {panel.sideHeading}
        </h2>

        {/* Visual component */}
        <div className="flex aspect-video w-full items-center justify-center overflow-hidden rounded-xl">
          <PanelVisual visual={panel.visual} />
        </div>
      </motion.div>

      {/* ---- Right column: label + heading + two-column body ---- */}
      <motion.div
        className="flex flex-col gap-8 md:gap-10"
        style={{ x: rightX, willChange: "transform" }}
      >
        {/* Label with top border */}
        <div className="border-t border-white/30 pt-4">
          <p className="text-xs font-bold uppercase tracking-widest text-white/70">
            {panel.label}
          </p>
        </div>

        {/* Large heading */}
        <h3
          className={cn(
            "font-heading text-2xl font-bold leading-tight tracking-tight md:text-3xl lg:text-[2.4rem] lg:leading-[1.12]",
            colors.heading,
          )}
        >
          {panel.heading}
        </h3>

        {/* Two-column body text */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <p className={cn("text-sm font-medium leading-relaxed", colors.body)}>
            {panel.columns.left}
          </p>
          <p className={cn("text-sm font-medium leading-relaxed", colors.body)}>
            {panel.columns.right}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
