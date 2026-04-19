---
name: Header Architecture Patterns
description: Key architectural decisions and known issues in the header component after the gooey nav refactor
type: project
---

Header uses a render-prop wrapper `ScrollAnimatedHeader` that drives DOM transforms directly via refs to avoid re-renders, but still gates a React state update (`setIsScrolled`) for the goo merge/split animation. This is intentional — the DOM-only path handles hide-on-scroll, while the state path handles the pill shape transition.

`useSupportsGoo` uses `useSyncExternalStore` with an empty subscribe function `() => () => {}` — this is a valid mount-only snapshot pattern (never re-subscribes) but could be replaced by a `useRef` + `useEffect` pattern for clarity.

Motion `animate={{ gap: ... }}` on a flex container is not reliably supported by Motion — `gap` is not a first-class Motion-animatable property. It works via the WAAPI path in some browsers but may silently fail or animate as a discrete jump.

The SVG gooey filter (`#goo-nav`) is placed inside the `<header>` element which itself is `position: fixed`. The filter only works correctly when the elements consuming `filter: url(#goo-nav)` are descendants of or siblings to the SVG — confirmed fine here since the nav's `motion.div` is a sibling inside the same `<header>`.

The double-`position: fixed` issue: `ScrollAnimatedHeader` wraps in `div.fixed.top-0`, and the inner `<header>` also has `fixed inset-x-0 top-0`. This creates two stacked fixed ancestors — the inner `<header>` escapes the outer wrapper's transform because fixed elements are positioned relative to the viewport, not their nearest positioned ancestor (unless a `transform` is set on the ancestor). Since `ScrollAnimatedHeader` uses `transform: translateY(...)`, the inner `<header>` IS captured by that containing block. This means the layout behaves correctly but is fragile — any future removal of the transform will break the hide-on-scroll behavior.

The skip link `href="#main-content"` is confirmed to match `id="main-content"` in `page-shell.tsx`.

**Why:** Documented after reviewing the gooey nav refactor (2026-04-19)
**How to apply:** Reference when reviewing future header changes or debugging scroll/animation issues.
