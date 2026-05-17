# Tablet Responsive Audit — 2026-05-16

## Summary

- **Scope**: 10 routes × 2 viewports × 2 themes = 40 captures
- **Routes**: /, /scholarships, /contact, /blog, /blog/[slug], /blog/[slug]/not-found, /cookies, /privacy, /terms, /not-found
- **Viewports**: 768×1024 portrait, 1024×768 landscape
- **Themes**: light + dark (next-themes)
- **Totals**: P0=1, P1=10, P2=12, P3=7
- **Top 3 ship-blockers**:
  1. Home page crashes the global error boundary in dark landscape — `error.tsx` replaces the page entirely with "We hit an unexpected hiccup"
  2. `formatLastUpdated()` TZ bug renders the wrong date on every legal page visible to sighted users across all 12 legal captures
  3. Cross-cutting WCAG failures: missing visible focus ring (2.4.7) and sub-44px touch targets (2.5.5) sitewide

**Correction (2026-05-16, post-audit)**: An earlier draft of this PRD listed `/blog/<invalid-slug>` as a P0. That was incorrect. The QA agent observed a dev-server 500 with a Next.js error overlay, but the production build emits a static `out/404.html` containing the bespoke "Page Not Found | Modern Scholar" UI from `src/app/not-found.tsx`. Static hosts (Vercel, Netlify, GitHub Pages, etc.) automatically serve `404.html` with HTTP 404 for unknown paths, so users see the styled custom 404. The dev 500 is a DX nuisance only — demoted to P3. See revised `/blog/[slug]/not-found` section below.

---

## Cross-cutting Patterns

Issues affecting multiple routes that should be resolved once in shared infrastructure.

---

### Pattern: Sub-44px touch targets sitewide

- **Routes affected**: /, /scholarships, /contact, /blog, /blog/[slug], /not-found (header + footer appear on every route)
- **Issue**: WCAG 2.5.5 requires a minimum 44×44 CSS px target size for any interactive control. The following are confirmed under-target across multiple routes:
  - Footer nav links (`<Link>` with `text-sm`, no padding): 20px tall — `src/components/ui/footer/footer.tsx` (nav `<Link>` elements, approx lines 60–100)
  - Header nav links at md breakpoint: 36px tall — `src/components/ui/header/` (nav links row)
  - "Read Blog" secondary card buttons: 28px tall — `src/components/blog/blog-card.tsx`
  - "Read Blog" featured card button: 34px tall — `src/components/blog/blog-card-featured.tsx`
  - Category filter chips: 34px tall — `src/components/blog/blog-filters.tsx`
  - Carousel prev/next arrows: 34×34 — `src/components/blog/` carousel component
  - "Back to Blog" text link: 23px tall — `src/components/blog/blog-detail.tsx` line 50–56
  - Reading-progress TOC buttons: 16px tall — `src/components/blog/reading-progress.tsx` (worst offender by far)
- **Fix**:
  - Footer nav `<Link>` elements: add `py-2.5` (20px padding each side → 40px intrinsic height; combine with `block` to get the hit-area to 40px+ without reflowing copy). For strict WCAG compliance add `min-h-[44px] flex items-center`.
  - Header nav links: add `py-1.5 min-h-[44px] flex items-center` to the link wrapper.
  - Blog card CTAs: change `size="sm"` → `size="default"` (44px) in `blog-card.tsx` and `blog-card-featured.tsx`.
  - Filter chips: add `h-11` (`44px`) to the chip variant in the CVA config for `blog-filters.tsx`.
  - Carousel arrows: add `size-11` (44×44) to the arrow button wrapper.
  - Reading-progress TOC buttons: replace the current `text-sm leading-4` text links with `<button className="w-full text-left py-2 text-sm leading-snug min-h-[44px] flex items-center">` — full-width rows with row padding provide the surface area without altering visual type size.
- **Files**: `src/components/ui/footer/footer.tsx`, `src/components/ui/header/` (nav link wrapper), `src/components/blog/blog-card.tsx`, `src/components/blog/blog-card-featured.tsx`, `src/components/blog/blog-filters.tsx`, `src/components/blog/reading-progress.tsx`
- **Effort**: M
- **Severity**: P1 (WCAG 2.5.5 failure; 16px TOC buttons are the most egregious)

---

### Pattern: Missing visible focus ring on interactive elements

- **Routes affected**: All routes (global `globals.css` issue)
- **Issue**: The logo `<a href="/">` and other interactive elements report `getComputedStyle(el).outlineStyle === 'none'` when focused via Tab. WCAG 2.4.7 requires a visible keyboard focus indicator. Confirmed on `/blog/[slug]` portrait; likely present everywhere because the suppression appears in `globals.css` or component-level `outline-none` utility without a `:focus-visible` replacement.
- **Fix**: In `src/app/globals.css`, add a global `:focus-visible` rule after the existing reset:
  ```css
  :focus-visible {
    outline: 2px solid var(--secondary);
    outline-offset: 3px;
    border-radius: var(--radius-sm);
  }
  ```
  This uses the sage `--secondary` token which is distinct from both the primary brownish-red and the cream surface — visible on all background tiers in both themes. Additionally audit any component that explicitly sets `outline-none` and replace with `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2` to preserve the ring when accessed by keyboard.
- **Files**: `src/app/globals.css`, spot-fix in `src/components/ui/header/`, `src/components/ui/footer/footer.tsx`
- **Effort**: S
- **Severity**: P1

---

### Pattern: Prose measure exceeds 75ch on tablet landscape

- **Routes affected**: /blog/[slug], /cookies, /privacy, /terms
- **Issue**: Long-form prose renders at 96–100ch per line at 1024px landscape, well above the 60–75ch editorial target. The culprit differs per component:
  - Blog detail: `max-w-prose` wrapper at line 55 of `src/components/blog/blog-detail-content.tsx` — Tailwind's `max-w-prose` resolves to `65ch` which at a root font-size of 16px is ~1040px, so it never constrains at a 704px content column. The actual paragraph width becomes the column width, ~100ch.
  - Legal pages: `max-w-3xl` (48rem = 768px) at line 56 of `src/components/legal/legal-layout.tsx` — at landscape 1024 the content area fills to 768px = ~96ch.
- **Fix**:
  - Blog detail (`src/components/blog/blog-detail-content.tsx:55`): Change `<div className="mt-10 max-w-prose">` to `<div className="mt-10 max-w-[65ch]">`. The explicit `ch` unit is immune to the `rem`-vs-`px` ambiguity in Tailwind's `max-w-prose` at this viewport.
  - Legal layout (`src/components/legal/legal-layout.tsx:56`): Change `max-w-3xl` to `max-w-2xl` (42rem = 672px), which lands at approximately 84ch — a meaningful improvement. If the target is strict ≤75ch, use `max-w-[65ch]` directly for editorial purity. `max-w-2xl` is the pragmatic midpoint that doesn't feel cramped at desktop widths while fixing the tablet landscape overflow.
- **Files**: `src/components/blog/blog-detail-content.tsx:55`, `src/components/legal/legal-layout.tsx:56`
- **Effort**: S
- **Severity**: P1

---

### Pattern: Spline Suspense fallback gives no content signal

- **Routes affected**: / (home hero), /contact (form section desktop), /not-found (404 backdrop), /blog/[slug] (covered image)
- **Issue**: Every Spline integration uses the same pulsing-dot fallback:
  ```jsx
  <div className="flex size-full items-center justify-center">
    <div className="size-12 animate-pulse rounded-full bg-surface-container" />
  </div>
  ```
  On the 404 page this is the only thing a motion-enabled user sees for several seconds — no heading, no "404" marker — until the Spline scene resolves (non-deterministic). On the home hero it leaves a blank viewport above the heading. This is a P1 for `/not-found` specifically; P2 for other routes where structural content is still visible.
