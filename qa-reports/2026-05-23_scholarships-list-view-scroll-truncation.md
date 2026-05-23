# QA Report: Scholarships Page — List View Scroll Truncation

**Date**: 2026-05-23
**Tester**: qa-test-engineer
**Scope**: Verification of user-reported bug — "When I land on the grid card view and I click on the list view, I'm not able to scroll to the bottom of the page." Tested the `/scholarships` page across desktop, tablet, and mobile viewports.
**Build/Commit**: `f497ad1` on `main` (with uncommitted edits to `src/components/ui/logo-loader/logo-loader.tsx` — unrelated to this bug)
**Today's reference date**: 2026-05-23

## Summary

**Bug CONFIRMED.** When the user lands on the default grid view and toggles to list view, the Lenis smooth-scroll instance retains the grid view's stale scroll dimensions. The page DOM grows to ~3197 px in list view, but Lenis remains capped at the grid view's 2529 px scrollHeight (limit = 1629 px). The result: **wheel scrolling stops 668 px short of the true page bottom on desktop**, leaving the pagination component, the spacer, and the reveal-footer transition unreachable through the natural wheel/trackpad interaction the user described.

Keyboard fallbacks (`End`, `PageDown`) still work because they trigger native scroll that bypasses Lenis's wheel listener — but no average user discovers this. Direct loads of `/scholarships?layout=list` are unaffected; the bug is specific to the **toggle from grid → list** within the same SPA session.

