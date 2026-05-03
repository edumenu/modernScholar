# Blog Content System (MDX Migration + Authoring Pipeline)

## Problem Statement

The blog detail page currently renders posts from `src/data/blog-posts.ts` — a hand-crafted TypeScript array of 12 dummy entries that exists solely to validate the UI. The schema forces every post into a rigid `ArticleSection[]` shape (one optional `blockquote`, one optional `list` per section), which limits what writers can express: no inline images, no callouts, no embedded scholarship cards, no flexible heading depth.

The *real* content lives in `ScholarshipBlogs.md` — four full posts (Common Mistakes, Winning Essay, First-Generation, Recommendation Letters) plus three placeholder titles, all written in loose, inconsistent markdown with no frontmatter, smart-quote artifacts, escaped characters, and sub-section headings expressed as bold-styled paragraphs rather than real headings. There is no system in place to ingest this real content, no metadata layer (author, publish date, category, tags), no image strategy, and no repeatable workflow for adding new posts.

The result: the existing blog detail page works, but there is no path to actually populate it with the user's editorial content at scale, and the dummy data masks how much friction the current schema would create for a writer.

## Location

`/Users/edemdumenu/Documents/Workspace/DearModernScholar/Brain/PRDs/05_02_2026/blog-content-system.md`

## Solution

Replace the static TypeScript blog data layer with an MDX-based authoring pipeline. Each post becomes a single `.mdx` file under `content/blog/` with typed YAML frontmatter (title, slug, excerpt, category, publishDate, author key, tags, optional series, optional related scholarships) and an MDX body that supports prose, lists, blockquotes, inline images, and a small set of custom components (`PullQuote`, `Callout`, `InlineScholarshipCard`).

A new `src/lib/blog.ts` module loads, parses, validates, and sorts MDX files at build time, exposing `getAllPosts()`, `getPostBySlug(slug)`, and `getRelatedPosts(post)`. Author metadata moves to its own registry (`src/data/blog-authors.ts`) referenced by short keys from frontmatter. The existing `blogPosts` array and `BlogPost`/`ArticleSection` types in `src/data/blog-posts.ts` are deleted; the dummy content goes with it.

The four real posts in `ScholarshipBlogs.md` are normalized (smart quotes, escape artifacts, missing spaces, sub-section heading levels) and migrated to MDX as the launch content set. The three placeholder titles are dropped — they are not content.

A scaffold script (`npm run new:blog`) prompts for title, slug, author, and category, then writes a frontmatter-prefilled MDX template. A documented prompt template for AI-generated cover images (Recraft / Flux / Midjourney) is added to `CLAUDE.md` so every cover image stays inside the "Academic Curator" palette without manual color tuning.

## User Stories

### Reader (end user)

1. As a reader, I want to open a blog post and see a typographic hierarchy that distinguishes the title, excerpt, section headings, body paragraphs, and pull quotes so I can scan or read deeply at will.
2. As a reader, I want pull quotes, lists, and section breaks rendered consistently across every post regardless of when it was authored.
3. As a reader, I want each post to load with a cover image that visually matches the site's editorial aesthetic so the experience feels curated rather than templated.
4. As a reader, I want to see the author's name, role, and avatar at the bottom of every post so I know who wrote it.
5. As a reader, I want related-post recommendations at the bottom of a post that prefer same-series and same-category matches so my next read is relevant.
6. As a reader on a multi-part series, I want a "Part X of Y" indicator and a series name so I understand the post's place in a larger arc.
7. As a reader who lands on an unknown slug, I want a not-found page rather than a crash.
8. As a reader, I want metadata (page title, description, OG image) populated correctly when I share a post link so the preview is accurate.

### Author (the user, writing posts)

9. As an author, I want to write blog posts in MDX with frontmatter so I never edit a TypeScript array again.
10. As an author, I want a `npm run new:blog "My Post Title"` command that scaffolds a new MDX file with frontmatter, slug, and section placeholders so I can start writing immediately.
11. As an author, I want frontmatter validation at build time (missing required field, unknown author key, duplicate slug) so I catch authoring errors before deploy.
12. As an author, I want to drop a `<PullQuote>` component anywhere in the body so I can place quotes for emphasis without restructuring my content into the old `ArticleSection` shape.
13. As an author, I want to embed a `<Callout type="tip|warning|note">` block to highlight actionable advice inside a post.
14. As an author, I want to embed an `<InlineScholarshipCard slug="..." />` that pulls from `scholarships-enriched.json` so I can cross-link real scholarships without copying data.
15. As an author, I want `readTime` computed automatically from word count so I do not have to estimate it manually.
16. As an author, I want a `status: draft | published` field that hides drafts from production builds (but keeps them visible in `npm run dev`) so I can commit work-in-progress safely.
17. As an author, I want to reuse the existing photos in `public/scholarships/` for cover images during MVP so I do not need to source or generate new artwork.
18. As an author migrating the four posts from `ScholarshipBlogs.md`, I want the smart-quote, escape-artifact, and sub-heading inconsistencies fixed in the migration so the resulting MDX files are clean from day one.