- **Fix** (per route):
  - `/not-found` (`src/components/ui/four-oh-four/not-found-client.tsx:166-170`): Replace the pulsing dot with the static `ZeroRing` SVG that already exists in the component. The fallback should render `<ZeroRing reduced />` inside a `flex items-center justify-center` container so that the "404" mark is immediately present regardless of Spline load state.
  - `/contact` (`src/components/contact/contact-form-section.tsx:196-200`): The fallback is behind `hidden lg:block` so it only shows at desktop ≥1024px. At exactly 1024px landscape the fallback appears. Replace with a styled placeholder that uses `bg-surface-container rounded-3xl h-120 w-full` — same dimensions as the Spline container but a warm tonal surface with no spinner, matching the card's own background.
  - Home hero (`src/components/home/hero-section.tsx:24-28`): The `SplineFallback` during SSR/pre-mount is a pulsing circle. Since the Spline scene is purely decorative, a transparent fallback is acceptable — leave as-is with a note.
- **Files**: `src/components/ui/four-oh-four/not-found-client.tsx:166-170`, `src/components/contact/contact-form-section.tsx:196-200`
- **Effort**: S
- **Severity**: P1 (for /not-found), P2 (for /contact)

---

### Pattern: AnimatedLines H1 text duplication in accessibility tree

- **Routes affected**: /blog (H1 "BlogsBlogs"), and any route using `AnimatedLines` as a heading (`as="h1"`) — confirmed at /scholarships and /contact (contact uses `as="h1"`)
- **Issue**: `AnimatedLines` renders character-level spans for the visual animation but the outer element receives the full text content as well. `document.querySelector('h1').textContent` returns the heading text doubled (e.g., "BlogsBlogs"). Assistive tech reads the heading twice, and text-extraction crawlers index the duplicate.
- **Fix**: In `src/components/ui/animatedLines/animated-lines.tsx`, the animated span container should carry `aria-hidden="true"` and a sibling `<span className="sr-only">` should hold the plain text. Pattern:
  ```jsx
  // Inside AnimatedLines render when as="h1" (or any heading)
  <Heading as={as} ...>
    <span aria-hidden="true">{/* existing char-split spans */}</span>
    <span className="sr-only">{text}</span>
  </Heading>
  ```
  The hero section in `hero-section.tsx` already does this correctly (lines 99 and 100–111) — `AnimatedLines` has `aria-hidden="true"` and a preceding `<span className="sr-only">`. The blog and scholarships heroes should follow the same pattern. Check if the `AnimatedLines` component itself can be modified to automatically include the `sr-only` text whenever `as` is a heading element, removing the need for call-site workarounds.
- **Files**: `src/components/ui/animatedLines/animated-lines.tsx`, `src/components/blog/blog-hero.tsx`, `src/components/scholarships/scholarship-hero.tsx`, `src/components/contact/contact-hero.tsx`
- **Effort**: S
- **Severity**: P2

---

### Pattern: Font preload set wider than per-route usage

- **Routes affected**: All routes (confirmed on /blog, /cookies, /terms, /not-found)
- **Issue**: Console logs on every route show `_next/static/media/*.woff2` and `global-error.css` preloaded but not used within a few seconds of load. This is a Next.js dev-mode artifact but it indicates the preload list is over-broad and could hurt CWV (wasted bandwidth on real connections).
- **Fix**: Review `src/app/layout.tsx` font declarations — currently both Poppins (400/500/600/700) and Noto Serif (400/700) are loaded globally. Audit which weights actually appear above the fold per route and consider adding `display: "swap"` with route-level `<link rel="preload">` only for the weights used on that page. At minimum, ensure `global-error.css` is not preloaded on every page (it should only load when `global-error.tsx` renders).
- **Files**: `src/app/layout.tsx` (font declarations), build-level Next.js config
- **Effort**: M
- **Severity**: P3

---

## Findings & Fixes by Route

---

### / (home)

**Captures reviewed**: home-tablet-portrait-light.png, home-tablet-portrait-dark.png, home-tablet-landscape-light.png, home-tablet-landscape-dark.png

**QA harness note**: Portrait captures (both light and dark) show a partially rendered home page — the hero Spline scene loads, the "Modern Scholar" heading and "Explore" CTA are visible, and the "Coming Soon" / "Scholarship Dashboard" section is visible below the fold. However, the content below the hero appears largely blank in portrait captures — this is the `AnimatedSection`/`useInView` animation-gate issue documented in Group 2: content remains at `opacity: 0` because `useInView` does not fire during Playwright's synthetic scroll when `prefers-reduced-motion` is not emulated. The content is structurally present; this is a screenshot artifact, not a layout bug.

---

#### [P0] Home page crashes to global error boundary in dark landscape

- **Symptom**: `home-tablet-landscape-dark.png` renders `src/app/error.tsx` ("Something went wrong / We hit an unexpected hiccup") with "Try Again" and "Go Home" CTAs — the entire home page is replaced by the error boundary. The light landscape and both portrait captures render correctly. The crash is dark-theme-specific and landscape-specific, implying the issue is triggered by the combination of theme resolution and a component mount sequence at exactly 1024×768.
- **Where**: `src/app/(home)/page.tsx` → `src/components/home/hero-section.tsx` (Spline theme resolution) or `src/components/home/featured-scholarships.tsx` / `src/components/home/whats-next/` (scroll-dependent sections)
- **Root cause**: The most likely cause is a `resolvedTheme` race in `hero-section.tsx` (lines 40–47) — at 1024px landscape dark, `useTheme()` may return a different `resolvedTheme` value than at portrait, causing a string error in `splineScenes.heroDark()` or an invalid URL passed to `SplineScene`. Alternatively, a component in `WhatsNext` (which uses `canvas-text.tsx` based on the file listing) may throw during a dark-mode canvas draw call that only manifests at this viewport. The `reactStrictMode: false` in `next.config.ts` means the double-invocation check is disabled, so this error may be harder to reproduce locally in standard dev.
- **Fix**: Wrap `HeroSection`, `FeaturedScholarships`, `WhatsNext`, and `FAQSection` individually in `<ErrorBoundary>` boundaries (or use `<Suspense>` with error fallback props) so a single section crash does not take down the entire page. At minimum, the `Home` page in `src/app/(home)/page.tsx` should not be naked — add a section-level error boundary around `<WhatsNext />` and `<FeaturedScholarships />` since those are the most likely offenders (scroll-driven, theme-aware). Investigate the dark-landscape-specific trigger by adding `console.error` instrumentation in `hero-section.tsx` around `splineUrl` and `splineScenes.heroDark()` to confirm the URL resolves correctly at 1024px.
- **Effort**: M
- **Screenshot**: home-tablet-landscape-dark.png

---

#### [P1] Hero heading semantic level is H2 not H1

- **Symptom**: The hero heading "Your scholarship journey starts here" is marked as `<h2 id="hero-heading">` (line 88–93 of `src/components/home/hero-section.tsx`). The large "Modern Scholar" brand name is rendered via `AnimatedLines` as `<span aria-hidden="true">`. A screen reader user navigating by heading finds H2 before any H1 — there is no H1 on the home page.
- **Where**: `src/components/home/hero-section.tsx:88–93`
- **Root cause**: The `aria-hidden` on `AnimatedLines` was added to prevent the duplication bug (correct), but the fallback `<span className="sr-only">Modern Scholar</span>` at line 99 is a `<span>`, not a heading. The semantic heading role for the page's primary identity ("Modern Scholar") is lost.
- **Fix**: Change `<h2 id="hero-heading">` to `<h1 id="hero-heading">` for the subhead "Your scholarship journey starts here". Then wrap the `AnimatedLines` + sr-only span in a visually-styled container that does not duplicate heading semantics. The structure should be: `<h1>` containing the sr-only "Modern Scholar" text, with the `AnimatedLines` span as its `aria-hidden` visual counterpart. The supporting "Your scholarship journey starts here" line can then become a `<p>` with appropriate styling (currently `text-xl` Noto Serif — keep but change element to `<p>`).
- **Effort**: S
- **Screenshot**: home-tablet-portrait-light.png

