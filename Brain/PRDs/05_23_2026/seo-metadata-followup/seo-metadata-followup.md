# PRD — SEO & Metadata Follow-up

> Close the remaining gaps from `Brain/future/seo-and-metadata.md` (2026-04-22). The first pass landed `SITE_URL`, `robots.ts`, `sitemap.ts`, basic per-page `title` + `description`, and partial home / blog-detail OpenGraph. This follow-up finishes the metadata story (template, base, OG/Twitter), adds the missing default OG image, and introduces JSON-LD on the two pages where rich results have the highest payoff.

## Problem Statement

- The root layout has no `metadataBase` (`src/app/layout.tsx:28`). The blog detail page works around this with a hand-rolled `toAbsoluteUrl` helper (`src/app/blog/[slug]/page.tsx:26`); any future page using relative OG URLs will silently break.
- There is no default OG image. No `src/app/opengraph-image.*` exists, and `public/` only contains `iconWhite.png` / `iconBurgundy.png`. Slack/Twitter/LinkedIn previews of `/`, `/scholarships`, `/contact`, `/privacy`, `/terms`, `/cookies` render with no card image.
- No page has Twitter Card metadata. Twitter and Slack-via-Twitter-fallback shares get text-only previews.
- Every page string-concatenates `| Modern Scholar` instead of using `title.template`. PRD Module 1 specified the template; it never landed. Rebranding would require touching every page.
- `/scholarships`, `/blog`, `/contact`, and the legal pages have no `openGraph` block at all. The home page has `openGraph` but no `images` or `url`.
- Blog detail `generateMetadata` is the most-shared route and is the shallowest — no `openGraph.type: "article"`, no `publishedTime` / `modifiedTime`, no `authors`, no image `width`/`height`/`alt`, no `twitter` block.
- No JSON-LD anywhere (`grep "application/ld+json"` returns zero). The single highest-ROI omission is `Article` / `BlogPosting` on blog detail — it drives Google rich results (article cards, author/date in SERP, Discover eligibility). `Organization` + `WebSite` on home unlocks sitelinks search box and brand panel.

## Location

`Brain/PRDs/05_23_2026/seo-metadata-followup/seo-metadata-followup.md`

Companion source PRD: `Brain/future/seo-and-metadata.md` — treat as Branch 1. This PRD is Branch 2 + structured-data extension.

No ADR — every change here is a Next.js convention or schema.org standard; no reversible architectural trade-off.

## Solution

- Add `metadataBase: new URL(SITE_URL)` and `title: { default, template }` to the root layout. Add root-level `openGraph` defaults (`siteName`, `type`, `locale`) and `twitter` defaults (`card: "summary_large_image"`).
- Drop a static 1200x630 `opengraph-image.png` at `src/app/opengraph-image.png`. Next.js wires it as the default OG for every route that doesn't specify its own.
- Strip the redundant `| Modern Scholar` suffix from every page's `title` once the template is in place.
- Add `openGraph` (and where appropriate, `alternates.canonical`) to `/scholarships`, `/blog`, `/contact`, `/privacy`, `/terms`, `/cookies`. Fill in `images` and `url` on the home page's existing OG block.
- Extend `generateMetadata` in `src/app/blog/[slug]/page.tsx` with `openGraph.type: "article"`, `publishedTime`, `modifiedTime`, `authors`, image `width`/`height`/`alt`, and the corresponding `twitter` block.
- Inject JSON-LD `<script type="application/ld+json">` blocks: `Organization` + `WebSite` on home, `BlogPosting` on blog detail. Use a small typed helper in `src/lib/structured-data.ts` so the schemas stay co-located and type-checked.

## User Stories

1. As a user sharing a blog post on LinkedIn, I want the preview card to show the article title, excerpt, hero image, author, and publish date, so the share looks like a real publication.
2. As a user sharing the home page in a group chat, I want a branded preview card instead of a blank link, so recipients understand what they're being sent.
3. As a student Googling "Modern Scholar scholarships", I want the search result to show a rich article card with author and date for blog hits, so I can judge freshness at a glance.
4. As a developer adding a new route next month, I want `title.template` and `metadataBase` to handle the boilerplate, so I only specify what's unique to my page.
5. As a search engine indexing the blog, I want valid `BlogPosting` JSON-LD with `headline`, `author`, `datePublished`, `image`, and `mainEntityOfPage`, so the post is eligible for rich results and Google Discover.
6. As a user pinning the site to their iPhone home screen, I want a proper-resolution icon — deferred to a follow-up (see Out of Scope), not blocking this PRD.

## Implementation Decisions

