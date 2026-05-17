# QA Findings — Group 3 (Legal & 404)

**Branch / Commit**: `feature/legal-pages` @ `857f8c0`
**Scope**: tablet-portrait (768×1024) and tablet-landscape (1024×768), light + dark themes
**Routes audited**:
1. `/cookies`
2. `/privacy`
3. `/terms`
4. `/this-route-definitely-does-not-exist-xyzzy` (root `not-found.tsx`)

---

## Captures Inventory

All 16 required captures produced in `Brain/PRDs/05_16_2026/screenshots/`. Width verified via `sips -g pixelWidth`.

| Route | Portrait Light | Portrait Dark | Landscape Light | Landscape Dark |
|---|---|---|---|---|
| `/cookies` | `cookies-tablet-portrait-light.png` (768×2965) | `cookies-tablet-portrait-dark.png` (768×2965) | `cookies-tablet-landscape-light.png` (1024×2765) | `cookies-tablet-landscape-dark.png` (1024×2765) |
| `/privacy` | `privacy-tablet-portrait-light.png` (768×5212) | `privacy-tablet-portrait-dark.png` (768×5212) | `privacy-tablet-landscape-light.png` (1024×4954) | `privacy-tablet-landscape-dark.png` (1024×4954) |
| `/terms` | `terms-tablet-portrait-light.png` (768×5608) | `terms-tablet-portrait-dark.png` (768×5608) | `terms-tablet-landscape-light.png` (1024×5194) | `terms-tablet-landscape-dark.png` (1024×5194) |
| 404 | `not-found-tablet-portrait-light.png` (768×1536) | `not-found-tablet-portrait-dark.png` (768×1536) | `not-found-tablet-landscape-light.png` (1024×1152) | `not-found-tablet-landscape-dark.png` (1024×1152) |

Note on the 404 captures: reduced-motion was active during some captures (causing the static ZeroRing SVG to render instead of the Spline 3D scene) and inactive during others (Spline rendered). Both states are documented under findings.

---

## Test Environment Oddities

Two environmental issues fought every capture cycle and must be flagged before any future tablet QA pass uses this dev server:

1. **Parallel agent contention on the shared Playwright session.** This audit ran alongside Groups 1 and 2, which share the same browser instance and competed for the active tab / viewport / theme / URL. Symptoms included:
   - Spontaneous navigation to `/`, `/blog`, `/blog/this-slug-definitely-does-not-exist-xyzzy`, individual blog post slugs, and `about:blank` between my sequential tool calls — even when I had not touched the URL.
   - Viewport silently reset between my `browser_resize` and the subsequent `browser_take_screenshot`, producing mislabeled-width artifacts (had to re-capture three times for some files; final files verified via `sips -g pixelWidth`).
   - `localStorage` cleared / theme flipped between my eval and my screenshot.
   - `prefers-reduced-motion` toggled between captures (likely a parallel `MotionConfig` mutation), changing whether the 404 page rendered the Spline canvas or the static `ZeroRing` SVG fallback.
   - Multiple instances of `Execution context was destroyed, most likely because of a navigation` errors mid-eval.
2. **Server-side runtime error from a parallel-agent route.** The console captured a real 500-class error (NOT in my scope, but visible in the dev overlay and surfaced as an `<iframe>` overlay across multiple of my screenshots):
   ```
   Error: Page "/blog/[slug]/page" is missing param "/blog/[slug]" in
   "generateStaticParams()", which is required with "output: export" config.
   ```
   This bubbled out of `next-dev-server.js:594`. The blog `[slug]` dynamic route is incompatible with `output: export` unless all slugs are statically declared. Worth its own ticket — it means `/blog/<any-invalid-slug>` returns a 500 in dev rather than rendering the local `not-found.tsx`. Logged here because it polluted my console output, not because it is mine to fix.

Workaround for future audits: serialize the tablet groups (one at a time), or spin up dedicated dev servers per group on different ports.

---

## Findings

### /cookies

#### tablet-portrait light (768×1024)

