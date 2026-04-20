"use client"

import { AnimatedSection } from "@/components/ui/animatedSection/animated-section"

interface PullQuoteProps {
  quote: string
  attribution?: string
}

export function PullQuote({ quote, attribution }: PullQuoteProps) {
  return (
    <AnimatedSection variant="scaleIn">
      <figure className="relative -mx-4 my-10 px-4 py-8 sm:-mx-8 sm:px-8 md:-mx-16 md:px-16 lg:-mx-24 lg:px-24">
        {/* Decorative quotation marks */}
        <div className="pointer-events-none absolute left-4 top-2 font-heading text-[120px] leading-none text-primary/10 select-none sm:left-8 md:left-16 lg:left-24">
          &ldquo;
        </div>

        <blockquote className="relative text-center">
          <p className="font-heading text-xl leading-relaxed text-on-surface sm:text-2xl md:text-3xl">
            {quote}
          </p>
        </blockquote>

        {attribution && (
          <figcaption className="mt-4 text-center text-xs font-medium uppercase tracking-widest text-on-surface-variant">
            &mdash; {attribution}
          </figcaption>
        )}

        {/* Decorative closing quote */}
        <div className="pointer-events-none absolute bottom-0 right-4 font-heading text-[120px] leading-none text-primary/10 select-none sm:right-8 md:right-16 lg:right-24">
          &rdquo;
        </div>
      </figure>
    </AnimatedSection>
  )
}
