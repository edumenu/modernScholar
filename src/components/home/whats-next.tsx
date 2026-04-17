"use client"

import { useRef, useCallback } from "react"
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useInView,
} from "motion/react"
import { Icon } from "@iconify/react"
import { cn } from "@/lib/utils"

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

interface WhatsNextPanel {
  id: string
  /** Short heading displayed in the left column above the visual */
  sideHeading: string
  /** Label displayed above the right-column heading (e.g. "What We Build") */
  label: string
  /** Large heading in the right column */
  heading: string
  /** Two-column body text below the heading */
  columns: { left: string; right: string }
  /** Hex color for background transition */
  bgColor: string
  /** Which visual component to render in the left column */
  visual: "orbiting-icons" | "staggered-grid" | "pulsing-icon"
  /** Optional color scheme for text/icons in the visual (defaults to "primary") */
  colorSchema?: "primary" | "secondary" | "tertiary"
}

const panels: WhatsNextPanel[] = [
  {
    id: "dashboard",
    sideHeading: "Coming Soon",
    label: "Scholarship Dashboard",
    heading:
      "View your scholarship status and progress in one place. Track your applications, deadlines, and outcomes.",
    columns: {
      left: "Overview to view scholarship status and progress. Track applications, deadlines, and outcomes in one place.",
      right:
        "Our platform understands the realities of scholarship applications. We plan every step carefully, stay in close contact with your goals, and adapt to the unexpected so you never miss a deadline.",
    },
    bgColor: "#6d3532",
    visual: "orbiting-icons",
    colorSchema: "primary",
  },
  {
    id: "reminders",
    sideHeading: "Coming Soon",
    label: "Notification and Reminder System",
    heading:
      "Automatic notifications, alerts, updates, and saved reminders so you stay ahead.",
    columns: {
      left: "Set it and forget it. Our reminder system watches every deadline across all your tracked scholarships and nudges you at just the right time.",
      right:
        "Email alerts, in-app notifications, and calendar sync work together so you never scramble at the last minute again.",
    },
    bgColor: "#96a498",
    visual: "staggered-grid",
    colorSchema: "secondary",
  },
  {
    id: "personalization",
    sideHeading: "Coming Soon",
    label: "Scholarship Tracking",
    heading:
      "Scholarship essay tracking and submission checklist tailored to your academic profile.",
    columns: {
      left: "A personalized scholarship list matched to your field, GPA, and background — no more sifting through thousands of irrelevant listings.",
      right:
        "Track every essay draft, required document, and submission step in one place. Know exactly where you stand with each application at a glance.",
    },
    bgColor: "#bb6659",
    visual: "pulsing-icon",
    colorSchema: "tertiary",
  },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface WhatsNextProps {
  enableColorTransition?: boolean
}

export function WhatsNext({ enableColorTransition = true }: WhatsNextProps) {
  const prefersReduced = useReducedMotion()
  const targetRef = useRef<HTMLElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"],
  })

  const x = useTransform(
    scrollYProgress,
    [0, 1],
    ["0%", `${-(panels.length - 1) * 100}%`],
  )

  const breakpoints = panels.map((_, i) => i / (panels.length - 1))
  const colors = panels.map((p) => p.bgColor)
  const backgroundColor = useTransform(scrollYProgress, breakpoints, colors)


  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return
      if (!targetRef.current) return

      const rect = targetRef.current.getBoundingClientRect()
      const sectionTop = window.scrollY + rect.top
      const sectionHeight = rect.height

      const currentProgress = scrollYProgress.get()
      const currentIndex = Math.round(currentProgress * (panels.length - 1))

      let nextIndex = currentIndex
      if (e.key === "ArrowRight") {
        nextIndex = Math.min(currentIndex + 1, panels.length - 1)
      } else {
        nextIndex = Math.max(currentIndex - 1, 0)
      }

      if (nextIndex !== currentIndex) {
        const targetY =
          sectionTop +
          (nextIndex / (panels.length - 1)) *
            (sectionHeight - window.innerHeight)
        window.scrollTo({ top: targetY, behavior: "smooth" })
      }
    },
    [scrollYProgress],
  )

  // -----------------------------------------------------------------------
  // Reduced motion fallback
  // -----------------------------------------------------------------------
  if (prefersReduced) {
    return (
      <section
        aria-label="What's Next"
        className="relative left-1/2 w-dvw -translate-x-1/2"
      >
        {panels.map((panel) => (
          <div
            key={panel.id}
            className="px-6 py-20 md:px-8"
            style={{ backgroundColor: panel.bgColor }}
          >
            <div className="mx-auto w-full max-w-7xl">
              <SlideContent panel={panel} />
            </div>
          </div>
        ))}
      </section>
    )
  }

  // -----------------------------------------------------------------------
  // Horizontal scroll
  // -----------------------------------------------------------------------
  return (
    <section
      ref={targetRef}
      aria-label="What's Next"
      aria-roledescription="carousel"
      className="relative left-1/2 w-dvw -translate-x-1/2"
      style={{ height: `${panels.length * 80}vh` }}
    >
      <motion.div
        ref={stickyRef}
        className="sticky top-0 h-dvh overflow-hidden"
        style={{
          backgroundColor: enableColorTransition
            ? backgroundColor
            : panels[0].bgColor,
        }}
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        <motion.div className="flex h-full will-change-transform" style={{ x }}>
          {panels.map((panel, index) => (
            <div
              key={panel.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${panels.length}: ${panel.label}`}
              className="flex h-full min-w-screen items-center px-6 md:px-8"
            >
              <div className="mx-auto w-full max-w-7xl">
                <SlideContent panel={panel} />
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Two-column slide layout (matches screenshot)
// ---------------------------------------------------------------------------

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
} as const;

function SlideContent({ panel }: { panel: WhatsNextPanel }) {
  const schema = panel.colorSchema ?? "primary"
  const colors = colorClasses[schema]

  return (
    <div className="grid h-full grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-16">
      {/* ---- Left column: side heading + visual ---- */}
      <div className="flex flex-col h-110 gap-6 lg:gap-8">
        <h2 className={cn("font-heading text-3xl font-bold leading-tight tracking-tight md:text-4xl lg:text-5xl", colors.heading)}>
          {panel.sideHeading}
        </h2>

        {/* Visual component */}
        <div className="flex aspect-video w-full items-center justify-center overflow-hidden rounded-xl">
          <PanelVisual visual={panel.visual} />
        </div>
      </div>

      {/* ---- Right column: label + heading + two-column body ---- */}
      <div className="flex flex-col gap-8 md:gap-10">
        {/* Label with top border */}
        <div className="border-t border-white/30 pt-4">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-300">
            {panel.label}
          </p>
        </div>

        {/* Large heading */}
        <h3 className={cn("font-heading text-2xl font-bold leading-tight tracking-tight md:text-3xl lg:text-[2.4rem] lg:leading-[1.12]", colors.heading)}>
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
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Panel Visual Selector
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Visual 1: Orbiting Icons
// ---------------------------------------------------------------------------

const orbitIcons = [
  { icon: "solar:square-academic-cap-bold-duotone", radius: 120, duration: 12, delay: 0 },
  { icon: "solar:book-bold-duotone", radius: 120, duration: 12, delay: -2.4 },
  { icon: "solar:cup-star-bold-duotone", radius: 120, duration: 12, delay: -4.8 },
  { icon: "solar:dollar-minimalistic-bold-duotone", radius: 120, duration: 12, delay: -7.2 },
  { icon: "solar:pen-new-round-bold-duotone", radius: 120, duration: 12, delay: -9.6 },
]

function OrbitingIcons() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })
  const prefersReduced = useReducedMotion()

  return (
    <motion.div
      ref={ref}
      className="relative flex size-85 items-center justify-center md:size-105"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={isInView ? { opacity: 1, scale: 1 } : undefined}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Central icon */}
      <div className="relative z-10 flex size-16 items-center justify-center rounded-full bg-white/20 shadow-lg">
        <Icon icon="solar:magnifer-bold-duotone" className="size-8 text-white" />
      </div>

      {/* Orbit ring (decorative) */}
      <div className="absolute inset-5 rounded-full border border-white/15 md:inset-9.5" />

      {/* Orbiting icons */}
      {orbitIcons.map((item, i) => (
        <div
          key={i}
          className="absolute left-1/2 top-1/2"
          style={{
            width: 0,
            height: 0,
            animation: prefersReduced
              ? "none"
              : `orbit ${item.duration}s linear infinite`,
            animationDelay: `${item.delay}s`,
            ...(prefersReduced
              ? {
                  transform: `rotate(${i * 72}deg) translateX(${item.radius}px) rotate(-${i * 72}deg)`,
                }
              : {}),
          }}
        >
          <div
            className="flex size-20 -translate-x-[10%] -translate-y-1/2 items-center justify-center rounded-full bg-white/20 shadow-md"
            style={{
              animation: prefersReduced
                ? "none"
                : `counter-rotate ${item.duration}s linear infinite`,
              animationDelay: `${item.delay}s`,
            }}
          >
            <Icon icon={item.icon} className="size-14 text-white" />
          </div>
        </div>
      ))}

      {/* Inline keyframes for orbit */}
      <style>{`
        @keyframes orbit {
          from { transform: rotate(0deg) translateX(90px); }
          to   { transform: rotate(360deg) translateX(90px); }
        }
        @keyframes counter-rotate {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to   { transform: translate(-50%, -50%) rotate(-360deg); }
        }
      `}</style>
    </motion.div>
  )
}

// ---------------------------------------------------------------------------
// Visual 2: Staggered Icon Grid
// ---------------------------------------------------------------------------

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

function StaggeredGrid() {
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

// ---------------------------------------------------------------------------
// Visual 3: Pulsing Trophy Icon
// ---------------------------------------------------------------------------

function PulsingIcon() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })
  const prefersReduced = useReducedMotion()

  return (
    <motion.div
      ref={ref}
      className="relative flex size-45 items-center justify-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={isInView ? { opacity: 1, scale: 1 } : undefined}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Glow ring */}
      <motion.div
        className="absolute size-40 rounded-full"
        style={{
          background:
            "radial-gradient(circle, oklch(0.65 0.12 31 / 0.35) 0%, transparent 70%)",
        }}
        animate={
          isInView && !prefersReduced
            ? {
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.55, 0.3],
              }
            : { scale: 1, opacity: 0.4 }
        }
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Icon container */}
      <motion.div
        className="relative z-10 flex size-40 items-center justify-center rounded-full bg-white/20 shadow-lg"
        animate={
          isInView && !prefersReduced
            ? {
                scale: [1, 1.08, 1],
              }
            : undefined
        }
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Icon icon="solar:cup-star-bold-duotone" className="size-24 text-white" />
      </motion.div>
    </motion.div>
  )
}
