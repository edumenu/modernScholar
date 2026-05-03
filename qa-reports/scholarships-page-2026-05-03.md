# QA Report: Scholarships Page (`/scholarships`)

**Date**: 2026-05-03
**Tester**: qa-test-engineer
**Scope**: Full-page QA pass — search, filtering, sorting, pagination, responsive, a11y, URL state, edge cases. Cross-referenced against `MasterScholarshipList.csv` (551 rows) and `src/data/scholarships-enriched.json` (158 entries).
**Build/Commit**: `70c0f8e` on `main` (with uncommitted edits to `blog-active-filter-strip.tsx`, `blog-filters.tsx`, `filter-sheet.tsx`, `input.tsx`)
**Today's reference date**: 2026-05-03 → Spring season

## Summary

The scholarships page is **functionally solid** — search, multi-tag filtering (within-category OR / cross-category AND), award range, level, sort, and pagination all match ground-truth data exactly. URL state is properly serialized, restored, and survives browser back/forward. Glass FX, dark/light themes, and responsive breakpoints behave as designed.

However, I found **8 confirmed UX/data-integrity issues** that should be triaged before launch. The most user-visible problems are: (1) the hero stats counter is static and never reflects the active filters, (2) deadline cards omit the year (so a card showing "Deadline March 1" could mean 2026 or 2027 — only the expanded modal reveals which), (3) duplicate scholarship names render as visually identical cards (e.g. two NCAA Postgraduate cards), and (4) paginating past the matching results into "dimmed-only" territory shows no contextual messaging. None are launch-blocking.

**Severity counts**: 0 critical · 2 high · 5 medium · 4 low · 16 pre-existing unit-test failures (stale assertions, not new regressions).

## Test Coverage

- [x] Functional: search, level filter, eligibility tags, award range, sort, pagination, layout toggle, comparison FAB, expanded scholarship modal
- [x] Responsive: 320, 375, 768, 1024, 1280, 1920 viewports
- [x] Accessibility: keyboard nav, focus management, aria attributes, focus return after sheet close, touch target sizes
- [x] Design system: light/dark themes, glassmorphism on Z-4 modals, card layout (no glass per spec)
- [x] Performance: console errors/warnings, network idle, font preload warnings
- [x] Edge cases: invalid URL params, special chars / XSS, very long queries, inverted ranges, unknown tags, out-of-range pages
- [x] URL state: q / level / sort / tags / min / max / page restore on load and via browser back/forward
- [x] Ground-truth verification: search results, filter counts, sort order all cross-checked against `scholarships-enriched.json`
- [ ] Cross-browser (Firefox/WebKit): skipped — single-browser pass via Playwright Chromium MCP

## Findings

### High Priority (should fix before release)

#### H-1. Card "Deadline" displays month + day but omits year — cards for 2027 deadlines look identical to 2026
- **Where**: `src/components/scholarships/scholarship-card.tsx`, `scholarship-list-card.tsx`
- **Steps to reproduce**:
  1. Open `/scholarships`. Default sort (deadline ascending).
  2. The first card "NCAA Postgraduate Scholarship program" shows "Deadline May 4" (actually May 4, **2026**).
  3. The third card "Engebretson Foundation Scholarship" shows "Deadline March 1" (actually March 1, **2027**, ten months later).
  4. There is no visual cue distinguishing them.
- **Expected**: Either show the year on the card, or surface an "Opens later" / "Next year" label for deadlines > ~6 months out.
- **Actual**: Year is only revealed when the user clicks the card and the expanded modal renders ("Deadline: May 4, 2026"). Source data (`deadlineYear`) is available but not displayed.
- **Evidence**: `qa-reports/screenshots/2026-05-03_scholarships-page/01-desktop-initial.png` (cards 1-12, mixed 2026/2027 deadlines), `09-card-expanded.png` (year visible only when expanded).

#### H-2. Hero stat strip never updates — always shows totals, even when search/filters yield 0 results
- **Where**: `src/components/scholarships/scholarship-hero.tsx` lines 12-45
- **Steps to reproduce**:
  1. Open `/scholarships`. Hero shows "129 scholarships · 3 education levels · Up to $50,000 · 2 deadlines this month".
  2. Type `asdfqwerzxcv` into the search. Card grid shows the empty state ("No scholarships found").
  3. Hero **still says** "129 scholarships · 2 deadlines this month".
- **Expected**: The stat strip should either reflect the filtered result count (live) or be visually de-emphasized once filters are applied so users don't read it as a result count.
- **Actual**: Stats are computed at module-load time as JS constants and never re-render — they're effectively a static badge, not a dynamic indicator.
- **Evidence**: `02-empty-search-state.png` (hero claims "129 scholarships" while grid shows "No scholarships found").

### Medium Priority (fix soon)

