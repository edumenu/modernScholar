"use client"

import type { RefObject } from "react"
import { AnimatedSection } from "@/components/ui/animatedSection/animated-section"
import { ReadingProgress } from "@/components/blog/reading-progress"
import { ShareDock } from "@/components/blog/share-dock"

interface RailSection {
  id: string
  title: string
}

interface RailPost {
  slug: string
  title: string
  excerpt?: string
}

interface BlogDetailRailProps {
  articleRef: RefObject<HTMLElement | null>
  sections: RailSection[]
  post: RailPost
}

export function BlogDetailRail({
  articleRef,
  sections,
  post,
}: BlogDetailRailProps) {
  const initialUrl = `/blog/${post.slug}`

  return (
    <aside
      className="sticky top-32 hidden lg:flex flex-col gap-6"
      aria-label="Article tools"
    >
      <AnimatedSection variant="fadeUp" delay={0.2}>
        <ReadingProgress articleRef={articleRef} sections={sections} />
      </AnimatedSection>
      <AnimatedSection variant="fadeUp" delay={0.3}>
        <ShareDock url={initialUrl} title={post.title} excerpt={post.excerpt} />
      </AnimatedSection>
    </aside>
  )
}
