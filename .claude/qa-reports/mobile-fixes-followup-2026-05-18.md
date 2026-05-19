# QA Report: Mobile Fixes Followup (Branches 1, 2, 3, 4, 5, 7, 8, 9)

**Date**: 2026-05-18
**Tester**: qa-test-engineer
**Scope**: Verify the eight remediation branches on `fix/tablet-scroll-fixes-followup` after mobile QA pass
**Build/Commit**: `da37dd6` on `fix/tablet-scroll-fixes-followup`

## Summary
Seven of eight branches verified PASS on mobile viewports (320, 375, 414). Branch 5 (mobile nav backdrop) FAILS: the backdrop renders constrained to the header's 62×390 box instead of covering the viewport, because the `ScrollAnimatedHeader` wrapper writes an inline `transform` onto its `position: fixed` div, which establishes a containing block for descendant `position: fixed` children. The backdrop element itself is correct — the bug is upstream in the header wrapper.

## Test Coverage
- [x] Functional behavior
- [x] Responsive (320×568, 375×667, 414×896)
- [x] Accessibility (keyboard + focus where applicable)
- [x] Design system compliance
- [x] Performance (smoke)
- [x] Edge cases (filter combinations, long content)
- [ ] Cross-browser — skipped, Chromium only via Playwright MCP for this pass

## Per-Branch Verdict

| Branch | Area | Verdict |
|--------|------|---------|
| 1 | Scholarships filter touch targets | PASS |
| 2 | Pagination total reflects active filter | PASS |
| 3 | /contact 320px row overflow | PASS |
| 4 | /privacy Callout overflow with long email | PASS |
| 5 | Mobile nav backdrop fullscreen coverage | **FAIL** |
| 7 | Blog post H1→H3 heading skip | PASS |
| 8 | Mobile menu Escape-key dismissal | PASS |
| 9 | Legal `formatLastUpdated` timezone | PASS |

## Findings

### Critical Issues (blocks release)

1. **Mobile nav backdrop confined to header box**
   - **Where**: `src/components/ui/header/header.tsx:30-46, 49-56` (the `ScrollAnimatedHeader` wrapper); affects the backdrop element at `src/components/ui/header/mobile-menu.tsx:316-324`
   - **Steps to reproduce**: viewport 375×667, navigate to `/`, tap hamburger button. Inspect the `motion.div` with classes `fixed inset-0 z-40 bg-on-surface/40 glass-heavy lg:hidden`.
   - **Expected**: bounding box equal to viewport (`0,0,375,667`); the entire page behind the menu darkens.
   - **Actual**: bounding box equal to header wrapper (`x≈0, y≈0, width≈375, height≈62` initially, growing only as the header's own children grow). Only the top strip darkens; content below the header remains fully lit and interactive.
   - **Root cause**: `header.tsx` line 50-53 renders `<div ref={headerRef} className="fixed top-0 left-0 right-0 z-50">`. Lines 31 and 45 imperatively assign `headerRef.current.style.transform = "translateY(...)px"`. Per CSS Transforms spec, any non-`none` `transform` on an element causes it to become the containing block for its `position: fixed` descendants — so the backdrop's `inset-0` resolves against the header box, not the viewport.
   - **Suggested direction**: portal the backdrop + `MobileNav` to `document.body` (e.g. via `createPortal`), OR move the backdrop out of the `ScrollAnimatedHeader` subtree so its containing block remains the viewport, OR drive the scroll-hide via `top` offset rather than `transform` on the wrapper.
   - **Evidence (computed style snippet captured via `getBoundingClientRect()`)**:
     ```
     wrapper div: transform = "matrix(1, 0, 0, 1, 0, 0)"  (identity, still non-none)
     backdrop:   getBoundingClientRect() = {x:0, y:0, width:375, height:62}
     viewport:    {innerWidth:375, innerHeight:667}
     ```

### High Priority — none

### Medium Priority — none

### Low Priority / Polish — none in scope

### Verified Working
- Branch 1: filter chip min-height 44px on `/scholarships` at 375px (previously documented as 40px in `project_a11y_touch_targets.md`)
- Branch 2: applying "Merit" filter updates pagination total from 24 → 6
- Branch 3: `/contact` 320×568 produces no horizontal scroll, email row wraps under copy button
- Branch 4: `/privacy` 320×568 Callout no longer overflows; `min-w-0` applied to flex child
- Branch 7: `/blog/[slug]` H2 now follows H1, no H3 skip
- Branch 8: Escape key dismisses mobile menu and returns focus to trigger
- Branch 9: legal pages render the correct date regardless of viewer timezone

## Responsive Matrix
| Viewport | Status | Notes |
|----------|--------|-------|
| 320×568  | PASS except Branch 5 | Branches 3, 4 verified at this width specifically |
| 375×667  | PASS except Branch 5 | Primary verification width |
| 414×896  | PASS except Branch 5 | No regressions observed |

## Accessibility Audit
- Keyboard nav: Escape dismisses mobile menu (Branch 8 PASS); focus returns to trigger button
- Touch targets: filter chips ≥ 44px (Branch 1 PASS)
- Reduced motion / transparency: backdrop still uses `glass-heavy` class which has the existing fallbacks; not regressed
- Contrast: not re-audited in this pass

## Recommendations
1. Fix Branch 5 by portaling the mobile menu DOM out of `ScrollAnimatedHeader`. The cleanest patch is wrapping the `<AnimatePresence>` block in `mobile-menu.tsx` with `createPortal(..., document.body)` (guarded for SSR).
2. Add a Playwright regression: open mobile menu at 375×667, assert backdrop `boundingBox().height >= viewport.height - 10`.
3. After fixing, re-verify Branch 5 then proceed to cross-browser (Firefox, WebKit) before merging.

## Test Artifacts
- No Playwright spec files added in this pass (exploratory verification via Playwright MCP).
- Dev server (`npm run dev` PID 63809 / next PID 63830) stopped at end of session.
