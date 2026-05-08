# QA Report: Scholarships Page

**Date**: 2026-05-07
**Tester**: qa-test-engineer
**Scope**: `/scholarships` end-to-end — search, sort, filters (level + month + tags + award range), pagination, expanded modal, comparison FAB, list/grid layout, responsive (320 → 1920), accessibility, design system compliance.
**Build / Commit**: `main @ c3b8b70` (webpack dev mode)
**Dev server**: http://localhost:3000 (the auto-started instance attempted port 3001 because 3000 was already in use; testing performed against the existing :3000 instance)
**Browser**: Playwright Chromium (default channel)

## Executive Summary

**Verdict**: PARTIAL PASS — page functions, but multiple data-quality and accessibility defects warrant fixing before release.

**Issue count** (excluding "Verified Working"):
- Critical: 1
- High: 4
- Medium: 6
- Low / Polish: 5

The most pressing issues are (a) **two duplicate scholarship IDs** in `scholarships-enriched.json` causing React key-collision console errors, (b) **a misspelled deadline ("Feburary") rendered directly on three cards** and silently mis-sorted to the epoch in deadline mode, (c) **inconsistent total-count messaging** (181 vs 211 shown for the same corpus in different surfaces), and (d) **horizontal scroll at 320 px** on the filter row.

---

## Test Coverage

- [x] Functional behavior (search, sort, filter, pagination, expanded modal, comparison)
- [x] Responsive (320, 375, 414, 768, 1024, 1280, 1440, 1920)
- [x] Accessibility (keyboard, ARIA, contrast spot-checks, reduced-motion media, scroll-lock, focus-trap, skip link)
- [x] Design system compliance (Noto Serif / Poppins, OKLCH tokens, glassmorphism scope)
- [x] Performance (console errors/warnings, network, layout shift on filter changes)
- [x] Edge cases (XSS, malformed URL params, empty result sets, page out-of-range, all-dimmed pages)
- [ ] Cross-browser (skipped — only Chromium exercised; Firefox/WebKit not tested in this pass)

---

## Findings

### Critical Issues (blocks release)

#### C-1. Duplicate scholarship IDs cause React key-collision errors
- **Where**: `src/data/scholarships-enriched.json` — two pairs of records with identical `id` fields:
  - `young-american-creative-patriotic-art-contest-march-31` (×2)
  - `jandy-books-for-good-scholarship-march-31` (×2)
- **Steps to reproduce**:
  1. Visit `http://localhost:3000/scholarships?sort=amount` (puts the duplicates on the first page).
  2. Open DevTools console.
- **Expected**: No React warnings; every list item has a unique `key`.
- **Actual**: Four `Encountered two children with the same key, 'young-american-creative-patriotic-art-contest-march-31'` errors are logged. React explicitly warns that "non-unique keys may cause children to be duplicated and/or omitted — the behavior is unsupported and could change in a future version."
- **Evidence (console excerpt)**:
  ```
  [ERROR] Encountered two children with the same key, %s. … young-american-creative-patriotic-art-contest-march-31
  ```
- **Direction**: Rewrite the ID generator in the scrape/tag pipeline (`scripts/`) to disambiguate when two CSV rows resolve to the same slug — e.g., append a `-2` suffix or include the deadline year in the slug.

---

### High Priority (should fix before release)

#### H-1. "Feburary" misspelling rendered on cards and silently breaks deadline sort
- **Where**: `src/data/scholarships-enriched.json` — three records have `deadline: "Feburary <day>"` (missing `r`):
  - `bsp-law-charitable-foundation-joel-stern-scholarship-feburary-13`
  - `ashby-thelen-lowry-legal-scholarship-feburary-15`
  - `hsf-scholar-program-application-feburary-15`
  - The same typo also exists in `MasterScholarshipList.csv` rows.
- **Steps to reproduce**:
  1. Search "BSP" on `/scholarships`.
  2. Inspect the card: it shows `Deadline Feburary 13, 2027`.
- **Expected**: `Deadline February 13, 2027`.
- **Actual**: User-visible typo on the card. Worse, `parseDeadlineDate("Feburary 13, 2027", 2027)` (in `src/lib/scholarship-utils.ts:11`) returns `0` because `new Date()` cannot parse "Feburary" — meaning these three records sort to the very top of any deadline-ascending result set (epoch wins), and to the bottom in deadline-descending. They also do not appear in the Month dropdown's "February" filter (the filter compares `getDeadlineMonth(s.deadline)` strictly against the lowercase `february`).
- **Evidence (Node REPL)**:
  ```
  Month counts (raw, all years): { …, february: 22, feburary: 3, … }
  ```