The root cause is a race between the existing `lenis.resize()` effect in `scholarship-grid.tsx:110-114` (fires ~100 ms after the layout state changes) and the `AnimatePresence mode="wait"` exit animation (~250 ms) that keeps the old grid in the DOM. By the time the list renders and the DOM grows, the resize has already fired against the still-shrinking transitional DOM, so Lenis snapshots the *grid* dimensions instead of the *list* dimensions. `autoResize: true` (Lenis's ResizeObserver fallback) does not appear to fire for this layout change.

**Severity**: 🔴 Critical for desktop/tablet-landscape — primary site-navigation interaction is broken; users cannot reach pagination or the next page button on the default landing flow.

## Test Coverage

- [x] Functional behavior — layout toggle, scroll cap measurement, Lenis instance introspection
- [x] Responsive — 320, 375, 768, 1024, 1440
- [ ] Accessibility — out of scope for this targeted verification (keyboard nav noted as workaround)
- [ ] Design system compliance — out of scope
- [x] Performance — console errors/warnings checked (only font-preload warnings, unrelated)
- [x] Edge cases — direct-load vs. toggle, both directions (grid→list, list→grid)
- [ ] Cross-browser (Firefox/WebKit) — skipped, single-browser pass via Playwright Chromium MCP

## Findings

### 🔴 Critical Issues (blocks release)

1. **Wheel/trackpad scroll cannot reach the bottom of the page after toggling grid → list**
   - **Where**:
     - `src/components/scholarships/scholarship-grid.tsx:110-114` — the `useEffect` that calls `lenis.resize()` 100 ms after `filters.layout` changes
     - `src/components/scholarships/scholarship-grid.tsx:269-310` — the `<AnimatePresence mode="wait">` block whose 250 ms exit animation defers the actual DOM growth
     - `src/components/smooth-scroll-provider.tsx:25-45` — `ReactLenis` configured with `autoResize: true`, which is supposed to catch this but does not
   - **Steps to reproduce**:
     1. Open Chrome at 1440×900 and navigate to `http://localhost:3000/scholarships` (no query params — land on default grid view).
     2. Wait for the page to settle (~2 s).
     3. Click the "List layout" toggle in the filter bar (`aria-label="List layout"`).
     4. Wait for the fade-out → fade-in animation to complete (~600 ms).
     5. Use the mouse wheel or trackpad to scroll down.
   - **Expected**: Scrolling continues until the pagination component, the 50 vh spacer, and the reveal-footer transition are visible — `scrollY` should reach `~2297`.
   - **Actual**: Scrolling stops at `scrollY = 1629` (the grid view's max scroll). The 12th list card is partially visible at the bottom of the viewport; the pagination component sits at `top = 914 px` (14 px below the 900 px viewport bottom) and is completely unreachable via wheel input. 668 px of content are inaccessible.
   - **Evidence** (Lenis instance introspection via React fiber, 1440×900 desktop, after grid→list toggle + 2 s settle):
     ```
     lenis.dimensions.scrollHeight = 2529   ← STALE grid-view value
     lenis.limit                   = 1629   ← scroll cap = 2529 - 900
     document.documentElement.scrollHeight = 3197   ← real DOM after list renders
     window.innerHeight            = 900
     unreachablePx                 = (3197 - 900) - 1629 = 668
     ```
     Calling `lenis.resize()` manually after the bug repros immediately updates `limit` → `2297` and `scrollHeight` → `3197`, confirming the resize call is what's missing.

     **Polling timeline of Lenis state during grid→list toggle** (1440×900, t=0 is click):
     | t (ms) | docScrollHeight | lenis.dimensions.scrollHeight | lenis.limit |
     |--------|----------------|-------------------------------|-------------|
     | 0 (pre-click) | 2529 (grid) | 3197 (stale from prior list view) | 2297 |
     | 100 | 2529 | 3197 | 2297 |
     | **150** | **2529** | **2529** ← Lenis resizes here | **1629** |
     | 250 | 2529 | 2529 | 1629 |
     | **300** | **3197** ← DOM finally grew | **2529** ← STALE | **1629** |
     | 3000 | 3197 | **2529 (STILL STALE)** | **1629** |

     The 150 ms Lenis resize fires *before* the DOM grows at 300 ms (held back by AnimatePresence's 250 ms exit animation). After the DOM grows, no further resize ever fires.

### 🟠 High Priority (should fix before release)

2. **Lenis `autoResize: true` does not catch the grid→list DOM growth**
   - **Where**: `src/components/smooth-scroll-provider.tsx:30-39`
   - **Why this matters**: The component author appears to be relying on Lenis's ResizeObserver to keep dimensions in sync (`autoResize: true`), which is why the manual `setTimeout(lenis.resize, 100)` in scholarship-grid.tsx exists as a "belt-and-suspenders" backup. Both safety nets are failing for this specific case. Worth investigating whether `autoResize` only observes the `<html>` element's size (which is fixed to `h-full`, i.e. viewport height) rather than the `<body>` whose `scrollHeight` actually changes. The `html` element has `class="relative h-full"` from `globals.css`, while `body` grows; if Lenis observes the wrong element, this would explain the silent failure.
   - **Hypothesis for fix direction**: Bump the manual resize timer past the AnimatePresence exit duration (currently 100 ms; needs to be >300 ms — safest at ~400 ms), or use `requestAnimationFrame` chained after the layout state change to wait for the next paint, or observe the actual list/grid container with a ResizeObserver inside `ScholarshipGrid`.

### 🟡 Medium Priority (fix soon)

3. **Tablet-landscape (1024×768) is also affected — 170 px unreachable**
   - **Where**: Same root cause as Finding 1.
   - **Evidence**: After toggling grid→list at 1024×768: `lenis.limit = 2193`, `docScrollHeight - innerHeight = 2363`, 170 px unreachable. Less dramatic than desktop because the list is only slightly taller than the grid at this width, but still cuts off the pagination's bottom row of page links.

### 🔵 Low Priority / Polish

4. **Grid → list URL update happens via `usePathname` with new search params, but the `LenisRouteResizer` in `smooth-scroll-provider.tsx` only resizes on `pathname` change, not `searchParams`**
   - **Where**: `src/components/smooth-scroll-provider.tsx:11-20`
   - The effect re-runs on pathname changes (route navigation) but `?layout=list` is a query-param change — `usePathname()` won't fire. This is consistent with the design intent (avoid resize on every filter keystroke) but means the route-level safety net cannot save this case either. Worth a comment in the code documenting that the per-feature resize timers (scholarship-grid.tsx, blog-grid.tsx) are the *only* path to a Lenis refresh on layout/pagination changes.

### ✅ Verified Working

- Grid view loads correctly on default `/scholarships` route: 2529 px scroll height, all 12 cards visible, pagination reachable, footer reveal works smoothly via wheel.
- Direct navigation to `/scholarships?layout=list` (bypassing the toggle) works correctly — Lenis initializes with the right dimensions from first paint.
- List → grid toggle is **not buggy in a user-visible way**: Lenis ends up with `limit = 2297` against `docScrollHeight = 2529`, i.e. ~668 px of "ghost" scroll room past the real content. The user can still reach everything; there is just extra blank scroll room.
- Mobile 375×667 is **not affected**: the single-column grid (`grid-cols-1`, `aspect-3/4`) is *taller* than the list view (6610 px vs 3070 px), so toggling grid→list always shrinks the page and there is no truncation possible.
- Mobile 320×568 same behavior as 375 — single-column tall grid → shorter list, no truncation.
- Layout-toggle buttons are 44×44 px (touch-target compliant) at every viewport.
- Keyboard scrolling via `End` / `PageDown` works in list view because native key-driven scroll bypasses Lenis's wheel listener and triggers `lenis.scrollTo` semantics correctly.
- No JavaScript console errors during the toggle. Only font-preload warnings (`woff2 ... preloaded but not used within a few seconds`) which are unrelated to scroll behavior.

## Responsive Matrix

| Viewport       | grid `docSh` | list `docSh` | grid→list delta | Lenis after grid→list (`limit` / `dim.sh`) | Unreachable px | Status |
|----------------|--------------|--------------|-----------------|--------------------------------------------|----------------|--------|
| 320×568        | 5757         | (n/a — list is shorter)         | shrinks        | matches docSh            | 0              | ✅ |
| 375×667        | 6610         | 3070         | shrinks         | 2403 / 3070                                | 0              | ✅ |
| 768×1024       | 2600         | 3226         | **+626 px**     | 1576 / 2600                                | **626**        | ❌ |
| 1024×768       | 2961         | 3131         | **+170 px**     | 2193 / 2961                                | **170**        | ❌ |
| 1440×900       | 2529         | 3197         | **+668 px**     | 1629 / 2529                                | **668**        | ❌ |

The bug manifests on **every viewport where the list view is taller than the grid view** — i.e. anywhere the grid uses `sm:grid-cols-2` or wider (≥640 px). On mobile single-column grid the bug is masked because the grid is taller than the list.

## Accessibility Audit

Out of scope for this targeted verification, but two observations:

- **Workaround exists for keyboard users**: Pressing `End` reaches the true bottom (`scrollY = 2297`). Pressing `PageDown` repeatedly also works. Both bypass Lenis's wheel cap.
- **No accessible workaround for pointer/touch users**: Wheel, trackpad, and touch-scroll all route through Lenis and are capped at 1629 px. This makes the bug effectively unworkaroundable for the majority of users without keyboard navigation.

## Root Cause Hypothesis

`src/components/scholarships/scholarship-grid.tsx:110-114`:

```ts
useEffect(() => {
  if (!lenis) return
  const timer = setTimeout(() => lenis.resize(), 100)
  return () => clearTimeout(timer)
}, [visibleItems.length, filters.layout, lenis])
```

This effect fires when `filters.layout` changes (synchronously, when the toggle is clicked). The `setTimeout` then fires `lenis.resize()` 100 ms later. But the outgoing grid is wrapped in `<AnimatePresence mode="wait">` with a 250 ms exit transition (`transition={{ duration: 0.25 }}` on the motion.div at `scholarship-grid.tsx:276`), and the *incoming* list view doesn't mount until the exit completes — at roughly 250-300 ms. By the time the new layout's full height is in the DOM, the resize timer has long since fired against the wrong DOM (the page during the brief transitional state when neither layout is mounted).

There is no subsequent resize call, and Lenis's `autoResize` ResizeObserver does not appear to be observing the right element (likely watching `<html>`, which is `h-full` and never changes size).

**Fix directions to consider** (not implementing, just noting for the engineer):

1. Push the resize timer past the AnimatePresence exit duration: change `setTimeout(..., 100)` to `setTimeout(..., 400)`. Cheapest, most fragile.
2. Add a *second* resize timer chained after the first to cover the post-mount DOM update: e.g. `setTimeout(lenis.resize, 100); setTimeout(lenis.resize, 500);`. Pattern already used in `smooth-scroll-provider.tsx:14-17` for the route-change case.
3. Resize Lenis from inside the AnimatePresence `onAnimationComplete` callback on the entering motion.div — guarantees the DOM has settled before resize.
4. Observe the list/grid container directly with a `ResizeObserver` in `ScholarshipGrid` and call `lenis.resize()` on every observed change. Most robust; cheapest at runtime.

## Recommendations

- **Triage as 🔴 critical** — this breaks the primary discovery flow of the scholarship page for desktop and tablet users on the default landing.
- Add a Playwright regression test that:
  1. Navigates to `/scholarships` (grid default) at 1440×900.
  2. Reads `document.documentElement.scrollHeight` and current Lenis `limit` (via React fiber introspection or by exposing Lenis to `window` in dev).
  3. Clicks the List layout toggle.
  4. Waits 1000 ms.
  5. Asserts `lenis.limit >= (document.documentElement.scrollHeight - window.innerHeight) - 5`.
  6. Repeat at 768×1024 and 1024×768.
  - Recommended location: `src/app/__tests__/scholarships-layout-toggle.test.tsx` (component project, Playwright browser env per `.claude/rules/testing.md`).
- Consider exposing the Lenis instance on `window.__lenis` in dev mode only — this would let tests assert against `limit` and `dimensions.scrollHeight` directly without fiber walking. Pattern: add a `useEffect(() => { if (process.env.NODE_ENV !== 'production') window.__lenis = lenis }, [lenis])` to `LenisRouteResizer`.
- Audit any *other* layout/visibility toggles (e.g. filter sheet open/close, expanded scholarship modal close, pagination page change) for the same pattern. The 100 ms resize timer is used in `scholarship-grid.tsx` and `blog-grid.tsx:111-114`; both rely on the same timing assumption and could exhibit the same bug if any incoming layout takes >100 ms to settle.

## Related Observations

- The `expanded-scholarship.tsx` modal uses `data-lenis-prevent` to stop Lenis from scrolling beneath the open modal — that mechanism is independent of this bug and was not exercised here.
- The fixed reveal-footer pattern (`<div class="fixed bottom-0 left-0 right-0 h-[50vh]">` wrapping `<footer>`) means the *footer element itself* is always visible at the bottom of the viewport regardless of scroll position. This made the initial verification confusing — the user's "I can't scroll to the bottom of the page" report is genuinely about reaching the pagination + spacer + reveal animation, not about reaching the footer DOM element, which is always rendered.

## Test Artifacts

- No new Playwright tests added (verification only, per scope). A reproduction test is recommended above.
- Console/network: 0 errors, font-preload warnings only.
- Snapshots/traces: none written to disk (Playwright MCP session was ephemeral; only YML accessibility snapshots accumulated in `.playwright-mcp/`, which is gitignored).
