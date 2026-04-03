import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { AnimatedSection } from "./animated-section"

interface Scholarship {
  id: string
  name: string
  provider: string
  amount: string
  description: string
  image: string
  category: string
}

const scholarships: Scholarship[] = [
  {
    id: "1",
    name: "Student Success Stories",
    provider: "National Education Fund",
    amount: "$10,000",
    description:
      "Supporting outstanding students who demonstrate academic excellence and community leadership.",
    image: "/scholarships/scholarship-1.jpg",
    category: "INSPIRATION",
  },
  {
    id: "2",
    name: "Digital Learning Platform",
    provider: "TechForward Foundation",
    amount: "$7,500",
    description:
      "Empowering students embracing technology-driven learning and digital innovation.",
    image: "/scholarships/scholarship-2.jpg",
    category: "TECHNOLOGY",
  },
  {
    id: "3",
    name: "Campus Life",
    provider: "University Alliance",
    amount: "$5,000",
    description:
      "Recognizing students who enrich campus culture and student life experiences.",
    image: "/scholarships/scholarship-3.jpg",
    category: "EXPERIENCE",
  },
  {
    id: "4",
    name: "Collaborative Learning",
    provider: "Community Scholars Network",
    amount: "$8,000",
    description:
      "Awarded to students who foster collaborative and inclusive learning environments.",
    image: "/scholarships/scholarship-4.jpg",
    category: "COMMUNITY",
  },
  {
    id: "5",
    name: "Achievement & Growth",
    provider: "Global Achievement Fund",
    amount: "$12,000",
    description:
      "Celebrating students who show exceptional personal growth and academic achievement.",
    image: "/scholarships/scholarship-5.jpg",
    category: "SUCCESS",
  },
  {
    id: "6",
    name: "Knowledge Resources",
    provider: "Library Sciences Trust",
    amount: "$6,000",
    description:
      "Supporting students pursuing research and expanding access to educational resources.",
    image: "/scholarships/scholarship-6.jpg",
    category: "LIBRARY",
  },
]

const row1 = scholarships.slice(0, 3)
const row2 = scholarships.slice(3, 6)

/** Stagger card heights per Figma — only applied on lg+ screens */
const heightsRow1 = ["lg:h-96", "lg:h-80", "lg:h-64"]
const heightsRow2 = ["lg:h-80", "lg:h-96", "lg:h-64"]

function ScholarshipCard({
  scholarship,
  heightClass,
}: {
  scholarship: Scholarship
  heightClass: string
}) {
  return (
    <div
      className={cn(
        "group relative w-full overflow-hidden rounded-2xl shadow-[8px_8px_16px_rgba(0,0,0,0.1),-8px_-8px_16px_rgba(255,255,255,0.9)] dark:shadow-lg",
        "h-72 sm:h-80",
        heightClass,
      )}
    >
      <Image
        src={scholarship.image}
        alt={scholarship.name}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent" />

      {/* Content overlay */}
      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-6">
        {/* Category badge */}
        <div className="inline-flex w-fit items-center gap-2 rounded-full bg-white/20 px-3 py-1">
          <span className="size-1.5 rounded-full bg-white" />
          <span className="text-xs tracking-widest text-white">
            {scholarship.category}
          </span>
        </div>

        <h3 className="text-xl font-medium leading-7 text-white sm:text-2xl sm:leading-8">
          {scholarship.name}
        </h3>

        <p className="text-sm text-white/80">
          {scholarship.provider} &middot;{" "}
          <span className="font-medium text-white">{scholarship.amount}</span>
        </p>

        <p className="line-clamp-2 text-sm leading-relaxed text-white/70">
          {scholarship.description}
        </p>
      </div>
    </div>
  )
}

export function FeaturedScholarships() {
  return (
    <section aria-labelledby="featured-heading" className="flex min-h-dvh flex-col justify-center">
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
              Explore Scholarships
            </h2>
            <p className="mt-2 text-lg text-on-surface-variant md:text-xl">
              Discover a world of educational possibilities and scholarship
              programs.
            </p>
          </div>
          <Link
            href="/scholarships"
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-white/50 bg-white/30 px-5 py-2.5 text-sm font-medium text-on-surface shadow-[0_8px_32px_rgba(31,38,135,0.2)] transition-shadow hover:shadow-[0_8px_40px_rgba(31,38,135,0.28)]"
          >
            View All Scholarships
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </AnimatedSection>

      {/* Cards Grid */}
      <div className="mt-16 flex flex-col gap-6">
        {/* Row 1 */}
        <AnimatedSection delay={0.1}>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {row1.map((s, i) => (
              <ScholarshipCard
                key={s.id}
                scholarship={s}
                heightClass={heightsRow1[i] ?? ""}
              />
            ))}
          </div>
        </AnimatedSection>

        {/* Row 2 */}
        <AnimatedSection delay={0.2}>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {row2.map((s, i) => (
              <ScholarshipCard
                key={s.id}
                scholarship={s}
                heightClass={heightsRow2[i] ?? ""}
              />
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
