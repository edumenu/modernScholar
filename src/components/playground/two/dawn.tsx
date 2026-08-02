"use client";

import { useRef } from "react";
import { motion, transform, useScroll, useTransform } from "motion/react";

// Function-form transforms stay on the JS thread. The declarative form gets
// promoted to a native ViewTimeline, which tracks the sticky element's own
// visibility instead of this section's scroll progress.
// Waypoints through warm dusk tones keep the mix from going dead gray.
const mapBg = transform(
  [0.12, 0.38, 0.56, 0.68],
  ["#07070d", "#2c2136", "#b08d68", "#f7f2e8"],
);
const mapNightOpacity = transform([0.05, 0.34], [1, 0]);
const mapNightY = transform([0.05, 0.34], [0, -60]);
const mapDayOpacity = transform([0.46, 0.72], [0, 1]);
const mapDayY = transform([0.46, 0.72], [60, 0]);
const mapGlowOpacity = transform([0.1, 0.45, 0.85], [0, 0.85, 0]);
const mapGlowScale = transform([0.1, 0.85], [0.6, 1.5]);

export function Dawn() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const backgroundColor = useTransform(() => mapBg(scrollYProgress.get()));
  const nightOpacity = useTransform(() => mapNightOpacity(scrollYProgress.get()));
  const nightY = useTransform(() => mapNightY(scrollYProgress.get()));
  const dayOpacity = useTransform(() => mapDayOpacity(scrollYProgress.get()));
  const dayY = useTransform(() => mapDayY(scrollYProgress.get()));
  const glowOpacity = useTransform(() => mapGlowOpacity(scrollYProgress.get()));
  const glowScale = useTransform(() => mapGlowScale(scrollYProgress.get()));

  return (
    <section ref={sectionRef} aria-label="Transition" className="relative h-[260vh]">
      <motion.div
        style={{ backgroundColor }}
        className="sticky top-0 flex h-dvh items-center justify-center overflow-hidden"
      >
        {/* Sunrise glow cresting the horizon */}
        <motion.div
          aria-hidden
          style={{ opacity: glowOpacity, scale: glowScale }}
          className="absolute -bottom-1/3 left-1/2 h-[80vh] w-[120vw] -translate-x-1/2 rounded-[50%]"
        >
          <div
            className="h-full w-full rounded-[50%]"
            style={{
              background:
                "radial-gradient(50% 50% at 50% 50%, rgba(240,194,92,0.55), rgba(240,194,92,0.12) 55%, transparent 75%)",
            }}
          />
        </motion.div>

        <motion.p
          style={{ opacity: nightOpacity, y: nightY }}
          className="pg2-display absolute px-6 text-center text-[clamp(2rem,5.5vw,4.75rem)] leading-tight text-[var(--pg2-moon)]"
        >
          Most students search
          <br />
          in the <em className="italic">dark.</em>
        </motion.p>

        <motion.p
          style={{ opacity: dayOpacity, y: dayY }}
          className="pg2-display absolute px-6 text-center text-[clamp(2rem,5.5vw,4.75rem)] leading-tight text-[var(--pg2-ink)]"
        >
          So we brought
          <br />
          the <em className="text-[var(--pg2-gold-deep)] italic">morning.</em>
        </motion.p>
      </motion.div>
    </section>
  );
}
