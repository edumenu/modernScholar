import { IconBookmark } from "@tabler/icons-react"
import { AnimatedSection } from "./animated-section"

interface ComingSoonFeature {
  title: string
  subtitle: string
  description: string
}

const features: ComingSoonFeature[] = [
  {
    title: "Scholarship Management Dashboard",
    subtitle: "Modern Architecture",
    description:
      "Overview to view scholarship status and progress. Track applications, deadlines, and outcomes in one place.",
  },
  {
    title: "Scholarship Reminders",
    subtitle: "Live Labs",
    description:
      "Automatic notifications, alerts, updates, and saved reminders so you never miss a deadline.",
  },
  {
    title: "Scholarship Personalization List",
    subtitle: "The Fellowship",
    description:
      "Scholarship essay tracking and submission checklist tailored to your academic profile.",
  },
]

export function ComingSoon() {
  return (
    <section aria-labelledby="coming-soon-heading" className="flex min-h-dvh flex-col justify-center">
      <AnimatedSection>
        {/* Header */}
        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium uppercase tracking-[0.1em] text-tertiary">
            Coming Soon
          </p>
          <h2
            id="coming-soon-heading"
            className="font-heading text-3xl font-medium tracking-tight text-on-surface md:text-[3rem] md:leading-[1]"
          >
            What&apos;s Next
          </h2>
          <p className="mt-2 max-w-xl text-lg text-on-surface-variant">
            Discover the upcoming features that will transform your scholarship
            journey.
          </p>
        </div>
      </AnimatedSection>

      {/* Bento Grid */}
      <AnimatedSection delay={0.15} className="mt-16">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Large featured card — primary dark */}
          <div className="flex min-h-[360px] flex-col justify-between rounded-3xl border border-white/20 bg-primary-container p-6 text-primary-foreground shadow-md sm:p-8 lg:min-h-[536px]">
            <div>
              <span className="inline-flex items-center rounded-full border border-white/20 bg-black/40 px-3.5 py-1 text-xs uppercase tracking-widest text-white/90">
                Featured Symposium
              </span>
            </div>
            <div className="flex flex-col gap-3">
              <h3 className="font-heading text-2xl font-medium leading-tight sm:text-3xl md:text-[3rem] md:leading-[1.25]">
                {features[0].title}
              </h3>
              <p className="text-base italic text-white/80 sm:text-lg">
                {features[0].subtitle}
              </p>
              <p className="max-w-md text-sm leading-relaxed text-white/70">
                {features[0].description}
              </p>
            </div>
            <div className="flex justify-end pt-4">
              <span
                className="flex size-10 items-center justify-center rounded-full border border-white/30 bg-white/20 shadow-sm"
                aria-hidden="true"
              >
                <IconBookmark className="size-4 text-white" />
              </span>
            </div>
          </div>

          {/* Right column — two stacked cards */}
          <div className="grid grid-cols-1 gap-6 sm:grid-rows-2">
            {/* Light/glass card */}
            <div className="flex flex-col justify-between rounded-3xl border border-white/40 bg-[rgba(229,223,218,0.7)] p-6 shadow-md sm:p-8">
              <div className="flex flex-col gap-2">
                <h3 className="font-heading text-xl font-medium leading-tight text-on-surface sm:text-2xl md:text-[1.875rem]">
                  {features[1].title}
                </h3>
                <p className="text-sm font-medium text-on-surface sm:text-base">
                  {features[1].subtitle}
                </p>
                <p className="text-sm text-on-surface-variant">
                  {features[1].description}
                </p>
              </div>
              <div className="flex justify-end pt-4">
                <span
                  className="flex size-10 items-center justify-center rounded-full border border-white/50 bg-white/40 shadow-sm"
                  aria-hidden="true"
                >
                  <IconBookmark className="size-4 text-on-surface-variant" />
                </span>
              </div>
            </div>

            {/* Terracotta card */}
            <div className="flex flex-col justify-between rounded-3xl border border-white/20 bg-tertiary p-6 text-tertiary-foreground shadow-md sm:p-8">
              <div className="flex flex-col gap-2">
                <h3 className="font-heading text-xl font-medium leading-tight sm:text-2xl md:text-[1.875rem]">
                  {features[2].title}
                </h3>
                <p className="text-sm text-white/70">
                  {features[2].description}
                </p>
                <p className="text-sm font-medium text-white/90 sm:text-base">
                  {features[2].subtitle}
                </p>
              </div>
              <div className="flex justify-end pt-4">
                <span
                  className="flex size-10 items-center justify-center rounded-full border border-white/30 bg-white/20 shadow-sm"
                  aria-hidden="true"
                >
                  <IconBookmark className="size-4 text-white" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>
    </section>
  )
}