- 🟠 **P1 — "Last updated" date is off by one day.** Header eyebrow renders `May 13, 2026` for ISO `2026-05-14`. The `<time datetime="2026-05-14">` attribute is correct, but the visible text is wrong. Root cause: `formatLastUpdated()` in `src/components/legal/legal-layout.tsx:28` parses the ISO with `new Date(`${iso}T00:00:00Z`)` (UTC midnight) and then formats with the default locale Intl formatter, which uses **local time** — so any timezone west of UTC renders the prior day. Reproduces in all four cookies captures. Same bug surfaces on `/privacy` and `/terms` header eyebrows.
  - Evidence: `lastUpdatedText="May 13, 2026"`, `lastUpdatedDateTime="2026-05-14"` from `document.querySelector('header time')` eval.
  - Component file: `src/components/legal/legal-layout.tsx`
- ✅ Heading hierarchy clean: 1× H1 (`Cookie Policy`, Noto Serif 36 px), 6× H2 (Noto Serif 24 px), 0× H3. No skipped levels.
- ✅ TL;DR `<aside aria-label="Summary">` renders with `border-l-4 border-primary` + `bg-surface-container` (cream `oklch(0.949 0.0136 34)`).
- ✅ `<table>` of localStorage rows fits 704 px article width without horizontal scroll. Wrapper has `overflow-x: auto`, so it degrades safely on narrower viewports.
- ✅ Footer line (`border-t border-on-surface/10`) renders above the contact `<a mailto:>` link; mailto link uses primary terracotta `oklch(0.563 0.1256 30.7)` underlined.
- ✅ No overflow: `documentElement.scrollWidth === clientWidth === 768`.

#### tablet-portrait dark (768×1024)

- 🟠 **P1 — same date bug** (header reads `May 13, 2026`).
- ✅ Body bg `oklch(0.175 0.008 25)`, paragraph color `oklch(0.75 0.015 28)` — contrast looks good (rough WCAG AA pass for body text).
- ✅ Aside bg `oklch(0.28 0.01 28)` with primary-tinted border, readable.
- ✅ Table header bg `oklch(0.28 0.01 28)` (container surface), cells have `border-outline-variant` — table reads cleanly in dark mode.
- ✅ No overflow.

#### tablet-landscape light (1024×768)

- 🟠 **P1 — text measure exceeds readable bound.** Body paragraph width = 768 px (article `max-w-3xl` = 48 rem). At `text-base` (16 px) with default `~0.5em` glyph width that's ~96 ch per line — over the 60–75 ch target the brief calls out. Becomes fatiguing on the long sections (e.g. "How to clear what we store" Chrome/Safari/Firefox bullet items). Same bound applies on `/privacy` and `/terms` in landscape.
  - Evidence: `articleWidth=768, paraWidth=768, paraCh≈96`.
  - Component file: `src/components/legal/legal-layout.tsx:56` (`max-w-3xl`).
- 🟠 **P1 — same date bug.**
- ✅ All sections render; no overflow; table fits cleanly.

#### tablet-landscape dark (1024×768)

- 🟠 **P1 — same date + measure bugs.**
- ✅ Otherwise identical to landscape light, dark surface variant.

---

### /privacy

#### tablet-portrait light (768×1024)

- 🟠 **P1 — date bug (header).** Same `formatLastUpdated()` issue: `May 13, 2026` visible, `2026-05-14` in datetime attr.
- 🟡 **P2 — duplicate / inconsistent "Last updated" rendering.** This page renders the date in TWO places with TWO different formats:
  - Header eyebrow → `May 13, 2026` (long-form, off-by-one)
  - Section 17 `<LegalSection id="last-updated">` → renders the raw ISO `2026-05-14` (no Intl formatting) inside `<time dateTime="2026-05-14">2026-05-14</time>` at line 374 of `src/app/privacy/page.tsx`.
  This creates the bizarre user experience of seeing one date in the header and a different (raw ISO) string at the bottom — and the two disagree because of the timezone bug. Either reuse `formatLastUpdated()` in the footer section or drop the redundant `<LegalSection id="last-updated">` block (the header already shows the date).
