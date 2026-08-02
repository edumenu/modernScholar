"use client";

import { useEffect, useRef } from "react";
import { animate, motion, useInView, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

const STATS = [
  { value: 4.8, decimals: 1, prefix: "$", suffix: "M", label: "awarded through Quad", outline: false },
  { value: 12, decimals: 0, prefix: "", suffix: "k", label: "applicants welcomed", outline: true },
  { value: 97, decimals: 0, prefix: "", suffix: "%", label: "less paperwork", outline: false },
  { value: 0, decimals: 0, prefix: "", suffix: "", label: "essays lost, ever", outline: true },
];

function Counter({
  value,
  decimals,
  prefix,
  suffix,
}: {
  value: number;
  decimals: number;
  prefix: string;
  suffix: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!inView || !node) return;
    const format = (v: number) => `${prefix}${v.toFixed(decimals)}${suffix}`;
    if (reduceMotion) {
      node.textContent = format(value);
      return;
    }
    const controls = animate(0, value, {
      duration: 1.4,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        node.textContent = format(v);
      },
    });
    return () => controls.stop();
  }, [inView, value, decimals, prefix, suffix, reduceMotion]);

  return <span ref={ref}>{`${prefix}0${suffix}`}</span>;
}

export function Numbers() {
  return (
    <section
      id="numbers"
      className="scroll-mt-24 border-y-2 border-[var(--pg3-ink)] bg-[var(--pg3-sand)] px-4 py-20 md:py-24"
    >
      <div className="mx-auto grid max-w-6xl gap-12 text-center sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ type: "spring", stiffness: 190, damping: 20, delay: i * 0.08 }}
          >
            <p
              className={cn(
                "pg3-display text-6xl md:text-7xl",
                stat.outline && "pg3-outline-num",
              )}
            >
              <Counter
                value={stat.value}
                decimals={stat.decimals}
                prefix={stat.prefix}
                suffix={stat.suffix}
              />
            </p>
            <p className="pg3-mono mt-3 text-xs uppercase tracking-[0.18em] text-[var(--pg3-ink-soft)]">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