### Build / system

19. As the build, I want to fail loudly if two MDX files declare the same slug, an unknown author key is referenced, a required frontmatter field is missing, or `relatedScholarships` references a non-existent scholarship.
20. As the build, I want `generateStaticParams` and `generateMetadata` populated from the MDX directory so static export continues to work.
21. As the system, I want all post loading to happen in server components (no client-side filesystem access) so MDX parsing never ships to the browser.

## Implementation Decisions

### Content Layout

A new top-level `content/` directory holds authoring source. Posts live at `content/blog/<slug>.mdx`. The `slug` filename is the canonical slug — it overrides any `slug` field in frontmatter to prevent drift. Authors edit MDX; nothing else.

### Frontmatter Schema

Required: `title`, `excerpt`, `category`, `publishDate` (ISO 8601 string), `author` (key into the author registry).

Optional: `coverImage` (public-relative path; falls back to a default cover when omitted), `updatedDate`, `tags` (string array), `series` (object: `name`, `part`, `totalParts`), `featured` (boolean), `status` (`draft` | `published`, defaults to `published`), `seoDescription` (falls back to `excerpt`), `ogImage` (falls back to `coverImage`), `coverCredit`, `relatedScholarships` (array of scholarship slugs).

`readTime` is **never** in frontmatter — it is computed from MDX body word count at load time.

### Author Registry

`src/data/blog-authors.ts` exports a typed `Record<AuthorKey, BlogAuthor>` keyed by short string (`Catherine Dumenu`). Frontmatter references the key only (`author: Catherine Dumenu`). The existing six authors from the dummy file are preserved verbatim — names, roles, avatar paths.

### `src/lib/blog.ts` — Deep Module

A single module hides MDX loading, parsing, validation, sorting, and related-post selection behind a small interface:

- `getAllPosts(): Promise<BlogPost[]>` — reads `content/blog/*.mdx`, parses frontmatter via `gray-matter`, validates schema, joins author registry, computes `readTime`, sorts newest-first, filters out `status: draft` in production builds.
- `getPostBySlug(slug: string): Promise<BlogPost | null>`
- `getRelatedPosts(post: BlogPost, limit = 3): Promise<BlogPost[]>` — prefers same-series, then same-tag overlap, then same-category, breaking ties by recency.

Internally caches the parsed post list per build using `React.cache` so multiple page renders during static generation do not re-parse the filesystem.

### MDX Renderer + Component Map

`src/components/blog/mdx-components.tsx` exports the `useMDXComponents` map consumed by `@next/mdx`. It maps:

- `h2`, `h3`, `p`, `ul`, `ol`, `li`, `a`, `code`, `pre`, `blockquote`, `img` → existing design-system class strings (`font-heading`, `text-on-surface`, `leading-relaxed`, etc.) — pulled from the current `BlogDetailContent` styling.
- Custom components exposed in MDX scope without import:
  - `<PullQuote quote="..." />` — wraps existing `pull-quote.tsx` component.
  - `<Callout type="tip|warning|note">…</Callout>` — new component, three variants using existing OKLCH palette (sage for tip, terracotta for warning, surface-container for note).
  - `<InlineScholarshipCard slug="..." />` — new component, reads from `scholarships-enriched.json`, renders a compact card in-flow with link to the scholarship detail.

Heading anchors are auto-generated by `rehype-slug` + `rehype-autolink-headings` so future TOC work has stable IDs.

### `BlogDetailContent` Refactor

The component is simplified to render: title, optional series indicator, excerpt, hero image (using existing `BlogDetailHeroImage`), MDX body, author bio card. The `post.content.map(section => …)` loop is deleted. The `ArticleSection`, `BlogSeries`, `BlogPost` interfaces move from `src/data/blog-posts.ts` to `src/lib/blog.ts` (with `content: ArticleSection[]` replaced by `body: ReactNode` rendered MDX).

