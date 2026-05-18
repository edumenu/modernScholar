# QA Findings — Group 2 (Content Pages)

**Date**: 2026-05-16
**Tester**: qa-test-engineer (Group 2)
**Scope**: `/blog`, `/blog/how-to-write-a-winning-scholarship-essay`, `/blog/this-slug-definitely-does-not-exist-xyzzy`
**Branch / SHA**: `feature/legal-pages` (as noted in environment) / HEAD `857f8c0`
**Build**: Next.js 16.2.1 dev server (Webpack), reported "stale" by the Next overlay.

---

## Captures Inventory

12 screenshots, all saved under `Brain/PRDs/05_16_2026/screenshots/`. Captures were taken with `prefers-reduced-motion: reduce` emulated so that `AnimatedSection` content (which is gated by `useInView`) reliably paints in full-page screenshots; without this, content below the initial viewport stays at `opacity: 0` because the in-view callback never fires during Playwright's synthetic scroll.

| File | Route | Viewport | Theme | Verified URL at capture |
|------|-------|----------|-------|--------------------------|
| `blog-index-tablet-portrait-light.png` | `/blog` | 768×1024 | light | yes |
| `blog-index-tablet-portrait-dark.png` | `/blog` | 768×1024 | dark | yes |
| `blog-index-tablet-landscape-light.png` | `/blog` | 1024×768 | light | yes |
| `blog-index-tablet-landscape-dark.png` | `/blog` | 1024×768 | dark | yes |
| `blog-post-tablet-portrait-light.png` | `/blog/how-to-write-a-winning-scholarship-essay` | 768×1024 | light | yes |
| `blog-post-tablet-portrait-dark.png` | `/blog/how-to-write-a-winning-scholarship-essay` | 768×1024 | dark | yes |
| `blog-post-tablet-landscape-light.png` | `/blog/how-to-write-a-winning-scholarship-essay` | 1024×768 | light | yes |
| `blog-post-tablet-landscape-dark.png` | `/blog/how-to-write-a-winning-scholarship-essay` | 1024×768 | dark | yes |
| `blog-not-found-tablet-portrait-light.png` | `/blog/<bad-slug>` | 768×1024 | light | yes (dev runtime error overlay) |
| `blog-not-found-tablet-portrait-dark.png` | `/blog/<bad-slug>` | 768×1024 | dark | yes (dev runtime error overlay) |
| `blog-not-found-tablet-landscape-light.png` | `/blog/<bad-slug>` | 1024×768 | light | yes (dev runtime error overlay) |
| `blog-not-found-tablet-landscape-dark.png` | `/blog/<bad-slug>` | 1024×768 | dark | yes (dev runtime error overlay) |

Overflow check (`documentElement.scrollWidth > clientWidth`) was **false** for every route × viewport pair listed above. No horizontal overflow detected.

---

## Findings

### /blog (Blog index)

#### tablet-portrait, light + dark
- **P2** The H1 renders as the literal text "BlogsBlogs" in the DOM. The animated-lines pattern duplicates the heading text (one visible, one screen-reader fallback). It is visually fine (only "Blogs" paints), but `document.querySelector('h1').textContent` returns the doubled string — assistive tech or text-only crawlers may read it twice. Component: `src/components/blog/blog-hero.tsx` (and the `AnimatedLines` utility it wraps). Screenshot: `blog-index-tablet-portrait-light.png`.
- **P2** Footer link tap targets are all 20px tall (`Scholarships` 89×20, `Blog` 30×20, `Contact Us` 77×20, `Privacy Policy` 95×20, `Terms of Service` 115×20, `Cookie Policy` 92×20). On a tablet (touch-capable) WCAG 2.5.5 minimum target size is 44×44. Component: `src/components/ui/footer/footer.tsx` (the two `<nav>` lists use plain `<Link>` with `text-sm` and no padding). Same issue surfaces on every other route — listed once here.
- **P2** "Read Blog" buttons on the secondary cards measure **83×28**, also under 44×44. The featured card's "Read Blog" measures 103×34. Component: `src/components/blog/blog-card.tsx` and `src/components/blog/blog-card-featured.tsx`. Screenshot: `blog-index-tablet-portrait-light.png`.
- **P3** "Filters" toggle on the search bar is 93×34 — slightly under recommended touch height. Component: `src/components/blog/blog-filters.tsx`. Probably acceptable for a low-frequency control, but worth noting.
- **P3** The category chip on the featured card ("Tips & Guides") sits flush against the card's image edge with no padding from the card boundary, producing a subtle visual clip on the rounded corner. Visible in `blog-index-tablet-portrait-light.png`.
- **P3** Skip-to-content link reports `1×1` bounding box — it is positioned off-screen until focused, which is the standard pattern, but it shows up in any "tap targets under 44×44" sweep. Not a real issue, noted to avoid future false positives.

