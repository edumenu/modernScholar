"use client";

import { Icon } from "@iconify/react";
import { AnimatedSection } from "../ui/animatedSection/animated-section";
import { ParallaxLayer } from "@/components/ui/parallax-layer";
import { ButtonLink } from "@/components/ui/button/button-link";
import { CoverflowCarousel } from "./coverflow-carousel";
import { scholarships as allScholarships } from "@/data/scholarships";
import { SESSION_DATE } from "@/lib/session-date";

function filterForMonth(year: number, month: number, since?: Date) {
  const sinceMs = since?.getTime();
  return allScholarships
    .map((s) => ({
      s,
      ms: new Date(`${s.deadline}, ${s.deadlineYear}`).getTime(),
    }))
    .filter(({ ms }) => {
      if (!Number.isFinite(ms) || ms === 0) return false;
      const d = new Date(ms);
      if (d.getFullYear() !== year || d.getMonth() !== month) return false;
      return sinceMs === undefined || ms >= sinceMs;
    })
    .sort((a, b) => a.ms - b.ms)
    .slice(0, 10)
    .map(({ s }) => s);
}

export function ExpiresSoonScholarships() {
  const currentYear = SESSION_DATE.getFullYear();
  const currentMonth = SESSION_DATE.getMonth();

  let carouselItems = filterForMonth(currentYear, currentMonth, SESSION_DATE);
  let targetDate = SESSION_DATE;

  if (carouselItems.length === 0) {
    // Empty-month fallback: roll forward to next calendar month so the home
    // section never renders without a list.
    const nextMonthDate = new Date(currentYear, currentMonth + 1, 1);
    carouselItems = filterForMonth(
      nextMonthDate.getFullYear(),
      nextMonthDate.getMonth(),
    );
    targetDate = nextMonthDate;
  }

  const monthName = targetDate.toLocaleString("default", { month: "long" });

  return (
    <section
      aria-labelledby="expires-soon-heading"
      className="flex min-h-dvh flex-col justify-center py-16 md:py-0"
    >
      <ParallaxLayer yRange={[-20, 20]}>
        <AnimatedSection>
          {/* Header */}
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col gap-2">
              <p className="text-xs font-medium uppercase tracking-widest text-tertiary">
                Curated for you
              </p>
              <h2
                id="expires-soon-heading"
                className="font-heading text-3xl font-medium tracking-tight text-on-surface md:text-[3rem] md:leading-none"
              >
                Expires in {monthName}
              </h2>
              <p className="mt-2 text-lg text-on-surface-variant md:text-xl">
                These scholarships close soon — apply before the month ends.
              </p>
            </div>
            <ButtonLink href="/scholarships" variant="tertiary" animateIcon>
              View All Scholarships{" "}
              <Icon
                icon="solar:arrow-right-line-duotone"
                data-icon="inline-end"
              />
            </ButtonLink>
          </div>
        </AnimatedSection>
      </ParallaxLayer>

      {/* Coverflow Carousel — break out of PageShell to full viewport width.
          `overflow-x-clip` traps the transform-driven horizontal overflow from
          the coverflow stage (each card is `absolute` and translated far
          beyond the stage edges); without it, scrollWidth on <html> grows
          past the viewport at tablet/phone widths and the page becomes
          horizontally scrollable. */}
      <ParallaxLayer
        yRange={[30, -30]}
        className="relative left-1/2 mt-16 w-dvw -translate-x-1/2 overflow-x-clip py-16"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, black 5%, black 95%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 5%, black 95%, transparent)",
        }}
      >
        <AnimatedSection delay={0.1}>
          <CoverflowCarousel scholarships={carouselItems} />
        </AnimatedSection>
      </ParallaxLayer>
    </section>
  );
}