---

#### [P2] Hero viewport height: content below hero hidden by animation gate at portrait

- **Symptom**: At 768×1024 portrait in both themes, only the hero section is visible in the capture. The "Featured Scholarships" section, "Coming Soon / WhatsNext" section, and FAQ are all at `opacity: 0` because `AnimatedSection`/`useInView` has not fired. Real tablet users who do not scroll will see blank space where the Featured Scholarships section should begin. This is partially a QA artifact (no `prefers-reduced-motion` emulation was applied for home captures), but the underlying issue is that `FeaturedScholarships` uses `h-dvh` (`src/components/home/featured-scholarships.tsx:16`) — it occupies a full viewport height below the hero, meaning users must scroll exactly one full viewport to see any featured content. On a 768×1024 tablet this is a significant scroll commitment before seeing social proof.
- **Where**: `src/components/home/featured-scholarships.tsx:16` (`flex h-dvh flex-col justify-center`)
- **Root cause**: Design intent is a full-screen section for the featured scholarships carousel. At desktop this feels cinematic; at tablet portrait the 1024px section height buries the content below a very long hero.
- **Fix**: Change `h-dvh` to `min-h-[600px] md:h-dvh` so the section maintains full-viewport height on wider breakpoints but collapses gracefully at tablet portrait where the viewport is taller. This ensures the section header and at least the first carousel card are visible after a modest scroll.
- **Effort**: S
- **Screenshot**: home-tablet-portrait-light.png

---

#### [P2] Hero Spline fallback visible in SSR/pre-mount state

- **Symptom**: Before `useHasMounted` resolves (server render + first client paint), the hero Spline area renders `SplineFallback` — a pulsing circle. At 768px portrait this occupies the full viewport's background area behind the heading. No 3D context is established.
- **Where**: `src/components/home/hero-section.tsx:57` (`<SplineFallback />` fallback branch)
- **Root cause**: Intentional architecture (SSR-safe lazy load). The pulsing circle is the only visual indicator during this window.
- **Fix**: The fallback is behind a `ParallaxLayer` with `absolute inset-y-0` positioning, so it doesn't block the heading or CTA. The fix is aesthetic: replace the pulsing circle with a `bg-surface-container-low` filled div (no spinner) — a calm placeholder that reads as intentional negative space rather than a loading state. The heading and CTA are visible regardless, so there is no content-blocking concern. This is a polish improvement.
- **Effort**: S
- **Screenshot**: home-tablet-portrait-light.png

---

#### [P3] "Explore" CTA button alignment at portrait

- **Symptom**: At 768×1024, the hero bottom row (`flex-col` on mobile → `md:flex-row` at tablet) shows the heading stack and the "Explore" CTA button. At exactly 768px (`md:`) the row switches to `flex-row md:items-end md:justify-between`. The CTA appears to the right of the heading at the bottom of the hero, but visually it is very close to the Spline model in the screenshot — potentially overlapping with the 3D scene's interactive elements.
- **Where**: `src/components/home/hero-section.tsx:77–121`
- **Root cause**: `md:` breakpoint triggers at 768px (exactly the tablet portrait width), so the portrait layout switches to the desktop row arrangement at this boundary.
- **Fix**: Consider changing the CTA to show below the heading on `md` (portrait tablet) and move to the right only at `lg:` (1024px+): `flex-col lg:flex-row lg:items-end lg:justify-between`. This keeps the tablet portrait layout in a cleaner single-column stack without interfering with the Spline model's hit zone.
- **Effort**: S
- **Screenshot**: home-tablet-portrait-light.png

---

### /scholarships

**Captures reviewed**: scholarships-tablet-portrait-light.png (mislabeled — actual content is the /cookies page due to QA harness contention), scholarships-tablet-portrait-dark.png (showing /not-found 404 screen — also a harness artifact), scholarships-tablet-landscape-light.png, scholarships-tablet-landscape-dark.png

**QA harness note**: Two of the four scholarship captures were contaminated by the parallel-agent browser session — the portrait-light capture shows `/cookies` and the portrait-dark shows `/not-found`. Only the two landscape captures are valid for /scholarships. The supplement log confirms zero horizontal overflow for all 4 nominal captures. All landscape findings below are based on verified captures.

---

#### [P1] Scholarship card titles truncated at landscape 3-column grid

- **Symptom**: At 1024×768 landscape the scholarship grid renders 4 columns (based on the landscape-light capture showing 4 scholarship cards in the first row). Card widths are approximately 228px. Card titles such as "Dormer Appel Ruder..." and "JM Phillips Group Cole..." are truncated with ellipsis mid-word. The card body type at this size is visually cramped.
- **Where**: `src/components/scholarships/scholarship-card.tsx` (title truncation) and `src/components/scholarships/scholarship-grid.tsx` (grid columns)
- **Root cause**: The grid likely uses `grid-cols-2 md:grid-cols-4` or similar, creating 4 columns at 1024px. At ~228px card width, Noto Serif titles with tracking-tight wrap poorly and truncate at one line.
- **Fix**: Change the grid to `grid-cols-2 md:grid-cols-3 lg:grid-cols-4` so that at exactly 1024px (which is `md:` in Tailwind v4) only 3 columns render, giving each card ~315px — enough for two-line titles without truncation. 4 columns should only activate at `lg:` (1280px+). Update the card title to allow `line-clamp-2` instead of `line-clamp-1` if not already set.
- **Effort**: S
- **Screenshot**: scholarships-tablet-landscape-light.png

---

#### [P2] Filter bar controls under 44px height at tablet

- **Symptom**: The filter bar at the top of the scholarship grid shows "Month", "Sort", and "Filters" buttons and a view-toggle icon. These are visually rendered at approximately 34px tall based on the landscape capture, consistent with the Group 2 finding for blog filter chips (same underlying component pattern).
- **Where**: `src/components/scholarships/scholarship-filters.tsx`
- **Root cause**: Filter buttons use a compact size variant suited for desktop mouse interaction, not tablet touch.
- **Fix**: Apply `min-h-[44px]` to the filter button row's individual `<Button>` elements (or their CVA size variant). Use `size="default"` (44px) rather than a custom small size for the Month, Sort, and Filters controls. The view-toggle icon button should be `size="icon"` (44×44) not `size="icon-sm"`.
- **Effort**: S
- **Screenshot**: scholarships-tablet-landscape-light.png

---

#### [P2] "Compare" chip on scholarship card clips out at landscape 4-up grid

- **Symptom**: In the landscape-light capture, the fourth column card ("JM Phillips Group Cole...") shows a "Compare" chip overlapping the right edge of the card. The chip appears to break containment.
- **Where**: `src/components/scholarships/scholarship-card.tsx` (compare chip positioning)
- **Root cause**: The compare chip is likely absolutely positioned within the card and its right-side offset is calibrated for wider card widths. At 228px card width the chip overflows.
- **Fix**: Clip the chip to `overflow-hidden rounded-[inherit]` on the card wrapper, or switch the compare chip to `relative` positioning within the card's content flow rather than absolute. Alternatively, fix is avoided entirely if the grid column count is fixed per the P1 above (3 columns at md instead of 4 gives ~315px cards where the chip fits).
- **Effort**: S
- **Screenshot**: scholarships-tablet-landscape-light.png

---

#### [P3] Pagination controls touch target at tablet

