"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { AnimatedSection } from "../ui/animatedSection/animated-section";
import { ParallaxLayer } from "@/components/ui/parallax-layer";
import { ButtonLink } from "@/components/ui/button/button-link";
import { Icon } from "@iconify/react";
import { useTextLayout } from "@/lib/pretext/use-text-layout";
import { PRETEXT_FONTS } from "@/lib/pretext/fonts";

interface Scholarship {
  id: string;
  name: string;
  provider: string;
  amount: string;
  image: string;
  category: string;
  rating: number;
  deadline: string;
}

const scholarships: Scholarship[] = [
  {
    id: "1",
    name: "Student Success Stories",
    provider: "National Education Fund",
    amount: "$10,000",
    image: "/scholarships/scholarship-1.jpg",
    category: "INSPIRATION",
    rating: 4.8,
    deadline: "May 15, 2026",
  },
  {
    id: "2",
    name: "Digital Learning Platform",
    provider: "TechForward Foundation",
    amount: "$7,500",
    image: "/scholarships/scholarship-2.jpg",
    category: "TECHNOLOGY",
    rating: 4.5,
    deadline: "Jun 1, 2026",
  },
  {
    id: "3",
    name: "Campus Life",
    provider: "University Alliance",
    amount: "$5,000",
    image: "/scholarships/scholarship-3.jpg",
    category: "EXPERIENCE",
    rating: 4.3,
    deadline: "Apr 30, 2026",
  },
  {
    id: "4",
    name: "Collaborative Learning",
    provider: "Community Scholars Network",
    amount: "$8,000",
    image: "/scholarships/scholarship-4.jpg",
    category: "COMMUNITY",
    rating: 4.7,
    deadline: "Jul 15, 2026",
  },
  {
    id: "5",
    name: "Achievement & Growth",
    provider: "Global Achievement Fund",
    amount: "$12,000",
    image: "/scholarships/scholarship-5.jpg",
    category: "SUCCESS",
    rating: 4.9,
    deadline: "Aug 1, 2026",
  },
  {
    id: "6",
    name: "Knowledge Resources",
    provider: "Library Sciences Trust",
    amount: "$6,000",
    image: "/scholarships/scholarship-6.jpg",
    category: "LIBRARY",
    rating: 4.2,
    deadline: "May 30, 2026",
  },
  {
    id: "7",
    name: "Future Leaders Award",
    provider: "Leadership Institute",
    amount: "$15,000",
    image: "/scholarships/scholarship-1.jpg",
    category: "LEADERSHIP",
    rating: 4.9,
    deadline: "Sep 1, 2026",
  },
  {
    id: "8",
    name: "STEM Innovation Grant",
    provider: "Science & Tech Council",
    amount: "$9,500",
    image: "/scholarships/scholarship-2.jpg",
    category: "STEM",
    rating: 4.6,
    deadline: "Jun 15, 2026",
  },
  {
    id: "9",
    name: "Arts & Humanities Fund",
    provider: "Cultural Heritage Foundation",
    amount: "$6,500",
    image: "/scholarships/scholarship-3.jpg",
    category: "ARTS",
    rating: 4.4,
    deadline: "Jul 1, 2026",
  },
  {
    id: "10",
    name: "Global Perspectives",
    provider: "International Education Trust",
    amount: "$11,000",
    image: "/scholarships/scholarship-4.jpg",
    category: "GLOBAL",
    rating: 4.7,
    deadline: "Aug 15, 2026",
  },
  {
    id: "11",
    name: "First Generation Scholar",
    provider: "Access Education Network",
    amount: "$8,500",
    image: "/scholarships/scholarship-5.jpg",
    category: "ACCESS",
    rating: 4.8,
    deadline: "May 1, 2026",
  },
  {
    id: "12",
    name: "Environmental Stewardship",
    provider: "Green Future Initiative",
    amount: "$7,000",
    image: "/scholarships/scholarship-6.jpg",
    category: "ENVIRONMENT",
    rating: 4.5,
    deadline: "Jun 30, 2026",
  },
  {
    id: "13",
    name: "Creative Writing Prize",
    provider: "National Writers Circle",
    amount: "$5,500",
    image: "/scholarships/scholarship-1.jpg",
    category: "WRITING",
    rating: 4.3,
    deadline: "Jul 30, 2026",
  },
  {
    id: "14",
    name: "Health Sciences Award",
    provider: "Medical Education Fund",
    amount: "$13,000",
    image: "/scholarships/scholarship-2.jpg",
    category: "HEALTH",
    rating: 4.8,
    deadline: "Sep 15, 2026",
  },
  {
    id: "15",
    name: "Social Impact Fellowship",
    provider: "Change Makers Foundation",
    amount: "$10,500",
    image: "/scholarships/scholarship-3.jpg",
    category: "IMPACT",
    rating: 4.6,
    deadline: "Oct 1, 2026",
  },
];

/** Split scholarships into 3 rows of ~5 each */
const row1Items = scholarships.slice(0, 5);
const row2Items = scholarships.slice(5, 10);
// const row3Items = scholarships.slice(10, 15);

/** Card text area width: w-80 (320px) - p-5 (20px) * 2 = 280px */
const CARD_TEXT_WIDTH = 280;
/** text-lg line height (leading-snug = 1.375 * 18px ≈ 25px) */
const TITLE_LINE_HEIGHT = 25;
/** text-sm line height (default ~20px) */
const PROVIDER_LINE_HEIGHT = 20;