#### tablet-landscape, light + dark
- **P2** Featured card's image at 1024×768 stretches to a 960×~360px banner with the title overlay starting just under "How to Wri…" — the title spans **two lines** of large display type and overlaps the cover photograph at low contrast against the bright window in the bookshelf image. In light mode the title text remains light-on-busy-background; the gradient overlay is too subtle in places. Screenshot: `blog-index-tablet-landscape-light.png`. Component: `src/components/blog/blog-card-featured.tsx`.
- **P2** Category filter buttons ("All", "Tips & Guides", "First-Generation") render at 50×34, 139×34, 163×34 — all under 44px height. Component: `src/components/blog/blog-filters.tsx`.
- **P2** Header nav links at 1024px (`Scholarships` 109×36, `Blog` 54×36, `Contact Us` 98×36, "Switch to dark mode" 64×32, "Cursor settings" 48×36) are all under the 44×44 target. Component: `src/components/ui/header/`.
- **P3** Card grid drops from 3 columns to … 3 columns at 1024px? At tablet-landscape the grid renders three secondary cards in a row, which makes each card 304px wide and the body text wraps tightly. Card title is truncated mid-word ("How to Get Strong Recommendation…"). Component: `src/components/blog/blog-grid.tsx`.

#### Both viewports
- **VERIFIED** No horizontal overflow; layout integrity holds at both 768 and 1024.
- **VERIFIED** Light/dark theme tokens both render — no FOUC or token-leakage in either direction.
- **VERIFIED** Card click navigates to `/blog/<slug>` correctly; browser back-navigation restores `/blog` with the "Blogs" H1 intact.
- **VERIFIED** Heading hierarchy on `/blog`: H1 ("Blogs") → H2 (each card title) → H3 (footer columns). Hierarchy is clean.

---

### /blog/how-to-write-a-winning-scholarship-essay (Blog post)

#### tablet-portrait, light + dark
- **P1** **Prose measure is too wide.** Paragraphs inside the article render at **653px wide at 16px font-size** — that works out to roughly 100 characters per line, well above the recommended 60–75ch for long-form prose. The `BlogDetailContent` component wraps the body in `<div className="mt-10 max-w-prose">`, but at md (≥768) Tailwind's `max-w-prose` is `65ch`, which at 16px ≈ 1040px and therefore does not constrain at this viewport. Component: `src/components/blog/blog-detail-content.tsx` (line 55). Screenshot: `blog-post-tablet-portrait-light.png`.
- **P2** Article heading hierarchy inside the `<article>` element is **H1 → H3 → H3 → H3** (skips H2). The MDX file uses `###` for section heads, but with no intervening H2 the document outline jumps two levels. Screen reader users navigating by heading level will see the article body as having no H2 sections at all. Source: `content/blog/how-to-write-a-winning-scholarship-essay.mdx` (lines 12, 18, 24). MDX components map: `src/components/blog/mdx-components.tsx`.
- **P2** Tab-key focus order: from page top, the first reachable element after the skip-link is the logo (`<a href="/">`), and **`getComputedStyle(focusedEl).outlineStyle === 'none'`** — no visible focus ring is rendered. Same pattern likely affects all interactive elements in this layout. WCAG 2.4.7 fail. Component: focus styling in `src/app/globals.css` and per-component focus utilities.
- **P2** "Back to Blog" link (text link variant) is 139×23 — under 44px tall. Component: `src/components/blog/blog-detail.tsx` line 50–56.
- **P3** The category-/date-/read-time metadata strip on tablet portrait sits **above** the article body in a horizontal pill (`md:flex lg:hidden`). It works, but reads a bit lost between the cover image and the prose — no visual hierarchy separating it from the prose start.
- **P3** Author bio card at the end of the post is full-width with a small avatar; visually balanced but the "Cathy Dumenu / Scholarship Advisor" type stack at 14/12px feels small relative to the body type. Visible in `blog-post-tablet-portrait-light.png`.
- **P3** MDX-rendered content for this specific post contains **no `PullQuote`, `Callout`, or `InlineScholarshipCard`** components (the MDX file is plain prose only). The PRD asked us to verify these render — they're not present here, so we can't QA their rendering on this slug. Recommend re-running this audit on a slug that exercises those components (e.g. `mdx-kitchen-sink` story or a future post using them).