- **Direction**: Normalize the source CSV. As a defense-in-depth, add a build-time validator that rejects deadlines where `new Date(\`${deadline}, ${year}\`)` is `NaN`.

#### H-2. Inconsistent total scholarship counts across the page
- **Where**: Three different surfaces show three different totals for the same corpus:
  - Hero stats (`scholarship-hero.tsx:16`): **`181 scholarships`** — counts only active (deadline ≥ today).
  - "All" level-tab badge (`scholarship-filters.tsx`, fed by `useScholarshipFilters.levelCounts`): **`211`** — full corpus including expired.
  - Filter sheet footer ("Showing 211 scholarships"): **`211`**.
- **Steps to reproduce**: Load `/scholarships` with no filters.
- **Expected**: One source of truth, or each surface clearly labelled (e.g., "181 active · 30 closed").
- **Actual**: The user sees three numbers and cannot tell which is canonical. Pagination uses 211 (18 pages), so paginating past page 16 surfaces only expired entries.
- **Direction**: Either (a) compute the level-tab and filter-sheet counts off `activeScholarships` only, matching the hero, or (b) add a clear "X active, Y closed" label to all three surfaces.

#### H-3. Horizontal scroll at 320×568 viewport
- **Where**: The filter row's right cluster (`Month`, `Sort`, `Filters` buttons) overflows when the viewport is narrower than ≈ 336 px.
- **Steps to reproduce**:
  1. Resize the browser to 320×568.
  2. Load `/scholarships`.
- **Expected**: `documentElement.scrollWidth === window.innerWidth`. No horizontal scrollbar.
- **Actual**: `documentElement.scrollWidth = 336`, viewport `320`. The container `<div class="flex items-center gap-2">` (Month + Filters row) extends to right edge `335.97 px` and the Filters button alone is 107 × 44 px.
- **Direction**: Reduce the gap, drop the "Filter by deadline month, currently …" wide month-button width below 320, or wrap the row to a second line below 360. Could also use a single icon button at the smallest breakpoints.

#### H-4. No global `prefers-reduced-motion` reset
- **Where**: `src/app/globals.css` defines fallbacks for `prefers-reduced-transparency` and `prefers-contrast: more` (lines 448-485) but there is no `@media (prefers-reduced-motion: reduce)` rule. The only consumer is `src/components/ui/custom-cursor.tsx:39`.
- **Impact**: All Motion-driven animations (the `LayoutGroup` highlight on level-tab change, hero `AnimatedLines` per-character reveal, modal entrance/exit, FAB enter, list/grid mode crossfade) play at full intensity regardless of the user's OS preference. WCAG 2.3.3 (AAA) and broader vestibular guidance recommend honoring this signal.
- **Direction**: Add a global rule in `globals.css` such as `@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; } }` and wrap Motion `MotionConfig reducedMotion="user"` near the root.

---

### Medium Priority

#### M-1. Comparison store does not persist
- **Where**: `src/stores/comparison.ts` is not wrapped in Zustand's `persist` middleware (only `theme` exists in `localStorage`).
- **Steps to reproduce**:
  1. Click "Add to comparison" on three cards.
  2. Refresh the page (or full-nav to `/scholarships?q=...` via address bar).
- **Expected**: Selections survive a refresh; the user's compare list is durable until they explicitly clear it.
- **Actual**: All selections are lost; FAB count returns to zero.
- **Note**: It DOES survive SPA navigation (e.g., Next.js Link to `/blog` and back) — so users who only paginate keep their state. The brittleness is on full reloads / shared URLs.

#### M-2. Card has `onClick` but is not keyboard-focusable
- **Where**: `src/components/scholarships/scholarship-card.tsx:48-71` (`<motion.article>`) and `src/components/scholarships/scholarship-list-card.tsx:58-71` (list variant) — the article has `cursor: pointer`, an `onClick`, and an `aria-label`, but no `role="button"`, no `tabIndex={0}`, and no `onKeyDown`.
- **Impact**: A keyboard user must Tab past the card body to reach the inner "View details" arrow button. Mouse and touch users get card-wide click targets; keyboard users do not. This is functional (the inner buttons exist) but inconsistent. Screen readers will announce the card as a generic article and the user must explore to find the trigger.
- **Direction**: Either drop the article-level `onClick` (rely on the inner buttons only) or make it a real button: `role="button" tabIndex={0}` + `onKeyDown` for Enter/Space, plus remove the duplicate trigger.

