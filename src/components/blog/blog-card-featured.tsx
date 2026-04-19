"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Icon } from "@iconify/react"
import type { BlogPost } from "@/data/blog-posts"
import { Button } from "@/components/ui/button/button"

interface BlogCardFeaturedProps {
  post: BlogPost
}

export function BlogCardFeatured({ post }: BlogCardFeaturedProps) {
  const [imgError, setImgError] = useState(false)

  return (
    <Link href={`/blog/${post.slug}`} className="block h-full">
      <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-outline-variant/40 bg-surface-container-low shadow-md transition-shadow duration-300 hover:shadow-xl dark:bg-surface-container-low dark:border-outline-variant/20 sm:flex-row">
        {/* Image — left half */}
        <div className="relative w-full overflow-hidden aspect-video sm:aspect-auto sm:w-1/2">
          <Image
            src={imgError ? "/mountain.png" : post.image}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
            sizes="(max-width: 640px) 100vw, 50vw"
            onError={() => setImgError(true)}
          />
        </div>

        {/* Content — right half */}
        <div className="flex flex-1 flex-col justify-center p-6 sm:p-8">
          {/* Category badge */}
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-outline-variant/30 bg-surface-container px-3 py-0.5 text-xs tracking-wider dark:bg-surface-container dark:border-outline-variant/20">
            <span className="size-1.5 rounded-full bg-on-surface" />
            <span className="text-on-surface">{post.category}</span>
          </div>

          {/* Title */}
          <h2 className="mt-3 font-heading text-2xl font-medium leading-snug text-on-surface md:text-3xl">
            {post.title}
          </h2>

          {/* Excerpt */}
          <p className="mt-3 text-sm leading-relaxed text-on-surface-variant line-clamp-3 md:text-base">
            {post.excerpt}
          </p>

          {/* Metadata */}
          <div className="mt-4 flex items-center gap-2 text-xs">
            <span className="text-on-surface-variant">Published</span>
            <span className="font-medium text-on-surface">
              {post.publishDate}
            </span>
            <span className="text-on-surface-variant">·</span>
            <span className="font-medium text-on-surface">
              {post.readTime}
            </span>
          </div>

          {/* Author byline + CTA */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="relative size-8 shrink-0 overflow-hidden rounded-full bg-surface-container-high">
                <Image
                  src={post.author.avatar}
                  alt={post.author.name}
                  fill
                  className="object-cover"
                  sizes="32px"
                  onError={(e) => {
                    const target = e.currentTarget
                    target.style.display = "none"
                  }}
                />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-on-surface">
                  {post.author.name}
                </span>
                <span className="text-xs text-on-surface-variant">
                  {post.author.role}
                </span>
              </div>
            </div>
            <Button
              onClick={(e) => {
                e.stopPropagation()
              }}
              animateText
              variant="secondary"
              data-icon="inline-start"
              size="sm"
              hoverTrigger="parent"
            >
              <span data-label>Read Article</span>
              <Icon icon="solar:arrow-right-linear" data-icon="inline-end" />
            </Button>
          </div>
        </div>

        {/* Hover accent border */}
        {/* <div className="absolute bottom-0 left-0 h-0.75 w-0 bg-primary transition-all duration-500 ease-out group-hover:w-full" /> */}
      </div>
    </Link>
  )
}
