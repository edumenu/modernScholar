# App Routes & Data Layer Review

_Reviewed 2026-05-08. Next.js 16.2.1 (webpack mode, `output: "export"`), React 19.2.4, nuqs 2.x, @next/mdx 16._
_Docs consulted: `node_modules/next/dist/docs/01-app/01-getting-started/02-project-structure.md`, `01-app/03-api-reference/05-config/01-next-config-js/output.md`._

---

## Summary

- The `params`/`searchParams` async-typing is correctly applied in `blog/[slug]/page.tsx` (`Promise<{ slug: string }>`), and `generateStaticParams` + `dynamicParams = false` are both present — the `[slug]` route is fully correct for the static-export constraint.
- Metadata is untyped (`export const metadata = {...}` without `import type { Metadata }`) across five routes, meaning TypeScript cannot catch malformed OG/Twitter fields at compile time.
- `sitemap.ts` uses `new Date()` for `lastModified` on static routes, so every build reports "modified today" regardless of actual content changes — minor but misleading to crawlers.
- No `global-error.tsx` exists; the root error boundary (`src/app/error.tsx`) cannot catch errors thrown by `RootLayout` or its children at the layout level.
- `blog/page.tsx` and `contact/page.tsx` have no segment-level `loading.tsx` or `error.tsx`, leaving those routes without loading or error UI.

---

## Critical Issues

**`src/app/global-error.tsx` — missing file**
- **Line:** n/a (file does not exist)
- **Severity:** Critical
- **Issue:** `src/app/error.tsx` is a segment-level error boundary; it cannot catch errors thrown inside the root layout (`layout.tsx`) itself (providers, `<Header>`, `<Footer>`, `<SmoothScrollProvider>`, etc.). Per Next.js App Router conventions, a `global-error.tsx` file at the app root is required to handle layout-level crashes. Without it, a provider crash produces an unrecoverable blank page with no fallback UI.
- **Fix:** Create `src/app/global-error.tsx` as a `"use client"` component accepting `{ error, reset }`. It must render its own `<html>` and `<body>` tags because it replaces the root layout entirely. A minimal version:
  ```tsx
  "use client"
  export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
    return (
      <html lang="en">
        <body>
          <main style={{ display: "flex", minHeight: "100vh", alignItems: "center", justifyContent: "center" }}>
            <div>
              <h1>Something went wrong</h1>
              <button onClick={reset}>Try again</button>
            </div>
          </main>
        </body>
      </html>
    )
  }
  ```

---

**`src/app/blog/[slug]/page.tsx:77` — dynamic `import()` string is not statically analyzable under webpack**
- **Line:** 77
- **Severity:** Critical
- **Issue:** The MDX file is loaded with:
  ```ts
  const Mdx = (await import(`../../../../content/blog/${slug}.mdx`)).default
  ```
  Webpack (not Turbopack) requires the dynamic import path to have a static prefix + variable suffix within the same directory for it to bundle the files correctly via a `require.context`-style scan. While `@next/mdx` registers the `.mdx` extension and `pageExtensions` includes `"mdx"`, a fully dynamic path like this relies on webpack's "magic comment" heuristics. The project runs with `next dev --webpack` and `next build --webpack` (see `package.json`), so the behaviour is webpack-specific. With `output: "export"` and `generateStaticParams` seeding every slug at build time, this works in practice because webpack can statically scan the import expression for its leading literal. However, if slug values ever exceed what webpack tracks, the dynamic import will throw at runtime with no error boundary below it in this async server component. There is no `try/catch` around the import.
- **Fix:** Wrap the dynamic import in a try/catch and call `notFound()` on failure:
  ```ts
  let Mdx: React.ComponentType
  try {
    Mdx = (await import(`../../../../content/blog/${slug}.mdx`)).default
  } catch {
    notFound()
  }
  ```
  This is safe because `dynamicParams = false` means only pre-generated slugs are served, but it makes the failure mode explicit rather than producing an unhandled server error.