#### tablet-landscape, light + dark
- **P1** **Sidebar takes 260px of a 1024px viewport — but the actual rendered article body still wraps at the same ~660px of prose width.** Layout uses `lg:grid-cols-[260px_1fr]` and reaches the `lg:` breakpoint at exactly 1024px. The sidebar appears with sticky positioning at `top-32` (128px from top). Sidebar contents: Category pill, Published date, Read Time, and a "Reading Progress" block. The reading-progress widget reports "0%" but is collapsed to a thin strip; it's not clear from the screenshot whether it expands as the reader scrolls. Visible in `blog-post-tablet-landscape-light.png`.
- **P1** **Reading-progress section-jump buttons are 226×16px** (`The Power of a Personal Story`, `Structuring Your Essay`, `Tailoring to the Scholarship's Mission`) — 16px tall buttons fail WCAG 2.5.5 by a wide margin and are also visually thin and easy to miss. Component: `src/components/blog/reading-progress.tsx`.
- **P2** Cover image at 1024 landscape consumes the entire right column (the `1fr` track) with aspect-video proportions, pushing the article body roughly 580px below the H1 before any prose is visible. There is significant negative space between the title block and the image. Visible in `blog-post-tablet-landscape-light.png`.
- **P3** "Related Blogs" carousel buttons "Previous slide" / "Next slide" are 34×34 — under 44×44 by 10px on each side.

#### Both viewports
- **VERIFIED** Cover image (`/blog/bookShelf.png`) loads and fits aspect-video without distortion.
- **VERIFIED** "Back to Blog" link navigates back to `/blog` and reset the listing H1.
- **VERIFIED** Light/dark theme switch produces a properly tinted card surface for the sidebar (`bg-surface-container-low`) in both modes.
- **VERIFIED** No horizontal overflow.

---

### /blog/[slug]/not-found (bad slug)

#### tablet-portrait, light + dark AND tablet-landscape, light + dark
- **P0** **Static export configuration prevents the bespoke not-found UI from rendering.** `next.config.ts` sets `output: "export"`, and `src/app/blog/[slug]/page.tsx` sets `export const dynamicParams = false`. Under this combination, requesting a slug not present in `generateStaticParams()` triggers a runtime error:
  > "Page '/blog/[slug]/page' is missing param '/blog/[slug]' in 'generateStaticParams()', which is required with 'output: export' config."

  In **dev** the Next.js error overlay completely blocks the page (`document.title === ""`, `document.body.innerText.length === 0`) — verified across all four bad-slug captures. The Next.js dev tools also pin a "1 Issue" toast in the bottom-left corner.

  Evidence (probe `state` repeated four times):
  ```
  url: http://localhost:3000/blog/this-slug-definitely-does-not-exist-xyzzy
  title: ""
  bodyLen: 0
  ```

  In **prod** (static export), the route doesn't exist at all and the host will serve its default 404 (which on most hosts is unstyled). Either way, the global `src/app/not-found.tsx` and the per-route `src/app/blog/[slug]/not-found.tsx` are unreachable from a normal navigation.

  Files: `next.config.ts:7` (`output: "export"`), `src/app/blog/[slug]/page.tsx:24` (`export const dynamicParams = false`), `src/app/blog/[slug]/not-found.tsx` (dead code under current config), `src/app/not-found.tsx` (dead code under current config).

  Screenshots: all four `blog-not-found-*.png`. Evidence: red "Runtime Error" banner inside the Next.js dev overlay reading "Page '/blog/[slug]/page' is missing param '/blog/[slug]' in 'generateStaticParams()', which is required with 'output: export' config."

