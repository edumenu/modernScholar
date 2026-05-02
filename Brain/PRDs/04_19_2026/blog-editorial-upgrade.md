# Module 3: Blog Editorial Upgrade

> Part of the [UX/UI Audit](ux-audit-overview.md) — Priority: P0

## Problem Statement

The blog undermines Modern Scholar's premium editorial identity through several critical issues: every card shows the same hardcoded mountain image, article detail content is static regardless of slug, reading progress buttons don't work, and glassmorphism is applied to cards and sidebars in violation of the design system. The listing page uses a uniform grid with no editorial hierarchy, card images are undersized squares, there are no author bylines, hover states are imperceptible, and the related posts component is a near-duplicate of the main card with commented-out sections. The detail page has low-contrast body text, an early sidebar breakpoint that creates cramped columns, and a reading progress widget with no visual progress bar.

## Solution

Transform the blog from a generic CMS listing into a premium editorial publication. Fix all broken functionality, enforce design system compliance, introduce editorial hierarchy with a featured post slot, add author attribution, and create a reading experience worthy of the "Academic Curator" design system.

## User Stories

1. As a reader, I want each blog post to display its own unique image, so that I can visually distinguish between articles.
2. As a reader, I want the blog listing to have a featured/hero post at the top, so that I know which content the editors consider most important.
3. As a reader, I want to see who wrote each article, so that I can assess the credibility of scholarship guidance.
4. As a reader clicking a blog post, I want to see that post's actual content, so that I'm not reading the same static article every time.
5. As a reader, I want to click reading progress dots to jump to that section, so that I can navigate long articles efficiently.
6. As a reader, I want a visual progress bar in the sidebar, so that I can see at a glance how much of the article remains.
7. As a reader on a tablet (768-1024px), I want the sidebar to collapse into a horizontal strip above the article, so that the reading column isn't cramped.
8. As a reader, I want body text to be high-contrast and readable, so that long-form content doesn't strain my eyes.
9. As a reader hovering over a blog card, I want clear visual feedback (image scale, accent border reveal, button fill), so that I know the card is interactive.
10. As a reader, I want blog cards to use tonal surface layering instead of glass effects, so that the design is consistent and performant.
11. As a reader seeing "No articles found", I want a styled empty state with an icon and clear filter button, so that I know how to recover.
12. As a reader browsing related articles, I want the carousel to show how many items exist, so that I know there's more content to explore.
13. As a mobile user, I want the blog hero heading to scale fluidly, so that it fills the screen appropriately at any width.

## Implementation Decisions

### 1. Fix Hardcoded Blog Card Image

Replace `src="/mountain.png"` with `src={post.image}` in both `blog-card.tsx` and `blog-card-related.tsx`. Add `onError` fallback to the mountain image. Update `sizes` attribute for responsive accuracy.

**Components affected**: `blog-card.tsx`, `blog-card-related.tsx`

### 2. Remove Glassmorphism from Cards and Sidebar

Replace glass treatment (`border-white/40 bg-white/25 backdrop-blur-2xl`) with tonal surface layering on all blog cards, the detail page sidebar, and the reading progress widget. Use `bg-surface-container-low border-outline-variant/40 shadow-md` per design system Z-1 convention. This also improves performance — `backdrop-blur-2xl` on 9 cards in a grid is expensive on mid-range devices.

**Components affected**: `blog-card.tsx`, `blog-card-related.tsx`, `blog-detail.tsx`, `reading-progress.tsx`

### 3. Editorial Grid Hierarchy

Implement an asymmetric first row: the first post takes `col-span-2` with a horizontal card layout (image left, text right). Remaining posts use the standard vertical card. This mirrors premium publications and creates a visual anchor on the listing page.

**New component**: `BlogCardFeatured` (horizontal variant of BlogCard)
**Components affected**: `blog-grid.tsx`

### 4. Card Image Redesign

Remove fixed `size-60` square. Use a full-width container with `aspect-[16/9]` and negative margin to bleed the image to card edges. This creates a proper editorial image treatment and eliminates the padded-image awkwardness.

**Components affected**: `blog-card.tsx`

### 5. Compound Hover Choreography

Replace `scale: 1.009` with a multi-element hover: image scales to 1.04, a primary-colored bottom border slides from `w-0` to `w-full`, shadow elevates from `md` to `xl`. Use CSS `group-hover` for coordinated triggers. Change CTA copy from "View" to "Read Article".

