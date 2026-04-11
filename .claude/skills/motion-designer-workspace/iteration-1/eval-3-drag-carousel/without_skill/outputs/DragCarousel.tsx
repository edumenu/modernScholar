"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";

// --- Types ---
interface CarouselItem {
  id: string | number;
  src: string;
  alt?: string;
  title?: string;
}

interface DragCarouselProps {
  items: CarouselItem[];
  itemWidth?: number;
  gap?: number;
  /** Spring stiffness for snap animation (default 300) */
  snapStiffness?: number;
  /** Spring damping for snap animation (default 30) */
  snapDamping?: number;
  className?: string;
}

// --- Constants ---
const VELOCITY_SCALE = 0.2;

// --- Component ---
export default function DragCarousel({
  items,
  itemWidth = 280,
  gap = 16,
  snapStiffness = 300,
  snapDamping = 30,
  className = "",
}: DragCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  const stride = itemWidth + gap;
  const totalWidth = items.length * stride - gap;

  // The raw drag offset
  const x = useMotionValue(0);

  // Spring-animated version that snaps
  const springX = useSpring(x, {
    stiffness: snapStiffness,
    damping: snapDamping,
    mass: 0.8,
  });

  // Track active index for dot indicators
  const [activeIndex, setActiveIndex] = useState(0);

  // Measure container width
  useEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Max drag bound (negative value = scrolled to end)
  const maxDrag = 0;
  const minDrag = containerWidth > 0 ? -(totalWidth - containerWidth) : 0;

  // Snap to the nearest item boundary
  const snapToNearest = useCallback(
    (currentX: number, velocity: number) => {
      // Apply momentum from velocity
      const projected = currentX + velocity * VELOCITY_SCALE;

      // Clamp within bounds
      const clamped = Math.max(minDrag, Math.min(maxDrag, projected));

      // Find nearest snap point
      const snapIndex = Math.round(-clamped / stride);
      const clampedIndex = Math.max(
        0,
        Math.min(items.length - 1, snapIndex)
      );

      const snapTarget = -clampedIndex * stride;
      // Clamp the snap target so it doesn't exceed bounds
      const finalTarget = Math.max(minDrag, Math.min(maxDrag, snapTarget));

      setActiveIndex(clampedIndex);
      x.set(finalTarget);
    },
    [minDrag, maxDrag, stride, items.length, x]
  );

  // Per-item parallax/scale effect based on proximity to viewport center
  function ItemWrapper({
    index,
    children,
  }: {
    index: number;
    children: React.ReactNode;
  }) {
    const itemCenter = index * stride + itemWidth / 2;
    const viewportCenter = containerWidth / 2;

    const scale = useTransform(springX, (latest: number) => {
      const offset = Math.abs(latest + itemCenter - viewportCenter);
      const normalized = Math.min(offset / (containerWidth / 2), 1);
      return 1 - normalized * 0.08;
    });

    const opacity = useTransform(springX, (latest: number) => {
      const offset = Math.abs(latest + itemCenter - viewportCenter);
      const normalized = Math.min(offset / (containerWidth / 2), 1);
      return 1 - normalized * 0.4;
    });

    return (
      <motion.div style={{ scale, opacity }} className="will-change-transform">
        {children}
      </motion.div>
    );
  }

  return (
    <div
      className={`relative select-none overflow-hidden ${className}`}
      ref={containerRef}
    >
      {/* Draggable track */}
      <motion.div
        className="flex cursor-grab active:cursor-grabbing"
        style={{
          x: springX,
          gap: `${gap}px`,
        }}
        drag="x"
        dragConstraints={{
          left: minDrag,
          right: maxDrag,
        }}
        dragElastic={0.15}
        dragTransition={{
          power: 0.3,
          timeConstant: 200,
        }}
        onDrag={(_, info) => {
          x.set(info.offset.x + x.get());
        }}
        onDragEnd={(_, info) => {
          snapToNearest(springX.get(), info.velocity.x);
        }}
      >
        {items.map((item, i) => (
          <ItemWrapper key={item.id} index={i}>
            <div
              className="flex-shrink-0 overflow-hidden rounded-2xl bg-neutral-100 dark:bg-neutral-800"
              style={{ width: itemWidth }}
            >
              <img
                src={item.src}
                alt={item.alt || ""}
                className="pointer-events-none h-[320px] w-full object-cover"
                draggable={false}
              />
              {item.title && (
                <div className="px-4 py-3">
                  <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                    {item.title}
                  </p>
                </div>
              )}
            </div>
          </ItemWrapper>
        ))}
      </motion.div>

      {/* Dot indicators */}
      {items.length > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          {items.map((item, i) => (
            <button
              key={item.id}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => {
                const target = -i * stride;
                const clamped = Math.max(
                  minDrag,
                  Math.min(maxDrag, target)
                );
                setActiveIndex(i);
                x.set(clamped);
              }}
              className={`h-2 rounded-full transition-all duration-200 ${
                i === activeIndex
                  ? "w-6 bg-neutral-900 dark:bg-neutral-100"
                  : "w-2 bg-neutral-300 dark:bg-neutral-600"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
