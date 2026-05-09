# Home + Scholarships Features Review

## Summary

Overall the feature surface is well-considered: nuqs filter sync is robust (validation + clamping on mount, route-replace not push, sensible default elision), the comparison store correctly defers hydration to avoid SSR mismatch, and most modal/sheet patterns lock scroll, trap focus, and restore focus on close. The biggest concrete risks are (1) Zustand store consumption — every card subscribes to the *entire* store, so a single `toggle()` re-renders all 12 cards on the page; (2) the home `CoverflowCarousel` swallows all scholarships into the DOM with `motion.div` per item plus measurement-driven re-runs; (3) the Spline hero isn't using `next/dynamic` (`React.lazy` is suboptimal in Next 16 App Router for SSR-skip semantics) and forces a `key={resolvedTheme}` re-mount on every theme toggle, downloading both `.splinecode` files in succession; (4) some accessibility/UX gaps around the carousel announcer, ESC handling, and focus trap autofocus picking the close button. There's also a dead `MatchBadge` component and unused `useRef` import patterns.

## Critical issues

- `src/components/home/hero-section.tsx:13-15` — `lazy(() => import("./spline-scene"))` instead of `next/dynamic`. In Next 16 App Router, `next/dynamic` with `ssr: false` is the supported way to skip server rendering for a heavy bundle; `React.lazy` works but loses Next's loading-state hooks, prefetch hints, and default chunk-splitting heuristics. The component is already `"use client"` so SSR isn't actually happening, but the bundle is loaded synchronously into the parent client chunk regardless of viewport. **Fix:** `const SplineScene = dynamic(() => import("./spline-scene").then(m => m.SplineScene), { ssr: false, loading: () => <Fallback /> })` and drop the `Suspense` wrapper.

- `src/components/home/hero-section.tsx:48` — `key={resolvedTheme}` forces a full re-mount of `<SplineScene>` on every theme toggle. This downloads the alternate `.splinecode` (~hundreds of KB), unloads the WebGL context, and recreates it. With `withCacheBust` returning a new `?v=Date.now()` string in dev (`spline-scenes.ts:17`), the URL also changes on every render in dev, defeating the browser cache. **Fix:** memoize the URL behind `useMemo([resolvedTheme])`, drop `key=`, and let `<Spline scene={...}>` swap scenes via the runtime API. Move `withCacheBust`'s dev branch to module-evaluation time so it computes once per session.

- `src/components/scholarships/scholarship-card.tsx:38` and `scholarship-list-card.tsx:52` — `const { toggle, isSelected } = useComparisonStore()` subscribes the card to the *full* store. Any state change in any card (toggle, sheet open, sheet close, clear) re-renders every visible card. With 12 cards/page that is 12 unrelated re-renders per click, plus tooltip + motion overhead. **Fix:** use selectors: `const toggle = useComparisonStore(s => s.toggle); const compared = useComparisonStore(s => s.selectedIds.includes(scholarship.id))`. Same pattern needed in `comparison-fab.tsx:10` and `comparison-sheet.tsx:28-29`.

- `src/components/home/coverflow-carousel.tsx:340-342` — `scholarshipsProp.filter(...)` runs every render (no `useMemo`) and the inline `new Date()` invalidates downstream memos that depend on `scholarships`. With autoplay re-rendering the parent every 8s and `setActiveIndex` firing on each tick, this rebuilds the array repeatedly, which feeds into `total = scholarships.length` and the live region. **Fix:** wrap in `useMemo(() => scholarshipsProp.filter(s => isScholarshipActive(s, new Date())), [scholarshipsProp])` and pull `new Date()` to a stable ref captured on mount, or pass `SESSION_DATE` (already used elsewhere) for consistency.

- `src/hooks/use-scholarship-filters.ts:180-214` — Mount-only sanitization runs once with `[]` deps, but during that single pass it conditionally calls up to 8 `setXUrl(null)` setters back-to-back. Nuqs batches within a tick by default, but each call goes through a `useEffect` cycle and the in-flight `pageUrl` is *not* reset by this cleanup, leaving a potentially stale `?page=N` against a sanitized result set. **Fix:** add `setPageUrl(null)` to the sanitization branch, or wrap the sanitization in `startTransition` and assert page-bounds via the existing `safePage` clamp in `scholarship-grid.tsx:96-100` (which currently runs *after* sanitization and depends on it).