- **Symptom**: The custom `PaginationLinkInkSpread` and `PaginationPreviousInkSpread` / `PaginationNextInkSpread` components are visible at the bottom of the grid in landscape captures. Their exact dimensions are not confirmed but the ink-spread pagination pattern typically renders at 32–36px — worth verifying.
- **Where**: `src/components/ui/pagination/pagination-ink-spread.tsx`
- **Root cause**: Custom pagination variant may not have 44px minimum height.
- **Fix**: Add `min-h-[44px] min-w-[44px]` to each pagination link wrapper in `pagination-ink-spread.tsx`.
- **Effort**: S
- **Screenshot**: scholarships-tablet-landscape-light.png

---

### /contact

**Captures reviewed**: contact-tablet-portrait-light.png, contact-tablet-portrait-dark.png, contact-tablet-landscape-light.png, contact-tablet-landscape-dark.png

All 4 captures are valid. The supplement log notes ~1 console error per contact capture (Spline-related warnings confirmed). No horizontal overflow on any capture. The contact page renders well overall with only polish-level issues.

---

#### [P1] Spline contact scene uses `MobileContactImage` at md — dark theme shows wrong image

- **Symptom**: At 768×768 and 768×1024 (portrait tablet), `ContactFormSection` renders the `MobileContactImage` (`block lg:hidden w-full`) — a static `<picture>` element. In the dark portrait capture, the static image placeholder renders with a cream/light background (`bg-surface-container`) visible around the phone mockup image in a rounded `rounded-3xl` container. However, the `<picture>` element uses `media="(prefers-color-scheme: dark)"` for source selection, not the next-themes `class="dark"` mechanism. At tablet portrait dark (where `class="dark"` is set on `<html>` by next-themes but the OS-level `prefers-color-scheme` may still be `light`), the browser selects the light image source.
- **Where**: `src/components/contact/contact-form-section.tsx:152-176` (`MobileContactImage`)
- **Root cause**: The `<picture>` `media` attribute is keyed off the OS color scheme, not next-themes' class-based dark mode. These can diverge — a user with `prefers-color-scheme: light` who manually toggles to dark in the app will see the light image.
- **Fix**: Convert `MobileContactImage` from a `<picture>` to a next-themes-aware component: add `"use client"` (or inline it into the parent `ContactFormSection` which is already a client component), use `useTheme()` and `mounted` state to select the correct image src. Example:
  ```jsx
  const imgSrc = mounted && resolvedTheme === 'dark'
    ? '/darkContactPhone.png'
    : '/lightContactPhone.png'
  return (
    <div className="overflow-hidden rounded-3xl bg-surface-container">
      <img src={imgSrc} alt="Modern Scholar contact illustration" ... />
    </div>
  )
  ```
  This matches the pattern already used for the Spline scene URL in the same component.
- **Effort**: S
- **Screenshot**: contact-tablet-portrait-dark.png

---

#### [P2] Contact card section uses hard-coded background colors instead of surface tokens

- **Symptom**: `ContactFormSection` wraps everything in `rounded-3xl bg-[#f9edea] dark:bg-[#140f0e]`. These are raw hex values, not OKLCH design system tokens.
- **Where**: `src/components/contact/contact-form-section.tsx:203`
- **Root cause**: The card background was hand-picked as warm cream and near-black, matching the Academic Curator palette visually but not using the token system.
- **Fix**: Replace `bg-[#f9edea]` with `bg-surface-container-lowest` (light: `oklch(0.984 0.0079 36.1)` — very close to the hand-coded cream). Replace `dark:bg-[#140f0e]` with `dark:bg-surface-container` (dark tier). This pulls the card into the tonal layering system and ensures it responds correctly to any future token updates. Note: do NOT apply glassmorphism here — this is a Z-1 card/container, and glass is reserved for Z-2+ floating elements per the design system rules.
- **Effort**: S
- **Screenshot**: contact-tablet-landscape-dark.png

---

#### [P2] Contact hero heading uses `font-normal` instead of `font-bold` Noto Serif

- **Symptom**: In all 4 contact captures, "Contact Us" renders at Noto Serif with `font-normal` (weight 400). Compared to other page heroes (/scholarships, /blog which use `font-bold`), the heading feels lighter and less authoritative. The Academic Curator system specifies Noto Serif 700 for H1 headings.
- **Where**: `src/components/contact/contact-hero.tsx:14` (`font-normal`)
- **Root cause**: Explicit `font-normal` class overrides the default heading weight.
- **Fix**: Change `font-normal` to `font-bold` in the `AnimatedLines` className at line 14. The "Contact Us" heading should use Noto Serif 700 to match /blog ("Blogs"), /scholarships ("Scholarships"), and legal page H1s.
- **Effort**: S
- **Screenshot**: contact-tablet-portrait-light.png

---

#### [P2] Contact page footer area is empty below FAQ — excess white space at portrait

- **Symptom**: In contact-tablet-portrait-light.png and contact-tablet-portrait-dark.png, after the FAQ accordion section closes, there is approximately 400px of empty space before the footer. The `min-h-screen` on the page container (`src/app/contact/page.tsx:16`) forces this.
- **Where**: `src/app/contact/page.tsx:16` (`min-h-screen`)
- **Root cause**: `min-h-screen` ensures the page is at least one viewport tall — a pattern to prevent the footer from floating up on short pages. But on portrait tablet where the page content is itself tall (hero + contact form + FAQ), the `min-h-screen` adds surplus space after the last section.
- **Fix**: Change `min-h-screen` to `min-h-dvh` to use the dynamic viewport height (accounts for browser chrome on mobile/tablet more accurately), and also consider removing it entirely since the contact page has sufficient content at all viewports to fill the screen without the constraint. Alternatively use `grow` on the page container so it fills available space in the flex column layout from `src/app/layout.tsx:44` without adding fixed minimum heights.
- **Effort**: S
- **Screenshot**: contact-tablet-portrait-light.png

---

#### [P3] "or copy email address" nudge arrow pill is missing at portrait (below sm breakpoint)

- **Symptom**: The `NudgeArrow` component wrapping "or copy email address" is inside `hidden sm:block` (`src/components/contact/contact-form-section.tsx:261`). At 768×1024 portrait the `sm:` breakpoint (640px) is exceeded so the nudge arrow should appear, but in the portrait-light capture it is not visible — possibly hidden behind the "SEND EMAIL" CTA button due to the `flex-wrap` layout.
- **Where**: `src/components/contact/contact-form-section.tsx:247–330`
- **Root cause**: The `flex-wrap items-center gap-4` row wraps the CTAButton and the AnimatePresence nudge arrow. At portrait tablet where the CTA is full-width or nearly so, the nudge arrow may wrap to a second line and be obscured.
- **Fix**: Verify the layout by adding `flex-col gap-2 sm:flex-row sm:flex-wrap` to the CTA row so the nudge arrow appears below (not hidden behind) the CTA button on portrait. This is a minor polish fix.
- **Effort**: S
- **Screenshot**: contact-tablet-portrait-light.png

---

### /blog

**Captures reviewed**: blog-index-tablet-portrait-light.png, blog-index-tablet-portrait-dark.png, blog-index-tablet-landscape-light.png, blog-index-tablet-landscape-dark.png

*(See Group 2 findings for full detail. Key findings summarized here with fix references.)*

---

#### [P2] AnimatedLines H1 duplicates "Blogs" in the accessibility tree

- See cross-cutting pattern: AnimatedLines H1 text duplication.
- **Screenshot**: blog-index-tablet-portrait-light.png

---

#### [P2] Featured card title low contrast against cover image at landscape

