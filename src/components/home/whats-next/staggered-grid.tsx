"use client"

import { useRef } from "react"
import { motion, useInView, useReducedMotion } from "motion/react"
import { Icon } from "@iconify/react"

const gridIcons: {
  icon: string
  label: string
  idle: Record<string, number[] | string>
  timing: { duration: number; delay: number }
}[] = [
  {
    icon: "solar:calendar-bold-duotone",
    label: "Deadlines",
    idle: { y: [0, -6, 0] },
    timing: { duration: 2.8, delay: 0 },
  },
  {
    icon: "solar:bell-bold-duotone",
    label: "Alerts",
    idle: { rotate: [0, 12, -12, 8, -8, 0] },
    timing: { duration: 2.4, delay: 0.3 },
  },
  {
    icon: "solar:checklist-minimalistic-bold-duotone",
    label: "Tasks",
    idle: { scale: [1, 1.15, 1] },
    timing: { duration: 2.6, delay: 0.6 },
  },
  {
    icon: "solar:clock-circle-bold-duotone",
    label: "Timeline",
    idle: { rotate: [0, 360] },
    timing: { duration: 8, delay: 0 },
  },
  {
    icon: "solar:chart-2-bold-duotone",
    label: "Progress",
    idle: { y: [0, -5, 0], scale: [1, 1.08, 1] },
    timing: { duration: 3, delay: 0.9 },
  },
  {
    icon: "solar:folder-bold-duotone",
    label: "Documents",
    idle: { rotate: [0, -8, 8, -4, 0] },
    timing: { duration: 3.2, delay: 1.2 },
  },
]

const gridContainerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
}

const gridItemVariants = {
  hidden: { opacity: 0, scale: 0.7, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
}

export function StaggeredGrid() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })
  const prefersReduced = useReducedMotion()

  return (
    <motion.div
      ref={ref}
      className="grid grid-cols-3 gap-3"
      variants={gridContainerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      {gridIcons.map((item) => (
        <motion.div
          key={item.label}
          className="flex size-30 flex-col items-center justify-center gap-1 rounded-2xl bg-white/15"
          variants={gridItemVariants}
        >
          <motion.div
            animate={
              isInView && !prefersReduced ? item.idle : undefined
            }
            transition={{
              duration: item.timing.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: item.timing.delay,
            }}
          >
            <Icon icon={item.icon} className="size-14 text-white" />
          </motion.div>
          <span className="text-[10px] font-medium text-white/70">
            {item.label}
          </span>
        </motion.div>
      ))}
    </motion.div>
  )
}