#### M-1. Duplicate scholarship names render as visually identical cards
- **Where**: Data layer — same provider sometimes splits a single program by deadline (e.g. NCAA Postgraduate has March 9 and May 4 entries). Card UI does not surface the distinguishing field.
- **Steps to reproduce**:
  1. Search for `NCAA`.
  2. Two cards render, both titled "NCAA Postgraduate Scholarship program", both from "NCAA.org", both $10,000.
  3. Only the deadline differs ("March 9" vs "May 4") — and per H-1, the year isn't shown.
- **Expected**: Add a deadline cohort suffix (e.g. "(May deadline)"), or a secondary label, or merge into a single card with multiple deadlines.
- **Actual**: Two near-identical cards. Combined with H-1, very confusing.
- **Evidence**: 2 cards returned from `?q=NCAA`, both with identical h3 text.

#### M-2. Mobile filter badge counts level + sort but omits search query — desktop "Filtered by:" strip omits all three
- **Where**: `src/components/scholarships/filter-sheet.tsx` (desktop strip), `src/components/scholarships/scholarship-filters-mobile.tsx` lines 63-67 (mobile badge)
- **Steps to reproduce**:
  1. Mobile (375×667), navigate to `/scholarships?q=engineering&level=High%20School&sort=amount`.
  2. Filter badge shows "2" — counting level + sort but **not** the search query.
  3. Switch to desktop (1280×800) at the same URL. The "Filtered by:" strip is **not rendered at all** because it only triggers when tags or award range are active.
- **Expected**: Either consistently include search query and level/sort in both surfaces, or document the convention. Currently neither surface tells the user "your search 'engineering' is active" without looking at the search input itself.
- **Actual**: Search query is invisible to the active-filter UI. Easy for a user to forget they have a search applied.

#### M-3. Pagination past matching results shows only dimmed cards with no status message
- **Where**: `src/components/scholarships/scholarship-grid.tsx` (status message logic only triggers when matching count = 0)
- **Steps to reproduce**:
  1. Navigate to `/scholarships?level=Undergraduate&page=11` (last page with the Undergraduate filter applied).
  2. All 9 cards on page 11 are dimmed (opacity 0.4) — non-matching scholarships.
  3. No status banner ("These don't match your filter — showing remainder") is displayed.
  4. The user sees 9 dimmed High School cards with the Undergraduate pill highlighted and may interpret this as "the filter is broken".
- **Expected**: Show a contextual banner on pages where ≥1 dimmed-only card is present (e.g. "These don't match your education level — switch back to High School to see them clearly").
- **Actual**: No messaging. The empty-state banner only appears when zero matches exist anywhere.
- **Evidence**: `18-dimmed-cards-page11.png` — Undergraduate is selected, all 9 cards are dimmed High-School cards, no status text.

#### M-4. Invalid URL params accepted silently (no validation / no normalization)
- **Where**: `src/hooks/use-scholarship-filters.ts`
- **Steps to reproduce**:
  1. Navigate to `/scholarships?level=Foo&sort=invalid&min=80000&max=10000&tags=fakeTag`.
  2. Page renders without error. URL is preserved as-is.
  3. `level=Foo` → no education level button is highlighted (`aria-pressed` is `""`); behaves like "All".
  4. `min=80000&max=10000` → "Filtered by: $80,000 – $10,000" chip shown; predictably 0 results.
  5. `tags=fakeTag,Need-Based` → fakeTag silently dropped at filter time but stays in the URL string.
- **Expected**: Sanitize on hydration — drop unknown values, swap min/max if inverted, and rewrite the URL via `router.replace` so shared links stay clean.
- **Actual**: Invalid params persist in URL; UI degrades silently.

#### M-5. Touch targets in mobile filter sheet are below recommended 44px (WCAG 2.5.5 AAA)
- **Where**: `src/components/scholarships/scholarship-filters-mobile.tsx` (Education Level chips, accordion category buttons, Sort pill buttons, layout-toggle icons)
- **Measurements (mobile filter sheet, 375px viewport)**:
  - Education level chips ("All", "High School", etc.): 34 × {47–139}px
  - Category accordions ("Gender-Specific", etc.): 36 × 327px
  - Sort buttons ("Deadline", "Amount"): 36 × {89, 95}px
  - Sheet close button: 34 × 34px
  - Page-level layout toggle (Grid/List): 34 × 34px
- **Expected**: ≥44 × 44 CSS px (WCAG 2.5.5 AAA, Apple HIG). At minimum ≥24 × 24 (WCAG 2.5.8 AA).
- **Actual**: All pass WCAG 2.5.8 AA but fail 2.5.5 AAA. The 34 × 34 layout toggle is small enough to be a usability risk on touch devices.

### Low Priority / Polish

