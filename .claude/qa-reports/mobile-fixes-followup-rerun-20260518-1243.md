# QA Report: Mobile Fixes Follow-up Rerun

**Date**: 2026-05-18
**Tester**: qa-test-engineer
**Scope**: Verify the 8 specific UI fixes listed in the prompt (strict scope).
**Branch / Commit**: `fix/tablet-scroll-fixes-followup` @ da37dd6
**Default mobile viewport**: 390×844 (with desktop spot-checks at 1280×800 for Tests 3, 4, 7, 8).

## Summary
All 8 tests PASS. The mobile fixes are correctly implemented and the responsive breakpoints behave as documented (Tailwind `sm:` ≥640px, `md:` ≥768px, `lg:` ≥1024px). No regressions in the targeted areas.

## Results

| Test # | Verdict | Evidence |
| --- | --- | --- |
| 1 — Home hero CTA position | PASS | "Modern Scholar" wordmark bottom at y≈685.2; Explore button (`mt-6 shrink-0 md:mt-0` wrapper, BUTTON `w-50 h-auto`) top at y≈765.2 → 80px gap, no overlap. "Featured Scholarships" h2 sits at y≈944, well below the button. |
| 2 — Featured carousel size + breathing room | PASS | Center coverflow card `offsetWidth=256` confirms `w-64` on mobile (class `w-64 ... sm:w-80` toggles to 320 at ≥640). Carousel wrapper `relative left-1/2 mt-16 w-dvw -translate-x-1/2 py-16` provides `mt-16` (4rem) + `py-16` (4rem) above the cards; inner carousel block also has `py-20` (5rem). Below the carousel, wrapper bottom ≈950 with next section at y=1008. |
| 3 — Coming Soon stack vs sticky | PASS (mobile + desktop) | Mobile (390×844): section contains 3 sibling `<div class="relative px-6 py-24 md:px-8 md:py-28">` panels stacked at y=1008→1908, 1908→2757, 2757→3635. No `position: sticky` and no `overflow-x: scroll` elements inside the section. Desktop (1280×800): the section's only child is `<div class="sticky top-0 h-dvh overflow-hidden">` and the section is 1920px tall vs viewport 800px — sticky horizontal sequence confirmed. |
| 4 — Footer Legal column visible | PASS (mobile + desktop) | Mobile: footer holds `grid grid-cols-1 gap-12 lg:grid-cols-[2fr_1fr_1fr]` outer + `grid grid-cols-2 gap-8 lg:contents` inner; Quick Links column at x=24 (155 wide) and Legal column at x=211 (155 wide) sit side-by-side on the same y=641.5 row, both visible inside the 390×844 viewport (footer bottom 817.5). Desktop: three columns side-by-side at x=32 (560 wide Brand), x=640 (280 wide Quick Links), x=968 (280 wide Legal). |
| 5 — Mobile nav backdrop covers viewport | PASS | After clicking `button[aria-label="Open menu"]`, `div.fixed.inset-0.z-40.bg-on-surface/40.glass-heavy.lg:hidden` is in the DOM with bounding rect `{x:0, y:0, width:390, height:844}` — full viewport, not just header. Programmatic `backdrop.click()` removed both the drawer (`#mobile-nav-drawer`) and the backdrop from the DOM. |
| 6 — Scholarship list card no overlap | PASS | Provider/date container has classes `flex flex-col gap-0.5 text-xs ... sm:flex-row sm:items-center sm:gap-2` (stacked on mobile, row at ≥640). Middle-dot `<span class="hidden text-outline-variant/40 sm:inline">·</span>` is hidden on mobile. For the "Schwartz" row: provider title rect ends at x=276, compare button starts at x=288 (12px gap); compare button y=784..816 sits below provider title y=759..781. Provider span has `line-clamp-1`. |
| 7 — Grid card eligibility lines | PASS (mobile + desktop) | Eligibility element class: `line-clamp-4 px-6 pt-4 text-xs leading-relaxed md:line-clamp-3 text-on-surface-variant`. Computed `webkit-line-clamp` = "4" on mobile (height 94px ≈ 4 × 19.5px line-height + 16px pt-4); = "3" on desktop (height 58px ≈ 3 × 19.5px). |
| 8 — Comparison sheet width | PASS (mobile + desktop) | Mobile: `[data-slot="sheet-content"]` bounding rect `{x:0, y:0, width:390, height:844}` — full viewport. All five row headers (Amount, Days Left, Deadline, Education Level, Eligibility) present in the sheet. Desktop: sheet rect `{x:384, y:0, width:896, height:800}` — width 896 = `max-w-4xl` (56rem) cap, not full screen. |

## Overall Verdict
**ALL PASS.** Every one of the 8 targeted fixes meets its expected behavior on both mobile (390×844) and, where applicable, desktop (1280×800).

## Notes / Observations (scoped to the 8 tests)
- Test 6 list-view assertion has zero overlap risk because of the size-11 compare button being absolutely on the right edge inside its own `pointer-events-auto relative z-10 flex size-11 shrink-0` cell, with provider text in a sibling `flex min-w-0 flex-1 flex-col` cell using `line-clamp-1`. The two never share horizontal space.
- Test 8 mobile sheet does show an internal horizontal scroll on the comparison data grid (`grid w-full gap-0` has scrollWidth 453 > clientWidth 326) when comparing 3 scholarships — this is expected scroll *inside* a full-width sheet, not clipping of the sheet itself; the test wording allows this.
- The compare store appears to persist 3 items across reloads (zustand persist), which made Test 8 setup trivial — no extra clicking required.

## Dev server
Stopped (verified via `curl -sf http://localhost:3000` returning failure after `kill`).
