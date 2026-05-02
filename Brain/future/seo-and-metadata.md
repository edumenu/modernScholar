# Branch 2: SEO & Metadata

> Priority: P0 — Must fix before launch
> Depends on: Branch 1 (Critical Blockers) for `SITE_URL` constant, `robots.ts`, and `sitemap.ts`
> Date: 2026-04-22

## Problem Statement

Modern Scholar has incomplete and untyped metadata across all pages. The home page — the most important page for search and social sharing — exports no metadata at all. No page has OpenGraph or Twitter Card fields, meaning every social share renders with no preview image, no description, and a generic title. The root layout has no `metadataBase`, so any relative OG URLs would be silently incomplete. For a scholarship discovery platform that depends on organic search traffic and social sharing by students, this is a critical gap.

## Solution

Add typed, complete metadata exports to every page. Set `metadataBase` and a title template in the root layout. Add OpenGraph and Twitter Card fields to all pages. Create a default OG image. Extend the blog detail page's `generateMetadata` with article-specific structured data.

## User Stories

1. As a user sharing the home page on social media, I want to see a branded preview card with the site name, description, and a compelling image, so that my followers understand what Modern Scholar is.
2. As a user sharing a blog post on Twitter or LinkedIn, I want to see the article title, excerpt, and hero image in the preview card, so that the content looks professional and clickable.
3. As a user sharing the scholarships page in a group chat, I want to see a meaningful description like "Browse 50+ scholarships across 8 categories", so that recipients know what they'll find.
4. As a search engine indexing the site, I want every page to have a unique, descriptive `<title>` and `<meta name="description">`, so that search results display relevant snippets.
5. As a developer maintaining the codebase, I want all metadata objects typed with `Metadata` from `next`, so that typos and invalid fields are caught at build time.
6. As a user searching Google for "Modern Scholar scholarships", I want the search result to show "Scholarships | Modern Scholar" with a category-aware description, so that I can distinguish pages in the results.

## Implementation Decisions

### Module 1: Root Layout Metadata Base

In `src/app/layout.tsx`, update the metadata export to include:

- `metadataBase` pointing to the production URL (reuse the `SITE_URL` constant from Branch 1).
- A `title` object with `template: "%s | Modern Scholar"` and `default: "Modern Scholar"`. This eliminates the need for every child page to manually append "| Modern Scholar" to their titles.
- Root-level `openGraph` fields: `siteName`, `type: "website"`, `locale: "en_US"`.
- Root-level `twitter` fields: `card: "summary_large_image"`, `creator` handle if available.

All metadata exports across the codebase must use `import type { Metadata } from "next"` for type safety.

### Module 2: Home Page Metadata

Create a `metadata` export in `src/app/page.tsx` with:

- `title: "Discover & Secure Scholarships"` (the template will append "| Modern Scholar").
- `description` summarizing the platform's value proposition.
- `openGraph` with `title`, `description`, `url: "/"`, and `images` pointing to the default OG image.

### Module 3: Per-Page Metadata Completion

Update metadata exports in:

- **`src/app/scholarships/page.tsx`** — Title: "Scholarships". Description referencing the number of scholarships and categories. Add `openGraph` fields.
- **`src/app/blog/page.tsx`** — Title: "Blog". Description about scholarship insights and guides. Add `openGraph` fields.
- **`src/app/contact/page.tsx`** — Title: "Contact". Description about reaching the team. Add `openGraph` fields.

Each page should add `import type { Metadata } from "next"` and annotate the export.

### Module 4: Blog Detail Enhanced Metadata

In `src/app/blog/[slug]/page.tsx`, extend `generateMetadata` to return:

- `openGraph.type: "article"`
- `openGraph.publishedTime` from `post.publishDate`
- `openGraph.images` using the post's hero image with width/height/alt
- `twitter.card: "summary_large_image"`
- `twitter.title` and `twitter.description`

The existing `title` and `description` fields are already present — this module adds the social sharing dimensions.

### Module 5: Default OG Image

Create a static OG image file at `src/app/opengraph-image.png` (or `.jpg`). This is the Next.js App Router convention — placing it in `src/app/` makes it the default OG image for all pages that don't specify their own. The image should be 1200x630px and feature the Modern Scholar brand mark, tagline, and the warm cream/brownish-red color palette.

Alternatively, create `src/app/opengraph-image.tsx` using Next.js's `ImageResponse` API to dynamically generate the OG image from the design tokens. This approach keeps the image in sync with the brand but adds build complexity.

Recommendation: Start with a static PNG for launch, iterate to dynamic generation later.

## Testing Decisions

- **Modules to test**: Module 1 (metadataBase resolution), Module 4 (generateMetadata output shape)
- **Prior art**: The blog `[slug]/page.tsx` already has a working `generateMetadata` function — use it as the reference pattern. Metadata can be tested by running `npm run build` and inspecting the generated HTML `<head>` tags, or via Playwright tests that assert `document.querySelector('meta[property="og:title"]')`.

## Out of Scope

- JSON-LD structured data (schema.org markup)
- Dynamic OG image generation per blog post
- Canonical URL management for paginated routes
- Alternate language metadata (`hreflang`)

## Further Notes

- The `SITE_URL` constant should be established in Branch 1 and imported here. If Branch 2 is implemented first, define it locally and refactor when Branch 1 lands.
- The title template pattern (`"%s | Modern Scholar"`) means child pages should NOT include "| Modern Scholar" in their title strings — the template handles it automatically.
- After implementation, validate OG tags using the Facebook Sharing Debugger and Twitter Card Validator before launch.