## High-impact improvements

- `src/components/home/coverflow-carousel.tsx:441-483` — Every scholarship renders a `<motion.div>` simultaneously, even those at offset > 2 (which set opacity 0 but stay in the DOM with a transform animation). With 10 items that's manageable, but the comment at line 78 ("Beyond visible range — hide but keep in DOM") suggests the design accepts indefinite growth. If `carouselItems` ever expands past ~20, this will start to hurt. **Fix:** virtualize to render only `[active-2 ... active+2]` (5 cards), keying so layout transitions still animate. Use `aria-hidden` for off-screen items so the live region remains the canonical announcer.

- `src/components/home/coverflow-carousel.tsx:436-438` — The live region announces `${scholarships[activeIndex].name} — ${provider}` on every index change, including autoplay ticks. SR users will be interrupted every 8s. **Fix:** gate the announcement on user intent — only update the live region on keyboard, click, or drag, not on the autoplay timer. Pause the autoplay entirely while the carousel has focus (currently only mouse-enter pauses).

- `src/components/home/coverflow-carousel.tsx:486-503` — Prev/Next buttons use `opacity-100 transition-opacity group-hover:opacity-100` (the comment says "visible on hover" but both states are 100). On touch devices the buttons are always visible, but the `tabIndex={0}` carousel container above can be reached before the buttons, and Prev sits at left while ArrowLeft is already wired on the parent — Tab order announces three controls for the same gesture. **Fix:** decide one model; either drop the `tabIndex={0}` on the container (keyboard users use Prev/Next) or hide the buttons from AT with `aria-hidden` and rely on the container.

- `src/components/scholarships/expanded-scholarship.tsx:283` + `use-focus-trap.ts:31-33` — `useFocusTrap` autofocuses the *first* focusable, which here is the close button (`expanded-scholarship.tsx:83-97`). Best-practice for dialogs is to focus the dialog itself (or the heading) so SR users hear the title before the close affordance. **Fix:** if `container.querySelector('[data-autofocus]')` exists focus it, else focus the container with `tabIndex=-1` and let SR announce `aria-labelledby="expanded-dialog-title"`.

- `src/components/scholarships/comparison-fab.tsx:32-34` — `aria-live="polite"` lives on the *button* together with `aria-label`. ARIA live regions are usually plain status containers; combining live with a button label means the entire label re-announces on every count change ("Compare 3 scholarships"). **Fix:** keep the button's `aria-label` static and add a sibling `<span className="sr-only" aria-live="polite">{count} selected</span>`.

- `src/components/scholarships/comparison-sheet.tsx:31-37` — `selectedIds.map(id => scholarships.find(s => s.id === id))` is O(n·m) per render against the full corpus (5,000+ scholarships). With selectedIds capped at 3 it's fine for now, but the lookup is repeated every time the sheet re-renders due to the full-store subscription. **Fix:** combine with the selector fix above; better, build a `Map<id, Scholarship>` once at module scope or via `useMemo([scholarships])` in the page.

- `src/components/home/hero-section.tsx:22` — `useEffect(() => { startTransition(() => setMounted(true)) }, [])` defers mount to a transition, but `setMounted(true)` is the only state setter and there's no concurrent render benefit. The `mounted` gate exists purely to read `resolvedTheme` after hydration; `useHasMounted` (already in this codebase, `src/hooks/use-has-mounted.ts`) does this without a state update inside `useEffect`. **Fix:** swap to `const mounted = useHasMounted()`.

- `src/components/scholarships/scholarship-grid.tsx:62-83` — `filterAndSort` runs against the *full* corpus on every render-causing change. With 5,000+ scholarships the search-on-keystroke path is doing string concatenation + `toLowerCase()` per item per keystroke. The memo deps are correct, but the search itself isn't debounced. **Fix:** debounce `filters.searchQuery` reads in `filterAndSort` (e.g., `useDeferredValue(filters.searchQuery)` and pass that into `filterAndSort`); React 19 makes this trivially cheap.