**Modules**

- **Module 1 — Root layout metadata (`src/app/layout.tsx`)**
  - Add `metadataBase: new URL(SITE_URL)`.
  - Replace `title: "Modern Scholar"` with `title: { default: "Modern Scholar", template: "%s | Modern Scholar" }`.
  - Add root `openGraph`: `siteName: "Modern Scholar"`, `type: "website"`, `locale: "en_US"`, `url: "/"`.
  - Add root `twitter`: `card: "summary_large_image"`, `creator` left empty until a handle exists.
  - Import `SITE_URL` from `@/lib/constants`.

- **Module 2 — Default OG image (`src/app/opengraph-image.png`)**
  - Static 1200x630 PNG using brand palette (cream `#F9F3F2` ground, deep red `#76312D` mark, Noto Serif wordmark, Poppins tagline).
  - Co-located filename triggers Next.js's `opengraph-image` convention — no metadata wiring needed.
  - Defer the dynamic `opengraph-image.tsx` (`ImageResponse`) variant — flagged Out of Scope, lower ROI than the missing card itself.

- **Module 3 — Per-page metadata completion**
  - **`src/app/(home)/page.tsx`** — Drop the redundant `| Modern Scholar` suffix (template handles it). Add `openGraph.url: "/"` and `openGraph.images: ["/opengraph-image.png"]` (resolved via `metadataBase`).
  - **`src/app/scholarships/page.tsx`** — Drop suffix, add `openGraph` (title, description, url, type). Add `alternates: { canonical: "/scholarships" }` to neutralize the nuqs filter-query duplicates.
  - **`src/app/blog/page.tsx`** — Drop suffix, add `openGraph` (title, description, url, type).
  - **`src/app/contact/page.tsx`** — Drop suffix, add `openGraph` (title, description, url, type).
  - **`src/app/privacy/page.tsx`**, **`src/app/terms/page.tsx`**, **`src/app/cookies/page.tsx`** — Drop suffix, add `openGraph` (title, description, url, type) and `alternates.canonical`.

- **Module 4 — Blog detail metadata (`src/app/blog/[slug]/page.tsx`)**
  - Extend the existing `generateMetadata` return:
    - `openGraph.type: "article"`
    - `openGraph.publishedTime: post.publishDate`
    - `openGraph.modifiedTime: post.updatedDate ?? post.publishDate`
    - `openGraph.authors: [post.author.name]`
    - `openGraph.url: \`/blog/${slug}\`` (now safe — `metadataBase` resolves it)
    - `openGraph.images: [{ url: ogImage, width: 1200, height: 630, alt: post.title }]`
    - `twitter: { card: "summary_large_image", title: post.title, description, images: [ogImage] }`
  - Once `metadataBase` is in place, `toAbsoluteUrl` is no longer needed for OG resolution. Keep it for the JSON-LD payload in Module 5 (schema.org requires absolute URLs).
  - `alternates.canonical: \`/blog/${slug}\``.

- **Module 5 — JSON-LD structured data**
  - Add `src/lib/structured-data.ts` exporting two typed builders:
    - `siteJsonLd()` → array containing `Organization` and `WebSite` (with `potentialAction: SearchAction` only if a real search exists; defer otherwise). Used on home.
    - `blogPostJsonLd(post: BlogPost)` → `BlogPosting` with `headline`, `description`, `image`, `datePublished`, `dateModified`, `author: { @type: "Person", name, url? }`, `publisher: { @type: "Organization", name, logo }`, `mainEntityOfPage`. All URLs absolute via `toAbsoluteUrl`.
  - Inject via a small `<JsonLd data={...} />` client-safe primitive in `src/components/ui/json-ld.tsx` that renders `<script type="application/ld+json" dangerouslySetInnerHTML={...} />`. Server component; no `"use client"`.
  - Mount on `src/app/(home)/page.tsx` (site schema) and `src/app/blog/[slug]/page.tsx` (post schema), once each, above the page content.
  - No `Organization` schema duplication on blog detail — Google deduplicates by `@id`, but cleaner to only emit it once on home.

**Key decisions**