- **Symptom**: At 1024×768 landscape, the featured card title renders as light-colored Noto Serif text over the bookshelf photo. The gradient overlay is insufficient — in light mode especially, areas of the image with bright tones (the window light in the bookshelf photo) produce near-failing contrast against the cream text.
- **Where**: `src/components/blog/blog-card-featured.tsx` (gradient overlay)
- **Root cause**: The gradient overlay (likely `bg-gradient-to-t from-black/60`) is too shallow for the full landscape card height, leaving the upper title area with minimal overlay on bright image regions.
- **Fix**: Increase the gradient opacity and height: change `from-black/60` to `from-black/80 via-black/40` and extend the `via` stop higher up the card (e.g., `from-black/80 via-black/40 to-transparent` with a `bg-gradient-to-t from-70%`). Additionally, add `drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]` to the title text element for a direct text shadow fallback on bright backgrounds.
- **Effort**: S
- **Screenshot**: blog-index-tablet-landscape-light.png

---

#### [P2] Touch targets: footer links, card CTAs, filter chips (see cross-cutting pattern)

- See cross-cutting Pattern: Sub-44px touch targets.
- Specific to blog index: footer links (20px), "Read Blog" secondary cards (28px), featured card CTA (34px), filter chips (34px), carousel arrows (34×34).
- **Screenshot**: blog-index-tablet-portrait-light.png

---

#### [P3] Three-column grid at landscape makes secondary card body text cramped

- **Symptom**: At 1024px landscape, 3 secondary cards per row at ~304px wide wrap body text tightly and truncate titles. Card body text reads at approximately 12px effective size in the screenshot.
- **Where**: `src/components/blog/blog-grid.tsx`
- **Root cause**: Grid column count may be the same at `md:` (768) and landscape `lg:` — if the grid uses `md:grid-cols-3` it becomes 3-up at exactly 1024px as well.
- **Fix**: Confirm the grid breakpoints. If `md:grid-cols-3` is used, change to `md:grid-cols-2 lg:grid-cols-3` so that tablet portrait (768px) shows 2 columns (wider cards) and only 1024px+ shows 3 columns.
- **Effort**: S
- **Screenshot**: blog-index-tablet-landscape-light.png

---

### /blog/[slug]

**Captures reviewed**: blog-post-tablet-portrait-light.png, blog-post-tablet-portrait-dark.png, blog-post-tablet-landscape-light.png, blog-post-tablet-landscape-dark.png

*(See Group 2 findings for full detail.)*

---

#### [P1] Prose measure ~100ch at portrait (see cross-cutting pattern)

- See cross-cutting Pattern: Prose measure exceeds 75ch.
- **Specific symptom**: `max-w-prose` in the MDX body wrapper at `src/components/blog/blog-detail-content.tsx:55` does not constrain at 768px.
- **Screenshot**: blog-post-tablet-portrait-light.png

---

#### [P1] Reading-progress TOC buttons are 16px tall — WCAG 2.5.5 failure

- **Symptom**: Section-jump buttons in the sidebar ("The Power of a Personal Story", "Structuring Your Essay", "Tailoring to the Scholarship's Mission") render at 226×16px. This is the most egregious touch target violation in the audit.
- **Where**: `src/components/blog/reading-progress.tsx`
- **Root cause**: TOC links are plain text with no padding, styled as inline text elements.
- **Fix**: Restructure TOC items as `<li>` list items with `<button>` elements that have `w-full text-left py-2.5 min-h-[44px] flex items-center text-sm text-on-surface-variant hover:text-on-surface transition-colors` — full-width, vertically padded to WCAG minimum, preserving the text size. The visual weight of the section jump link is unchanged; only the hit area grows.
- **Effort**: S
- **Screenshot**: blog-post-tablet-landscape-light.png

---

#### [P1] Missing visible focus ring on logo and interactive elements (see cross-cutting pattern)

- **Screenshot**: blog-post-tablet-portrait-light.png

---

#### [P2] Article heading hierarchy skips H2 (H1 → H3 → H3 → H3)

- **Symptom**: Inside the `<article>` element the document outline goes H1 ("How to Write a Winning Scholarship Essay") → H3 ("The Power of a Personal Story") → H3 → H3. H2 is absent inside the article. Screen reader users navigating by heading level will jump two levels after the title.
- **Where**: `content/blog/how-to-write-a-winning-scholarship-essay.mdx` (section headings use `###`), `src/components/blog/mdx-components.tsx` (heading component mapping)
- **Root cause**: The MDX content uses `###` for section heads. The MDX component map renders `###` as `<h3>`. Since the post title is already `<h1>`, the correct semantic level for in-post sections is `<h2>`.
- **Fix** (two options — choose one):
  - Option A: Change `###` to `##` in the MDX source for this and all future posts. Update `CLAUDE.md`'s blog authoring convention to specify that in-post section heads use `##`.
  - Option B: Remap `h3` → `h2` in `src/components/blog/mdx-components.tsx` so that `###` in MDX renders as `<h2>` in HTML. This is a global remap — ensure no posts legitimately use H3-inside-H2 nesting before applying.
- **Effort**: S
- **Screenshot**: blog-post-tablet-portrait-light.png

---

#### [P2] "Back to Blog" link is 139×23px — under WCAG 2.5.5

- See cross-cutting touch-target pattern.
- **Specific where**: `src/components/blog/blog-detail.tsx:50–56`
- **Fix**: Wrap the link in a `<div className="py-2">` or add `py-2 inline-block` to the link itself so the tap target extends to at least 36px. For strict compliance use `min-h-[44px] inline-flex items-center`.
- **Effort**: S
- **Screenshot**: blog-post-tablet-portrait-light.png

---

#### [P2] Cover image pushes prose ~580px below H1 at landscape sidebar layout

- **Symptom**: At 1024px landscape with the `lg:grid-cols-[260px_1fr]` sidebar layout, the hero cover image (aspect-video) occupies the full width of the `1fr` column. This pushes the article prose body approximately 580px below the H1 before any text is visible.
- **Where**: `src/components/blog/blog-detail-content.tsx:44–49` (the hero image `div`)
- **Root cause**: `aspect-video` on a `w-full` element inside the article `1fr` column produces a very tall image at landscape 1024px column widths.
- **Fix**: Cap the hero image height at landscape: add `max-h-80 md:max-h-[50vh]` to the image wrapper div, with `object-cover` on the `<Image>` component (already present). This preserves the aspect-video crop behaviour while limiting vertical impact.
- **Effort**: S
- **Screenshot**: blog-post-tablet-landscape-light.png

---

#### [P3] Related Blogs carousel prev/next buttons are 34×34px

- See cross-cutting touch-target pattern.
- **Effort**: S
- **Screenshot**: blog-post-tablet-landscape-light.png

---

### /blog/[slug]/not-found

**Captures reviewed**: blog-not-found-tablet-portrait-light.png, blog-not-found-tablet-portrait-dark.png, blog-not-found-tablet-landscape-light.png, blog-not-found-tablet-landscape-dark.png

---

#### [P3 dev-only] Static export emits a dev 500 for invalid slugs; production serves a styled 404 correctly

- **Production behavior (verified 2026-05-16)**: `npm run build` emits `out/404.html` containing the bespoke `<title>Page Not Found | Modern Scholar</title>` UI from `src/app/not-found.tsx`. Static hosts auto-serve `404.html` with HTTP 404 for any unknown path, including `/blog/<bad-slug>`. The styled custom 404 page **does** render in production — no user-facing P0.
- **Dev-mode symptom**: `npm run dev` returns HTTP 500 with the Next.js error overlay for any unknown slug. Console: `Page "/blog/[slug]/page" is missing param "/blog/[slug]" in "generateStaticParams()", which is required with "output: export" config.` Body is empty. DX nuisance for engineers iterating on blog routing or writing tests.
- **Where**: `next.config.ts:7` (`output: "export"`), `src/app/blog/[slug]/page.tsx:24` (`export const dynamicParams = false`)
- **Optional polish (deferred to backlog)**:
  - The bespoke `src/app/blog/[slug]/not-found.tsx` is unreachable in production — the global `404.html` is what users see. If you want blog-specific 404 copy (e.g., related-posts suggestions), you'd need to either drop static export, or treat the global `not-found.tsx` as the canonical 404 and delete the unreachable segment file to avoid dead code.
  - To eliminate the dev 500 specifically, you could swap `dynamicParams = false` for `true` in dev (verify Next 16 behavior under `output: "export"` first), but this trades a 500 for inconsistency with production's static-file fallback. Not worth the complexity for a dev-only annoyance.