- **Note (race condition observed)**: In one early run during this audit, the same URL transiently rendered the global 404 ("We couldn't find that page." H1 from `src/components/ui/four-oh-four/not-found-client.tsx`) *before* the runtime error overlay mounted. Once the error fires, the page goes blank. This race makes the bug occasionally invisible during exploratory testing.

#### Related observation
- **P3** The dedicated `src/app/blog/[slug]/not-found.tsx` ("This story hasn't been written yet.") was **never reached** during any of the bad-slug attempts, even in the lucky race-condition run. If the underlying P0 is fixed by relaxing `dynamicParams` or by removing `output: "export"`, this component should still be wired up so that bespoke copy can replace the global 404 for blog-shaped URLs.

---

## Console Errors / Warnings Summary

Across all twelve captures:

**Errors**
- `Failed to load resource: the server responded with a status of 404 (Not Found)` — seen when navigating away from a route and a webpack HMR ping returns 404. Benign in dev, but worth confirming the HMR endpoint is correctly wired.
- During bad-slug navigation: two errors per attempt, both stemming from the dev runtime error described above ("Page '/blog/[slug]/page' is missing param …").

**Warnings**
- `You have Reduced Motion enabled on your device. Animations may not appear as expected.` — emitted by Motion. This is a **diagnostic from our QA harness** (we forced `prefers-reduced-motion: reduce` to make in-view animations resolve for screenshots) and is not user-facing. Motion's recommendation is to gate its warning by `process.env.NODE_ENV === 'production'`; we surface it here only so the team knows to ignore it during this audit.
- `Image with src "/iconBurgundy.png" was detected as the Largest Contentful Paint (LCP). Please add the loading="eager" property if this image is above the fold.` — and the matching `/iconWhite.png` warning. The footer logo is being flagged as LCP because the long marquee-style "Modern Scholar" text below is positioned via clip-path so the logo paints earlier than expected. Component: `src/components/ui/footer/footer.tsx` lines 29–43. Adding `priority` to those `<Image>` elements would silence this.
- `The resource <preloaded font / CSS> was preloaded using link preload but not used within a few seconds from the window's load event.` — repeated for several `_next/static/media/*.woff2` files and `app/global-error.css`. Indicates the font/CSS preload list is wider than what's actually rendered on the route. Not user-visible but worth tightening for CWV.

---

## Interaction Probe Results

### `/blog` interactions
| Probe | Result |
|---|---|
| Hover first card (synthetic mouseenter) | No transform/box-shadow change observed (`transform: none`, `box-shadow: none`). Hover affordance is likely keyed off CSS `:hover`, which Playwright's dispatched mouse events don't trigger reliably — visual hover state should be re-validated by hand. |
| Click featured card link | Navigates to `/blog/how-to-write-a-winning-scholarship-essay`. ✅ |
| `goBack()` after card click | URL returns to `/blog`; H1 still reads "Blogs". State preserved. ✅ |
| Card layout | Featured card: 704×302 portrait, 960×411 landscape. Secondary cards: 340×469 portrait (2-up), 304×449 landscape (3-up). ✅ |

### `/blog/<slug>` interactions
| Probe | Result |
|---|---|
| Article heading hierarchy | H1 → H3 → H3 → H3 inside `<article>`. **H2 skipped.** |
| Paragraph count in article | 14 |
| Inline links in article | 0 (this MDX file has none) |
| PullQuote, Callout, InlineScholarshipCard | 0, 0, 0 — none present in this MDX file |
| "Related Blogs" H2 outside article | Present, with 3 related cards. ✅ |
| Tab key focus indicator | First reachable focusable (skip-link → logo `<a href="/">`) reports `outlineStyle: 'none'`. **No visible focus ring.** P2. |
| Carousel "Previous slide"/"Next slide" buttons | 34×34 each, below 44×44 minimum. |
| Mobile menu button | 46×46 ✅ |

