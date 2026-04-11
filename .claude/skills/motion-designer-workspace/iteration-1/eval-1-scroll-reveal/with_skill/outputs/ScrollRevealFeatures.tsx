"use client";

import { motion } from "motion/react";
import {
  IconWorld,
  IconBrain,
  IconUsers,
  IconCode,
  IconDeviceGamepad2,
  IconRocket,
} from "@tabler/icons-react";

/* ──────────────────────────────────────────────
   FEATURE DATA
   ────────────────────────────────────────────── */
const features = [
  {
    icon: IconWorld,
    title: "Open Worlds",
    description:
      "Vast, seamlessly streaming environments with no loading screens. Every horizon is a promise — and we deliver.",
    accent: "cyan" as const,
  },
  {
    icon: IconBrain,
    title: "Adaptive AI",
    description:
      "NPCs with emergent behaviors that learn from your playstyle. No two playthroughs are ever the same.",
    accent: "magenta" as const,
  },
  {
    icon: IconUsers,
    title: "Massive Multiplayer",
    description:
      "Shared persistent worlds supporting thousands of concurrent players in a single shard. Your actions reshape the world for everyone.",
    accent: "cyan" as const,
  },
  {
    icon: IconCode,
    title: "Modding SDK",
    description:
      "First-class modding tools shipped at launch. We build the engine — you build the universe.",
    accent: "magenta" as const,
  },
  {
    icon: IconDeviceGamepad2,
    title: "Haptic Immersion",
    description:
      "Next-gen controller feedback engineered to make you feel every impact, every texture, every heartbeat.",
    accent: "cyan" as const,
  },
  {
    icon: IconRocket,
    title: "Cross-Platform",
    description:
      "Play anywhere. Your progress, your friends, your world — unified across every device.",
    accent: "magenta" as const,
  },
];

/* ──────────────────────────────────────────────
   FEATURE CARD — Scroll-triggered fade-in + slide-up
   Each card animates independently via whileInView
   with a staggered delay based on its index.
   ────────────────────────────────────────────── */
function FeatureCard({
  icon: Icon,
  title,
  description,
  accent,
  index,
}: (typeof features)[number] & { index: number }) {
  const isCyan = accent === "cyan";

  return (
    <motion.div
      className={`
        group relative p-6 md:p-8 border
        bg-void-card/50 backdrop-blur-sm
        ${isCyan ? "border-neon-cyan/10 hover:border-neon-cyan/30" : "border-neon-magenta/10 hover:border-neon-magenta/30"}
        corner-accents
      `}
      style={{
        "--corner-color": isCyan ? "#00f0ff" : "#ff00aa",
      } as React.CSSProperties}
      /*
       * Scroll reveal animation:
       * - initial: card starts invisible, shifted 60px down, slightly scaled down
       * - whileInView: card fades in, slides to natural position, scales to 1
       * - viewport.once: animation triggers only once (no re-triggering on scroll back)
       * - viewport.margin: triggers 60px before the element enters the viewport
       * - delay: each card has an incremental 0.1s delay for the staggered "one by one" effect
       */
      initial={{ opacity: 0, y: 60, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        type: "spring",
        damping: 22,
        stiffness: 100,
        delay: index * 0.1,
      }}
      whileHover={{
        y: -4,
        transition: { type: "spring", damping: 20, stiffness: 300 },
      }}
    >
      {/* Icon */}
      <motion.div
        className={`
          mb-5 inline-flex p-3 border
          ${isCyan ? "border-neon-cyan/20 text-neon-cyan bg-neon-cyan/5" : "border-neon-magenta/20 text-neon-magenta bg-neon-magenta/5"}
        `}
        whileHover={{ rotate: 8, scale: 1.1 }}
        transition={{ type: "spring", damping: 15, stiffness: 300 }}
      >
        <Icon size={24} strokeWidth={1.5} />
      </motion.div>

      {/* Number */}
      <span
        className={`absolute top-4 right-5 font-heading text-xs tracking-widest ${isCyan ? "text-neon-cyan/20" : "text-neon-magenta/20"}`}
      >
        0{index + 1}
      </span>

      {/* Content */}
      <h3
        className={`font-heading text-base tracking-wider uppercase mb-3 ${isCyan ? "text-neon-cyan" : "text-neon-magenta"}`}
      >
        {title}
      </h3>
      <p className="text-sm leading-relaxed text-muted-foreground/80">
        {description}
      </p>

      {/* Bottom accent line */}
      <div
        className={`
          absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-700
          ${isCyan ? "bg-neon-cyan/40" : "bg-neon-magenta/40"}
        `}
      />
    </motion.div>
  );
}

/* ──────────────────────────────────────────────
   FEATURES SECTION

   Animation strategy:
   - Uses Motion's `whileInView` on each card for scroll-triggered reveals
   - Each card fades in (opacity 0 -> 1) and slides up (y: 60 -> 0)
   - Staggered delays (index * 0.1s) create the "one by one" sequential effect
   - Spring physics for natural, organic feel (damping: 22, stiffness: 100)
   - viewport.once ensures animations only play once
   - No Tailwind transition classes on animated elements (avoids conflicts)
   ────────────────────────────────────────────── */
export default function ScrollRevealFeatures() {
  return (
    <section id="features" className="relative py-32 px-6 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-void-light" />
      <div className="absolute inset-0 grid-bg" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-neon-cyan/20 to-transparent" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ type: "spring", damping: 25, stiffness: 90 }}
        >
          <motion.span
            className="inline-block px-4 py-1.5 border border-neon-cyan/20 text-[10px] tracking-[0.5em] uppercase font-heading text-neon-cyan/60 mb-6"
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Capabilities
          </motion.span>
          <h2 className="font-heading font-bold text-4xl md:text-6xl tracking-tight text-foreground mb-4">
            Built{" "}
            <span className="text-neon-cyan neon-glow-cyan">Different</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Every system engineered from the ground up. No shortcuts. No
            compromises. Just relentless innovation.
          </p>
        </motion.div>

        {/* Feature grid — staggered scroll reveal, one by one */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[1px] bg-void-border/30">
          {features.map((feature, i) => (
            <FeatureCard key={feature.title} {...feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
