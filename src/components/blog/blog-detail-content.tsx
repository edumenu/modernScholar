import Image from "next/image"
import { Icon } from "@iconify/react"
import type { BlogPost } from "@/data/blog-posts"
import { AnimatedSection } from "@/components/ui/animatedSection/animated-section"
import { PullQuote } from "@/components/blog/pull-quote"
import { BlogDetailHeroImage } from "@/components/blog/blog-detail-hero-image"

interface BlogDetailContentProps {
  post: BlogPost
}

export function BlogDetailContent({ post }: BlogDetailContentProps) {
  return (
    <>
      {/* Title */}
      <AnimatedSection variant="fadeUp">
        <h1 className="font-heading text-3xl font-bold leading-tight text-on-surface md:text-4xl lg:text-5xl">
          {post.title}
        </h1>
        {/* Series indicator */}
        {post.series && (
          <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3.5 py-1.5 text-xs font-medium text-primary">
            <Icon icon="solar:documents-linear" className="size-3.5" />
            Part {post.series.part} of {post.series.totalParts} &mdash; {post.series.name}
          </div>
        )}
      </AnimatedSection>

      {/* Excerpt */}
      <AnimatedSection variant="fadeUp" delay={0.1}>
        <p className="mt-4 text-lg leading-relaxed text-on-surface-variant md:text-xl">
          {post.excerpt}
        </p>
      </AnimatedSection>

      {/* Hero Image */}
      <AnimatedSection variant="fadeUp" delay={0.2}>
        <div className="relative mt-8 aspect-video w-full overflow-hidden rounded-2xl">
          <BlogDetailHeroImage src={post.image} alt={post.title} />
        </div>
      </AnimatedSection>

      {/* Dynamic Prose Content */}
      <div className="mt-10 max-w-prose space-y-8">
        {post.content.map((section, i) => (
          <AnimatedSection
            key={section.id}
            variant="fadeUp"
            delay={i === 0 ? 0.3 : 0.1}
          >
            {/* Section heading with chapter break (except first) */}
            {i > 0 && (
              <div className="border-t border-primary/20 pt-8 mt-8" />
            )}
            <h2
              id={section.id}
              className="font-heading text-2xl font-bold text-on-surface md:text-3xl"
            >
              {section.title}
            </h2>

            {/* Paragraphs */}
            {section.content.map((paragraph, pIdx) => (
              <p
                key={pIdx}
                className="mt-4 text-base leading-relaxed text-on-surface"
              >
                {paragraph}
              </p>
            ))}

            {/* Pull quote — breaks out of prose column */}
            {section.blockquote && (
              <PullQuote quote={section.blockquote} />
            )}

            {/* List */}
            {section.list && (
              <ul className="mt-4 list-disc space-y-2 pl-6 text-base leading-relaxed text-on-surface">
                {section.list.map((item, lIdx) => (
                  <li key={lIdx}>{item}</li>
                ))}
              </ul>
            )}
          </AnimatedSection>
        ))}
      </div>

      {/* Author bio card */}
      <AnimatedSection variant="fadeUp" delay={0.1}>
        <div className="mt-12 flex items-center gap-4 rounded-2xl bg-surface-container-low p-6 shadow-xs dark:bg-surface-container-low">
          <div className="relative size-14 shrink-0 overflow-hidden rounded-full bg-surface-container-high">
            <Image
              src={post.author.avatar}
              alt={post.author.name}
              fill
              className="object-cover"
              sizes="56px"
            />
          </div>
          <div>
            <p className="font-heading text-base font-medium text-on-surface">
              {post.author.name}
            </p>
            <p className="text-sm text-on-surface-variant">
              {post.author.role}
            </p>
          </div>
        </div>
      </AnimatedSection>
    </>
  )
}
