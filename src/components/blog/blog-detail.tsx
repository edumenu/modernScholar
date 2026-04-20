"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Icon } from "@iconify/react"
import { blogPosts, type BlogPost } from "@/data/blog-posts"
import { AnimatedSection } from "@/components/ui/animatedSection/animated-section"
import { Button } from "@/components/ui/button/button"
import { ReadingProgress } from "@/components/blog/reading-progress"
import { ArticleProgressBar } from "@/components/blog/article-progress-bar"
import { PullQuote } from "@/components/blog/pull-quote"

interface BlogDetailProps {
  post: BlogPost
}

export function BlogDetail({ post }: BlogDetailProps) {
  const articleRef = useRef<HTMLElement>(null)
  const [imgError, setImgError] = useState(false)

  const sections = post.content.map((s) => ({
    id: s.id,
    title: s.title,
  }))

  return (
    <div>
      <ArticleProgressBar articleRef={articleRef} />
      <AnimatedSection variant="fadeUp">
        <Link href="/blog">
          <Button variant="ghost" size="sm" data-icon="inline-start">
            <Icon icon="solar:arrow-left-linear" data-icon="inline-start" />
            Back to Blog
          </Button>
        </Link>
      </AnimatedSection>

      <article
        ref={articleRef}
        className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[260px_1fr]"
      >
        {/* Article Content */}
        <div className="relative order-first lg:order-last">
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
              <Image
                src={imgError ? "/mountain.png" : post.image}
                alt={post.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 66vw"
                priority
                onError={() => setImgError(true)}
              />
            </div>
          </AnimatedSection>

          {/* Dynamic Prose Content */}
          <div className="mt-10 space-y-8">
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
            <div className="mt-12 flex items-center gap-4 rounded-2xl border border-outline-variant/40 bg-surface-container-low p-6 dark:bg-surface-container-low dark:border-outline-variant/20">
              <div className="relative size-14 shrink-0 overflow-hidden rounded-full bg-surface-container-high">
                <Image
                  src={post.author.avatar}
                  alt={post.author.name}
                  fill
                  className="object-cover"
                  sizes="56px"
                  onError={(e) => {
                    const target = e.currentTarget
                    target.style.display = "none"
                  }}
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
        </div>

        {/* Sidebar — horizontal strip on md, vertical sidebar on lg */}
        <aside className="order-last lg:order-first">
          {/* On md (tablet): horizontal metadata strip above article */}
          <div className="hidden md:flex lg:hidden flex-wrap items-center gap-4 rounded-2xl border border-outline-variant/40 bg-surface-container-low p-4 dark:bg-surface-container-low dark:border-outline-variant/20">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-xs font-medium uppercase tracking-wider text-on-surface-variant">
                Category
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-outline-variant/30 bg-surface-container px-2.5 py-0.5 text-xs dark:bg-surface-container dark:border-outline-variant/20">
                <span className="size-1.5 rounded-full bg-on-surface" />
                {post.category}
              </span>
            </div>
            <span className="text-outline-variant">·</span>
            <span className="text-sm text-on-surface">
              {post.publishDate}
            </span>
            <span className="text-outline-variant">·</span>
            <span className="text-sm text-on-surface">{post.readTime}</span>
          </div>

          {/* On lg: sticky vertical sidebar */}
          <div className="sticky top-32 hidden lg:flex flex-col gap-6">
            <AnimatedSection variant="fadeUp" delay={0.2}>
              <div className="flex flex-col gap-4 rounded-2xl border border-outline-variant/40 bg-surface-container-low p-6 shadow-md dark:bg-surface-container-low dark:border-outline-variant/20">
                {/* Category */}
                <div>
                  <span className="text-xs font-medium uppercase tracking-wider text-on-surface-variant">
                    Category
                  </span>
                  <div className="mt-2">
                    <span className="inline-flex items-center gap-2 rounded-full border border-outline-variant/30 bg-surface-container px-3.5 py-1 text-xs tracking-wider dark:bg-surface-container dark:border-outline-variant/20">
                      <span className="size-1.5 rounded-full bg-on-surface" />
                      <span className="text-on-surface">{post.category}</span>
                    </span>
                  </div>
                </div>

                {/* Publish Date */}
                <div>
                  <span className="text-xs font-medium uppercase tracking-wider text-on-surface-variant">
                    Published
                  </span>
                  <p className="mt-1 text-sm font-medium text-on-surface">
                    {post.publishDate}
                  </p>
                </div>

                {/* Read Time */}
                <div>
                  <span className="text-xs font-medium uppercase tracking-wider text-on-surface-variant">
                    Read Time
                  </span>
                  <p className="mt-1 text-sm font-medium text-on-surface">
                    {post.readTime}
                  </p>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection variant="fadeUp" delay={0.3}>
              <ReadingProgress
                articleRef={articleRef}
                sections={sections}
              />
            </AnimatedSection>

            {/* Series navigation */}
            {post.series && (
              <AnimatedSection variant="fadeUp" delay={0.4}>
                <div className="flex flex-col gap-3 rounded-2xl border border-outline-variant/40 bg-surface-container-low p-4 shadow-md dark:bg-surface-container-low dark:border-outline-variant/20">
                  <span className="text-xs font-medium uppercase tracking-wider text-on-surface-variant">
                    {post.series.name}
                  </span>
                  <div className="flex flex-col gap-1.5">
                    {blogPosts
                      .filter((p) => p.series?.name === post.series?.name)
                      .sort((a, b) => (a.series?.part ?? 0) - (b.series?.part ?? 0))
                      .map((seriesPost) => {
                        const isCurrent = seriesPost.id === post.id
                        return (
                          <Link
                            key={seriesPost.id}
                            href={`/blog/${seriesPost.slug}`}
                            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs transition-colors ${
                              isCurrent
                                ? "bg-primary/10 font-medium text-primary"
                                : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                            }`}
                          >
                            <span className="shrink-0 font-medium">
                              {seriesPost.series?.part}.
                            </span>
                            <span className="truncate">{seriesPost.title}</span>
                          </Link>
                        )
                      })}
                  </div>
                </div>
              </AnimatedSection>
            )}
          </div>
        </aside>
      </article>
    </div>
  )
}
