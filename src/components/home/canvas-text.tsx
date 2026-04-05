"use client";

import { useRef, useEffect, useCallback } from "react";
import {
  prepareWithSegments,
  layoutWithLines,
  type LayoutLine,
} from "@chenglou/pretext";
import { useMotionValue, useTransform, useScroll } from "motion/react";
import { useContainerWidth } from "@/lib/pretext/use-container-width";

interface CanvasTextProps {
  text: string;
  font: string;
  lineHeight: number;
  /** Height of the canvas in CSS pixels */
  height: number;
  /** Text color (CSS color string) */
  color?: string;
  /** Gradient colors for a horizontal text gradient. Overrides `color`. */
  gradient?: { start: string; end: string };
  /** Text alignment */
  align?: "left" | "center" | "right";
  /** Enable scroll-driven reveal wipe effect */
  scrollReveal?: boolean;
  className?: string;
}

/**
 * Renders text to a canvas element using pretext for line measurement.
 * Enables effects impossible with CSS: gradient fills, scroll-driven reveals, etc.
 */
export function CanvasText({
  text,
  font,
  lineHeight,
  height,
  color = "#000",
  gradient,
  align = "center",
  scrollReveal = false,
  className,
}: CanvasTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const width = useContainerWidth(containerRef);
  const linesRef = useRef<LayoutLine[]>([]);

  // Scroll progress for reveal effect
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end center"],
  });

  const revealProgress = useMotionValue(1);
  const animatedProgress = useTransform(
    scrollYProgress,
    [0, 0.6],
    [0, 1],
  );

  // Use scroll progress if scrollReveal is enabled
  useEffect(() => {
    if (!scrollReveal) return;
    return animatedProgress.on("change", (v) => revealProgress.set(v));
  }, [scrollReveal, animatedProgress, revealProgress]);

  const draw = useCallback(
    (progress: number) => {
      const canvas = canvasRef.current;
      if (!canvas || !width) return;

      const dpr = window.devicePixelRatio || 1;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.font = font;
      ctx.textBaseline = "top";

      // Set fill style: gradient or solid color
      if (gradient) {
        const grad = ctx.createLinearGradient(0, 0, width, 0);
        grad.addColorStop(0, gradient.start);
        grad.addColorStop(1, gradient.end);
        ctx.fillStyle = grad;
      } else {
        ctx.fillStyle = color;
      }

      const lines = linesRef.current;
      const totalHeight = lines.length * lineHeight;
      const yOffset = Math.max(0, (height - totalHeight) / 2);

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const y = yOffset + i * lineHeight;

        // Calculate x position based on alignment
        let x = 0;
        if (align === "center") {
          x = (width - line.width) / 2;
        } else if (align === "right") {
          x = width - line.width;
        }

        // Scroll reveal: clip to reveal from left
        if (scrollReveal) {
          const lineProgress = Math.min(
            1,
            Math.max(0, (progress * (lines.length + 1) - i) / 1),
          );
          if (lineProgress <= 0) continue;

          ctx.save();
          ctx.beginPath();
          ctx.rect(x, y, line.width * lineProgress, lineHeight);
          ctx.clip();
          ctx.fillText(line.text, x, y);
          ctx.restore();
        } else {
          ctx.fillText(line.text, x, y);
        }
      }

      ctx.restore();
    },
    [width, font, color, gradient, lineHeight, height, align, scrollReveal],
  );

  // Measure text and set up canvas
  useEffect(() => {
    if (!width || width <= 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    // Wait for font before measuring
    const doMeasure = () => {
      const prepared = prepareWithSegments(text, font);
      const result = layoutWithLines(prepared, width, lineHeight);
      linesRef.current = result.lines;
      draw(revealProgress.get());
    };

    if (document.fonts.check(font)) {
      doMeasure();
    } else {
      document.fonts.ready.then(doMeasure);
    }
  }, [text, font, width, lineHeight, height, draw, revealProgress]);

  // Re-draw on scroll progress change
  useEffect(() => {
    if (!scrollReveal) {
      draw(1);
      return;
    }
    return revealProgress.on("change", draw);
  }, [scrollReveal, revealProgress, draw]);

  return (
    <div ref={containerRef} className={className}>
      <canvas
        ref={canvasRef}
        className="block"
        style={{ width: width ?? "100%", height }}
        aria-hidden="true"
      />
      {/* Accessible text for screen readers */}
      <span className="sr-only">{text}</span>
    </div>
  );
}
