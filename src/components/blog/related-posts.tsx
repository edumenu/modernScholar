"use client"

import { useState, useEffect, useRef } from "react"
import { BlogCard } from "@/components/blog/blog-card"
import { AnimatedSection } from "@/components/ui/animatedSection/animated-section"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from "@/components/ui/carousel"
import type { BlogPost } from "@/lib/blog"

/** Subset of BlogPost RelatedPosts forwards to BlogCard. */
type RelatedPostItem = Pick<
  BlogPost,
  | "slug"
  | "title"
  | "excerpt"
  | "category"
  | "image"
  | "publishDate"
  | "readTime"
  | "author"
  | "featured"
  | "series"
>

interface RelatedPostsProps {
  posts?: RelatedPostItem[]
}

export function RelatedPosts({ posts = [] }: RelatedPostsProps) {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)
  const initialized = useRef(false)

  useEffect(() => {
    if (!api) return

    const sync = () => {
      setCurrent(api.selectedScrollSnap())
      setCount(api.scrollSnapList().length)
    }

    // Initialize once on mount
    if (!initialized.current) {
      initialized.current = true
      sync()
    }

    api.on("select", sync)
    api.on("reInit", sync)
    return () => {
      api.off("select", sync)
      api.off("reInit", sync)
    }
  }, [api])

  if (posts.length === 0) return null

  return (
    <AnimatedSection variant="fadeUp">
      <section className="mt-16">
        <Carousel
          opts={{
            align: "start",
            loop: false,
          }}
          setApi={setApi}
          className="w-full"
        >
          {/* Header row: heading left, arrows right */}
          <div className="mb-8 flex items-center justify-between">
            <h2 className="font-heading text-2xl font-medium text-on-surface md:text-3xl">
              Related Blogs
            </h2>
            <div className="flex items-center gap-3">
              {count > 1 && (
                <span className="text-sm tabular-nums text-on-surface-variant">
                  {current + 1} / {count}
                </span>
              )}
              <CarouselPrevious
                className="static translate-y-0"
                variant="outline"
                size="icon"
              />
              <CarouselNext
                className="static translate-y-0"
                variant="outline"
                size="icon"
              />
            </div>
          </div>

          <CarouselContent className="-ml-4 px-8 pb-8">
            {posts.map((relatedPost, index) => {
              const isActive = index === current
              return (
                <CarouselItem
                  key={relatedPost.slug}
                  className="basis-full pl-4 md:basis-1/2 lg:basis-1/3"
                  inert={!isActive}
                >
                  <BlogCard post={relatedPost} variant="compact" />
                </CarouselItem>
              )
            })}
          </CarouselContent>
        </Carousel>
      </section>
    </AnimatedSection>
  );
}
