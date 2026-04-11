"use client"

import { useState, useCallback, useEffect, useMemo } from "react"
import { useLenis } from "lenis/react"
import { useQueryState, parseAsInteger } from "nuqs"
import { cn } from "@/lib/utils"
import { blogPosts } from "@/data/blog-posts"
import { BlogCard } from "./blog-card"
import { BlogFilters } from "./blog-filters"
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

      <div className="grid grid-cols-1 gap-6 pt-2 pb-10 sm:grid-cols-2 lg:grid-cols-3">
        {visiblePosts.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <p className="py-12 text-center text-on-surface-variant">
          No articles found matching your criteria.
        </p>
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
