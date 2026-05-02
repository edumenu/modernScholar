## Problem Statement

Users can browse the blog listing page but cannot view individual blog posts. Clicking a blog card leads nowhere. A detail page is needed to display full post content, metadata, and related posts — establishing the template that will later render MDX content.

## Location

`/Users/edemdumenu/Documents/Workspace/DearModernScholar/Brain/PRDs/04_11_2026/blog-detail-page.md`

## Solution

Add a blog detail page at `/blog/[slug]` with a two-column layout: article content on the left, minimal metadata sidebar on the right. A related posts carousel at the bottom shows same-category posts. Blog cards on the listing page become clickable links to this detail page.

The page is a UI template — hardcoded placeholder content demonstrates all prose elements (headings, paragraphs, blockquotes, lists, links, images) that MDX will eventually render. MDX configuration is deferred.

## User Stories

1. As a visitor, I want to click a blog card on the listing page so that I navigate to the full blog post.
2. As a visitor, I want to see the post title, subtitle/excerpt, and a hero image at the top of the detail page so that I immediately understand what the post is about.
3. As a visitor, I want to see post metadata (category, publish date, read time) in a sidebar so that I can quickly assess the post's relevance.
4. As a visitor on mobile, I want the sidebar metadata to appear above the article content so that I see context before reading.
5. As a visitor on desktop, I want the sidebar to remain sticky while I scroll through the article so that metadata stays accessible.
6. As a visitor, I want to see related posts from the same category at the bottom of the page so that I can continue exploring similar content.
7. As a visitor, I want to horizontally scroll through related posts using carousel arrows so that I can browse without leaving the page.
8. As a visitor, I want the page to be fully responsive across mobile, tablet, and desktop breakpoints.
9. As a visitor navigating to an invalid slug, I want to see a 404 page instead of a broken page.
10. As a visitor, I want smooth entrance animations consistent with the rest of the site.

## Implementation Decisions

### Modules

**1. Blog Detail Page Route**
- Dynamic route at `src/app/blog/[slug]/page.tsx`
- Server component using Next.js 16's Promise-based `params` (`await params`)
- Exports `generateMetadata` for dynamic page title and description from post data
- Exports `generateStaticParams` to statically generate pages for all known slugs
- Calls `notFound()` for invalid slugs
- Renders `BlogDetail` and `RelatedPosts` components

**2. BlogDetail Component**
- Client component at `src/components/blog/blog-detail.tsx`
- Accepts a `BlogPost` as prop
- Two-column grid layout: `md:grid-cols-[1fr_300px]`
  - Left column: Article content (title, excerpt, hero image, placeholder prose sections)
  - Right column: Sticky sidebar (`sticky top-32`) with category badge, publish date, read time
- Mobile: Sidebar renders above content via CSS `order` classes
- Typography: Noto Serif (`font-heading`) for title and section headings, Poppins (default sans) for body
- Uses existing design tokens: `on-surface`, `on-surface-variant`, `glassPill` for category badge
- Entrance animations via `AnimatedSection`
- Placeholder content includes: hero image, 2+ section headings, multiple paragraphs, a blockquote, an unordered list, and inline links

**3. RelatedPosts Component**
- Client component at `src/components/blog/related-posts.tsx`
- Accepts current post as prop
- Filters `blogPosts` by matching category, excludes current post, limits to 6
- Uses shadcn `Carousel` with `CarouselContent`, `CarouselItem`, `CarouselPrevious`, `CarouselNext`
- Carousel navigation arrows positioned above the carousel on the right side
- Responsive slide sizing: 1 visible on mobile, 2 on md, 3 on lg (via `basis-full md:basis-1/2 lg:basis-1/3`)
- Each slide renders the existing `BlogCard` component
- Section heading "Related Articles" in Noto Serif
- Wrapped in `AnimatedSection` for scroll-triggered entrance
- Falls back gracefully (hidden) if no related posts exist

**4. BlogCard Link Update**
- Modify existing `src/components/blog/blog-card.tsx`
- Wrap card content in Next.js `Link` to `/blog/${post.slug}`
- Preserve existing hover animations and button behavior

### Dependencies

- **shadcn Carousel**: Install via `npx shadcn@latest add carousel` — adds Embla-based carousel component to `src/components/ui/carousel/`
- No new external dependencies beyond what shadcn carousel brings (embla-carousel-react)

### Architectural Notes

- No data model changes needed — `BlogPost` already has `slug`, `category`, `publishDate`, `readTime`
- Page lives within the existing `PageShell` layout wrapper (applied in root layout)
- All styling uses existing design system tokens and utilities
- MDX integration is explicitly deferred — the placeholder content demonstrates the visual hierarchy that MDX components will later fill

## Testing Decisions

- **Modules to test**: None — this is a static UI template with no business logic. Visual correctness is verified manually.
- **Verification**: Navigate to `/blog`, click cards, verify detail page renders, check responsive behavior, test carousel navigation, verify 404 for invalid slugs, confirm dark mode.

## Out of Scope

- MDX configuration and content rendering
- Author profiles or detailed author information
- Share/social links functionality
- Table of contents / reading progress indicator
- Comments or engagement features
- Blog post search on the detail page
- SEO-specific optimizations beyond basic metadata
- Analytics or view tracking

## Further Notes

- When MDX is added later, the placeholder content in `BlogDetail` will be replaced by an `{children}` slot or MDX renderer. The prose styling established here should transfer directly to MDX component overrides.
- The `BlogPost` data model may need additional fields (author, tags, body content path) when real content is introduced — this is expected and intentionally deferred.
- Consider adding `embla-carousel-autoplay` plugin later if auto-scrolling related posts is desired.
