"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { motion, transform, useScroll, useTransform } from "motion/react";

const Constellation = dynamic(() => import("./constellation"), { ssr: false });

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.5 } },
};

const lineUp = {
  hidden: { y: "110%" },
  visible: {
    y: "0%",
    transition: { duration: 1, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const },
  },
};

// Function-form transforms avoid Motion's native ViewTimeline promotion,
// which mis-tracks progress for section-target scroll offsets (see dawn.tsx).
const mapSkyOpacity = transform([0.3, 1], [1, 0]);
const mapCopyY = transform([0, 1], [0, -120]);

const stats = [
  { value: "12,438", label: "awards mapped" },
  { value: "$2.1B", label: "in funding tracked" },
  { value: "9 min", label: "to a first match" },
];

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const skyOpacity = useTransform(() => mapSkyOpacity(scrollYProgress.get()));
  const copyY = useTransform(() => mapCopyY(scrollYProgress.get()));

  return (
    <section
      id="sky"
      ref={sectionRef}
      aria-labelledby="pg2-hero-heading"
      className="relative flex min-h-dvh flex-col overflow-hidden bg-[var(--pg2-void)]"
    >
      {/* Nebula haze beneath the starfield */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 70% 30%, rgba(36,30,63,0.55), transparent 70%), radial-gradient(50% 40% at 20% 75%, rgba(36,30,63,0.4), transparent 70%), radial-gradient(35% 30% at 50% 95%, rgba(240,194,92,0.07), transparent 70%)",
        }}
      />

      <motion.div style={{ opacity: skyOpacity }} className="absolute inset-0">
        <Constellation />
      </motion.div>

      <motion.div
        style={{ y: copyY }}
        variants={container}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex flex-1 flex-col justify-center px-5 pt-28 md:px-10"
      >
        <motion.p
          variants={fadeUp}
          className="pg2-mono mb-6 text-[11px] font-medium tracking-[0.32em] text-[var(--pg2-star)] uppercase md:text-xs"
        >
          Scholarship management, reimagined
        </motion.p>

        <h1
          id="pg2-hero-heading"
          className="pg2-display max-w-5xl text-[clamp(3.2rem,9.5vw,8.5rem)] leading-[0.95] font-normal tracking-tight text-[var(--pg2-moon)]"
        >
          <span className="block overflow-hidden pb-[0.08em]">
            <motion.span variants={lineUp} className="block">
              Every scholarship
            </motion.span>
          </span>
          <span className="block overflow-hidden pb-[0.08em]">
            <motion.span variants={lineUp} className="block">
              is a <em className="text-[var(--pg2-star)] italic">star.</em>
            </motion.span>
          </span>
        </h1>

        <motion.p
          variants={fadeUp}
          className="mt-7 max-w-xl text-base leading-relaxed text-[var(--pg2-dusk)] md:text-lg"
        >
          Modern Scholar maps twelve thousand awards into one living sky, finds
          the constellation that fits your story, and guides every application
          from first draft to submitted.
        </motion.p>

        <motion.div variants={fadeUp} className="mt-10 flex flex-wrap items-center gap-4">
          <a
            href="#begin"
            className="group relative overflow-hidden rounded-full bg-[var(--pg2-star)] px-8 py-4 text-sm font-semibold text-[var(--pg2-void)] transition-shadow duration-300 hover:shadow-[0_0_40px_rgba(240,194,92,0.35)]"
          >
            <span className="relative z-10">Chart my sky</span>
            <span
              aria-hidden
              className="absolute inset-0 -translate-x-full bg-[var(--pg2-star-soft)] transition-transform duration-500 ease-out group-hover:translate-x-0"
            />
          </a>
          <a
            href="#method"
            className="pg2-mono rounded-full border border-[var(--pg2-line-dark)] px-7 py-4 text-[11px] font-medium tracking-[0.18em] text-[var(--pg2-moon)] uppercase transition-colors duration-300 hover:border-[var(--pg2-star)] hover:text-[var(--pg2-star)]"
          >
            See the method
          </a>
        </motion.div>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="relative z-10 border-t border-[var(--pg2-line-dark)] px-5 md:px-10"
      >
        <motion.div
          variants={fadeUp}
          className="flex flex-wrap items-center justify-between gap-x-10 gap-y-4 py-6"
        >
          <div className="flex flex-wrap gap-x-12 gap-y-4">
            {stats.map((stat) => (
              <div key={stat.label} className="flex items-baseline gap-3">
                <span className="pg2-display text-2xl text-[var(--pg2-star-soft)] md:text-3xl">
                  {stat.value}
                </span>
                <span className="pg2-mono text-[10px] tracking-[0.2em] text-[var(--pg2-dusk)] uppercase">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
          <div className="hidden items-center gap-3 md:flex" aria-hidden>
            <span className="pg2-mono text-[10px] tracking-[0.2em] text-[var(--pg2-dusk)] uppercase">
              Scroll
            </span>
            <span className="pg2-scroll-cue block h-8 w-px bg-[var(--pg2-star)]" />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
