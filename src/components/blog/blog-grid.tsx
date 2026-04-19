"use client"

import { useState, useCallback, useEffect, useMemo } from "react"
import { useLenis } from "lenis/react"
import { useQueryState, parseAsInteger } from "nuqs"
import { Icon } from "@iconify/react"
import { cn } from "@/lib/utils"
import { blogPosts } from "@/data/blog-posts"
import { BlogCard } from "./blog-card"
import { BlogCardFeatured } from "./blog-card-featured"
import { BlogFilters } from "./blog-filters"
import { Button } from "@/components/ui/button/button"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination"
import {
  PaginationLinkInkSpread,
  PaginationPreviousInkSpread,
  PaginationNextInkSpread,
  PaginationEllipsisInkSpread,
} from "@/components/ui/pagination/pagination-ink-spread"

const PAGE_SIZE = 9

export function BlogGrid() {
  const [activeCategory, setActiveCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1))

  const lenis = useLenis()

  const categories = useMemo(() => {
    const unique = Array.from(new Set(blogPosts.map((p) => p.category)))
    return ["All", ...unique]
  }, [])

  const filteredPosts = useMemo(() => {
    let posts = blogPosts

    if (activeCategory !== "All") {
      posts = posts.filter((p) => p.category === activeCategory)
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      posts = posts.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q),
      )
    }

    return posts
  }, [activeCategory, searchQuery])

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / PAGE_SIZE))
  const safePage = Math.min(Math.max(1, page), totalPages)
  const start = (safePage - 1) * PAGE_SIZE
  const visiblePosts = filteredPosts.slice(start, start + PAGE_SIZE)

  // Show featured post only on page 1 when explicitly marked
  const featuredPost =
    safePage === 1 ? visiblePosts.find((p) => p.featured) ?? null : null
  const gridPosts = featuredPost
    ? visiblePosts.filter((p) => p.id !== featuredPost.id)
    : visiblePosts

  // Normalize URL if requested page is out of range
  useEffect(() => {
    if (page !== safePage) {
      setPage(safePage === 1 ? null : safePage)
    }
  }, [page, safePage, setPage])

  // Recalculate Lenis scroll height when content changes
  useEffect(() => {
    if (!lenis) return
    const timer = setTimeout(() => lenis.resize(), 100)
    return () => clearTimeout(timer)
  }, [safePage, activeCategory, searchQuery, lenis])

  const handleCategoryChange = useCallback(
    (category: string) => {
      setActiveCategory(category)
      setPage(null)
    },
    [setPage],
  )

  const handleSearchChange = useCallback(
    (query: string) => {
      setSearchQuery(query)
      setPage(null)
    },
    [setPage],
  )

  const handleClearFilters = useCallback(() => {
    setActiveCategory("All")
    setSearchQuery("")
    setPage(null)
  }, [setPage])

  const goToPage = useCallback(
    (n: number) => {
      const clamped = Math.min(Math.max(1, n), totalPages)
      setPage(clamped === 1 ? null : clamped)
      const el = document.getElementById("blog-grid-top")
      if (el && lenis) lenis.scrollTo(el, { offset: -80 })
    },
    [totalPages, setPage, lenis],
  )

  const pageNumbers = getPageNumbers(safePage, totalPages)

  return (
    <div id="blog-grid-top" className="flex flex-col gap-8 scroll-mt-20">
      <BlogFilters
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
      />

      {/* Featured post — editorial hero */}
      {featuredPost && (
        <div className="pt-2">
          <BlogCardFeatured post={featuredPost} />
        </div>
      )}

      {/* Standard grid */}
      {gridPosts.length > 0 && (
        <div className="grid grid-cols-1 gap-6 pt-2 pb-10 sm:grid-cols-2 lg:grid-cols-3">
          {gridPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      )}

      {/* Styled empty state */}
      {filteredPosts.length === 0 && (
        <div className="flex flex-col items-center gap-4 py-16">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-surface-container">
            <Icon
              icon="solar:document-text-linear"
              className="size-8 text-on-surface-variant"
            />
          </div>
          <div className="text-center">
            <h3 className="font-heading text-lg font-medium text-on-surface">
              No articles found
            </h3>
            <p className="mt-1 text-sm text-on-surface-variant">
              Try adjusting your search or filters to find what you&apos;re
              looking for.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={handleClearFilters}>
            Clear filters
          </Button>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex flex-col items-center gap-2">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPreviousInkSpread
                  href="#"
                  aria-disabled={safePage === 1}
                  className={cn(
                    safePage === 1 && "pointer-events-none opacity-50",
                  )}
                  onClick={(e) => {
                    e.preventDefault()
                    if (safePage > 1) goToPage(safePage - 1)
                  }}
                />
              </PaginationItem>

              {pageNumbers.map((p, i) =>
                p === "ellipsis" ? (
                  <PaginationItem key={`ellipsis-${i}`}>
                    <PaginationEllipsisInkSpread />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={`page-${p}`}>
                    <PaginationLinkInkSpread
                      href="#"
                      isActive={p === safePage}
                      onClick={(e) => {
                        e.preventDefault()
                        goToPage(p)
                      }}
                    >
                      {p}
                    </PaginationLinkInkSpread>
                  </PaginationItem>
                ),
              )}

              <PaginationItem>
                <PaginationNextInkSpread
                  href="#"
                  aria-disabled={safePage === totalPages}
                  className={cn(
                    safePage === totalPages &&
                      "pointer-events-none opacity-50",
                  )}
                  onClick={(e) => {
                    e.preventDefault()
                    if (safePage < totalPages) goToPage(safePage + 1)
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  )
}

function getPageNumbers(
  current: number,
  total: number,
): (number | "ellipsis")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }
  const pages: (number | "ellipsis")[] = [1]
  const left = Math.max(2, current - 1)
  const right = Math.min(total - 1, current + 1)
  if (left > 2) pages.push("ellipsis")
  for (let p = left; p <= right; p++) pages.push(p)
  if (right < total - 1) pages.push("ellipsis")
  pages.push(total)
  return pages
}
