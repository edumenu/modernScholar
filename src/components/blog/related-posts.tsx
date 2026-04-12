"use client"

import type { BlogPost } from "@/data/blog-posts"
import { blogPosts } from "@/data/blog-posts"
import { BlogCardRelated } from "@/components/blog/blog-card-related"
import { AnimatedSection } from "@/components/ui/animatedSection/animated-section"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel"

interface RelatedPostsProps {
  post: BlogPost
}

export function RelatedPosts({ post }: RelatedPostsProps) {
  const relatedPosts = blogPosts
    .filter((p) => p.category === post.category && p.id !== post.id)
    .slice(0, 6)

  if (relatedPosts.length === 0) return null

  return (
    <AnimatedSection variant="fadeUp">
      <section className="mt-16">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="font-heading text-2xl font-medium text-on-surface md:text-3xl">
            Related Articles
          </h2>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: false,
          }}
          className="w-full"
        >
          {/* Navigation arrows above carousel on the right */}
          <div className="-mt-14 mb-4 flex items-center justify-end gap-2">
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

          <CarouselContent className="-ml-4">
            {relatedPosts.map((relatedPost) => (
              <CarouselItem
                key={relatedPost.id}
                className="basis-full pl-4 md:basis-1/2 lg:basis-1/3"
              >
                <BlogCardRelated post={relatedPost} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </section>
    </AnimatedSection>
  );
}