- **Effort**: S (delete unreachable segment file) or none (accept the dev 500)
- **Screenshot**: blog-not-found-tablet-portrait-light.png (shows dev overlay, not production behavior)

---

### /cookies

**Captures reviewed**: cookies-tablet-portrait-light.png, cookies-tablet-portrait-dark.png, cookies-tablet-landscape-light.png, cookies-tablet-landscape-dark.png

*(See Group 3 findings for full detail.)*

---

#### [P1] "Last updated" date is off by one day due to TZ parsing

- **Symptom**: All four /cookies captures show "Last updated May 13, 2026" in the header eyebrow, but `<time datetime="2026-05-14">` is correct. Sighted users see the wrong date. The bug reproduces on /privacy and /terms as well.
- **Where**: `src/components/legal/legal-layout.tsx:25–33` (`formatLastUpdated()`)
- **Root cause**: `new Date(`${iso}T00:00:00Z`)` parses as UTC midnight. `LAST_UPDATED_FORMATTER` (line 19–23) has no `timeZone` option, so it formats in the local system timezone. Any system west of UTC (including EST = UTC-5) interprets UTC midnight as the prior day.
- **Fix**: Pass `timeZone: "UTC"` to `Intl.DateTimeFormat`:
  ```ts
  const LAST_UPDATED_FORMATTER = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  })
  ```
  This ensures the formatter renders in the same UTC context used when parsing. No change needed to the `new Date()` call. Add a Vitest unit test that asserts `formatLastUpdated("2026-05-14")` returns "May 14, 2026" when run in a system timezone that is UTC-5 or earlier.
- **Effort**: S
- **Screenshot**: cookies-tablet-portrait-light.png

---

#### [P1] Legal prose measure ~96ch at landscape (see cross-cutting pattern)

- **Specific where**: `src/components/legal/legal-layout.tsx:56` (`max-w-3xl`)
- **Screenshot**: cookies-tablet-landscape-light.png

---

### /privacy

**Captures reviewed**: privacy-tablet-portrait-light.png, privacy-tablet-portrait-dark.png, privacy-tablet-landscape-light.png, privacy-tablet-landscape-dark.png

---

#### [P1] "Last updated" TZ bug — same as /cookies

- **Where**: `src/components/legal/legal-layout.tsx:25–33`
- **Fix**: See /cookies fix. Single change to `LAST_UPDATED_FORMATTER` covers all legal pages.
- **Screenshot**: privacy-tablet-portrait-light.png

---

#### [P1] Legal prose measure ~96ch at landscape

- Same cross-cutting fix.
- **Screenshot**: privacy-tablet-landscape-light.png

---

#### [P2] "Last updated" rendered twice with disagreeing values

- **Symptom**: The privacy page shows the formatted (but off-by-one) date in the header eyebrow AND the raw ISO string `2026-05-14` in a trailing `<LegalSection id="last-updated">` at the bottom of the document (line 374 of `src/app/privacy/page.tsx`). Sighted users see two dates that disagree.
- **Where**: `src/app/privacy/page.tsx:374`, `src/components/legal/legal-layout.tsx:57–65` (header eyebrow)
- **Root cause**: The header already provides the "Last updated" date. Section 17/the trailing section duplicates it with raw ISO formatting.
- **Fix**: Remove the trailing `<LegalSection id="last-updated">` from `src/app/privacy/page.tsx`. The header eyebrow (once the TZ bug is fixed) is the canonical location for this date. If the section is legally required to appear in the body, replace the raw ISO with `{formatLastUpdated(LAST_UPDATED.PRIVACY)}` and remove the `<LegalSection>` wrapper so it reads as a simple paragraph — not a repeated `<h2>` heading drawing extra attention to the duplication.
- **Effort**: S
- **Screenshot**: privacy-tablet-portrait-light.png

---

### /terms

**Captures reviewed**: terms-tablet-portrait-light.png, terms-tablet-portrait-dark.png, terms-tablet-landscape-light.png, terms-tablet-landscape-dark.png

---

#### [P1] "Last updated" TZ bug — same as /cookies and /privacy

- **Where**: `src/components/legal/legal-layout.tsx:25–33`
- **Screenshot**: terms-tablet-portrait-light.png

---

#### [P1] Legal prose measure ~96ch at landscape

- Same cross-cutting fix.
- **Screenshot**: terms-tablet-landscape-light.png

---

#### [P2] "Last updated" rendered twice with disagreeing values — same as /privacy

- **Symptom**: Trailing section 17 ("17. Last updated") renders the raw ISO at the bottom of the /terms page while the header shows the formatted (off-by-one) date.
- **Where**: `src/app/terms/page.tsx` (final `<LegalSection>` block)
- **Fix**: Same as /privacy — remove or de-duplicate the trailing section. The numbered "17. Last updated" H2 heading draws extra attention to the mismatch because it appears after 16 substantive sections as an apparent peer-level item.
- **Effort**: S
- **Screenshot**: terms-tablet-portrait-light.png

---

#### [P2] Numbered section titles on /terms inconsistent with /cookies and /privacy

- **Symptom**: `/terms` uses numbered section titles ("1. Acceptance of these terms", "2. About the Service", …, "17. Last updated"). `/cookies` and `/privacy` use plain titles ("What we store", "Who we are"). When a user tabs between the three policy pages via footer links, the editorial inconsistency is jarring.
- **Where**: `src/app/terms/page.tsx` (all `<LegalSection>` title props)
- **Root cause**: Either /terms was authored separately or numbering was a deliberate choice for a longer document.
- **Fix**: See Open Questions. If the decision is "remove numbers": strip the numeric prefix from each title prop in `src/app/terms/page.tsx`. If "add numbers to all": add them to `/cookies` and `/privacy` as well. If "terms-only numbers are intentional" (e.g., for legal reference), document this in a code comment.
- **Effort**: S
- **Screenshot**: terms-tablet-portrait-light.png

---

### /not-found

**Captures reviewed**: not-found-tablet-portrait-light.png, not-found-tablet-portrait-dark.png, not-found-tablet-landscape-light.png, not-found-tablet-landscape-dark.png