#### M-3. URL sanitization leaves "swap" residue in the address bar
- **Where**: `useScholarshipFilters` sanitization effect (`src/hooks/use-scholarship-filters.ts:180-207`).
- **Steps to reproduce**: Visit `http://localhost:3000/scholarships?min=99999&max=10`.
- **Expected**: Either (a) revert to defaults `?` (no params), or (b) keep the swap but suppress the active-filter strip.
- **Actual**: URL becomes `?min=10&max=99999`, an active "$10 – $99,999" filter strip is shown, and the user must click "Clear all" to escape. A user who pasted a typoed link cannot tell they ended up in a non-default state.

#### M-4. Card key collision on March 31 entries (related to C-1)
- **Where**: Same root cause as C-1; calling out separately because it manifests in the grid even when `sort=amount` isn't active. On `/scholarships?month=march` the list contains both copies of the duplicate IDs and React's reconciliation may drop one of them.
- **Steps to reproduce**: `?month=march` then scroll the grid. (Couldn't reliably reproduce dropped cards in this pass — but the React docs explicitly say "duplicated and/or omitted" is unsupported behavior.)

#### M-5. Apparent-duplicate cards on default view (J&Y "Books for Good" appears 5× on page 1)
- **Where**: `src/data/scholarships-enriched.json` legitimately contains 13 records for "J&Y 'Books for Good' Scholarship" — one per month — because the source CSV creates a row per monthly cohort. The cards differ only by `deadline`.
- **Impact**: Default view shows a long stripe of visually near-identical cards. Even though the `Deadline May 31, 2026` line varies, the heading + provider + amount + description repeat — looking like a rendering bug at first glance. New users may distrust the page.
- **Direction**: Product decision — either (a) collapse recurring monthly cohorts into one card with an "applies monthly" indicator, (b) deduplicate by `(name, provider)` when the user-selected month is "All", or (c) add a visible "Cohort: May 31" pill so the variant is unmistakable. The four JMJ Phillip Group College Scholarship records have the same problem.

#### M-6. Filter-sheet typography hierarchy uses non-tokenised count chip
- **Where**: `filter-sheet.tsx:92` — the active-filter badge uses inline classnames `text-white` and `bg-primary` rather than going through the OKLCH token (`bg-primary` is the token, `text-white` short-circuits the dark-mode aware `text-on-primary`). In dark mode at certain accents this risks contrast inconsistency.
- **Direction**: Replace `text-white` with `text-primary-foreground` (or `text-on-primary`).

---

### Low Priority / Polish

#### L-1. Share button is a no-op
- **Where**: `expanded-scholarship.tsx:211-217` — the "Share scholarship" `<Button>` has an `aria-label` but no `onClick` / `render`. Clicking does nothing visible to the user.
- **Direction**: Wire `navigator.share` (with a copy-link fallback) or remove the button.

#### L-2. Hero LCP warning
- **Console**: `Image with src "/iconBurgundy.png" was detected as the Largest Contentful Paint (LCP). Please add the loading="eager" property if this image is above the fold.`
- **Where**: Whichever component renders `/iconBurgundy.png` (likely the header logo) — this fires on every page nav.
- **Direction**: Add `priority` (Next.js Image) or `loading="eager"` to the offending asset.

#### L-3. Five preload-not-used warnings for fonts
- **Console**:
  ```
  The resource http://localhost:3000/_next/static/media/<hash>.woff2 was preloaded using link preload but not used within a few seconds from the window's load event.
  ```
- Five different woff2 hashes warn on each navigation. Almost certainly unused weight/style variants of Noto Serif / Poppins.
- **Direction**: Audit `next/font` usage — only request the weights actually used (the design system mentions Noto Serif 400/700 and Poppins 400/500/600/700; if all four Poppins weights are loaded but not all are used on the scholarships page, drop the unused ones, or accept the warning).

#### L-4. Default view sorting puts active first then expired — but the *banner* doesn't fire when the dimmed cards are active expired records on later pages
- **Where**: `scholarship-grid.tsx:136-147` — the "Jump to page N" banner only fires when *every* card on the page is dimmed by the level filter. Pages dominated by expired (but not dimmed) cards show no comparable hint. May not be a defect; flagging in case product wants symmetry.

#### L-5. Month dropdown footer says "211 scholarships" inside an "All months" item — same inconsistency as H-2 in a different place
- **Where**: `month-dropdown.tsx`. The "All months: 211" line in the Month dropdown reinforces the count discrepancy noted in H-2.

---

### Verified Working

- Search debounces correctly; URL `?q=...` persists, back/forward restores state.
- XSS via `?q=<script>alert(1)</script>` is properly text-escaped — rendered as a quoted token in the active-filter strip; HTML scan confirms no executable injection.
- Empty-state copy ("No scholarships found …") + working "Clear all filters" CTA.
- "All-dimmed page" banner with "Jump to page N" works as designed at `/scholarships?level=Graduate&min=10000&max=50000&sort=amount&page=3`.
- Page out-of-range normalization: `?page=999` rewrites to `?page=18` (last page).
- Invalid URL params are dropped (`?level=Bogus&sort=banana&tags=invalid&page=-99` → cleaned URL).
- Inverted award range is swapped (`min=99999&max=10` → `min=10&max=99999`) — though see M-3 about the residual state.
- Expired tier always sorts last regardless of sort mode; the "DEADLINE HAS PASSED" stamp + reduced opacity on the inner wrapper renders correctly.
- Apply Now link in the expanded modal: `target="_blank"`, `rel="noopener noreferrer"`. Good.
- Modal: `role="dialog"`, `aria-modal="true"`, `aria-labelledby` connects to the title `h2`, scroll-lock applies, Escape closes, body overflow restored on close.
- Focus trap: confirmed via `useFocusTrap` (initial focus lands on the Close button); previous focus is restored on close.
- Comparison FAB appears once ≥ 1 card selected; clicking opens the comparison sheet showing the 3/3 selected count and per-scholarship columns.
- Layout toggle (grid ↔ list) works and the URL `?layout=list` round-trips.
- Light/dark theme toggle works; OKLCH tokens are applied consistently (sampled card bg, body bg, h1 color).
- Typography: H1 = Noto Serif (per `--font-heading`), body = Poppins (per `--font-sans`) — matches design system.
- Glassmorphism scope: zero `backdrop-filter` rules on cards, list items, or the grid container — compliant with the "floating elements only" rule.
- Sample data sanity check (6 scholarships randomly compared between CSV and the rendered card): Dell Scholars / Voyager / McDonald's HACER / Voice of Democracy / Stephen Phillips / The Paradigm Challenge — names, deadlines (modulo H-1 typo class), amounts, classifications all match.
- "129 scholarships in May 2026" count from prior memory was wrong: live count is 181 active total (May currently shows 11 cards — 1 active, 10 expired). Memory has been updated.

---

## Responsive Matrix

| Viewport       | Status | Notes |
|----------------|--------|-------|
| **320 × 568**  | ❌      | Filter row overflows by ~16 px → horizontal scrollbar (H-3). 12 cards reflow to a single column. Touch targets pass WCAG 2.5.8 AA (≥24×24) but miss AAA (44×44) on the card icon buttons. |
| **375 × 667**  | ✅      | No horizontal scroll. Mobile filter sheet active. Grid/List toggle is 44×44, Filters button is 107×44 — compliant with Apple HIG. Card "Add to comparison" / "View details" buttons are 32×32 / 34×34 (pass AA, fail AAA — pre-existing per memory). |
| **414 × 896**  | ✅      | Clean. |
| **768 × 1024** | ✅      | Mobile filter sheet still active (breakpoint is `<1024`). Grid switches to 3 columns. |
| **1024 × 768** | ✅      | Desktop filter row appears. 4-column grid. |
| **1280 × 800** | ✅      | Comfortable layout. |
| **1440 × 900** | ✅      | Default tested viewport for the full pass — clean. |
| **1920 × 1080**| ✅      | Cards become wider (~292 px columns); no overflow. |

---

## Accessibility Audit

- **Keyboard nav**: Skip-link present and works. Tab order is logical through nav → search toggle → level tabs → layout toggle → Month → Sort → Filters. Cards themselves are NOT focusable (M-2) — keyboard users reach card actions only via the inner buttons. Modal traps focus correctly; Escape closes it.
- **Screen reader semantics**: H1 properly uses a visually-hidden text twin (`<span class="sr-only">Scholarships</span>`) so AnimatedLines per-character `<span aria-hidden>` decoration doesn't expose junk to AT — confirmed via DOM inspection. Modal has `aria-labelledby` to the title, `aria-modal="true"`. Filter sheet has `dialog` role with `Filters` heading.
- **Live regions**: The "all-dimmed page" banner uses `role="status"`, the empty state has `role="status"` — both will be announced. Result count is not in a live region; users won't hear it update as they type. (Minor.)
- **Contrast (light theme spot-check)**: Default card background `bg-white` against on-surface OKLCH text passes 4.5:1. Pill chips (e.g., "HIGH SCHOOL" `bg-primary-200 text-primary-700`) appear within range but were not measured here — recommend a Lighthouse / axe pass.
- **Reduced motion**: NOT honored globally (H-4). The page animates aggressively on every filter change.
- **Reduced transparency / high contrast**: Globally honored via `globals.css:448-485`. The cards do not use glass, so this is mostly relevant to nav/modal surfaces rather than the scholarships grid.
- **Touch targets (mobile)**: Layout toggle 44×44 and Filters 107×44 — pass AAA. Inner card icon buttons 32×32 / 34×34 — pass AA, miss AAA. Documented in memory.
- **Form labels**: Search input has `aria-label="Search scholarships"` and is hidden via `tabIndex={-1}` when collapsed — appropriate.

---

## Recommendations (prioritized)

1. **Fix the duplicate IDs** in the scrape pipeline (C-1). Add a Node script assertion in CI that all `id` values are unique.
2. **Fix "Feburary"** in the source CSV and add a build-time deadline-validity check that fails the build if any deadline cannot be parsed (H-1).
3. **Reconcile the corpus counts** (H-2): pick one definition (active-only seems most user-friendly), and surface "X active · Y closed" wherever the count is shown.
4. **Patch the 320 px overflow** (H-3) by shrinking gap or wrapping the action row.
5. **Add `prefers-reduced-motion` global** (H-4) — one-paragraph CSS rule plus Motion `MotionConfig`.
6. **Persist the comparison store** to `localStorage` (M-1) — Zustand `persist` middleware is a 4-line change.
7. **Decide on card-as-button semantics** (M-2): either remove the article-level `onClick` in favor of the inner buttons, or promote the article to a real button with keyboard handlers.
8. **Audit unused font preloads** (L-3) and add `priority` to the LCP image (L-2).
9. **Wire up or remove the Share button** (L-1).
10. Consider collapsing the J&Y / JMJ-Phillip / Patriotic-Art monthly-cohort duplicates into a single card with a cohort indicator (M-5).

---

## Test Artifacts

- No new automated tests added in this pass.
- Existing tests in repo (not run, just observed):
  - `src/components/scholarships/__tests__/expanded-scholarship.component.test.tsx`
  - `src/components/scholarships/__tests__/scholarship-card.component.test.tsx`
  - `src/components/scholarships/__tests__/sort-by-filter.test.ts`
  - `src/data/__tests__/scholarships.test.ts`
- **Recommended new tests**:
  - Vitest snapshot or assertion: `expect(new Set(scholarships.map(s => s.id)).size).toBe(scholarships.length)` — would have caught C-1.
  - Vitest assertion: `for (const s of scholarships) expect(parseDeadlineDate(s.deadline, s.deadlineYear)).not.toBe(0)` — catches H-1.
  - Playwright responsive test: `await page.setViewportSize({width: 320, height: 568}); await page.goto('/scholarships'); expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);`
  - Playwright key-collision guard: assert `await page.evaluate(...)` produces zero `console.error` events on the route.

---

## Console Excerpts (full session — `/scholarships?sort=amount`)

```
[ERROR] Encountered two children with the same key, %s. … young-american-creative-patriotic-art-contest-march-31  (×4)
[WARNING] Image with src "/iconBurgundy.png" was detected as the Largest Contentful Paint (LCP). Please add the loading="eager" property if this image is above the fold.
[WARNING] The resource http://localhost:3000/_next/static/media/8888a3826f4a3af4-s.p.woff2 was preloaded using link preload but not used …
[WARNING] The resource http://localhost:3000/_next/static/media/30d74baa196fe88a-s.p.woff2 was preloaded using link preload but not used …
[WARNING] The resource http://localhost:3000/_next/static/media/b957ea75a84b6ea7-s.p.woff2 was preloaded using link preload but not used …
[WARNING] The resource http://localhost:3000/_next/static/media/eafabf029ad39a43-s.p.woff2 was preloaded using link preload but not used …
[WARNING] The resource http://localhost:3000/_next/static/media/0484562807a97172-s.p.woff2 was preloaded using link preload but not used …
```

No 404s, no 500s, no failed network requests observed during the test pass.
