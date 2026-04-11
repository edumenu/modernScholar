"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useMotionValue, useAnimation } from "motion/react"

interface CarouselItem {
  id: string | number
  image: string
  title?: string
}

interface DragCarouselProps {
  items: CarouselItem[]
  itemWidth?: number
  gap?: number
  snapToItem?: boolean
}

export default function DragCarousel({
  items,
  itemWidth = 300,
  gap = 16,
  snapToItem = true,
}: DragCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const controls = useAnimation()
  const [containerWidth, setContainerWidth] = useState(0)

  useEffect(() => {
    function updateWidth() {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth)
      }
    }
    updateWidth()
    window.addEventListener("resize", updateWidth)
    return () => window.removeEventListener("resize", updateWidth)
  }, [])

  const totalContentWidth = items.length * (itemWidth + gap) - gap
  const maxDrag = Math.max(0, totalContentWidth - containerWidth)

  function handleDragEnd(
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: { offset: { x: number }; velocity: { x: number } }
  ) {
    const currentX = x.get()

    if (snapToItem) {
      // Calculate which item to snap to based on velocity + position
      const step = itemWidth + gap
      const velocityOffset = info.velocity.x * 0.2
      const projectedX = currentX + velocityOffset

      // Round to nearest snap point
      const snapIndex = Math.round(-projectedX / step)
      const clampedIndex = Math.max(0, Math.min(snapIndex, items.length - 1))

      // Ensure we don't scroll past the end
      const targetX = Math.max(-maxDrag, Math.min(0, -clampedIndex * step))

      controls.start({
        x: targetX,
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 30,
        },
      })
    } else {
      // Clamp within bounds without snapping
      const clampedX = Math.max(-maxDrag, Math.min(0, currentX))
      if (clampedX !== currentX) {
        controls.start({
          x: clampedX,
          transition: {
            type: "spring",
            stiffness: 300,
            damping: 30,
          },
        })
      }
    }
  }

  return (
    <div
      ref={containerRef}
      className="overflow-hidden cursor-grab active:cursor-grabbing"
    >
      <motion.div
        className="flex"
        style={{ x, gap }}
        drag="x"
        dragConstraints={{ left: -maxDrag, right: 0 }}
        dragElastic={0.1}
        dragTransition={{ bounceStiffness: 300, bounceDamping: 30 }}
        onDragEnd={handleDragEnd}
        animate={controls}
      >
        {items.map((item) => (
          <motion.div
            key={item.id}
            className="shrink-0 select-none"
            style={{ width: itemWidth }}
          >
            <div className="relative overflow-hidden rounded-xl bg-neutral-100 aspect-[4/3]">
              <img
                src={item.image}
                alt={item.title ?? ""}
                className="w-full h-full object-cover pointer-events-none"
                draggable={false}
              />
            </div>
            {item.title && (
              <p className="mt-2 text-sm font-medium text-neutral-800 truncate">
                {item.title}
              </p>
            )}
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