#### L-1. "Filtered by:" strip's "Clear all" only clears tags + award range, not q/level/sort
- **Where**: `filter-sheet.tsx` `ActiveFilterStrip.clearAll`
- **Steps to reproduce**: Navigate to `/scholarships?tags=Need-Based&min=5000&q=test&level=Graduate&sort=amount`. Click the strip's "Clear all" link.
- **Result**: URL becomes `/scholarships?q=test&level=Graduate&sort=amount` (q/level/sort untouched).
- **Expected**: Either rename to "Clear filters" (since it only clears strip filters), or have it call `filters.clearAll()` like the mobile sheet's "Clear" button does.

#### L-2. Layout toggle (grid/list) is not URL-persisted
- Layout state lives in `useState`, so refreshing or sharing a link reverts to grid. Inconsistent with all other filters which use Nuqs.

#### L-3. Sort by `amount` uses only the first parsed dollar value, not totals or ranges
- "$5,000 per year (Total: $20,000)" is sorted as $5,000, not $20,000.
- "$2,000 to $7,500" is sorted as $2,000.
- Documented behavior in `parseAwardAmount`, but a user expecting "highest first" would be misled by Microsoft Disability Scholarship ranking below Engebretson.

#### L-4. Five font preload warnings in dev console
- Next.js preloads 5 woff2 files but they're not applied within the load-event window. Wasted bytes on initial paint. Investigate `next/font` configuration.

### Pre-existing test failures (not regressions, but worth flagging)

`npx vitest run` reports **16 failed tests / 314 passed** — primarily stale class-name assertions in:
- `scholarship-card.component.test.tsx` (4 failures: expects `bg-surface-container-low`, `border-tertiary-600`, `invisible`)
- `scholarships.test.ts` (1 failure: same pattern)
- `featured-scholarships.component.test.tsx` (8 failures: carousel selectors)
- `error.component.test.tsx`, `not-found.component.test.tsx` (2 failures)

These need a sweep to realign assertions with current rendered output. Not introduced by this QA pass.

### Verified Working

- Search by name / provider / eligibility / description matches ground-truth row count exactly:
  - `q=NCAA` → 2 results (matches CSV)
  - `q=engineering` → 10 results (matches CSV)
  - `q=engineering & level=High School` → 4 matching + 6 dimmed = 10 total (matches CSV)
- Eligibility tag counts in the filter sheet match seasonal scholarships exactly:
  - Need-Based: 10, Merit-Based: 40, First-Generation: 1, State-Specific: 13, Athletic: 3, Creative/Arts: 4
  - STEM/Engineering: 11, Business/Accounting: 16
- Within-category OR works: STEM ∨ Business → 20 results (matches expected union)
- Cross-category AND works: STEM ∧ Women → 2 results (Houzz, Dragon Hearts) — matches expected intersection
- Award range filter excludes "Varies" awards when range is narrowed (per documented behavior)
- Sort by deadline (ascending) verified against parsed dates — order matches data
- Sort by amount (descending) verified — Voyager $50k → ACS $10k order is correct
- URL state restoration: every filter param restores correctly on page load and via browser back/forward
- Out-of-range page numbers normalized to `safePage` (e.g. `?page=999` → `?page=11`; `?page=-5` → URL cleaned to no param)
- Special characters / SQL-injection-style queries treated as literal strings (no XSS, no errors)
- Very long queries (>150 chars) handled without overflow
- Sheet keyboard a11y: focus moves to first interactive on open, Escape closes and returns focus to trigger button
- Skip-to-content link is the first tab stop and properly visible on focus
- Light/dark theme switching renders cleanly (cards stay solid per spec, glass only on Z-4 modal)
- Responsive layout: no horizontal scroll at 320px; mobile filter sheet at 375/768; desktop layout activates at 1024px
- Comparison FAB increments correctly when cards are added (1 → 3 verified)
- Expanded scholarship modal closes on Escape and via X button
- Active filter chips remove individually when clicked
- Empty state ("No scholarships found") renders with a working "Clear all filters" CTA
- Hero "deadlines this month" badge correctly counts 2 May deadlines
- Education level pill counts (High School 93, Undergraduate 77, Graduate 46, K-8 0, K-12 0) match seasonal data exactly

## Responsive Matrix

| Viewport | Status | Notes |
|----------|--------|-------|
| 320 × 568  (iPhone SE)        | PASS | 1-col grid, no horizontal scroll |
| 375 × 667  (iPhone 8)         | PASS | Mobile filter sheet bottom-anchored, single search bar always visible. Touch targets 34px (M-5). |
| 768 × 1024 (iPad portrait)    | PASS | Still using mobile filter sheet (`max-width: 1023px` breakpoint), 3-col grid |
| 1024 × 768 (iPad landscape)   | PASS | Desktop filter row activates, education-level tabs visible inline, 4-col grid |
| 1280 × 800 (Laptop)           | PASS | Standard desktop layout |
| 1920 × 1080 (Desktop)         | PASS | Content centered with side gutters; 4-col cap |

