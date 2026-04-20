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
    <Link href={`/blog/${post.slug}`} className="block">
      <div className="group relative w-full overflow-hidden rounded-2xl shadow-lg transition-shadow duration-300 hover:shadow-xl">
        {/* Full-bleed image with 21:9 aspect ratio */}
        <div className="relative w-full aspect-21/9">
          <Image
            src={imgError ? "/mountain.png" : post.image}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            sizes="100vw"
            priority
            onError={() => setImgError(true)}
          />

          {/* Gradient overlay — vertical from transparent to dark */}
          <div className="absolute inset-0 bg-linear-to-b from-black/10 via-black/30 to-black/80" />

          {/* Content overlaid on image */}
          <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8 md:p-12">
            {/* Category pill + metadata row */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                <span className="size-1.5 rounded-full bg-white" />
                {post.category}
              </span>
              <span className="text-xs text-white/70">{post.publishDate}</span>
              <span className="text-white/40">&middot;</span>
              <span className="text-xs text-white/70">{post.readTime}</span>
            </div>

            {/* Title — large editorial Noto Serif */}
            <h2 className="font-heading text-2xl font-medium leading-tight text-white sm:text-3xl md:text-4xl lg:text-5xl max-w-3xl">
              {post.title}
            </h2>

            {/* Excerpt */}
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/80 line-clamp-2 md:text-base">
              {post.excerpt}
            </p>

            {/* Author + CTA */}
            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative size-9 shrink-0 overflow-hidden rounded-full border-2 border-white/30">
                  <Image
                    src={post.author.avatar}
                    alt={post.author.name}
                    fill
                    className="object-cover"
                    sizes="36px"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.style.display = "none";
                    }}
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-white">
                    {post.author.name}
                  </span>
                  <span className="text-xs text-white/60">
                    {post.author.role}
                  </span>
                </div>
              </div>
              <Button
                onClick={(e) => e.stopPropagation()}
                animateIcon
                variant="outline"
                size="sm"
                className="text-white border-white/30 hover:bg-white/10 hover:text-white shadow-none"
                hoverTrigger="parent"
              >
                Read Article
                <Icon icon="solar:arrow-right-linear" data-icon="inline-end" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