*(Note: not-found-tablet-portrait-dark.png may show the /scholarships 404 page due to harness contamination — see QA harness note in Group 3. The findings below are based on Group 3's documented captures.)*

---

#### [P1] Spline loading state leaves no "404" indicator for up to several seconds

- **Symptom**: When Spline has not resolved and `prefers-reduced-motion` is not set, the only content visible is the pulsing-dot Suspense fallback (`size-12 animate-pulse rounded-full bg-surface-container`) at the center of the page. The "ERROR 404" eyebrow, "We couldn't find that page." heading, and the three CTA buttons are in the bottom portion of the page — but users on slow connections see nothing indicating they are on a 404 page until either the Spline resolves or the Motion entrance animations fire.
- **Where**: `src/components/ui/four-oh-four/not-found-client.tsx:166-170` (Suspense fallback)
- **Root cause**: The `splineFallback` is a presentational placeholder with no semantic or visual content.
- **Fix**: Replace the `splineFallback` with a static version of the `ZeroRing` SVG (already defined in the same file) wrapped in a centered container at the appropriate text size:
  ```jsx
  const splineFallback = (
    <div className="flex size-full items-center justify-center">
      <div className="text-[25vw] font-heading font-bold text-primary/20 select-none"
           aria-hidden="true">
        <span>4</span>
        <ZeroRing reduced />
        <span>4</span>
      </div>
    </div>
  )
  ```
  This renders an immediate, dim 404 indicator that communicates the error state without motion, then is replaced by the Spline scene once it resolves.
- **Effort**: S
- **Screenshot**: not-found-tablet-portrait-light.png

---

#### [P1] Theme/Spline URL desync produces visual seam on rapid theme toggle

- **Symptom**: When `localStorage.theme` disagrees with `document.documentElement.classList`, the Spline scene URL (keyed off `resolvedTheme` from next-themes) can be the dark variant while the page surface is light (or vice versa). This produces a horizontal seam at the bottom of the Spline canvas where the 3D scene's background color meets the page surface.
- **Where**: `src/components/ui/four-oh-four/not-found-client.tsx:155-194`
- **Root cause**: `resolvedTheme` from `useTheme()` and the `<html>` class can briefly disagree during `disableTransitionOnChange` or on a fast double-toggle. The Spline scene URL is derived from `resolvedTheme` while the page surface color is derived from the CSS class.
- **Fix**: Add a brief opacity transition on the Spline container (200ms ease-out) so that theme switches do not produce a hard seam visible to the eye — the scene fades out and back in during the URL swap. The existing `key={resolvedTheme}` on `<SplineScene>` already forces a remount on theme change; wrapping the container in `<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>` on each `key` change achieves this. Additionally, guard `splineUrl` so it only updates after `mounted === true` to prevent the pre-mount light-scene showing on a dark-mode first load.
- **Effort**: S
- **Screenshot**: not-found-tablet-landscape-light.png

---

#### [P2] Global footer below `min-h-screen` main doubles page height

- **Symptom**: The 404 page `<main>` uses `min-h-screen`. The global `<Footer>` from `src/app/layout.tsx:59` renders below it. At tablet portrait the combined height is ~1536px (2× viewport), forcing users to scroll past the footer wordmark "Modern Scholar" to reach the bottom — or more likely, users see blank space after the CTAs and are confused.
- **Where**: `src/components/ui/four-oh-four/not-found-client.tsx:173` (`min-h-screen`)
- **Root cause**: `min-h-screen` is intended to fill the viewport with the 404 experience, but the footer is appended to the body below it by the root layout.
- **Fix** (two options):
  - Option A: Change `min-h-screen` to `min-h-[calc(100dvh-theme(spacing.20))]` to leave room for an approximate footer height. This keeps the footer visible just below the fold at a one-scroll distance.
  - Option B: Suppress the global footer on the 404 route by adding a route-segment layout at `src/app/not-found.tsx` that does not wrap children in the default `PageShell` + `Footer`. This requires restructuring the root layout to be more composition-friendly — higher effort.
  Option A is recommended as the expedient fix; Option B is the correct architectural answer if the footer is confirmed non-desired on error pages.
- **Effort**: S (Option A), M (Option B)
- **Screenshot**: not-found-tablet-portrait-dark.png

---

#### [P3] Decorative "404" glyph is purely visual with no ARIA announcement

- **Symptom**: The large "404" rendered by the Spline scene (canvas) or `ZeroRing` SVG is `aria-hidden="true"` on all wrappers. Screen readers announce: "Error 404 [pause] We couldn't find that page." The visual "404" is not announced.
- **Where**: `src/components/ui/four-oh-four/not-found-client.tsx:177–196`
- **Root cause**: Intentional design — the "404" glyph is decorative; the H1 and eyebrow carry the semantic meaning.
- **Fix**: This is acceptable as-is. The eyebrow "Error 404" (line 200–207) is the programmatic announcement. Document with a code comment explaining that the large 404 glyph is `aria-hidden` because the eyebrow provides the same information to AT users. No code change required; annotate the intentional decision.
- **Effort**: S (documentation only)
- **Screenshot**: not-found-tablet-portrait-light.png

---

## Remediation Plan (Ordered)

### Sprint 1 — Ship-blockers (P0 + cross-cutting P1)

1. **[P0] Home dark landscape crash** — Investigate and add section-level error boundaries in `src/app/(home)/page.tsx`; instrument `hero-section.tsx` Spline URL resolution. `src/app/(home)/page.tsx`, `src/components/home/hero-section.tsx`. Effort: M.

2. **[P1] `formatLastUpdated()` TZ bug** — Add `timeZone: "UTC"` to `LAST_UPDATED_FORMATTER`. Add Vitest unit test. `src/components/legal/legal-layout.tsx:19–23`. Effort: S.

3. **[P1] Global focus ring** — Add `:focus-visible` rule to `src/app/globals.css`. Audit `outline-none` usage in header and footer components. Effort: S.

4. **[P1] Prose measure — blog detail** — Change `max-w-prose` to `max-w-[65ch]` in `src/components/blog/blog-detail-content.tsx:55`. Effort: S.

5. **[P1] Prose measure — legal pages** — Change `max-w-3xl` to `max-w-2xl` in `src/components/legal/legal-layout.tsx:56`. Effort: S.

6. **[P1] Reading-progress TOC button height (16px)** — Restructure TOC items in `src/components/blog/reading-progress.tsx` to `min-h-[44px]` row buttons. Effort: S.

7. **[P1] 404 Suspense fallback — add 404 indicator** — Replace pulsing dot with static ZeroRing in `src/components/ui/four-oh-four/not-found-client.tsx:166-170`. Effort: S.

8. **[P1] Contact MobileContactImage dark theme source mismatch** — Convert to `useTheme()` in `src/components/contact/contact-form-section.tsx:152-176`. Effort: S.

9. **[P1] Scholarship card grid 4-column → 3-column at md** — Change grid breakpoints in `src/components/scholarships/scholarship-grid.tsx` (and confirm in `scholarship-card.tsx`). Effort: S.

---

### Sprint 2 — Per-route P1s

11. **[P1] Home H1 semantic level** — Change `<h2>` to `<h1>` in `src/components/home/hero-section.tsx:88–93` and restructure "Modern Scholar" sr-only heading. Effort: S.

12. **[P1] 404 theme/Spline desync seam** — Add Motion opacity fade on Spline container keyed to `resolvedTheme` in `not-found-client.tsx`. Effort: S.

13. **[P1] Blog detail article heading H1→H3 skip** — Decide Option A (edit MDX source) or Option B (remap h3→h2 in `mdx-components.tsx`). Effort: S.

14. **[P1] Blog detail cover image too tall at landscape sidebar layout** — Add `max-h-80 md:max-h-[50vh]` to image wrapper in `src/components/blog/blog-detail-content.tsx:46`. Effort: S.

---

### Sprint 3 — P2 Polish

15. **[P2] Touch targets — sitewide sweep** — Footer nav (`py-2.5 min-h-[44px]`), header nav, blog card CTAs, filter chips, carousel arrows. Multiple files. Effort: M.

16. **[P2] AnimatedLines H1 accessibility tree duplication** — Add `sr-only` text + `aria-hidden` in `animated-lines.tsx` for heading usage. `src/components/ui/animatedLines/animated-lines.tsx`. Effort: S.

17. **[P2] Legal duplicate "Last updated" on /privacy and /terms** — Remove trailing `<LegalSection id="last-updated">` from `src/app/privacy/page.tsx` and `src/app/terms/page.tsx`. Effort: S.

18. **[P2] Contact hero font-weight** — Change `font-normal` → `font-bold` in `src/components/contact/contact-hero.tsx:14`. Effort: S.

19. **[P2] Contact card hard-coded hex colors → surface tokens** — Replace `bg-[#f9edea]` / `dark:bg-[#140f0e]` with `bg-surface-container-lowest dark:bg-surface-container` in `src/components/contact/contact-form-section.tsx:203`. Effort: S.

20. **[P2] Contact page `min-h-screen` → `min-h-dvh` or `grow`** — `src/app/contact/page.tsx:16`. Effort: S.

21. **[P2] 404 footer doubling page height** — Change `min-h-screen` to `min-h-[calc(100dvh-5rem)]` in `not-found-client.tsx:173` or add route-segment layout. Effort: S/M.

22. **[P2] Blog featured card gradient overlay** — Increase gradient opacity/depth in `blog-card-featured.tsx`. Effort: S.

23. **[P2] Featured scholarships section height at portrait** — Change `h-dvh` to `min-h-[600px] md:h-dvh` in `src/components/home/featured-scholarships.tsx:16`. Effort: S.

24. **[P2] Blog grid column count at tablet** — Confirm and fix `md:grid-cols-2 lg:grid-cols-3` in `src/components/blog/blog-grid.tsx`. Effort: S.

25. **[P2] Compare chip overflow on scholarship card at 4-up** — Fix via grid column count change (item 10) or explicit `overflow-hidden` on card wrapper. Effort: S.

---

### Backlog — P3 Nits

26. **[P3] Font/CSS preload set trimming** — Audit and narrow `link rel="preload"` set in Next.js `layout.tsx` font declarations. Effort: M.

27. **[P3] Hero `SplineFallback` → calm tonal placeholder** — Replace pulsing circle with `bg-surface-container-low` static div in `hero-section.tsx:24-28`. Effort: S.

28. **[P3] Home hero CTA breakpoint shift (`md:flex-row` → `lg:flex-row`)** — `src/components/home/hero-section.tsx:77`. Effort: S.

29. **[P3] Scholarship pagination touch targets** — Add `min-h-[44px] min-w-[44px]` to `pagination-ink-spread.tsx`. Effort: S.

30. **[P3] Contact nudge arrow layout at portrait** — Add `flex-col gap-2 sm:flex-row` to CTA row in `contact-form-section.tsx:247`. Effort: S.

31. **[P3] /terms section numbering decision** — See Open Questions Q3. Effort: S once decided.

32. **[P3] 404 decorative glyph ARIA comment** — Document intentional `aria-hidden` in `not-found-client.tsx`. Effort: S.

33. **[P3] Footer logo `priority` prop** — Add `priority` to `<Image>` elements in `src/components/ui/footer/footer.tsx` to silence LCP warning. Effort: S.

34. **[P3] Blog card category chip padding** — Ensure category chip on featured card has `px-2 py-1` minimum padding from card boundary. `src/components/blog/blog-card-featured.tsx`. Effort: S.

---

## Verification Plan

After each sprint, re-capture the affected routes at both viewports × both themes. Specific checks:

### Sprint 1 verification
- **Home dark landscape**: Navigate to `/` in dark mode at 1024×768. Confirm the full page renders — no error boundary, Spline scene visible or fallback placeholder showing, heading + CTA present.
- **Blog bad slug**: Navigate to `/blog/this-slug-definitely-does-not-exist-xyzzy`. Confirm either the bespoke blog 404 or global 404 renders — no Next.js runtime error overlay. Title should not be empty.
- **Legal dates**: Open each of `/cookies`, `/privacy`, `/terms`. Confirm "Last updated" in the header eyebrow reads "May 14, 2026" (not May 13). Confirm `<time datetime>` attribute also reads `2026-05-14`. Run Vitest test for `formatLastUpdated("2026-05-14")` in a UTC-5 environment.
- **Focus ring**: Tab through `/` and `/blog` in Chrome. Confirm a visible outline appears on every interactive element (logo, nav links, CTA buttons, footer links). Check against WCAG 2.4.7.
- **Prose measure**: Open `/blog/how-to-write-a-winning-scholarship-essay` at 1024×768. Measure article paragraph width in DevTools — should be ≤65ch (≤1040px at 16px base, but the 65ch wrapper should constrain to ~650px).
- **404 Suspense fallback**: Throttle network to Slow 3G. Navigate to `/this-route-does-not-exist`. Confirm "404" is visible within 1 second, before Spline resolves.
- **Contact image dark**: Switch to dark mode at 768×1024. Navigate to `/contact`. Confirm the static phone image uses the dark variant.
- **Scholarship grid**: Open `/scholarships` at 1024×768. Confirm 3 columns render, not 4. Confirm no card title is clipped mid-word.

### Sprint 2 verification
- **Home H1**: Use a screen reader or axe DevTools on `/`. Confirm the page has exactly one H1 — "Modern Scholar" (or "Your scholarship journey starts here" if restructured). Confirm no duplicate heading text in the accessibility tree.
- **Blog heading hierarchy**: Run axe or HeadingsMap extension on `/blog/how-to-write-a-winning-scholarship-essay`. Confirm in-article sections are H2, not H3.
- **Blog image height**: Open `/blog/<slug>` at 1024×768. Confirm the cover image is no taller than `50vh` (~384px at landscape) and the article prose begins within the initial viewport.

### Sprint 3 verification
- **Touch targets**: Run Lighthouse accessibility audit or a manual tap-target sweep on `/blog`, `/contact`, `/scholarships`, and all footer nav links. Target: zero controls under 44×44px.
- **AnimatedLines duplication**: `document.querySelector('h1').textContent` should return "Scholarships", "Blogs", "Contact Us" (not the doubled string) on respective pages.
- **Legal page date deduplication**: Scroll to bottom of `/privacy` and `/terms`. Confirm "Last updated" appears only in the header eyebrow, not again at the bottom.
- **404 page height**: Navigate to `/this-route-does-not-exist` at 768×1024. Confirm the page is approximately 1 viewport tall — footer should be visible with one short scroll, not two full-viewport scrolls.

### Ongoing
- Re-run the 40-capture matrix after Sprint 1 is merged. Compare against this baseline for any regressions.
- Add Playwright tests for: (a) `formatLastUpdated` cross-TZ correctness, (b) blog bad-slug renders a 404 UI (not error overlay), (c) home page dark mode at 1024×768 renders without error boundary.

---

## Open Questions / Decisions Needed

**Q1 — Should the global footer appear on error pages (/not-found, /error)?**
Currently the root layout unconditionally renders `<Header>`, `<PageShell>`, and `<Footer>` for all routes including the 404 and error boundary pages. The footer's large "Modern Scholar" wordmark adds ~450px of height below the 404 CTAs, producing a confusing double-page experience. The three CTA buttons already provide navigation — a footer may be redundant and visually distracting on error pages. Consider suppressing the footer on routes that explicitly use `min-h-screen` content. **Who decides**: Design + product owner.

**Q2 — Legal page section numbering: harmonize or preserve terms-only numbering?**
`/terms` uses numbered section titles (1–17); `/cookies` and `/privacy` do not. Three options:
- Number all three (consistent, useful for legal reference).
- Remove numbers from `/terms` (consistent, simpler).
- Leave terms numbered, document it as intentional (acknowledges the inconsistency; acceptable if /terms is seen as a more formal legal document).
**Who decides**: Product owner or legal contact. This is a P2 polish issue and does not block shipping.

**Q3 — `reactStrictMode: false` reversion**
`next.config.ts` disables React Strict Mode to work around a `LogoLoader` animation restart bug. The comment notes this is a temporary workaround with a TODO to make `LogoLoader` restart-tolerant. Strict Mode's double-invocation check would have made the home dark landscape crash more reproducible and easier to diagnose. Recommend prioritizing the `LogoLoader` fix so Strict Mode can be re-enabled. **Who decides**: Engineering lead.

**Q4 — MDX post heading convention (H2 vs H3)**
In-post section headings use `###` (H3) in MDX source. At the article level these should be H2. Decision: either update the authoring convention (Option A) or remap in `mdx-components.tsx` (Option B). Option B is simpler for authors but prevents any legitimate nested H3 usage within a post. Option A is correct semantically but requires migrating existing posts. **Who decides**: Content lead (Catherine Dumenu) + engineering.
