# Blog Editorial Upgrade — Verification Report

**Date**: 2026-04-19
**PRD**: blog-editorial-upgrade.md
**Build**: Passes (Next.js 16.2.1 Turbopack)
**Lint**: 0 errors (2 pre-existing warnings unrelated to blog)

---

## Implementation Decision Verification

### 1. Fix Hardcoded Blog Card Image
- [x] `blog-card.tsx` uses `post.image` instead of `/mountain.png`
- [x] `onError` fallback renders `/mountain.png` when image fails to load
- [x] `sizes` attribute updated for responsive accuracy (`33vw`, `50vw`, `100vw`)
- [x] `blog-card-related.tsx` deleted (consolidated into `BlogCard`)

### 2. Remove Glassmorphism from Cards and Sidebar
- [x] Blog cards use `bg-surface-container-low border-outline-variant/40 shadow-md` (Z-1 tonal layering)
- [x] Detail page sidebar uses same tonal surface treatment
- [x] Reading progress widget uses tonal surface treatment
- [x] No `backdrop-blur`, `bg-white/25`, or `border-white/40` remain in blog components
- [x] Category badges use `bg-surface-container border-outline-variant/30` instead of `glassPill`

### 3. Editorial Grid Hierarchy
- [x] First post on page 1 (when no search active) renders as `BlogCardFeatured`
- [x] `BlogCardFeatured` uses horizontal layout: image left, text right (`sm:flex-row`)
- [x] Remaining posts use standard vertical `BlogCard`

### 4. Card Image Redesign
- [x] Fixed `size-60` square removed
- [x] Full-width container with `aspect-[16/9]` implemented
- [x] Image bleeds to card edges (no padding)

### 5. Compound Hover Choreography
- [x] Image scales to `1.04` on hover via `group-hover:scale-[1.04]`
- [x] Primary-colored bottom border slides from `w-0` to `w-full` on hover
- [x] Shadow elevates from `md` to `xl` on hover
- [x] CTA copy changed from "View" to "Read Article"
- [x] `motion` `whileHover={{ scale: 1.009 }}` removed (replaced with CSS-based hover)

### 6. Author Data Model and Byline
- [x] `BlogAuthor` interface added: `{ name, role, avatar }`
- [x] `author` field added to `BlogPost` type
- [x] 6 author profiles created and assigned to all 12 posts
- [x] Compact byline rendered on cards (28px avatar, name, role)
- [x] Larger author bio card rendered at bottom of detail page (56px avatar)

### 7. Dynamic Article Content
- [x] `ArticleSection` interface added: `{ id, title, content[], blockquote?, list? }`
- [x] `content` field added to `BlogPost` type
- [x] All 12 posts have unique, structured article content (3 sections each)
- [x] `ARTICLE_SECTIONS` hardcoded array removed from `blog-detail.tsx`
- [x] Sections derived from `post.content`
- [x] Duplicate `section-applicationn` section removed

### 8. Reading Progress Fixes
- [x] Clickable section dots with `lenis.scrollTo(element, { offset: -100 })`
- [x] Active section detection offset changed to `window.innerHeight * 0.3`
- [x] Visual progress bar added (`motion.div` with `scaleX` driven by `useSpring(scrollYProgress)`)
- [x] `key`-based pop animation replaced with smooth `useSpring` counter transition
- [x] `tabular-nums` added for stable percentage display

### 9. Detail Page Typography and Layout
- [x] Body text changed from `text-on-surface-variant` to `text-on-surface`
- [x] H2 weight increased to `font-bold`
- [x] Chapter breaks added: `border-t border-primary/20 pt-8 mt-8` before each H2 (except first)
- [x] Sidebar breakpoint shifted from `md:grid-cols-[300px_1fr]` to `lg:grid-cols-[260px_1fr]`
- [x] At `md`, sidebar collapses into horizontal metadata strip above article
- [x] Blockquotes upgraded to pull quotes with large decorative quotation marks, `font-heading text-xl md:text-2xl`, primary-colored left border

### 10. Consolidate BlogCardRelated
- [x] `blog-card-related.tsx` deleted
- [x] CVA `variant` prop added to `BlogCard`: `default` (full metadata) and `compact` (no metadata row)
- [x] `related-posts.tsx` updated to use `<BlogCard variant="compact" />`
- [x] No remaining imports of `BlogCardRelated` anywhere in codebase

### 11. Related Posts Arrow Layout
- [x] `-mt-14` negative margin hack removed
- [x] Proper flex row: heading left, navigation arrows right (`flex items-center justify-between`)
- [x] Carousel slide counter added (`1 / N` format) using `useSyncExternalStore` with Embla API

### 12. Filter Fixes
- [x] Mobile filter badge derives count from actual active filter state (category + search)
- [x] Desktop collapsed search has `border border-outline-variant/30 bg-surface-container-low/50`
- [x] Empty state styled with icon, heading, description, and "Clear filters" CTA button
- [x] Hero fluid typography uses `text-[clamp(3rem,8vw+1rem,7rem)]`

---

## User Story Coverage

| # | User Story | Status |
|---|-----------|--------|
| 1 | Unique image per blog post | Covered |
| 2 | Featured/hero post at top | Covered |
| 3 | Author bylines | Covered |
| 4 | Post-specific content on detail page | Covered |
| 5 | Clickable reading progress dots | Covered |
| 6 | Visual progress bar in sidebar | Covered |
| 7 | Sidebar collapses on tablet (768-1024px) | Covered |
| 8 | High-contrast readable body text | Covered |
| 9 | Clear hover feedback on cards | Covered |
| 10 | Tonal surface layering instead of glass | Covered |
| 11 | Styled empty state with clear filter | Covered |
| 12 | Carousel item count indicator | Covered |
| 13 | Fluid hero heading scaling | Covered |

---

## Files Modified

- `src/data/blog-posts.ts` — Expanded type + all 12 posts with author/content data
- `src/components/blog/blog-card.tsx` — Full rewrite with CVA variants, image fix, hover, byline
- `src/components/blog/blog-card-featured.tsx` — New component (horizontal featured card)
- `src/components/blog/blog-grid.tsx` — Editorial hierarchy, styled empty state
- `src/components/blog/blog-detail.tsx` — Dynamic content, typography, sidebar breakpoint, author bio
- `src/components/blog/reading-progress.tsx` — Click-to-scroll, progress bar, spring animation
- `src/components/blog/related-posts.tsx` — Uses BlogCard compact, carousel counter, arrow layout
- `src/components/blog/blog-filters.tsx` — Dynamic badge count, search border visibility
- `src/components/blog/blog-hero.tsx` — Fluid clamp() typography

## Files Deleted

- `src/components/blog/blog-card-related.tsx` — Consolidated into BlogCard variant

## Notes

- Author avatar images (`/authors/*.jpg`) are referenced but not yet added to `/public/authors/`. The avatar component gracefully hides on error. Physical images should be added when available.
- Only 6 of 12 scholarship images exist in `/public/scholarships/`. Posts 7-12 will fall back to `/mountain.png` via the onError handler.