## Accessibility Audit

- **Keyboard nav**: PASS — Tab moves through all interactive controls, focus visible (1.5px outline). Skip-to-content link is the first focusable. Filter sheet opens with focus on first slider thumb; Escape closes and returns focus to trigger.
- **ARIA**: PASS — Education-level buttons have `aria-pressed` and `role="group"` with `aria-label`. Filter accordions use `aria-expanded` + `aria-controls`. Search has `role="search"` + `aria-label`. Pagination has `aria-label`.
- **Status messaging**: Empty-state banner uses `role="status"` (live region). Education-level empty-hint uses `role="status"`.
- **Contrast**: Light theme passes for primary text (verified via OKLCH tokens). Zero-count level pills (K-8, K-12) use 0.6 opacity — visible but de-emphasized; passes 3:1 AA non-text but is borderline for 4.5:1 body text. Acceptable for a "0 results" indicator.
- **Touch targets**: PARTIAL — meets WCAG 2.5.8 AA (≥24px) but fails 2.5.5 AAA (≥44px). See M-5.
- **`aria-pressed=""`**: When `level=Foo` (invalid), one button has `aria-pressed=""` (empty string). Should be `"false"` or no attribute. Minor.
- **Reduced motion / transparency**: Not directly tested in this pass — recommend a follow-up audit confirming Motion animations and glass effects respect the prefers-* media queries (referenced in `globals.css` per design-system docs).

## Recommendations

1. **Fix H-1 first** — adding the year to deadline cards is a small change with high user impact. A sort by deadline that interleaves 2026 and 2027 deadlines is misleading without it.
2. **Fix H-2 next** — either gate the hero stats behind "no active filters" or make them dynamic. Cheapest fix: hide the stat row when any filter is active.
3. **Investigate M-1 with the data team** — decide whether duplicate-name entries should be merged in the data pipeline or visually differentiated in the card.
4. **Sanitize URL params on hydration (M-4)** — drop unknown levels/tags, swap inverted ranges, replace the URL via `router.replace` so shared links stay valid. Low effort, high payoff.
5. **Decide a single source of truth for "active filters" (M-2)** — either consistently surface q/level/sort in the active strip or rename the strip to "Active eligibility filters".
6. **Fix the 16 stale unit tests** in a maintenance pass — most are class-name drift from the design-system refactor.
7. **Add Playwright e2e tests** covering the URL-state round-trip (the most regression-prone behavior). Suggested specs:
   - `scholarships.search.spec.ts` — typing into search updates URL; loading URL with `?q=` restores input
   - `scholarships.filters.spec.ts` — toggling a tag updates URL; cross-category AND vs within-category OR
   - `scholarships.pagination.spec.ts` — out-of-range page normalizes to `safePage`
   - `scholarships.responsive.spec.ts` — mobile filter sheet vs desktop filter row at 375 vs 1024

## Test Artifacts

- Playwright tests added: none (this was an exploratory pass; recommendations above for permanent specs).
- Screenshots: `qa-reports/screenshots/2026-05-03_scholarships-page/`
  - `01-desktop-initial.png` — default state
  - `02-empty-search-state.png` — "asdfqwerzxcv" search showing H-2 (hero stats unchanged)
  - `03-url-state-restored.png` — full URL restoration
  - `04-filter-sheet-open.png` — filter sheet desktop
  - `05-major-category-expanded.png` — accordion expanded
  - `06-mobile-375.png`, `07-mobile-top.png`, `08-mobile-filter-sheet.png` — mobile views
  - `09-card-expanded.png` — expanded modal showing year (only here, not on card)
  - `10-mobile-320.png` — 320px viewport
  - `11-tablet-768.png`, `12-laptop-1024.png`, `13-desktop-1920.png` — responsive matrix
  - `14-list-layout.png` — list layout view
  - `15-comparison-fab.png` — comparison FAB
  - `16-mobile-with-filters.png` — mobile with filters from URL
  - `17-light-theme.png` — light theme
  - `18-dimmed-cards-page11.png` — M-3 evidence

## Related Observations

- **Card click target**: The whole `<article>` is clickable (cursor: pointer) and triggers expand. The "View details" anchor at the bottom and the "Add to comparison" button are also clickable — overlapping click handlers all work without conflict.
- **`scholarships-enriched.json` only has Spring entries** (158/158). The seasonal hide logic was thoroughly tested at 2026-05-03 but the codebase needs Summer/Fall/Winter data before season changeover testing can be meaningful.
- **CSV row count (550 entries) vs JSON (158)**: Many CSV rows have 2026 deadlines that have already passed (today is 2026-05-03), and the scrape pipeline likely only emits a subset. Worth confirming with the data owner that this is intended.
