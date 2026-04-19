"use client"

import { useState, useEffect, useRef } from "react"
import type { BlogPost } from "@/data/blog-posts"
import { blogPosts } from "@/data/blog-posts"
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

interface RelatedPostsProps {
  post: BlogPost
}

export function RelatedPosts({ post }: RelatedPostsProps) {
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

  const relatedPosts = blogPosts
    .filter((p) => p.category === post.category && p.id !== post.id)
    .slice(0, 6)

  if (relatedPosts.length === 0) return null

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
              Related Articles
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
                size="icon-sm"
              />
              <CarouselNext
                className="static translate-y-0"
                variant="outline"
                size="icon-sm"
              />
            </div>
          </div>

          <CarouselContent className="-ml-4">
            {relatedPosts.map((relatedPost) => (
              <CarouselItem
                key={relatedPost.id}
                className="basis-full pl-4 md:basis-1/2 lg:basis-1/3"
              >
                <BlogCard post={relatedPost} variant="compact" />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </section>
    </AnimatedSection>
  )
}