**Components affected**: `blog-card.tsx`

### 6. Author Data Model and Byline

Add `author: { name: string; role: string; avatar: string }` to the `BlogPost` type. Populate for all 12 existing posts. Render a compact byline at the bottom of each card (28px circular avatar, name, role). On the detail page, render a larger author bio card at the bottom of the article.

**Components affected**: `blog-posts.ts` (data), `blog-card.tsx`, `blog-detail.tsx`

### 7. Dynamic Article Content

Add a `content` field to the `BlogPost` type containing structured article sections. Derive `ARTICLE_SECTIONS` from post data instead of hardcoding. Remove the duplicate section with typo `"section-applicationn"`. Each post should render its own content on the detail page.

**Components affected**: `blog-posts.ts` (data), `blog-detail.tsx`

### 8. Reading Progress Fixes

- **Clickable section dots**: Add `onClick` handler using `lenis.scrollTo(element, { offset: -100 })`.
- **Active section detection**: Change offset from `viewportCenter` to `window.innerHeight * 0.3` for more accurate reading-zone detection.
- **Visual progress bar**: Add a horizontal `motion.div` with `scaleX` driven by `scrollYProgress` below the section dots.
- **Percentage animation**: Replace the `key`-based pop animation with a smooth `useSpring` counter transition.

**Components affected**: `reading-progress.tsx`

### 9. Detail Page Typography and Layout

- **Body text contrast**: Change `text-on-surface-variant` to `text-on-surface` for article paragraphs.
- **Heading scale**: Increase H2 weight to `font-bold`. Add `border-t border-primary/20 pt-8 mt-8` before each H2 for visual chapter breaks.
- **Sidebar breakpoint**: Shift from `md:grid-cols-[300px_1fr]` to `lg:grid-cols-[260px_1fr]`. At `md`, collapse sidebar into a horizontal metadata strip above the title.
- **Blockquote upgrade**: Transform into pull quotes with large decorative quotation marks, `font-heading text-xl md:text-2xl`, and a left border in primary color.

**Components affected**: `blog-detail.tsx`

### 10. Consolidate BlogCardRelated

Delete `blog-card-related.tsx`. Add a `variant` prop to `BlogCard` using CVA: `default` (full card with metadata) and `compact` (carousel variant, no bottom metadata row). Update `related-posts.tsx` to use `<BlogCard variant="compact" />`.

**Components affected**: `blog-card.tsx`, `blog-card-related.tsx` (delete), `related-posts.tsx`

### 11. Related Posts Arrow Layout

Replace `-mt-14` negative margin hack with a proper flex row: heading on the left, navigation arrows on the right, using `flex items-center justify-between`.

**Components affected**: `related-posts.tsx`

### 12. Filter Fixes

- **Mobile filter badge**: Derive count from actual active filter state instead of hardcoded "1".
- **Desktop search visibility**: Add `border border-outline-variant/30 bg-surface-container-low/50` to the collapsed search state.
- **Empty state**: Replace plain `<p>` with styled block featuring an icon, heading, and "Clear filters" CTA.
- **Hero fluid typography**: Use `text-[clamp(3rem,8vw+1rem,7rem)]` for smooth scaling.

**Components affected**: `blog-filters.tsx`, `blog-grid.tsx`, `blog-hero.tsx`

## Testing Decisions

- **Modules to test**: Blog card image rendering (unit test: `post.image` prop used, fallback on error), reading progress click-to-scroll (Playwright: click dot, verify scroll position), search filtering (unit test: text search matches title/excerpt), editorial grid layout (visual regression test)
- **Prior art**: Existing Vitest + Playwright setup

## Out of Scope

- CMS or API integration for blog content (structured data in TypeScript files is sufficient for this phase)
- Comments system or social sharing
- Article series/collection grouping (Module 6)
- Reading time visual bars (Module 6)
- Global page-progress line in sticky nav (Module 6)

## Further Notes

- The `BlogPost` data model expansion (author + content fields) is the most impactful single change. It solves hardcoded content, enables bylines, and makes the blog feel like a real publication.
- Consider a carousel scroll indicator (dot pagination or "1/3" counter) below the related posts carousel to signal more content exists.
- The blog hero could be renamed from "Blogs" to something with more editorial identity ("The Scholar's Journal" or "Dispatches") to establish voice.
