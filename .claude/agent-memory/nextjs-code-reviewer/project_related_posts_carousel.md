---
name: project_related_posts_carousel
description: Related-posts carousel inert/slidesInView fix: Embla IntersectionObserver timing, initialized.current race, event-listener leak in carousel.tsx, counter semantics
metadata:
  type: project
---

## `related-posts.tsx` — `inert` driven by `slidesInView` (fixed May 2026)

Bug: `inert={!isActive}` used `selectedScrollSnap()` (single index), so all non-selected but visible slides became inert. Fixed by tracking `api.slidesInView()` in state and guarding with `inView.length === 0` on initial render.

**Key Embla facts verified from source:**
- `SlidesInView` uses an `IntersectionObserver` that emits `slidesInView` only when entries change — it does NOT fire synchronously on init. The first emission is asynchronous (after IO callback).
- `init` event fires via `setTimeout(() => eventHandler.emit('init'), 0)` — also async. So calling `sync()` eagerly in the `useEffect` after the `initialized.current` guard is the correct way to seed state.
- `api.slidesInView()` is safe to call at any time (reads `intersectionEntryMap`); returns `[]` until the first IO callback fires.

**Remaining issues found in review:**
- `initialized.current` guard is redundant: the `[api]` dep means the effect runs exactly once per api instance. The `if (!initialized.current)` block is dead code for all practical purposes.
- `carousel.tsx` leaks the `reInit` listener: it registers `api.on("reInit", onSelect)` but only calls `api.off("select", onSelect)` in cleanup — `reInit` is never removed.
- `inView.length === 0` fallback (show-all on initial render) is correct given Embla's async IO timing, but has an edge case: a carousel with only off-screen slides on load would briefly show them as interactive.
- `current` (selectedScrollSnap) is still load-bearing for the "X / Y" counter display.
- The `inert` prop on `CarouselItem` passes through to a `<div>` — valid HTML, but `inert` is a boolean attribute in React 19; passing `inert={false}` correctly omits the attribute (React 19 changed this from the string `"false"` behavior in React 18).

**Why:** Counter semantics and accessibility for multi-visible-slide carousels.
**How to apply:** When reviewing future carousel work, check that `slidesInView` state is seeded eagerly (can't rely on the IO event firing before first paint), and verify `carousel.tsx` cleanup removes all registered listeners.
