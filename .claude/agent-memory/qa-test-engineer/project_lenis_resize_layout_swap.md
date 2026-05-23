---
name: lenis-resize-after-layout-swap
description: After AnimatePresence-wrapped layout swaps (grid↔list, etc.), Lenis can keep stale scrollHeight and cap wheel scroll short of the page bottom
type: project
---

When a route uses `<AnimatePresence mode="wait">` to swap layouts (e.g. `scholarship-grid.tsx` grid↔list, `blog-grid.tsx` could have the same pattern), the existing `setTimeout(lenis.resize, 100)` safety-net in the same component **fires too early** — before the incoming layout has mounted. Result: Lenis snapshots the *transitional* DOM (often the shrinking outgoing layout) and never resizes again, capping wheel/trackpad scroll short of the true page bottom by however many pixels the new layout grew.

**Why:** The `mode="wait"` exit animation (typically 250 ms in this codebase) holds the old layout in the DOM, then the new layout mounts. The 100 ms resize fires at ~150 ms, in the gap between exit completing and new layout mounting, when document height is at its smallest. Lenis's `autoResize: true` in `smooth-scroll-provider.tsx` does not catch the subsequent growth — likely because it observes `<html>` (fixed at `h-full`) rather than `<body>`.

**How to apply:**
- When QA-ing any layout-swap interaction (grid ↔ list, pagination, filter open/close that changes height), specifically test by toggling AND attempting to scroll with the wheel afterward. Don't trust `window.scrollTo` in tests — it bypasses Lenis.
- To detect this programmatically, introspect Lenis via React fiber walk: starting at `__reactContainer$...` on `<body>`/`<#__next>`, recursively look for `node.memoizedState.lenis` (it's stored in a useRef on `ReactLenis`'s host element). Compare `lenis.dimensions.scrollHeight` to `document.documentElement.scrollHeight`. Drift = bug.
- Keyboard scroll (`End`, `PageDown`) bypasses Lenis's wheel cap, so functional keyboard QA will not surface this bug. You must test with wheel/trackpad/touch input or by checking Lenis internals directly.
- Bug is **directional**: only manifests when the new layout is *taller* than the old. On mobile (`grid-cols-1`, tall cards), grid → list shrinks the page, so the bug is masked at viewports <640 px.
- Severity scales with viewport: 668 px unreachable at 1440×900, 626 px at 768×1024, 170 px at 1024×768, 0 px at <640 px widths.
- Related files: `src/components/scholarships/scholarship-grid.tsx:110-114`, `src/components/smooth-scroll-provider.tsx`, `src/components/blog/blog-grid.tsx:111-114`.
- Detailed reproduction & evidence: `qa-reports/2026-05-23_scholarships-list-view-scroll-truncation.md`.

See also: [[scholarships-page]] (the page where this bug was first identified).
