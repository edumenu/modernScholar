"use client";

import { useRef } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { AnimatedSection } from "./animated-section";
import { ButtonLink } from "@/components/ui/button/button-link";
// import { Button } from "@/components/ui/button/button";
import { IconArrowRight } from "@tabler/icons-react";

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

function ScholarshipCard({ scholarship }: { scholarship: Scholarship }) {
  return (
    <div className="group relative w-80 shrink-0 overflow-hidden rounded-2xl shadow-[8px_8px_16px_rgba(0,0,0,0.1),-8px_-8px_16px_rgba(255,255,255,0.9)] dark:shadow-lg">
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
          {/* <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-1 shadow-[2px_2px_4px_rgba(0,0,0,0.1),-1px_-1px_3px_rgba(255,255,255,0.1)]">
            <IconStarFilled className="size-3 text-amber-400" />
            <span className="text-xs font-medium text-white">
              {scholarship.rating}
            </span>
          </span> */}
        </div>

        {/* Bottom: Info */}
        <div className="flex items-end justify-start gap-3">
          <div className="flex min-w-0 flex-col gap-1">
            <h3 className="truncate text-lg font-medium leading-snug text-white">
              {scholarship.name}
            </h3>
            <p className="truncate text-sm text-white/80">
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
        {/* button */}
        {/* <div className="flex w-full items-end justify-start gap-3">
          <Button
            variant="outline"
            animateText
            hoverTrigger="parent"
            className="shrink-0 border-white/30 text-white shadow-none hover:border-white/50"
          >
            <IconArrowRight data-icon="inline-start" className="size-4" />
            <span data-label>View</span>
          </Button>
        </div> */}
      </div>
    </div>
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
  const trackRef = useRef<HTMLDivElement>(null);
  const duplicated = [...items, ...items];
  const animationName = direction === "left" ? "marquee-left" : "marquee-right";

  return (
    <div
      className={cn("overflow-hidden", height, className)}
      onMouseEnter={() => {
        if (trackRef.current)
          trackRef.current.style.animationPlayState = "paused";
      }}
      onMouseLeave={() => {
        if (trackRef.current)
          trackRef.current.style.animationPlayState = "running";
      }}
    >
      <div
        ref={trackRef}
        className="flex h-full gap-6"
        style={{
          animation: `${animationName} ${duration}s linear infinite`,
          width: "max-content",
        }}
      >
        {duplicated.map((scholarship, i) => (
          <ScholarshipCard
            key={`${scholarship.id}-${i}`}
            scholarship={scholarship}
          />
        ))}
      </div>
    </div>
  );
}

export function FeaturedScholarships() {
  return (
    <section
      aria-labelledby="featured-heading"
      className="flex min-h-dvh flex-col justify-center"
    >
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
            View All Scholarships <IconArrowRight data-icon="inline-end" />
          </ButtonLink>
        </div>
      </AnimatedSection>

      {/* Marquee Rows */}
      <div
        className="mt-16 flex flex-col gap-6"
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
            duration={200}
            height="h-80"
          />
        </AnimatedSection>

        {/* Row 2: scrolls right, 35s — visible md+ */}
        <AnimatedSection delay={0.2}>
          <MarqueeRow
            items={row2Items}
            direction="right"
            duration={190}
            height="h-64"
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
      </div>
    </section>
  );
}