- Use Next.js's `opengraph-image` file convention rather than `metadata.openGraph.images` references — fewer moving parts, automatic image size/type detection.
- `title.template` lives only in the root layout; every page's `title` becomes the unique segment. The blog detail's `"Post Not Found"` fallback keeps the explicit full title since `notFound()` isn't hit through normal navigation.
- JSON-LD goes in a tiny inline `<script>` element rendered server-side, not via `next/script`. `next/script` is for executable JS; LD-JSON is data and should be in the initial HTML for crawlers.
- `BlogPosting` chosen over `Article` — more specific, same rich-result eligibility, signals editorial intent.
- No `BreadcrumbList` yet — site is shallow (home → blog → post is two clicks); deferred until depth grows.
- Canonical URLs added to legal + scholarships pages, but **not** to blog detail's pagination (none exists) or to root (its self-canonical is implicit via `metadataBase` + path).
- `metadataBase` makes `toAbsoluteUrl` partially redundant for metadata, but the JSON-LD payload still needs absolute URLs — keep the helper, lift it from the blog detail file into `src/lib/url.ts` so `structured-data.ts` can share it without circular import. (Two call sites is the threshold — see `.claude/rules/components.md` "When NOT to create a component".)
- No `creator` Twitter handle added — the brand has no account; revisit when one exists.

## Testing Decisions

- **Test (component / page)**: Add `src/app/__tests__/blog-detail-metadata.test.ts` that imports `generateMetadata` directly and asserts the returned shape for a known post slug — checks `openGraph.type`, `publishedTime`, `images[0].alt`, `twitter.card`. Pure function call, no DOM — runs under the `unit` project. Mirrors the pattern in `src/app/__tests__/`.
- **Test (lib)**: Add `src/lib/__tests__/structured-data.test.ts` — assert `blogPostJsonLd(samplePost)` returns valid shape (required fields present, all URLs absolute, `datePublished` is ISO). `siteJsonLd()` returns the two-element array. `unit` project.
- **Test (e2e)**: Add `e2e/seo-metadata.spec.ts` — Playwright navigates to `/`, `/blog`, `/blog/<known-slug>`, asserts:
  - `head meta[property="og:title"]` exists and is non-empty
  - `head meta[property="og:image"]` resolves to an absolute URL under `SITE_URL`
  - `head meta[name="twitter:card"] === "summary_large_image"`
  - Blog detail: `head script[type="application/ld+json"]` parses to JSON with `@type === "BlogPosting"`
  - Justification for `e2e` over `component`: needs the real rendered `<head>` and absolute-URL resolution via `metadataBase`, which jsdom won't give us.
- **Skip**: No test for the static OG image file — its presence is what matters; broken file would be caught at build/preview time.
- **Skip**: No `npm run build` post-check in CI for this PRD — existing build job already catches `Metadata` type errors.
- **Prior art**: `e2e/scholarships-layout-toggle.spec.ts` is the closest e2e to mirror. `src/lib/__tests__/` has multiple pure-function test files to copy structure from.

## Out of Scope

- **Per-scholarship JSON-LD (`MonetaryGrant` / `EducationalOccupationalProgram`)** — there are no per-scholarship detail routes yet; the corpus lives inside `/scholarships`. Becomes high-ROI once detail pages exist.
- **`BreadcrumbList` JSON-LD** — defer until site depth grows.
- **PWA / iOS polish** — `icon.png`, `apple-icon.png`, `manifest.ts`, theme color. Worth a small follow-up PRD; not blocking SEO.
- **Dynamic per-post OG image via `ImageResponse`** — the static default + per-post hero image already covers most shares.
- **`hreflang` / locale alternates** — single-language site.
- **Removing `nuqs` filter params from the crawlable URL surface** — adding `alternates.canonical: "/scholarships"` is the cheap fix; rebuilding scholarships filters to use hash params is a separate UX decision.
- **Twitter `creator` handle** — add when the brand has an account.
- **`SearchAction` in `WebSite` JSON-LD** — requires a real `/search?q=` route; the existing filter UI is not URL-addressable as a search endpoint.

## Further Notes

- The original SEO PRD (`Brain/future/seo-and-metadata.md`) explicitly listed JSON-LD as Out of Scope. This PRD picks it up because the blog content cadence (multiple posts already in `content/blog/`) means the rich-result ROI now justifies it.
- After deploy, validate with: Facebook Sharing Debugger, Twitter Card Validator, Google Rich Results Test (paste `/blog/<slug>` URL). Add the URLs to the verification checklist in the implementation PR description.
- Once `metadataBase` lands, the `toAbsoluteUrl` helper is only used by `structured-data.ts` — lift it into `src/lib/url.ts` rather than leaving it private to the blog detail file.
- Title template means **do not** include `| Modern Scholar` in any page's `title` string after this lands. Add a one-line comment on the root `title.template` so the next developer sees the convention.
- Order of merge inside the PR: Module 1 (root metadata + template) first, then Module 3 in the same commit (so title duplication is removed in lockstep). Modules 2, 4, 5 are independent and can land in any order behind that.
