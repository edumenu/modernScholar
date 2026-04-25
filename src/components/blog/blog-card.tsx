"use client"

import { useState } from "react";
import Image from "next/image"
import Link from "next/link";
import { Icon } from "@iconify/react"
import { cva, type VariantProps } from "class-variance-authority";
import type { BlogPost } from "@/data/blog-posts";
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button/button";

const blogCardVariants = cva(
  "group relative flex h-full overflow-hidden cursor-pointer rounded-2xl border shadow-md transition-shadow duration-300",
  {
    variants: {
      variant: {
        default:
          "flex-col bg-surface-container-low border-outline-variant/40 hover:shadow-xl dark:bg-surface-container-low dark:border-outline-variant/20",
        compact:
          "flex-col bg-surface-container-low border-outline-variant/40 hover:shadow-lg dark:bg-surface-container-low dark:border-outline-variant/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

interface BlogCardProps extends VariantProps<typeof blogCardVariants> {
  post: BlogPost;
}

export function BlogCard({ post, variant = "default" }: BlogCardProps) {
  const [imgError, setImgError] = useState(false);
  const isCompact = variant === "compact";

  return (
    <Link href={`/blog/${post.slug}`} className="block h-full">
      <div className={cn(blogCardVariants({ variant }))}>
        {/* Image — full-width 16:9 */}
        <div className="relative w-full overflow-hidden aspect-video">
          <Image
            src={imgError ? "/mountain.png" : post.image}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            onError={() => setImgError(true)}
          />
        </div>

        <div className="flex flex-1 flex-col p-6">
          {/* Category badge + series indicator */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-outline-variant/30 bg-surface-container px-3 py-0.5 text-xs tracking-wider dark:bg-surface-container dark:border-outline-variant/20">
              <span className="size-1.5 rounded-full bg-on-surface" />
              <span className="text-on-surface">{post.category}</span>
            </div>
            {post.series && (
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-primary">
                Part {post.series.part}/{post.series.totalParts}
              </span>
            )}
          </div>

          {/* Title */}
          <h2 className="mt-3 font-heading text-xl font-medium leading-snug text-on-surface line-clamp-2 md:text-2xl">
            {post.title}
          </h2>

          {/* Excerpt */}
          <p className="mt-2 text-sm leading-relaxed text-on-surface-variant line-clamp-2">
            {post.excerpt}
          </p>

          {!isCompact && (
            <>
              {/* Metadata row + reading time bars */}
              <div className="mt-auto flex items-center justify-between pt-4">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-on-surface-variant">Published</span>
                  <span className="font-medium text-on-surface">
                    {post.publishDate}
                  </span>
                </div>
                <ReadingTimeBars readTime={post.readTime} />
              </div>

              {/* Author byline */}
              <div className="flex items-center justify-between pt-3">
                <div className="flex items-center gap-2.5">
                  <div className="relative size-7 shrink-0 overflow-hidden rounded-full bg-surface-container-high">
                    <Image
                      src={post.author.avatar}
                      alt={post.author.name}
                      fill
                      className="object-cover"
                      sizes="28px"
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.style.display = "none";
                      }}
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-on-surface">
                      {post.author.name}
                    </span>
                    <span className="text-[11px] text-on-surface-variant">
                      {post.author.role}
                    </span>
                  </div>
                </div>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  animateText
                  variant="secondary"
                  data-icon="inline-start"
                  size="xs"
                  hoverTrigger="parent"
                >
                  <span data-label>Read Article</span>
                  <Icon
                    icon="solar:arrow-right-linear"
                    data-icon="inline-end"
                  />
                </Button>
              </div>
            </>
          )}

          {isCompact && (
            <div className="mt-auto flex items-center justify-between pt-3">
              <span className="text-xs font-medium text-on-surface">
                {post.readTime}
              </span>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                }}
                animateText
                variant="secondary"
                data-icon="inline-start"
                size="xs"
                hoverTrigger="parent"
              >
                <span data-label>Read Article</span>
                <Icon icon="solar:arrow-right-linear" data-icon="inline-end" />
              </Button>
            </div>
          )}
        </div>

        {/* Hover accent border — slides from left to right */}
        {/* <div className="absolute bottom-0 left-0 h-0.75 w-0 bg-primary transition-all duration-500 ease-out group-hover:w-full" /> */}
      </div>
    </Link>
  );
}

function ReadingTimeBars({ readTime }: { readTime: string }) {
  const minutes = parseInt(readTime) || 5
  const filled = Math.min(5, Math.max(1, Math.ceil(minutes / 3)))

  return (
    <div
      role="img"
      aria-label={readTime}
      className="flex items-end gap-0.5"
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          aria-hidden="true"
          className={cn(
            "w-1 rounded-full transition-colors",
            i < filled ? "bg-primary" : "bg-outline-variant/30",
          )}
          style={{ height: `${8 + i * 2}px` }}
        />
      ))}
    </div>
  )
}
