"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";

type Playground = {
  href: string;
  index: string;
  name: string;
  tagline: string;
  description: string;
  accent: string;
};

const playgrounds: Playground[] = [
  {
    href: "/playgroundTwo",
    index: "02",
    name: "First Light",
    tagline: "Dawn-lit editorial",
    description:
      "A starfield that resolves into sunrise — italic display type over a dark, warming canvas.",
    accent: "oklch(0.62 0.13 265)",
  },
  {
    href: "/playgroundThree",
    index: "03",
    name: "Quad",
    tagline: "Campus, room by room",
    description:
      "A guided tour of the administrative building, told in serif headlines and dotted grids.",
    accent: "oklch(0.55 0.11 150)",
  },
  {
    href: "/playgroundFour",
    index: "04",
    name: "Registrar",
    tagline: "Systems & console",
    description:
      "A technical, monospaced take — pillars, metrics, and a live console preview.",
    accent: "oklch(0.58 0.15 45)",
  },
  {
    href: "/playgroundFive",
    index: "05",
    name: "Vibrant Wellness",
    tagline: "Bright hero study",
    description:
      "A single, saturated wellness hero exploring color, motion, and depth.",
    accent: "oklch(0.68 0.16 20)",
  },
];

export function PlaygroundIndex() {
  const reduceMotion = useReducedMotion();

  const container = {
    hidden: {},
    show: {
      transition: { staggerChildren: reduceMotion ? 0 : 0.08 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  return (
    <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
      <motion.header
        initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mb-14 max-w-2xl"
      >
        <p className="mb-3 text-sm font-medium tracking-[0.16em] text-muted-foreground uppercase">
          Playground
        </p>
        <h1 className="font-heading text-4xl leading-tight text-foreground md:text-5xl">
          Design experiments
        </h1>
        <p className="mt-4 text-base text-muted-foreground md:text-lg">
          Self-contained concept routes — each with its own type, palette, and
          motion. Pick one to explore.
        </p>
      </motion.header>

      <motion.ul
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 gap-6 sm:grid-cols-2"
      >
        {playgrounds.map((pg) => (
          <motion.li key={pg.href} variants={item}>
            <Link
              href={pg.href}
              className={cn(
                "group relative flex h-full flex-col justify-between gap-10 overflow-hidden rounded-lg bg-surface-container-low p-7 shadow-md",
                "transition-transform duration-300 ease-out hover:-translate-y-1",
                "focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
              )}
            >
              <span
                aria-hidden
                className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100"
                style={{ backgroundColor: pg.accent }}
              />

              <div className="flex items-start justify-between">
                <span
                  className="font-heading text-2xl tabular-nums"
                  style={{ color: pg.accent }}
                >
                  {pg.index}
                </span>
                <Icon
                  icon="lucide:arrow-up-right"
                  className="size-5 text-muted-foreground transition-transform duration-300 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </div>

              <div>
                <p className="mb-2 text-xs font-medium tracking-[0.14em] text-muted-foreground uppercase">
                  {pg.tagline}
                </p>
                <h2 className="font-heading text-2xl text-foreground md:text-3xl">
                  {pg.name}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {pg.description}
                </p>
              </div>
            </Link>
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
}
