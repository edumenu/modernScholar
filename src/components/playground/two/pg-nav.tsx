"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

const links = [
  { label: "The Sky", href: "#sky" },
  { label: "Method", href: "#method" },
  { label: "Brightest", href: "#brightest" },
  { label: "Stories", href: "#stories" },
];

const enter = {
  initial: { y: -24, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  transition: { duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] as const },
};

export function PgNav() {
  return (
    <>
      {/* position:fixed creates a stacking context, so the blend mode must sit
          on the fixed element itself to invert against page content. The gold
          CTA lives in its own fixed layer to escape the inversion. */}
      <motion.div
        {...enter}
        className="pointer-events-none fixed inset-x-0 top-0 z-[70] mix-blend-difference"
      >
        <nav
          aria-label="Playground Two"
          className="flex items-center justify-between px-5 py-4 md:px-10 md:py-5"
        >
          <a
            href="#sky"
            className="pg2-display pointer-events-auto text-xl text-white italic md:text-2xl"
          >
            Modern Scholar
          </a>
          <div className="hidden items-center gap-7 md:flex md:pr-36">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={cn(
                  "pg2-mono pointer-events-auto relative text-[11px] font-medium tracking-[0.18em] text-white uppercase",
                  "after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-right after:scale-x-0 after:bg-white after:transition-transform after:duration-300 after:ease-out",
                  "hover:after:origin-left hover:after:scale-x-100",
                )}
              >
                {link.label}
              </a>
            ))}
          </div>
        </nav>
      </motion.div>

      <motion.div
        {...enter}
        className="fixed top-4 right-5 z-[71] md:top-[1.15rem] md:right-10"
      >
        <a
          href="#begin"
          className="pg2-mono rounded-full bg-[var(--pg2-star)] px-4 py-2 text-[11px] font-semibold tracking-[0.14em] text-[var(--pg2-void)] uppercase transition-transform duration-300 hover:scale-105"
        >
          Start free
        </a>
      </motion.div>
    </>
  );
}