### Page Wiring

`src/app/blog/page.tsx` and `src/app/blog/[slug]/page.tsx` switch from synchronous `blogPosts` import to `await getAllPosts()` / `await getPostBySlug(slug)`. `generateStaticParams` enumerates MDX filenames. `generateMetadata` reads `seoDescription`, `ogImage`, and `title` from the resolved post.

### Image Strategy (Decision — MVP)

**Reuse the existing photos in `public/scholarships/`** as cover images for the MVP. Rationale: these assets already exist, already match the site's visual tone (the dummy data referenced them via `scholarship-1.jpg` … `scholarship-12.jpg`), and require zero new sourcing or generation work. This unblocks shipping the four real posts immediately.

**Frontmatter usage:**

- Each MDX file's frontmatter sets `coverImage: /scholarships/<filename>` pointing at the chosen photo from `public/scholarships/`.
- `coverImage` is **optional**. When omitted, the loader falls back to a single default cover image at `/blog/default-cover.jpg` (committed once, copied from one of the existing scholarship photos selected to feel category-neutral).
- The four migrated launch posts are each assigned a distinct photo from `public/scholarships/` so no two share a hero image.

**Author bio avatars:** unchanged — remain under `public/authors/` (existing assets retained).

**Rollout:** no new image directory or prompt template is introduced in this PRD. A dedicated `public/blog/` directory and a custom-photo or AI-generated cover pipeline can be reconsidered post-MVP once content volume warrants it.

### Scaffold Script

`scripts/new-blog-post.ts` (run as `npm run new:blog`) prompts for: title, author key, category, optional series. Generates kebab-case slug from title, writes `content/blog/<slug>.mdx` with prefilled frontmatter and a heading + paragraph stub. Refuses to overwrite an existing file.

### Migration of Real Content

The four full posts in `ScholarshipBlogs.md` become four MDX files. During migration:

- Smart quotes (`'` `"`) preserved as-is — they render correctly.
- Escape artifacts (`\!`, `\-`) and the typo `anapplication` are corrected.
- Sub-section headings currently expressed as bold-styled lines (e.g., "Not Following Directions") become real `## Heading` lines.
- "What to do instead:" blocks become `<Callout type="tip">` components.
- Lists stay as standard markdown bullet lists.
- Each post is assigned an author from the existing six (Catherine Dumenu for essay/personal-statement-style, James for mistakes/recommendations, Amara for first-gen) and a `coverImage` pointing at one of the existing photos in `public/scholarships/` (each post gets a distinct photo).
- The three placeholder titles ("No Essay Scholarships Aren't Worth Your Time", "International Students", "Sarah's Story", "Marcus's Medical Degree") are **dropped**. They are titles without content.

### `src/data/blog-posts.ts` Deletion

The entire file is deleted. The `BlogAuthor`, `ArticleSection`, `BlogSeries`, `BlogPost` types are re-homed in `src/lib/blog.ts` (with `body: ReactNode` instead of `content: ArticleSection[]`). All consumers update imports.

### New Dependencies

- `@next/mdx` + `@mdx-js/react` + `@mdx-js/loader` — MDX support for App Router.
- `gray-matter` — frontmatter parsing.
- `remark-gfm` — GitHub-flavored markdown (tables, strikethrough, autolinks).
- `rehype-slug` — auto IDs on headings.
- `rehype-autolink-headings` — anchor links on headings.
- `reading-time` — word-count-based read-time computation.
- `zod` — frontmatter schema validation with descriptive error messages.

### `next.config.ts` Update

Add `pageExtensions: ['ts', 'tsx', 'mdx']` and the MDX plugin chain (remark + rehype config). The MDX plugin is configured to use the component map from `mdx-components.tsx` (Next 16 convention: top-level `mdx-components.tsx` re-exports from the blog-specific map).

## Testing Decisions

### Modules to Test

