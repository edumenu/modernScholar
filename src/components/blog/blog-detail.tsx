"use client"

import { useRef } from "react"
import Link from "next/link"
import { Icon } from "@iconify/react"
import { blogPosts, type BlogPost } from "@/data/blog-posts"
import { cn } from "@/lib/utils"
import { AnimatedSection } from "@/components/ui/animatedSection/animated-section"
import { Button } from "@/components/ui/button/button"
import { ReadingProgress } from "@/components/blog/reading-progress"
import { ArticleProgressBar } from "@/components/blog/article-progress-bar"

interface BlogDetailProps {
  post: BlogPost
  children: React.ReactNode
}

export function BlogDetail({ post, children }: BlogDetailProps) {
  const articleRef = useRef<HTMLElement>(null)

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
        {/* Article Content — server-rendered via children */}
        <div className="relative order-first lg:order-last">
          {children}
        </div>

        {/* Sidebar — horizontal strip on md, vertical sidebar on lg */}
        <aside className="order-last lg:order-first">
          {/* On md (tablet): horizontal metadata strip above article */}
          <div className="hidden md:flex lg:hidden flex-wrap items-center gap-4 rounded-2xl bg-surface-container-low p-4 shadow-xs dark:bg-surface-container-low">
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
              <div className="flex flex-col gap-4 rounded-2xl bg-surface-container-low p-6 shadow-md dark:bg-surface-container-low">
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
                <div className="flex flex-col gap-3 rounded-2xl bg-surface-container-low p-4 shadow-md dark:bg-surface-container-low">
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
                            className={cn(
                              "flex items-center gap-2 rounded-lg px-3 py-2 text-xs transition-colors",
                              isCurrent
                                ? "bg-primary/10 font-medium text-primary"
                                : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface",
                            )}
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