- `src/components/scholarships/scholarship-grid.tsx:96-100` — `useEffect` with `[filters, safePage]` triggers when *any* filter setter identity changes. Because `useScholarshipFilters` returns a fresh object every render, this effect will fire much more often than just on safePage drift. **Fix:** narrow deps to `[filters.page, safePage, filters.setPage]`, or memoize the returned object.

- `src/components/scholarships/scholarship-grid.tsx:103-117` — Lenis resize timer fires on the same broad dependency set, with a 100ms `setTimeout` inside `useEffect`. Each filter keystroke schedules a resize. **Fix:** only call `lenis.resize()` after the visible items actually change; gate on `[visibleItems.length, filters.layout]` and drop the rest.

- `src/components/home/coverflow-carousel.tsx:393-406` — `dragConstraints={{ left: 0, right: 0 }}` on a parent with `pointer-events-none` (line 447). Drag still works because Motion attaches handlers directly, but pointer-events-none prevents hover/focus on the wrapper, which means `setIsDragging(true)` fires only when the user grabs a child via the inner `pointer-events-auto`. The cancellation contract works, but on touch devices any vertical scroll inside the carousel area routes through this drag handler — there's no `dragSnapToOrigin` and `info.offset.y` isn't checked. **Fix:** add `dragDirectionLock` or check `Math.abs(info.offset.x) > Math.abs(info.offset.y)` before paginating, otherwise vertical page scrolls can trigger horizontal nav.

- `src/data/scholarships.ts:60` — `scholarships` is imported as a 5,360-line JSON literal at module load. Every page that imports anything from `@/data/scholarships` (constants, helpers, types) drags the full corpus into its bundle. **Fix:** split helpers/constants/types into a separate file (`scholarships-meta.ts`) and only import the JSON corpus from pages that actually list scholarships. The home page's `featured-scholarships.tsx` already only needs the first 10 — that import alone pulls in the whole file.

## Medium-impact improvements

- `src/components/scholarships/match-badge.tsx` — Component is defined and exported but has zero references in `src/`. Dead code. **Fix:** delete or wire into the grid card if originally intended for relevance scoring.

- `src/components/scholarships/comparison-sheet.tsx:42-46` — `<Sheet onOpenChange={open => { if (!open) closeSheet() }}>` — the `open` value is ignored when truthy. If Base UI ever programmatically opens the sheet (e.g., trigger pattern), the store and the controlled state will desync. **Fix:** `onOpenChange={open => open ? openSheet() : closeSheet()}`.

- `src/components/scholarships/expanded-scholarship.tsx:285-292` — ESC handler attaches/detaches a `keydown` listener to `window`, while `useFocusTrap` attaches another `keydown` to `document`. Both fire for every keystroke while the modal is open. Base UI's `<Dialog>` (Sheet uses it) handles ESC + focus trap natively. **Fix:** consider migrating `ExpandedScholarship` to the existing `<Sheet>`/`<Dialog>` primitive used by `ComparisonSheet` — the manual focus-trap + ESC + scroll-lock combo here is already provided by Base UI.

- `src/components/scholarships/scholarship-list-card.tsx:61-83` — `motion.article` with `role="button"` and `tabIndex={0}`. Inside it there are three real buttons (compare, view-details, list-card-CTA arrow). Putting an interactive role on a container with nested interactive descendants is invalid HTML/ARIA — focus order becomes ambiguous and click bubbling depends on `e.stopPropagation()` being reliably called (lines 70, 183, 217). The same anti-pattern is in `scholarship-card.tsx:81-83`. **Fix:** wrap the card content in a real `<button>` for the primary "expand" affordance and lift the secondary actions out of its DOM subtree (sibling buttons positioned absolute), or drop the role and make only the title clickable.

- `src/components/scholarships/scholarship-grid.tsx:282-291` — Grid items wrap `ScholarshipCard` in a `div` with `aspect-3/4 w-full`. The `aspect-3/4` constrains height, but the inner card uses `flex-col` with content of variable length — long names trigger `line-clamp-2`, short names leave a stretched spacer. The aspect ratio is doing CLS prevention work; document why or move it to the card itself so consumers don't need to know.

