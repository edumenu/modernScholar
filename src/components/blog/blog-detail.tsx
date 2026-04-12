"use client"

import { useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Icon } from "@iconify/react"
import type { BlogPost } from "@/data/blog-posts"
import { glassPill } from "@/components/ui/styles"
import { cn } from "@/lib/utils"
import { AnimatedSection } from "@/components/ui/animatedSection/animated-section"
import { Button } from "@/components/ui/button/button"
import { ReadingProgress } from "@/components/blog/reading-progress"

const ARTICLE_SECTIONS = [
  { id: "section-landscape", title: "Understanding the Scholarship Landscape" },
  { id: "section-application", title: "Building a Strong Application" },
  { id: "section-applicationn", title: "Building a Strong Applicationn" },
]

interface BlogDetailProps {
  post: BlogPost
}

export function BlogDetail({ post }: BlogDetailProps) {
  const articleRef = useRef<HTMLElement>(null)

  return (
    <div>
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
        className="mt-8 grid grid-cols-1 gap-10 md:grid-cols-[300px_1fr]"
      >
        {/* Article Content */}
        <div className="relative order-first md:order-last">
          {/* Title */}
          <AnimatedSection variant="fadeUp">
            <h1 className="font-heading text-3xl font-bold leading-tight text-on-surface md:text-4xl lg:text-5xl">
              {post.title}
            </h1>
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
                src="/mountain.png"
                alt={post.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 66vw"
                priority
              />
            </div>
          </AnimatedSection>

          {/* Placeholder Prose Content */}
          <div className="mt-10 space-y-8">
            <AnimatedSection variant="fadeUp" delay={0.3}>
              <h2
                id="section-landscape"
                className="font-heading text-2xl font-medium text-on-surface md:text-3xl"
              >
                Understanding the Scholarship Landscape
              </h2>
              <p className="mt-4 text-base leading-relaxed text-on-surface-variant">
                The journey to securing a scholarship begins long before you
                fill out your first application. It starts with understanding
                the landscape — knowing what types of scholarships exist, who
                offers them, and what they&apos;re really looking for in
                candidates. Most students only scratch the surface, focusing on
                the most well-known opportunities while missing thousands of
                niche scholarships that could be a perfect fit.
              </p>
              <p className="mt-4 text-base leading-relaxed text-on-surface-variant">
                Research is your most powerful tool. Spend time exploring
                databases, talking to your school&apos;s financial aid office,
                and connecting with organizations in your field of study. The
                more targeted your search, the better your chances of finding
                opportunities where you&apos;re not competing against tens of
                thousands of applicants.
              </p>
            </AnimatedSection>

            <AnimatedSection variant="fadeUp" delay={0.1}>
              <blockquote className="border-l-4 border-primary/40 pl-6 italic text-on-surface-variant">
                &ldquo;The students who succeed aren&apos;t necessarily the ones
                with the highest grades — they&apos;re the ones who tell the
                most compelling stories about who they are and where
                they&apos;re going.&rdquo;
              </blockquote>
            </AnimatedSection>

            <AnimatedSection variant="fadeUp" delay={0.1}>
              <h2
                id="section-application"
                className="font-heading text-2xl font-medium text-on-surface md:text-3xl"
              >
                Building a Strong Application
              </h2>
              <p className="mt-4 text-base leading-relaxed text-on-surface-variant">
                A strong scholarship application is more than a list of
                achievements. It&apos;s a narrative that connects your
                experiences, your goals, and the specific opportunity
                you&apos;re applying for. Reviewers read hundreds of
                applications — yours needs to stand out by being authentic,
                specific, and memorable.
              </p>

              <ul className="mt-4 list-disc space-y-2 pl-6 text-base leading-relaxed text-on-surface-variant">
                <li>
                  Start your essay with a specific moment or experience, not a
                  generic statement about your passion for learning.
                </li>
                <li>
                  Tailor every application to the specific scholarship&apos;s
                  mission and values — avoid generic, one-size-fits-all
                  responses.
                </li>
                <li>
                  Quantify your impact wherever possible: &ldquo;organized a
                  tutoring program that served 50 students&rdquo; is stronger
                  than &ldquo;helped other students.&rdquo;
                </li>
                <li>
                  Ask for recommendation letters at least three weeks in
                  advance, and provide your recommenders with context about the
                  scholarship.
                </li>
                <li>
                  Proofread ruthlessly — spelling and grammar errors signal a
                  lack of care and attention to detail.
                </li>
              </ul>
            </AnimatedSection>

            <AnimatedSection variant="fadeUp" delay={0.1}>
              <h2
                id="section-application"
                className="font-heading text-2xl font-medium text-on-surface md:text-3xl"
              >
                Building a Strong Applicationn
              </h2>
              <p className="mt-4 text-base leading-relaxed text-on-surface-variant">
                A strong scholarship application is more than a list of
                achievements. It&apos;s a narrative that connects your
                experiences, your goals, and the specific opportunity
                you&apos;re applying for. Reviewers read hundreds of
                applications — yours needs to stand out by being authentic,
                specific, and memorable.
              </p>

              <ul className="mt-4 list-disc space-y-2 pl-6 text-base leading-relaxed text-on-surface-variant">
                <li>
                  Start your essay with a specific moment or experience, not a
                  generic statement about your passion for learning.
                </li>
                <li>
                  Tailor every application to the specific scholarship&apos;s
                  mission and values — avoid generic, one-size-fits-all
                  responses.
                </li>
                <li>
                  Quantify your impact wherever possible: &ldquo;organized a
                  tutoring program that served 50 students&rdquo; is stronger
                  than &ldquo;helped other students.&rdquo;
                </li>
                <li>
                  Ask for recommendation letters at least three weeks in
                  advance, and provide your recommenders with context about the
                  scholarship.
                </li>
                <li>
                  Proofread ruthlessly — spelling and grammar errors signal a
                  lack of care and attention to detail.
                </li>
              </ul>
            </AnimatedSection>

            <AnimatedSection variant="fadeUp" delay={0.1}>
              <p className="text-base leading-relaxed text-on-surface-variant">
                Remember that{" "}
                <a
                  href="#"
                  className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
                >
                  financial aid offices
                </a>{" "}
                are valuable resources that many students overlook. They can
                help you identify opportunities, review your applications, and
                connect you with alumni who have successfully navigated the
                scholarship process. Don&apos;t hesitate to{" "}
                <a
                  href="#"
                  className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
                >
                  reach out for guidance
                </a>{" "}
                — it could make the difference between a good application and a
                winning one.
              </p>
            </AnimatedSection>
          </div>
        </div>

        {/* Sidebar — renders above content on mobile via order */}
        <aside className="order-last md:order-first">
          <div className="sticky top-32 flex flex-col gap-6">
            <AnimatedSection variant="fadeUp" delay={0.2}>
              <div className="flex flex-col gap-4 rounded-2xl border border-white/40 bg-white/25 p-6 shadow-md backdrop-blur-2xl dark:border-white/10 dark:bg-white/10">
                {/* Category */}
                <div>
                  <span className="text-xs font-medium uppercase tracking-wider text-on-surface-variant">
                    Category
                  </span>
                  <div className="mt-2">
                    <span
                      className={cn(
                        glassPill,
                        "inline-flex items-center gap-2 px-3.5 py-1 text-xs tracking-wider",
                      )}
                    >
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

            {/* Reading progress: section dots + parallax waves + percentage */}
            <AnimatedSection variant="fadeUp" delay={0.3}>
            <ReadingProgress
              articleRef={articleRef}
              sections={ARTICLE_SECTIONS}
            />
            </AnimatedSection>
          </div>
        </aside>
      </article>
    </div>
  );
}