### `/blog/<bad-slug>` interactions
| Probe | Result |
|---|---|
| Page title | `""` (empty) in every reliable observation |
| H1 | `null` |
| Body innerText length | `0` |
| Visible UI | Only the Next.js dev runtime-error overlay |
| Race-condition observation (1 of ~10 runs) | Global 404 rendered briefly: H1 "We couldn't find that page.", title "Page Not Found \| Modern Scholar", bodyLen 433, back-link present. |

---

## Responsive Matrix

| Viewport      | /blog | /blog/<slug> | /blog/<bad-slug> | Notes |
|---------------|-------|--------------|-------------------|-------|
| 768×1024 light  | ⚠️ P2 issues (touch targets, animated-h1 dupe) | ⚠️ P1 (prose measure, focus ring) | ❌ P0 (dev runtime error blocks rendering) | — |
| 768×1024 dark   | ⚠️ same as light | ⚠️ same | ❌ P0 | — |
| 1024×768 light  | ⚠️ P2 (featured-card title contrast, filter buttons) | ⚠️ P1 (16px-tall TOC buttons) | ❌ P0 | — |
| 1024×768 dark   | ⚠️ same | ⚠️ same | ❌ P0 | — |

---

## Accessibility Audit

- **Keyboard navigation**: Tab moves through logo → menu button → main content → footer. Order is logical, but **no visible focus indicator** was rendered on `<a href="/">` (the logo) after Tab — `outlineStyle: none`. Likely the same for other interactive elements; this needs a global audit, not just the logo.
- **Skip-to-content link**: Present, navigates to `#main-content`, off-screen until focused (1×1 bounding rect).
- **Heading hierarchy on /blog**: H1 ("Blogs") → H2 (card titles) → H3 (footer columns). Clean.
- **Heading hierarchy on /blog/<slug>**: H1 → H3 → H3 → H3 inside `<article>` (H2 skipped). Outside the article a sibling H2 ("Related Blogs") appears. Screen-reader heading nav will jump from H1 to H3 inside the article.
- **`h1#main` text duplication**: `/blog` H1 reads "BlogsBlogs" in the accessibility tree. Animated-lines duplicates the heading text; if it's intended for visual masking only, the duplicate copies should be `aria-hidden`.
- **Touch targets**: Numerous controls under 44×44 (see findings above). Most consequential: 16px-tall TOC buttons in `reading-progress.tsx`, 20px footer links, 28px "Read Blog" CTAs, 34×34 carousel arrows.
- **Reduced motion**: `AnimatedSection` correctly short-circuits to non-animated content when `prefers-reduced-motion: reduce` is set (verified via screenshot harness). `PageTransition` likewise.
- **Reduced transparency / increased contrast**: Not exercised in this audit (deferred — none of the audited routes use glassmorphism at Z-2+; the sticky header does, but that's out of scope here).
- **Color contrast**: Not measured numerically; visual review suggests body text + on-surface tokens are well within range in both themes, but the featured card title in light mode overlaps the cover image with only a subtle overlay (see /blog landscape P2 above).
- **Image alt text**: Card images use the post title as alt; author images use the author name. ✅

---

## Cross-Browser

Not exercised in this run (only Chromium via Playwright MCP). The same browser session was being contested by parallel agents (Groups 1 and 3 of the QA pass), which forced this audit to use atomic `browser_run_code_unsafe` scripts to avoid mid-flight navigation hijack. Mention this for the harness owner — future QA passes should run in `--isolated` mode (separate `--user-data-dir` per agent) to prevent test cross-contamination.

---

## Recommendations

1. **P0 — Resolve the `output: "export"` + `dynamicParams = false` interaction.** Either:
   - Remove `output: "export"` from `next.config.ts` if the deploy target supports SSR/ISR; this immediately re-enables `notFound()` and lets the global 404 (or the per-route blog 404) render.
   - Keep static export but set `dynamicParams = true` and add a build-time check that `getPostBySlug` returning null causes `notFound()` to render the static 404 fallback at request time. *(Verify this is actually supported under `output: "export"` in Next 16 — consult `node_modules/next/dist/docs/`.)*
   - At minimum, add a redirect from any 404'd `/blog/<slug>` to `/blog` on the host (Vercel/DigitalOcean) so users don't see an unstyled host error page.

2. **P1 — Constrain prose measure on `/blog/<slug>`.** The `.max-w-prose` wrapper around the MDX body needs an additional cap (e.g. `max-w-2xl` or a custom `max-w-[65ch]` that survives the calc at 16px). Today, at 768px viewport the body is ~100ch wide, hurting readability for long-form content.

3. **P1 — Add a visible focus ring** to all interactive elements (`<a>`, `<button>`, form controls). Easiest fix is a global `:focus-visible` ring in `globals.css` using `outline-offset-2 outline-secondary` (matches the design system).

4. **P1 — Fix `reading-progress.tsx` TOC button heights.** 16px tall is unusable on touch and barely usable with a mouse. Raise to at least 32px with adequate padding, or convert to text links inside a list with row padding.

5. **P2 — Touch-target sweep.** Roll up the patterns: footer links need `py-2`; "Read Blog" buttons in cards need to grow to 36–40px tall; "Previous/Next slide" need to hit 44×44.

6. **P2 — Fix article heading hierarchy.** Either:
   - Lift the in-post `###` levels to `##` in the MDX source so the article reads H1 → H2 → H2 → H2.
   - Or remap H3 → H2 in `mdx-components.tsx` so any in-post `###` gets rendered as a `<h2>` (consistent with the post's role as the page's primary content).

7. **P2 — Drop the H1 duplication in animated-lines.** Either give the second copy `aria-hidden="true"`, or render only one accessible heading and overlay the animated glyphs as decorative spans.

8. **P3 — Test with a slug that actually exercises `PullQuote`, `Callout`, and `InlineScholarshipCard`.** The spec asked us to verify these — they're not present in this MDX. Suggest adding a fixture post or using the existing `mdx-kitchen-sink` Storybook story for that part of the QA.

9. **P3 — Add `priority` to the footer logos** to silence the LCP warning and let the browser preload the correct theme variant.

10. **P3 — Tighten the font/CSS preload list.** Currently several `_next/static/media/*.woff2` and `global-error.css` are preloaded but unused, generating console warnings on every route.

---

## Test Artifacts

- Screenshots (12): listed in **Captures Inventory** above. All under `Brain/PRDs/05_16_2026/screenshots/`.
- Console excerpts: see **Console Errors / Warnings Summary**.
- Probe transcripts: see **Interaction Probe Results**.
- No Playwright tests authored or modified in this pass.

---

## Environment Oddities (for harness maintainers)

- Four parallel `playwright-mcp` Node processes were detected (`ps aux | grep playwright-mcp`), all sharing the same `--user-data-dir=/Users/edemdumenu/Library/Caches/ms-playwright/mcp-chrome-6809e5c`. As a result, individual `browser_navigate`, `browser_resize`, and `localStorage` operations from this agent were repeatedly clobbered by sibling agents navigating to `/cookies`, `/privacy`, `/terms`, etc. The workaround used here was to run the full capture loop inside a single `browser_run_code_unsafe` call so that no other agent could intervene between `goto` → `evaluate(theme)` → `screenshot`. Future QA runs should be invoked with `--isolated` (separate browser contexts per agent) to eliminate the race.
- Full-page screenshots taken without `prefers-reduced-motion: reduce` capture content with `AnimatedSection`-gated content still at `opacity: 0` (because `useInView` doesn't fire during the synthetic scroll Playwright performs). This is correct production behavior for real users, but it makes screenshots unreliable. The reduced-motion media-emulation flag was used here to neutralize that.
- The Next.js dev tools "1 Issue" toast appears in three of the not-found screenshots; it's a dev-only overlay and would not appear in production.