1. **`src/lib/blog.ts`** — Vitest unit tests covering: frontmatter validation (missing title rejects, unknown author key rejects, invalid date rejects, duplicate slugs across files reject), draft filtering in production vs dev, sort order (newest first), related-posts ranking (series > tag overlap > category > recency), `readTime` computation rounds correctly. **Reason:** this is the deep module that absorbs all content-loading complexity; if it breaks, every blog page breaks.
2. **MDX component map (`mdx-components.tsx`)** — Storybook stories for each custom component (`PullQuote`, `Callout` variants, `InlineScholarshipCard`) and a "kitchen sink" MDX rendering with all element types (h2/h3, lists, code, blockquote, image). **Reason:** the design system is class-string heavy; visual regression in Storybook catches drift faster than runtime testing.
3. **Scaffold script (`scripts/new-blog-post.ts`)** — Vitest test that runs the script in a temp directory, verifies the resulting MDX parses, and verifies refusal-to-overwrite behavior. **Reason:** the script is the author's first touchpoint; a broken scaffold blocks all new content.

### Not Tested (Deliberate)

- The migrated MDX content of the four posts — content correctness is editorial review, not automated testing.
- Page-level integration tests for `/blog` and `/blog/[slug]` — covered indirectly by lib tests + Storybook + manual smoke test post-migration.

### Prior Art

- `src/data/__tests__/scholarships.test.ts` for Vitest data-validation pattern.
- `scripts/check-links` / `scrape-scholarships` / `tag-eligibilities` pipeline for the "scripts read/write JSON, validated at boundaries" pattern this PRD mirrors.
- Existing `BlogDetailContent` styling for the class strings ported into the MDX component map.

## Out of Scope

- A CMS UI (Sanity, Contentful, Decap) — MDX-on-disk is the system; CMS is a future evaluation.
- AI-generated, custom-shot, or stock-photo cover images — MVP reuses `public/scholarships/`. Bespoke imagery is post-MVP.
- A dedicated `public/blog/` image directory — not introduced in MVP; covers live alongside scholarship photos.
- Comments, reactions, or social-share counts on posts.
- RSS/Atom feed generation — easy to add later from `getAllPosts()`, but not required for launch.
- Search across blog posts — defer until post count justifies it (>20 posts).
- Tag pages (`/blog/tag/<tag>`) — schema supports `tags`, but page routes are deferred.
- Newsletter integration / email capture on post pages.
- Migrating the 12 dummy posts — they are deleted with `src/data/blog-posts.ts`. Real content launches with the four migrated posts only.
- Internationalization of post content.

## Further Notes

### Migration / Rollout

Single PR. The change is internal (data layer + renderer), and the URL surface is preserved by mapping the four migrated MDX slugs to sensible paths (`common-scholarship-application-mistakes-to-avoid`, `how-to-write-a-winning-scholarship-essay`, `navigating-scholarships-as-a-first-generation-student`, `how-to-get-strong-recommendation-letters`). Three of these four slugs already exist in the dummy data — the dummy versions are replaced in-place, so any hypothetical external links continue to resolve.

The eight other dummy slugs (STEM opportunities, international students, arts/humanities, personal statement, graduate funding, community college, Sarah's story, Marcus's story) will 404 after launch. This is acceptable because the site has not been published with real users yet — these slugs were never publicly indexed.

### Performance

MDX parsing is build-time only (server components, `React.cache`d). Production bundles ship rendered HTML/CSS, not MDX runtime. Cover images use Next.js `<Image>` with the existing `BlogDetailHeroImage` component for responsive loading.

### Author Workflow Summary (Future-You Reference)

1. `npm run new:blog "My Post Title"` → creates `content/blog/my-post-title.mdx` with frontmatter stub.
2. Pick a photo from `public/scholarships/` and set `coverImage: /scholarships/<filename>` in the frontmatter (or leave the field out to use the default cover).
3. Write the post in MDX. Use `<PullQuote>`, `<Callout>`, and `<InlineScholarshipCard>` as needed.
4. Set `status: published` (defaults to `published` already; switch to `draft` only if you want it hidden in prod).
5. Commit. Build validates frontmatter and fails loudly on errors.

### Open Questions

1. Should `relatedScholarships` in frontmatter be human-curated (author picks slugs), or auto-derived from tag overlap with `eligibilityTags` on scholarships? **Proposal:** start human-curated for editorial control; reconsider after 10+ posts exist.
2. Should the four migrated posts share an author, or be distributed across the existing six? **Proposal:** distribute by topic fit (Catherine Dumenu: essay/statement; James: mistakes/recommendations; Amara: first-gen success).
3. Which four photos from `public/scholarships/` should each migrated post use? **Proposal:** assign during migration so each launch post gets a distinct hero; revisit if any pairing feels visually off.