function ScholarshipCard({
  scholarship,
  isClone = false,
}: {
  scholarship: Scholarship;
  isClone?: boolean;
}) {
  const { lineCount: titleLines } = useTextLayout({
    text: scholarship.name,
    font: PRETEXT_FONTS.cardTitle,
    maxWidth: CARD_TEXT_WIDTH,
    lineHeight: TITLE_LINE_HEIGHT,
  });

  const { lineCount: providerLines } = useTextLayout({
    text: scholarship.provider,
    font: PRETEXT_FONTS.bodySmall,
    maxWidth: CARD_TEXT_WIDTH,
    lineHeight: PROVIDER_LINE_HEIGHT,
  });

  const titleOverflows = titleLines > 1;
  const providerOverflows = providerLines > 1;

  return (
    <li
      role="listitem"
      aria-hidden={isClone ? "true" : undefined}
      className="w-80 shrink-0 list-none"
    >
      <Link
        href="/scholarships"
        tabIndex={isClone ? -1 : 0}
        aria-label={`${scholarship.name} — ${scholarship.provider}, ${scholarship.amount}. View all scholarships.`}
        data-cursor="text"
        data-cursor-text="View"
        className="group relative block h-full w-full cursor-pointer overflow-hidden rounded-2xl shadow-lg outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
      >
        <Image
          src={scholarship.image}
          alt={scholarship.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="320px"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent" />

        {/* Content overlay */}
        <div className="absolute inset-0 flex flex-col justify-between p-5">
          {/* Top: Pill badges */}
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-tertiary/40 px-3 py-1 shadow-[2px_2px_4px_rgba(0,0,0,0.1),-1px_-1px_3px_rgba(255,255,255,0.1)]">
              <span className="size-1.5 rounded-full bg-white" />
              <span className="text-xs tracking-widest text-white">
                {scholarship.category}
              </span>
            </span>
          </div>

          {/* Bottom: Info */}
          <div className="flex items-end justify-start gap-3">
            <div className="flex min-w-0 flex-col gap-1">
              <h3
                className="truncate text-lg font-medium leading-snug text-white"
                title={titleOverflows ? scholarship.name : undefined}
              >
                {scholarship.name}
              </h3>
              <p
                className="truncate text-sm text-white/80"
                title={providerOverflows ? scholarship.provider : undefined}
              >
                {scholarship.provider}
              </p>
              <p className="text-sm text-white/70">
                <span className="font-medium text-white">
                  {scholarship.amount}
                </span>{" "}
                &middot; {scholarship.deadline}
              </p>
            </div>
          </div>
        </div>
      </Link>
    </li>
  );
}

interface MarqueeRowProps {
  items: Scholarship[];
  direction: "left" | "right";
  duration: number;
  height: string;
  className?: string;
}

function MarqueeRow({
  items,
  direction,
  duration,
  height,
  className,
}: MarqueeRowProps) {
  const trackRef = useRef<HTMLUListElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const animationName = direction === "left" ? "marquee-left" : "marquee-right";
  const cards = shouldReduceMotion ? items : [...items, ...items];

  return (
    <div
      className={cn("overflow-hidden", height, className)}
      onMouseEnter={() => {
        if (trackRef.current && !shouldReduceMotion)
          trackRef.current.style.animationPlayState = "paused";
      }}
      onMouseLeave={() => {
        if (trackRef.current && !shouldReduceMotion)
          trackRef.current.style.animationPlayState = "running";
      }}
    >
      <ul
        ref={trackRef}
        role="list"
        className="flex h-full list-none gap-6 p-0"
        style={
          shouldReduceMotion
            ? { width: "max-content" }
            : {
                animation: `${animationName} ${duration}s linear infinite`,
                width: "max-content",
              }
        }
      >
        {cards.map((scholarship, i) => (
          <ScholarshipCard
            key={`${scholarship.id}-${i}`}
            scholarship={scholarship}
            isClone={!shouldReduceMotion && i >= items.length}
          />
        ))}
      </ul>
    </div>
  );
}

export function FeaturedScholarships() {
  return (
    <section
      aria-labelledby="featured-heading"
      className="flex min-h-dvh flex-col justify-center py-30"
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
                id="featured-heading"
                className="font-heading text-3xl font-medium tracking-tight text-on-surface md:text-[3rem] md:leading-none"
              >
                Featured Scholarships
              </h2>
              <p className="mt-2 text-lg text-on-surface-variant md:text-xl">
                Discover a world of educational possibilities and scholarship
                programs.
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

      {/* Marquee Rows — break out of PageShell to full viewport width */}
      <ParallaxLayer
        yRange={[30, -30]}
        className="relative left-1/2 mt-16 flex w-dvw -translate-x-1/2 flex-col gap-6 py-10"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
        }}
      >
        {/* Row 1: scrolls left, 30s — always visible */}
        <AnimatedSection delay={0.1}>
          <MarqueeRow
            items={row1Items}
            direction="left"
            duration={50}
            height="h-100"
          />
        </AnimatedSection>

        {/* Row 2: scrolls right, 35s — visible md+ */}
        <AnimatedSection delay={0.2}>
          <MarqueeRow
            items={row2Items}
            direction="right"
            duration={55}
            height="h-100"
            className="hidden md:block"
          />
        </AnimatedSection>

        {/* Row 3: scrolls left, 25s — visible lg+ */}
        {/* <AnimatedSection delay={0.3}>
          <MarqueeRow
            items={row3Items}
            direction="left"
            duration={205}
            height="h-72"
            className="hidden lg:block"
          />
        </AnimatedSection> */}
      </ParallaxLayer>
    </section>
  );
}