- ✅ Heading hierarchy: 1× H1, 11× H2, 2× H3 ("If you're in the EU or UK (GDPR)" and "If you're in California (CCPA / CPRA)"). H3 uses Noto Serif at 20 px (`text-xl`), as `legal-subsection.tsx:29` specifies. No skipped levels.
- ✅ `<Callout type="tip">` (children's privacy section, "Parents and guardians may email us…") renders as a separate `<aside aria-label="Tip">` with tinted background `oklab(0.911 -0.0235 0.0152 / 0.4)` — proper a11y label.
- ✅ Nested `<ul>` ("theme", "ms-comparison", "ms-settings" under "What we collect") uses `list-[circle]` style — distinguishable from parent disc bullets.
- ✅ No overflow.

#### tablet-portrait dark (768×1024)

- 🟠 **P1 — header date bug.**
- 🟡 **P2 — duplicate-date inconsistency in section 17.**
- ✅ All callouts re-tint for dark mode; nested ul circles remain legible.

#### tablet-landscape light (1024×768)

- 🟠 **P1 — date bug, measure bug** (`paraCh≈96`).
- 🟡 **P2 — duplicate-date inconsistency.**

#### tablet-landscape dark (1024×768)

- Same trio of P1/P2 findings as above.

---

### /terms

#### tablet-portrait light (768×1024)

- 🟠 **P1 — header date bug** (`May 13, 2026` for `2026-05-14`).
- 🟡 **P2 — same duplicate "Last updated" pattern as `/privacy`.** Section 17 of `/terms` (the last `LegalSection`) renders the raw ISO at the bottom, while the header shows the formatted (and off-by-one) date. Visually noisier than `/privacy` because terms has 17 numbered sections and the final "17. Last updated" heading sits below 16 substantive sections, drawing extra eye-attention to the mismatch.
- 🟡 **P2 — section-numbering inconsistency vs the other two policies.** `/cookies` and `/privacy` use short section titles ("What we store", "Who we are"). `/terms` uses numbered titles ("1. Acceptance of these terms", "2. About the Service", …, "17. Last updated"). Not a functional bug, but the editorial inconsistency stands out when the user tabs between the three policies via the footer. Flagging for product owner: either number all three or none.
- ✅ Heading hierarchy: 1× H1, 17× H2, 0× H3 — flat structure, fine for the doc.
- ✅ `<Callout type="warning">` (section 4 "Scholarship data disclaimer") renders as `<aside aria-label="Warning">` with warm-tinted background — appropriate severity treatment for an as-is disclaimer.
- ✅ No overflow.

#### tablet-portrait dark (768×1024)

- 🟠 **P1 — date bug.**
- 🟡 **P2 — duplicate-date pattern, section-numbering inconsistency.**
- ✅ Warning callout shifts to a darker red-tinted background `oklab(0.351 0.0609 0.0366 / 0.4)` — legible.

#### tablet-landscape light (1024×768)

- 🟠 **P1 — date bug, measure bug** (`paraCh≈96`, same `max-w-3xl` cap).
- 🟡 **P2 — duplicate-date, numbering inconsistency.**

#### tablet-landscape dark (1024×768)

- Same combo of P1/P2 findings.

---

### /not-found (root `not-found.tsx`)

#### tablet-portrait light (768×1024)

- 🟠 **P1 — Spline 3D scene is non-deterministic.** Across my captures the 404 hero rendered three different ways:
  1. **Spline scene visible** (light version: tall pinkish-cream 4-0-4 with 3D depth). Earliest portrait-light run.
  2. **Static reduced-motion fallback** (red 4-0-4 with `ZeroRing` SVG ellipse for the `0`). Triggered when `window.matchMedia('(prefers-reduced-motion: reduce)').matches === true`. This is the intended fallback per `not-found-client.tsx:46-80` and lines 209-215 — accessibility win when it triggers correctly.
  3. **Loading state stuck** (small dark "loading" dot in place of the 404 hero, with the rest of the page content not yet faded in). The Suspense fallback at `not-found-client.tsx:166-170` is what's showing — meaning the Spline scene never resolved within the screenshot window.
  The deterministic states (1 + 2) are fine; the indeterminate state (3) is a real issue — users who arrive with motion enabled and a slow Spline load see only a tiny dark circle for several seconds with no 404 messaging visible. Consider showing the static `ZeroRing` SVG as the Suspense fallback so that there's *some* 404 marker before Spline resolves.
  - Component file: `src/components/ui/four-oh-four/not-found-client.tsx:166-194`
- 🟡 **P2 — footer is rendered below the 404 main, doubling page height.** `not-found.tsx` is wrapped in `PageTransition` inside `RootLayout`, which always renders `<Header>`, `<PageShell>{children}</PageShell>`, `<Footer>`. The 404 `<main>` uses `min-h-screen`, so the user's viewport is filled by the 404 hero — but the global footer ("Cookie Policy" link, copyright, big "Modern Scholar" wordmark) sits *below* the min-h-screen container. At tablet portrait the page becomes 1536 px tall for what is essentially "page not found". Either:
  - Drop the footer for 404 routes (would require a route-segment layout override), or
  - Replace `min-h-screen` with `min-h-[calc(100vh-footer-height)]` so the footer fits inside the viewport.
  Worth a product call — the wordmark visible below is striking but probably unintentional for an error page.
- 🟡 **P2 — no `<h1>`-level "404" text.** The visible "404" is either a Spline scene (decorative `<canvas>`) or the `ZeroRing` SVG (`aria-hidden="true"`). The actual `<h1>` is the headline "We couldn't find that page." A screen reader user therefore hears: "Main · Error 404 [paragraph] · We couldn't find that page [heading 1] · The link may be broken …". That's actually reasonable, but document it: the prominent "404" glyph is purely visual, not announced.
- ✅ Three CTAs rendered at the bottom:
  - `Return Home` → `/` (44 px tall, hits touch-target minimum)
  - `Browse Scholarships` → `/scholarships` (44 px)
  - `Read the Blog` → `/blog` (44 px)
- ✅ At 768 portrait, the header collapses to mobile mode (single brand glyph + hamburger menu) — expected (md breakpoint is 768, so at exactly 768 the desktop nav narrowly fits or just collapses depending on min-width).
- ✅ ARIA: `aria-hidden="true"` on the floating-icon decorative layer (when motion is enabled) and on the `ZeroRing` SVG fallback — both correct.

#### tablet-portrait dark (768×1024)

- 🟠 **P1 — same Spline non-determinism**, sometimes loaded (dark version: maroon 4-0-4 floating on the dark surface) and sometimes stuck on the loading dot.
- 🟡 **P2 — same footer-below-min-h-screen issue.** Dark theme version particularly noticeable: the "Modern Scholar" wordmark at the very bottom of `<Footer>` renders as a giant `oklch(0.28 …)` near-black glyph that's mostly invisible against the dark surface — but still occupies ~340 px of vertical space, so the user scrolls past a "blank" area after the CTAs.
- ✅ Header glass pill renders as `glass-elevated` cream-tinted (top-right hamburger button visible).

#### tablet-landscape light (1024×768)

- 🟠 **P1 — Spline non-determinism (same root cause).** Capture caught it both rendered (with the dark Spline maroon variant) AND a separate run rendered as static fallback. Either is acceptable end state; the failure mode is the Suspense loading dot.
- 🟠 **P1 — theme bleed when forcibly toggling theme on the 404 route.** When I set `<html>` to `light` while next-themes still considered the page dark (because I had set `localStorage.theme = 'dark'` previously and not gone through the `useTheme()` toggle), the page rendered with **the dark Spline scene URL on a light page background**, producing a clear horizontal seam roughly at the bottom of the 404 hero where the dark Spline backdrop ends and the cream `surface` begins. Reproduced via:
  ```js
  // While theme = dark via next-themes
  document.documentElement.classList.remove('dark');
  document.documentElement.classList.add('light');
  // Spline URL (computed from `resolvedTheme`) is still notFoundDark()
  ```
  This is a synthetic test path, not a real user gesture — but it exposes that the 404 component's Spline URL is keyed off `resolvedTheme` while the page surface is keyed off the `<html>` class. If next-themes ever leaves them out of sync (e.g. during the `disableTransitionOnChange` window or a fast double-toggle), users would see the same seam for a frame. Worth a confirmation pass: toggle the theme via the header switcher rapidly while on `/this-route-…-xyzzy` and watch for the seam between Spline backdrop and page surface.
  - Component file: `src/components/ui/four-oh-four/not-found-client.tsx:155-194`
- ✅ All three CTAs render in a horizontal row at landscape (vs. stacked at narrower portrait), per the `sm:flex-row` on the CTA container.

#### tablet-landscape dark (1024×768)

- 🟠 **P1 — Spline non-determinism** (caught the maroon 3D scene rendered cleanly).
- ✅ CTAs row, header glass pill, theme toggle, hamburger all render as expected.
- ✅ When fully loaded, the page has dark surface + dark Spline scene + cream "Modern Scholar" wordmark in footer — coherent.

---

## Severity Roll-up

| Severity | Count | Items |
|---|---|---|
| 🔴 P0 | 0 | — |
| 🟠 P1 | 5 distinct issues (all reproduced on every relevant capture) | "Last updated" off-by-one timezone bug (legal-layout); body text measure 96 ch at landscape (legal-layout); Spline non-deterministic loading state on 404; theme/Spline-URL desync race on 404; pre-existing `/blog/[slug]` 500 in dev (parallel-agent's scope, but observed) |
| 🟡 P2 | 4 distinct issues | duplicate "Last updated" rendering on `/privacy` and `/terms`; section-numbering inconsistency on `/terms` vs `/cookies`/`/privacy`; 404 footer rendered below `min-h-screen` (page doubles in height with mostly-empty content below CTAs); 404 "404" glyph is `aria-hidden` decoration only |
| 🔵 P3 | 0 | — |

---

## Responsive Matrix

| Viewport | `/cookies` | `/privacy` | `/terms` | `/not-found` |
|---|---|---|---|---|
| 768 × 1024 light | ⚠️ date | ⚠️ date + duplicate | ⚠️ date + duplicate + numbering | ⚠️ Spline race |
| 768 × 1024 dark | ⚠️ date | ⚠️ date + duplicate | ⚠️ date + duplicate + numbering | ⚠️ Spline race + footer bleed |
| 1024 × 768 light | ⚠️ date + measure | ⚠️ date + duplicate + measure | ⚠️ date + duplicate + numbering + measure | ⚠️ Spline race + theme seam |
| 1024 × 768 dark | ⚠️ date + measure | ⚠️ date + duplicate + measure | ⚠️ date + duplicate + numbering + measure | ⚠️ Spline race |

Legend: ✅ pass; ⚠️ pass with issues listed; ❌ broken.

No P0 layout breakage. No horizontal overflow on any route at any tablet size — `document.documentElement.scrollWidth === clientWidth` on every capture. All four routes are usable; the issues are correctness (date), typography (measure), and 404 polish.

---

## Accessibility Audit

- **Keyboard nav** (probed on `/cookies` tablet-portrait light):
  - First Tab focuses `<a href="#main-content">Skip to content</a>` — present and visually focusable (1 px outline `oklab(0.669 …)`). ✅
  - All `<a mailto:>` instances reachable; underline + primary color used as focus / link affordance.
- **Heading hierarchy**:
  - `/cookies`: 1 H1 → 6 H2. ✅
  - `/privacy`: 1 H1 → 11 H2 → 2 H3. ✅
  - `/terms`: 1 H1 → 17 H2 → 0 H3. ✅
  - `/not-found`: 1 H1 → 0 H2 → 0 H3 (heading is the "We couldn't find that page." copy, not the glyph). ✅
- **Time semantics**: every "Last updated" wraps the date in a `<time datetime="2026-05-14">`, so even though the visible text is off by one, programmatic readers get the correct date. Mixed blessing — assistive tech and search engines see the right date, sighted users see the wrong one.
- **Landmarks**: every legal page has `<main>` → `<article>` → `<header>` / `<aside aria-label="Summary">` / `<footer>`. Reader landmarks announce sensibly.
- **Callouts**: `Callout` component renders as `<aside aria-label="Tip">` / `<aria-label="Warning">` — labelled. ✅
- **Reduced motion**: `not-found-client.tsx` checks `useReducedMotion()` and renders the static `ZeroRing` SVG fallback when true, skipping both the floating icons and the Spline backdrop. ✅
- **Reduced transparency / `prefers-contrast: more`**: not directly tested in this audit. Recommend a follow-up pass — the header pill on legal pages uses `glass-elevated` per the design system and may need fallbacks.
- **Touch targets** on 404 CTAs: all 3 are exactly 44 px tall (`size=default` button). ✅
- **Decorative images**: `<canvas>` is in a container with `aria-hidden="true"`. ✅

---

## Console Errors / Warnings Summary

Per-route console snapshot, captured immediately after navigate (errors only):

| Route | Errors | Warnings (sample) |
|---|---|---|
| `/cookies` | 0 | 6× font preload "not used within a few seconds" (the standard Next.js dev font-preload nag) |
| `/privacy` | 0 | same font preload warnings |
| `/terms` | 1 | **`Can't perform a React state update on a component that hasn't mounted yet. … Move this work to useEffect instead.`** — surfaced via `webpack-internal:///.../intercept-console-error.js`. Not directly attributable to a terms-specific component from the trace; likely a header / theme / smooth-scroll setup race in the shared layout that happens to surface on certain navigation orderings. Worth investigating — this is a real React anti-pattern warning, even if non-fatal. Did not reproduce 100% of the time. |
| `/not-found` | 1 in light portrait, 2 in landscape | Both are the parallel-agent's `/blog/[slug]` 500 leaking into the shared console (see Environment Oddities). Not from `not-found.tsx` itself. |

Notable warnings (across all four routes, font/preload genre):

```
The resource http://localhost:3000/_next/static/media/0484562807a97172-s.p.woff2?v=… was preloaded
using link preload but not used within a few seconds from the window's load event.
```

Repeated for ~6 woff2 files and one `global-error.css`. These are dev-mode noise but flag that the font preload set is wider than the page actually uses — at minimum a build-side opportunity to trim Next.js's auto-generated `<link rel="preload">` set.

---

## Interaction Probe Results

### Legal pages (`/cookies` chosen as representative — same `LegalLayout` underlies all three)

- **In-page anchor links**: 0 found. Sections all have `id="…"` (so `/cookies#what-we-store` works as a direct URL), but no TOC links inside the article. Could be additive — the brief mentions "table-of-contents / anchor links if present" — they aren't, which is fine for the doc length but worth a product call for `/terms` (17 sections) and `/privacy` (11 sections + 2 sub-sections) where a sticky TOC would meaningfully aid navigation at tablet sizes.
- **Tab order**: Skip-link is the first stop, then header nav, then main content, then footer links. Natural reading order. ✅
- **Section ordering**: Reads sensibly top-to-bottom. ✅
- **"Last updated" timestamp**: Renders (with the off-by-one bug noted above).

### `/not-found`

- **Spline scene loads**: Yes, when motion is enabled and the network resolves it. Captured both the light (cream/pink) and dark (maroon) variants successfully. Indeterminate Suspense loading state remains a P1.
- **Return-Home CTA**: `<a href="/">Return Home</a>` — anchor href set, would route correctly via Next.js `<Link>` wrapped in `ButtonLink`. (Did not execute the click to avoid further parallel-agent contention.)
- **Browse Scholarships CTA**: href `/scholarships`. ✅
- **Read the Blog CTA**: href `/blog`. ✅
- **Tab through focusable elements**: did not run a full tab loop here due to environment contention; all three CTAs are programmatically focusable per default `<a>` semantics, and the `ButtonLink` component has standard focus styles (confirmed via component import).

---

## Recommendations (for the UX agent — not implementing here)

1. **Fix `formatLastUpdated()` once** in `src/components/legal/legal-layout.tsx` — either parse without `T00:00:00Z` (`new Date(`${iso}T12:00:00`)` would dodge timezone-edge cases for any reasonable host TZ), or pass `timeZone: 'UTC'` into the Intl formatter so it formats in the same zone it parsed. Cascades to all three legal pages.
2. **De-duplicate "Last updated"** on `/privacy` and `/terms` — drop the trailing `<LegalSection id="last-updated">` or have it reuse `formatLastUpdated()` so both renderings agree.
3. **Cap `LegalLayout` article width tighter** at large breakpoints. `max-w-2xl` (42 rem ≈ 672 px) lands at ~84 ch and is still long; `max-w-prose` (~65 ch) would hit the readability target cleanly. Test at desktop too — at 1280 px+ the same `max-w-3xl` produces an even longer line.
4. **404 Suspense fallback** should pre-render the static `ZeroRing` SVG (or a CSS-only "404") instead of the current pulsing-dot fallback at `not-found-client.tsx:166-170`, so motion-enabled users on slow networks still see a 404 marker while Spline is fetching.
5. **404 footer**: decide whether the global footer belongs on the error page. If yes, fit the 404 main into `min-h-[calc(100vh-<footer-h>)]` instead of `min-h-screen` so the page doesn't tower at 2× viewport.
6. **Section numbering**: pick one convention across `/cookies`, `/privacy`, `/terms` — either all numbered or none.
7. **Investigate the unmounted-component React warning** triggered on `/terms` navigation. The warning is non-fatal but real and indicates a setState-during-render somewhere in the layout tree.

---

## Test Artifacts

- Screenshots: 16 files in `Brain/PRDs/05_16_2026/screenshots/<route>-tablet-<orientation>-<theme>.png`
- No Playwright tests added (this audit was exploratory, against the running dev server, not codified into the test suite). Recommend follow-up: add a Vitest snapshot for the `formatLastUpdated()` function with a TZ-shifted clock to lock the fix down.