- `src/components/scholarships/scholarship-filters.tsx:54-56` — `if (isMobile === null) return <div className="min-h-24" />` renders a 6rem placeholder during SSR/hydration. On desktop this means 96px of empty space until JS evaluates the media query. A CSS-driven approach (`hidden lg:flex` / `flex lg:hidden`) would render both branches and let CSS hide the wrong one with zero JS gate. **Fix:** render both `<ScholarshipFiltersMobile>` and the desktop block with responsive `hidden`/`block` classes and drop the JS branch.

- `src/components/home/faq-section.tsx:60-99` — Custom accordion via `<button>` + grid-rows transition. Functional and accessible, but the project already has Base UI primitives. Using `<details>`/`<summary>` or Base UI's Accordion would give animated `aria-expanded` and built-in keyboard semantics for free. Not a bug — opportunity to converge on the design system.

- `src/components/scholarships/award-range-filter.tsx:53` — `onValueChange={(v) => onValueChange(v as [number, number])}` — Slider returns `number[]` but the cast assumes exactly 2 values. With nuqs writing `min` and `max` separately and the Slider being a controlled tuple, this is safe today. **Fix:** add a runtime length-2 assertion, or type the underlying Slider so the cast isn't needed.

- `src/components/scholarships/month-dropdown.tsx:44-53` — `useMemo(..., [])` computes `visibleMonths`/`hiddenMonths` from `new Date().getMonth()` once per mount. If a session crosses midnight on the last day of a month, the dropdown shows stale months. Low probability but documentable. **Fix:** drop the memo (it's a 12-iteration loop) or recompute when the dropdown opens.

- `src/components/scholarships/comparison-sheet-audit-ledger.tsx:13-17` — `parseDeadlineDays` uses `Date.now()` instead of `SESSION_DATE`. The rest of the codebase uses `SESSION_DATE` for deterministic snapshot rendering and tests; this one helper drifts. **Fix:** accept `today` as a parameter, default to `SESSION_DATE`.

- `src/components/scholarships/comparison-sheet-audit-ledger.tsx:46-53` — Grid columns hard-coded to `100px repeat(${items.length}, 1fr)`. With 3 items at long names, on a narrow viewport this overflows the parent sheet (which is `max-w-xl` on `sm:`). The sheet itself is `overflow-y-auto` but not horizontal. **Fix:** wrap in `overflow-x-auto`, or set `min-w-0` on cells with long text.

## Low / nits

- `src/components/home/coverflow-carousel.tsx:373-377` — Autoplay timer's deps include `next` (a `useCallback` that depends on `activeIndex` and `goTo`). Each tick changes `activeIndex` → `next` identity changes → effect re-runs → interval cleared and recreated. Functional but wasteful. **Fix:** capture `next` in a ref and depend on `[shouldReduceMotion, isPaused, isDragging]` only.

- `src/components/home/hero-section.tsx:34-57` — The IIFE `(() => { ... })()` inside JSX adds a stack frame on every render. **Fix:** lift to a `const splineNode` computed above the return.

- `src/components/scholarships/scholarship-grid.tsx:386-401` — `getPageNumbers` could be hoisted outside the component (it is — it's just below the export, in module scope, fine) but it's recomputed on every render. Trivial. **Fix:** wrap in `useMemo([safePage, totalPages])` only if profiling shows it.

- `src/components/scholarships/expanded-scholarship.tsx:309-312` — Outer `motion.div` has `onClick={onClose}` *and* the inner one has `onClick={e => e.stopPropagation()}`. Works, but the backdrop already handles dismiss. The wrapper layer is redundant. **Fix:** drop the `motion.div` wrapper and let the backdrop be the dismiss target.

- `src/components/scholarships/scholarship-card.tsx:53-55` — `layoutId={`card-${scholarship.id}`}` is set conditionally via `disableLayoutAnimation`, but the modal at `expanded-scholarship.tsx:321` also uses `layoutId={`card-${scholarship.id}`}`. Without a `<LayoutGroup>` the shared-layout animation only fires when both nodes are mounted simultaneously; current code unmounts the card (`isExpanded` triggers `opacity: 0`) and mounts the modal — the FLIP transition can drop frames if the card is unmounted before AnimatePresence completes. Functional but worth a profiling pass.

- `src/components/home/featured-scholarships.tsx:11` — `const carouselItems = allScholarships.slice(0, 10)` runs at module load — fine, but the array isn't shuffled or curated; it's just the first 10 from the JSON. The section header reads "Curated for you". Either label honestly or implement curation.

- `src/components/scholarships/scholarship-filters-mobile.tsx:56,281` — Two-state `expandedCategory: EligibilityCategory | null` means only one category can be open at a time. Filter sheets typically allow multiple expanded sections. Confirm with design.

- `src/components/scholarships/scholarship-filters-mobile.tsx:80-85` — `filterBadgeCount` excludes month, but `hasActiveFilters` includes month. The comment at lines 70-72 acknowledges this; intentional asymmetry. Nit: surface this as a named helper to avoid the inline arithmetic drift.

- `src/components/home/spline-scene.tsx:20-27` — `useEffect` with `passive: false` wheel listener. The cleanup is correct, but `blockPageScroll` is unused in the home hero (defaults to false) — dead code path for this scope. Verify still used in `contact` page or remove.

- `src/components/scholarships/scholarship-list-card.tsx:39-45` — `formatDeadlineShort` is duplicated knowledge — `expanded-scholarship.tsx:170` formats the same field as `${deadline}, ${deadlineYear}`, while `scholarship-card.tsx:215-218` uses yet another shape. **Fix:** centralize in `scholarship-utils.ts`.

- `src/hooks/use-parallax.ts:36` — `useRef<HTMLDivElement>(null!)` non-null assertion is a smell. The ref is attached to `<div>` consumers, not all of which guarantee mount. **Fix:** `useRef<HTMLDivElement | null>(null)` and adjust the consumer expectations.

## Notable strengths

- `src/hooks/use-scholarship-filters.ts:180-214` — Excellent URL hardening: validates known values, clamps award range, swaps inverted ranges to defaults rather than silent-swap (preserving paste-link intent), and elides defaults via `setX(null)` so URLs stay clean. The comment explaining `router.replace` semantics is exactly right.

- `src/stores/comparison.ts:46-55` — `partialize` to drop `isSheetOpen` from persistence + `skipHydration: true` paired with `<ComparisonRehydrator>` is the textbook approach for Zustand + Next.js SSR. The accompanying comment is load-bearing and accurate.

- `src/hooks/use-has-mounted.ts` — Using `useSyncExternalStore` to avoid a state-update-in-effect for "are we hydrated" is a cleaner pattern than the common `useState(false)+useEffect` and is well-explained inline.

- `src/components/home/coverflow-carousel.tsx:299-324` — `ReducedMotionFallback` honors `prefers-reduced-motion` with a real snap-scroll alternative (not just "disable animation"), preserving the carousel use case for users who can't tolerate transforms.

- `src/components/scholarships/expanded-scholarship.tsx:263-279` — Focus restoration via `previousFocusRef` captured in `useLayoutEffect` and replayed on `AnimatePresence`'s `onExitComplete` is the correct sequencing — restoring focus mid-exit-animation would visually pull focus to a stale spot.

- `src/lib/scholarship-utils.ts:51-129` — Good separation of concerns: filtering, sorting, level partitioning, and expired partitioning are layered as distinct passes with comments explaining why each ordering rule is preserved. The `matches: false` "dimmed" pattern preserves pagination counts — a thoughtful product call.

- `src/components/scholarships/filter-sheet.tsx:55-64` — `tagCounts` filtered by `isScholarshipActive(s, SESSION_DATE)` so the badge counts agree with the visible set; the comment in `scholarship-grid.tsx:51-55` documents the active-vs-corpus split that drives this consistency.

- `src/components/scholarships/scholarship-grid.tsx:153-164` — "All-on-page-dimmed" detection with a Jump-to-page-N banner is a genuinely thoughtful UX — most filtered grids would just show a confusing blank dimmed page. The fact that `firstMatchingPage !== safePage` is also checked prevents a no-op banner.

- `src/components/scholarships/scholarship-filters.tsx:84-124` — `LayoutGroup` + shared `layoutId="scholarship-filter-highlight"` for the active-tab pill is the canonical Motion pattern and avoids manual offset math.