---

## High-Impact Improvements

**`src/app/blog/page.tsx:5` — metadata not typed as `Metadata`**
- **Line:** 5
- **Severity:** Warning
- **Issue:** `export const metadata = { title: "...", description: "..." }` uses a plain object literal. The same pattern appears in `src/app/contact/page.tsx:5`, `src/app/privacy/page.tsx:1`, `src/app/terms/page.tsx:1`, and `src/app/cookies/page.tsx:1`. Without `import type { Metadata } from "next"`, TypeScript cannot enforce the shape, so malformed `openGraph`, `twitter`, or `robots` sub-fields are silently accepted as `any`. The root layout (`src/app/layout.tsx:34`) correctly types it.
- **Fix:** Add `import type { Metadata } from "next"` and annotate:
  ```ts
  export const metadata: Metadata = { title: "Blog | Modern Scholar", description: "..." }
  ```
  Apply to all five affected pages.

---

**`src/app/blog/[slug]/page.tsx:65–72` — triple `getAllPosts()` call in a single render**
- **Lines:** 35, 57 (via `getPostBySlug`), 68
- **Severity:** Warning
- **Issue:** `getAllPosts` is called three times per page render: in `generateStaticParams` (at build time), inside `generateMetadata` (via `getPostBySlug` → `getAllPosts`), and inside the page component itself (for `seriesPosts`). `getAllPosts` is wrapped in `React.cache`, so the per-request dedup works correctly during server rendering. However, the series-posts filter (lines 65–72) issues a third `getAllPosts()` call when `post.series` is truthy, then manually filters. This is already deduplicated by `cache()` in the same render pass, so it is not a performance bug — but it duplicates the filtering logic that `getRelatedPosts` already has access to. The real issue is the manual inline filter rather than a dedicated `getSeriesPosts(seriesName)` function.
- **Fix:** Add an exported `getSeriesPosts(name: string): Promise<BlogPost[]>` to `src/lib/blog.ts` (it's a one-liner using the cached `getAllPosts`). This removes the inline filter from the page and makes the intent explicit.

---

**`src/app/sitemap.ts:11,16,21,25` — `lastModified: new Date()` on static routes**
- **Lines:** 11, 16, 21, 25
- **Severity:** Warning
- **Issue:** Every static route uses `lastModified: new Date()`, which resolves to the build timestamp. This means all four pages report as modified on every build, even if their content is unchanged. Crawlers (especially Google Search Console) can be misled into re-crawling pages that haven't changed, consuming crawl budget. Blog routes correctly use `post.updatedDate ?? post.publishDate`.
- **Fix:** Use stable dates for pages with genuinely stable content:
  ```ts
  { url: `${SITE_URL}/contact`, lastModified: new Date("2025-01-01"), changeFrequency: "monthly", priority: 0.5 },
  ```
  For the home and scholarships pages, `new Date()` may be acceptable if content changes on each build, but should be documented. The privacy/terms/cookies pages are not included in the sitemap at all — add them with stable dates or `changeFrequency: "yearly"`.

---

**`src/app/sitemap.ts` — privacy, terms, and cookies pages missing**
- **Line:** 8–33
- **Severity:** Warning
- **Issue:** `/privacy`, `/terms`, and `/cookies` are live routes in `src/app/` but are absent from `sitemap.ts`. These pages are linked from the footer. Omitting them means search engines won't discover them via the sitemap, though they are still crawlable via internal links.
- **Fix:** Add them to `staticRoutes` with `changeFrequency: "yearly"` and `priority: 0.3`.

---

**`src/app/blog/page.tsx` and `src/app/contact/page.tsx` — no segment-level `loading.tsx` or `error.tsx`**
- **Lines:** n/a (files absent)
- **Severity:** Warning
- **Issue:** `blog/page.tsx` calls `getAllPosts()` which reads the filesystem asynchronously. If the filesystem read is slow or the MDX dir is missing, the page hangs with no loading skeleton. Similarly, `contact/page.tsx` may load a Spline 3D scene (via `ContactHero`), but there is no route-level `loading.tsx` or `error.tsx` for either segment. The root `loading.tsx` only fires for the root route, not for sub-segments. By contrast, `blog/[slug]/` has both.
- **Fix:** Add `src/app/blog/loading.tsx` (can reuse or adapt the root `loading.tsx` skeleton) and `src/app/blog/error.tsx`. Add `src/app/contact/loading.tsx` at minimum — `error.tsx` is optional if contact errors can fall back to the root error boundary.

---

**`src/app/page.tsx` — no per-page metadata**
- **Line:** 1–15
- **Severity:** Warning
- **Issue:** The home page exports no `metadata` object. It falls back to the root layout's generic `{ title: "Modern Scholar", description: "Empowering students to discover and secure scholarships." }`. This means the home page `<title>` and OG tags are identical to the fallback, with no per-page canonical description, OG image, or Twitter card. This is particularly important for the landing page which is likely the most-shared URL.
- **Fix:** Add a `metadata` export with a specific title pattern, a richer description, and OG image pointing to the main brand asset.

---

**`src/app/error.tsx:1` — root error boundary is a client component but renders without `<html>`/`<body>` framing**
- **Line:** 1, 85–170
- **Severity:** Warning
- **Issue:** `src/app/error.tsx` is correctly a `"use client"` component and does not need `<html>`/`<body>` (that is only required for `global-error.tsx`). However, the component calls `console.error(error)` on line 83, which is correct for development but will be stripped in production by the `removeConsole` compiler option in `next.config.ts` (line 13: `removeConsole: { exclude: ["error"] }`). The `exclude: ["error"]` means `console.error` is preserved in production — this is correct and intentional. No issue here, just confirming correctness.

---

**`src/lib/blog.ts:255` — draft filtering uses `process.env.NODE_ENV` at runtime in a `cache()`d function**
- **Line:** 276
- **Severity:** Warning
- **Issue:** `getAllPosts` filters out drafts only when `NODE_ENV === "production"`. Since this function is wrapped in `React.cache`, the result is memoized for the lifetime of a request. Under `output: "export"`, the entire app is built once at `NODE_ENV=production`, so drafts are always excluded from the static export. This is fine. However, the per-run check inside a `cache()`d function means that if someone runs `NODE_ENV=production npm run dev`, the cache is populated once and drafts are excluded for the entire dev session — this may be surprising. The logic is sound for the intended use case but worth documenting.
- **Fix:** No code change needed; add a JSDoc note that draft filtering is baked at `NODE_ENV` read time, which is effectively build time under `output: "export"`.

---

## Medium-Impact Improvements

**`src/app/layout.tsx:29–31` — dead commented-out font import**
- **Lines:** 29–31
- **Severity:** Suggestion
- **Issue:** The `geistMono` font import is commented out. The `--font-geist-mono` variable is still referenced in `globals.css:12` (`--font-mono: var(--font-geist-mono)`), which means the mono font token resolves to `undefined` in practice. Either load the font or remove the CSS custom property reference.
- **Fix:** Either uncomment and add `geistMono.variable` to the `<html>` className, or remove the `--font-mono`/`--font-geist-mono` mapping from `globals.css`.

---

**`src/app/blog/[slug]/page.tsx:81–99` — manual shape-mapping for `relatedItems`**
- **Lines:** 81–99
- **Severity:** Suggestion
- **Issue:** After calling `getRelatedPosts`, the page manually reconstructs a near-identical object shape to satisfy `<RelatedPosts>`'s prop type. This mapping duplicates every field from `BlogPost`. If `BlogPost` gains or loses a field, this mapping is a silent divergence point. The root cause is that `RelatedPosts` accepts a slightly different shape than `BlogPost` (it requires `id` which `BlogPost` uses `slug` for).
- **Fix:** Either update `RelatedPosts` to accept `BlogPost[]` directly (using `slug` as identity throughout), or define a `RelatedPostItem` type derived from `BlogPost` with an `id` alias and create a utility function `toRelatedItem(p: BlogPost): RelatedPostItem` in `src/lib/blog.ts` so the mapping is centralized.

---

**`src/lib/scholarship-utils.ts:5` — `Month` and `MonthFilter` types re-exported from the hook layer**
- **Line:** 5–7
- **Severity:** Suggestion
- **Issue:** `scholarship-utils.ts` imports `Month` and `MonthFilter` from `@/hooks/use-scholarship-filters` and immediately re-exports them. A utility module depending on a hook module for type definitions is an inverted dependency — hooks should depend on lib, not the other way around. This was previously flagged in memory (`project_scholarships_all_corpus.md`).
- **Fix:** Move the `Month` and `MonthFilter` type definitions (and the `MONTHS` constant) into `src/lib/scholarship-utils.ts` or `src/lib/constants.ts`, then import from there in both the hook and the utility.

---

**`src/lib/session-date.ts` — module name implies stable singleton but is re-evaluated on each hot-module-reload**
- **Line:** 5
- **Severity:** Suggestion
- **Issue:** `SESSION_DATE` is documented as a "snapshot taken at module load" so all client surfaces agree on a single `now`. This is correct and intentional for the server side (static export snapshot). In development, webpack HMR re-evaluates the module, which resets the snapshot — potentially surprising during local testing if a deadline crosses midnight. This is a non-bug for production but worth a note in the comment.
- **Fix:** Expand the existing comment to mention HMR behavior: "In development with HMR, this snapshot resets on module reload."

---

**`src/app/not-found.tsx` — thin wrapper without metadata**
- **Lines:** 1–5
- **Severity:** Suggestion
- **Issue:** `not-found.tsx` delegates entirely to `<NotFoundClient>`. No `metadata` export is defined for the 404 page, so the title falls back to the root layout's title ("Modern Scholar") rather than something like "Page Not Found | Modern Scholar". Crawlers that index the 404 page (some do) will see a misleading title.
- **Fix:** Add:
  ```ts
  export const metadata: Metadata = {
    title: "Page Not Found | Modern Scholar",
    robots: { index: false },
  }
  ```

---

**`src/app/globals.css:560–576` — `@layer base` placed after utility definitions**
- **Line:** 560
- **Severity:** Suggestion
- **Issue:** The `@utility page-padding-y` block (line 556) appears before `@layer base` (line 560). In Tailwind v4, the ordering within a single CSS file generally doesn't matter for correctness because the cascade layers are explicit, but placing a base layer after custom utilities at the end of the file makes the intent harder to read and may conflict if base resets should run before utilities in some cascade resolution paths. The double `html` selector (lines 561–562 and 573–575) is also redundant — `scrollbar-width: none` and `font-sans` are both applied to `html` in separate rules inside the same `@layer base`.
- **Fix:** Consolidate the two `html` rules within `@layer base` and move the entire layer before any `@utility` definitions.

---

## Low / Nits

- `src/app/loading.tsx:13` — The root `loading.tsx` renders a 3-column card grid (`lg:grid-cols-3`) but the home page renders a hero + featured scholarships + whats-next + FAQ, not a card grid. The skeleton shape doesn't match what it's standing in for.

- `src/app/blog/[slug]/not-found.tsx:7` — Uses `<AnimatedSection>` inside a not-found boundary. `AnimatedSection` likely uses `motion/react` — if `MotionConfigProvider` is higher in the tree (it is, in root layout), this is fine. However, the not-found boundary re-uses the root layout, so providers are present. No bug, just unusual.

- `src/app/contact/page.tsx:5` and all legal pages — `description` values are extremely short ("Privacy policy for Modern Scholar."). These are the strings crawlers show in search results. Worth expanding once the actual policies are finalized.

- `src/lib/seasons.ts` — `getCurrentSeason` and related exports are still imported by `src/data/scholarships.ts` (lines 6–7) even though the seasonal filter was removed. If the seasonal logic is no longer user-facing, these exports are dead surface area. Not a bug, but consider removing or deprecating.

- `src/app/blog/[slug]/page.tsx:9–11` — `BlogPostType` is a local type alias derived from `getAllPosts`. This is a valid pattern, and the comment explains why. Minor: the alias name shadows nothing and the JSDoc comment says "so the seriesPosts narrowing stays in sync" — a direct `BlogPost` import from `src/lib/blog.ts` would serve the same purpose with less indirection.

---

## Notable Strengths

- **`src/lib/blog.ts`** is exceptionally well-engineered: Zod schema validation with clear error messages, duplicate-slug detection with a correct case-sensitivity warning, `React.cache` deduplication, draft gating, and a well-documented `getRelatedPosts` scoring algorithm. The `extractHeadings` function correctly tracks code-fence state to avoid false positives.

- **`src/app/blog/[slug]/page.tsx`** correctly types `params` as `Promise<{ slug: string }>` and awaits it — this is the breaking change introduced in Next.js 15 that many codebases miss. It is applied correctly here.

- **`src/app/globals.css`** has thorough glassmorphism accessibility coverage: `prefers-reduced-transparency`, `prefers-contrast: more`, and `@supports not (backdrop-filter)` fallbacks all present, matching the CLAUDE.md specification exactly.

- **`src/app/sitemap.ts`** correctly exports `dynamic = "force-static"` and joins static + dynamic blog routes, using `post.updatedDate ?? post.publishDate` for blog entries — semantically correct.

- **`src/app/robots.ts`** is minimal and correct, pointing to the absolute sitemap URL via the `SITE_URL` constant.

- **`next.config.ts`** `removeConsole: { exclude: ["error"] }` is the right production setting — strips noise while preserving error tracking.

- **`src/lib/expired-status.ts`** correctly treats `isNaN(deadlineTime)` as non-expired (safe default), centralizes the reopen label, and the `getExpiredBadge` convenience composer is a clean API.

---

## Recommended Actions (by priority)

1. **[Blocking]** Create `src/app/global-error.tsx` with `<html>` + `<body>` tags.
2. **[Blocking]** Wrap the dynamic MDX `import()` in `blog/[slug]/page.tsx:77` with try/catch → `notFound()`.
3. **[High]** Add `import type { Metadata } from "next"` + type annotation to all five untyped metadata exports (`blog/page.tsx`, `contact/page.tsx`, `privacy/page.tsx`, `terms/page.tsx`, `cookies/page.tsx`).
4. **[High]** Add `metadata` export to `src/app/page.tsx` (home page currently inherits root layout title only).
5. **[High]** Add `src/app/blog/loading.tsx` and `src/app/blog/error.tsx`; add `src/app/contact/loading.tsx`.
6. **[Medium]** Add privacy/terms/cookies to `src/app/sitemap.ts`; replace `new Date()` on contact and legal pages with stable build-date literals.
7. **[Medium]** Fix the `--font-geist-mono` dangling reference in `globals.css:12` (load the font or remove the token).
8. **[Medium]** Move `Month`/`MonthFilter` types out of the hook into `src/lib/scholarship-utils.ts` or `src/lib/constants.ts` to fix the inverted dependency.
9. **[Low]** Add `metadata: { title: "Page Not Found | Modern Scholar", robots: { index: false } }` to `src/app/not-found.tsx`.
10. **[Low]** Consolidate duplicate `html` selectors in `@layer base` in `globals.css` and move `@layer base` before `@utility` blocks.
