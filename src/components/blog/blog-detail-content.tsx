import type { ReactNode } from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { AnimatedSection } from "@/components/ui/animatedSection/animated-section";
import { BlogDetailHeroImage } from "@/components/blog/blog-detail-hero-image";

interface BlogDetailContentProps {
  post: {
    title: string;
    excerpt: string;
    image: string;
    series?: { name: string; part: number; totalParts: number };
    author: { name: string; role: string; avatar: string };
  };
  body: ReactNode;
}

export function BlogDetailContent({ post, body }: BlogDetailContentProps) {
  return (
    <>
      {/* Title — capped at a readable measure so display-size Noto Serif
          doesn't run to ~120ch on xl viewports. */}
      <AnimatedSection variant="fadeUp">
        <h1 className="max-w-prose font-heading text-3xl font-bold leading-tight text-on-surface md:text-4xl lg:text-5xl">
          {post.title}
        </h1>
        {/* Series indicator */}
        {post.series && (
          <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3.5 py-1.5 text-xs font-medium text-primary">
            <Icon icon="solar:documents-linear" className="size-3.5" />
            Part {post.series.part} of {post.series.totalParts} &mdash;{" "}
            {post.series.name}
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

      {/* MDX Body — element-level styling (mt-* on h2/h3/p/ul/ol) is owned by
          useMDXComponents. Don't add space-y-* here or the two stack and
          throw the rhythm off. Capped to ~65ch for tablet-landscape measure. */}
      <AnimatedSection variant="fadeUp" delay={0.3}>
        <div className="mt-10 max-w-[65ch]">{body}</div>
      </AnimatedSection>

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
  );
}
