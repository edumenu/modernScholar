import { AnimatedSection } from "@/components/ui/animatedSection/animated-section"
import { ButtonLink } from "@/components/ui/button/button-link"

export default function BlogPostNotFound() {
  return (
    <div className="flex min-h-[calc(100vh-7rem)] flex-col items-center justify-center px-6 text-center">
      <AnimatedSection>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-tertiary">
          Article Not Found
        </p>

        <div className="mx-auto mt-6 h-px w-24 bg-secondary" />

        <h1 className="mt-6 font-heading text-2xl font-medium tracking-tight text-on-surface md:text-3xl">
          This story hasn&apos;t been written yet.
        </h1>

        <p className="mx-auto mt-3 max-w-md text-base text-on-surface-variant">
          The article you&apos;re looking for may have been moved or removed. Head
          back to the blog to discover more reads.
        </p>

        <div className="mt-8 flex items-center justify-center gap-3">
          <ButtonLink href="/blog" variant="default" size="default">
            Back to Blog
          </ButtonLink>
          <ButtonLink href="/" variant="outline" size="default">
            Go Home
          </ButtonLink>
        </div>
      </AnimatedSection>
    </div>
  )
}
