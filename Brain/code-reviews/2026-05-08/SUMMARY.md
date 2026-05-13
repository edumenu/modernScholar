# Modern Scholar — Codebase Review Summary

_Reviewed 2026-05-08, re-audited 2026-05-10 against the live tree. Re-audit appendix lives at the bottom of this file under "Status update — 2026-05-10"; the original summary below is preserved unchanged for historical reference._

_Reviewed 2026-05-08 across 5 parallel agent passes (2 × `nextjs-code-reviewer`, 3 × `frontend-engineer`). Source reports:_

- `01-app-routes-and-data.md` — App Router, data layer, sitemap/robots, lib helpers
- `02-providers-and-mdx.md` — Providers, MDX pipeline, build config, Storybook/Vitest
- `03-ui-primitives.md` — `src/components/ui/**`
- `04-home-and-scholarships.md` — Home + Scholarships features, Zustand, nuqs filters
- `05-blog-and-contact.md` — Blog stack, contact page, focus-trap/scroll-lock hooks

The codebase is in **good overall shape**. Every reviewer separately called out the same strengths: Base UI as the consistent a11y foundation, `data-slot` compound patterns, React 19 ref-as-prop, Zod-validated MDX loader, `React.cache` deduplication, thorough glassmorphism accessibility fallbacks in `globals.css`, and the URL-hardening logic in `useScholarshipFilters`. The findings below are about polish and a few real correctness/a11y blockers — not about a broken architecture.

---

## Top 10 issues, ranked

| # | Severity | Location | Issue | Why it matters |
|---|---|---|---|---|
| 1 | **Critical** | `src/app/global-error.tsx` (missing) | Root layout has no error boundary. A provider crash → blank page with no fallback. | App-wide outage on any layout-level exception. |
| 2 | **Critical** | `package.json:8` + `next.config.ts:6` | `"start": "next start"` while `output: "export"` is set. `npm start` after `npm run build` will fail with "Could not find a production build". | Deployment surprise; misleads anyone who runs `start` to verify a static-export build. |
| 3 | **Critical** | `src/components/ui/pagination/pagination.tsx:52-53` | `PaginationLink` passes `nativeButton={false}` and `render={<a/>}` to `Button`, but `Button` doesn't forward `render` → silently renders `<button>` instead of `<a>`. | Breaks `aria-current="page"` semantics, middle-click open-in-new-tab, and right-click "Copy link". |
| 4 | **Critical** | `src/hooks/use-focus-trap.ts:26-60` | Trap never captures `document.activeElement` on activation, never restores focus on cleanup. | All consumers (`mobile-menu`, `comparison-sheet`, `scholarship-filters-mobile`, `expanded-scholarship`) leak focus to `<body>` after close — SR users perceive focus going "nowhere." |
| 5 | **Critical** | `src/lib/pretext/pretext-hooks.stories.tsx:559-632` | `CLSPrevention` story calls `useTextLayout` twice inside an object-literal `render` function — Rules of Hooks violation. Other stories in same file already follow the named-component pattern. | Storybook hot reloads / concurrent renders → "Invalid hook call" or stale values. |
| 6 | **High** | `src/components/scholarships/scholarship-card.tsx:38`, `scholarship-list-card.tsx:52`, `comparison-fab.tsx:10`, `comparison-sheet.tsx:28-29` | All consume `useComparisonStore()` without selectors → entire store subscription, full re-render of every card on any toggle. | 12 unrelated card re-renders per single click on the scholarships page. |
| 7 | **High** | `src/components/home/hero-section.tsx:13-15, 48` | Spline hero uses `React.lazy` (not `next/dynamic`) and `key={resolvedTheme}` forces a full WebGL teardown + alternate `.splinecode` fetch on every theme toggle. | Massive download + re-init on each theme switch; `withCacheBust`'s dev `?v=Date.now()` also defeats browser cache. |
| 8 | **High** | `src/app/blog/[slug]/page.tsx:77` | Dynamic MDX `import()` has no try/catch; `dynamicParams = false` protects the happy path but a resolution failure surfaces as an unhandled server exception. | Brittle failure mode in static export. |
| 9 | **High** | `src/components/blog/blog-grid-skeleton.tsx:77-80` and divergent featured/non-featured pages | Skeleton always renders 8 cards + featured hero placeholder; real grid renders 9 on pages without a featured post → guaranteed CLS once `loading.tsx` is added. | First-paint layout shift on `/blog` pages 2+. |
| 10 | **High** | `src/components/ui/sheet/sheet.tsx:31-33` | `cn(... className \|\| "glass-elevated")` short-circuits the default whenever consumer passes any class (even `"opacity-0"`). | Default glass treatment silently lost the moment someone customizes the overlay. |

---

## Cross-cutting themes

### Theme A — Glassmorphism rule violations
SystemDesign forbids glass on Z-1 (cards) and requires `glass-*` utilities on Z-2+ for the `prefers-reduced-transparency` and `prefers-contrast: more` fallbacks. Several spots break this:
- `src/components/ui/header/mobile-menu.tsx:288-296, 257-263` — hand-rolls `backdrop-blur-md`/`backdrop-blur-2xl` instead of `glass-heavy`/`glassPill`. Bypasses the fallbacks defined in `globals.css:449-512`.
- `src/components/ui/dialog/dialog.tsx:34-39` — uses raw `bg-black/80 supports-backdrop-filter:backdrop-blur-xs` instead of `glass-heavy`.
- `src/components/blog/blog-card-featured.tsx:73-76` — sole glass-on-card violation in the blog stack.

### Theme B — Zustand full-store subscriptions
Comparison store is used without selectors in 4 files (item #6 above). Same anti-pattern likely lurks elsewhere if any other store is added. Adopt the convention `useStore(s => s.field)` everywhere.

### Theme C — `mounted` gating in place of CSS-driven hydration
- `src/components/contact/contact-form-section.tsx:153-184` — `MobileContactImage` defeats `<Image priority>` by gating on a post-effect `mounted` flag. A `<picture>` with `media="(prefers-color-scheme: dark)"` lets the browser pick the right asset before JS runs.
- `src/components/ui/header/theme-toggle.tsx:14-18` — uses `useSyncExternalStore` as a mounted-check while the codebase already has `useHasMounted` for this exact purpose.
- `src/components/scholarships/scholarship-filters.tsx:54-56` — JS branch on `isMobile` could be a CSS `hidden lg:flex` / `flex lg:hidden` pair.

### Theme D — Missing per-segment loading/error boundaries
- `src/app/blog/page.tsx`, `src/app/contact/page.tsx` — no `loading.tsx` or `error.tsx` (only `[slug]` has them). Combined with item #9 above, this is what saves the skeleton CLS issue *for now*.

### Theme E — Untyped metadata + missing home-page metadata
- `src/app/blog/page.tsx:5`, `contact/page.tsx:5`, `privacy|terms|cookies/page.tsx:1` — `export const metadata = {...}` with no `Metadata` type → malformed OG/Twitter fields silently accepted.
- `src/app/page.tsx` — no `metadata` at all; home page inherits the generic root layout title.

### Theme F — Reading-progress / scroll-tied perf
- `src/components/blog/reading-progress.tsx:45-66` — every scroll frame: `Math.round` + 2 React state setters + `getElementById` + `getBoundingClientRect` per heading. Should be rAF-throttled with cached refs and `useMotionValue`/`useTransform` instead of state.
- `src/components/blog/reading-progress.tsx:32-36` — `["start start", "end end"]` reaches 100% when article bottom hits viewport bottom, not when reader finishes; should be `["start start", "end start"]`.

### Theme G — Inverted lib ↔ hook dependency
- `src/lib/scholarship-utils.ts:5-7` — re-exports `Month`/`MonthFilter` types from `@/hooks/use-scholarship-filters`. Move types into `src/lib/constants.ts` so the hook depends on lib, not the reverse.

### Theme H — `prefers-reduced-motion` coverage gaps
- `src/components/blog/reading-progress.tsx:90-94, 117-129` — spring + scale celebration animations not gated.
- `src/components/ui/four-oh-four/not-found-client.tsx:32-41` — 8 `motion.div`s with infinite mirror animations; reduced-motion guard exists but item count is heavy on low-end devices regardless.

### Theme I — Duplicate / legacy structural-shape types in blog
The five blog components carry `BlogCardPost`/`BlogGridPost`/`BlogDetailPost`/etc. structural duplicates with comments referencing a "T08/T11/T14 cascade" migration to `@/data/blog-posts`. That file no longer exists (migration is complete). Replace duplicates with `Pick<BlogPost, ...>` or import `BlogPost` directly.

---

## Quick wins (≤30 min each)

1. Create `src/app/global-error.tsx` (template provided in report 01).
2. Remove `"start": "next start"` from `package.json` (or remove `output: "export"` — pick one).
3. Wrap dynamic `import()` in `blog/[slug]/page.tsx:77` with try/catch → `notFound()`.
4. Capture + restore focus in `use-focus-trap.ts` cleanup (one ref + 2 lines).
5. Fix `Sheet` overlay default: `cn("...", className ?? "glass-elevated")`.
6. Wrap `CLSPrevention` story render body in a named component (matches sibling stories).
7. Annotate the 5 untyped metadata exports with `Metadata` type.
8. Add `metadata` export to `src/app/page.tsx`.
9. Add `src/app/blog/loading.tsx`, `src/app/blog/error.tsx`, `src/app/contact/loading.tsx`.
10. Add privacy/terms/cookies to `sitemap.ts`; replace `new Date()` with stable build-date literals.
11. Delete dead `src/components/scholarships/match-badge.tsx`.
12. Delete duplicate `src/components/ui/table.tsx` (keep `table/table.tsx`).
13. Convert all `useComparisonStore()` calls to selector form.
14. Replace `key={resolvedTheme}` on `<SplineScene>` with `useMemo`-cached URL.
15. Fix `--font-geist-mono` dangling reference in `globals.css:12` (load font or remove token).
16. Add `disableTransitionOnChange` and `enableColorScheme` to `<ThemeProvider>` in `layout.tsx:52`.

## Medium initiatives (a couple hours each)

- **Migrate `Slider` from `@radix-ui/react-slider` to `@base-ui/react/slider`** to drop the second a11y engine from the bundle.
- **Add `remark-gfm` to `next.config.ts:21`** — tables, strikethrough, task lists currently render as raw text.
- **Migrate `ExpandedScholarship` to the `Sheet`/`Dialog` primitive** — eliminates manual focus-trap + ESC + scroll-lock duplication; Base UI handles all three natively.
- **Split `src/data/scholarships.ts`** — separate the 5,360-line JSON corpus from helpers/constants/types so `featured-scholarships.tsx` doesn't pull the full corpus.
- **Refactor `reading-progress.tsx`** to rAF + cached refs + `useMotionValue`/`useTransform` for the percentage display (no React state on scroll).
- **Flatten `contact-form-section.tsx`** — split into 4 sibling files (`nudge-arrow`, `copy-email-button`, `question-routing`, `mobile-contact-image`).
- **Remove inverted `Month`/`MonthFilter` dependency** — move types into `src/lib/constants.ts`.
- **Replace structural-shape `BlogCardPost`/`BlogGridPost`/etc. types** with `Pick<BlogPost, ...>`; delete stale "T08/T11/T14" comments.
- **Fix nested-interactive markup** in `scholarship-card.tsx:81-83`, `scholarship-list-card.tsx:61-83`, `blog-card.tsx:147-162`, `blog-card-featured.tsx:117-128` — `<a><button>` and `role="button"` containers wrapping real buttons.

## Larger initiatives (decide on direction)

- **Drop `--webpack` flag** from `dev`/`build` scripts → adopt Turbopack default. Verify Spline + remark plugins compile under Turbopack first; document any blockers in `next.config.ts`.
- **Decide static export vs server runtime** — `output: "export"` forces image-optimization off, blocks server actions, and conflicts with `next start`. If contact form ever needs a server action, this needs to flip.
- **Establish a typecheck script + CI gate** — `"typecheck": "tsc --noEmit"` plus a pre-commit hook. `next build` doesn't always fail on TS errors.
- **Enable `noUncheckedIndexedAccess`** in `tsconfig.json` — codebase already codes defensively (`use-container-width.ts` etc.), so adoption cost is low.

---

## Skip / deprioritize

- **`src/lib/seasons.ts`** dead exports — flagged by report 01 as low priority. Remove only if you confirm no other consumer.
- **CVA migration of `Card`** (report 03) — works fine without it; only worth it when adding `tinted`/`outlined` variants.
- **Per-character `motion.span` rendering in `AnimatedLines`** — flagged as observable on low-end devices but not a real bug; defer until profiling justifies it.
- **`Tooltip` `delay = 0` default** — preference, not a bug.
- **Inline-style → utility migration in `blog-card-featured.tsx:55-67`** — cosmetic, no functional change.

---

## Notable strengths (do not regress)

- `src/lib/blog.ts` — Zod validation, duplicate-slug detection, `React.cache` dedup, draft gating, well-documented `getRelatedPosts` ranking algorithm.
- `src/hooks/use-scholarship-filters.ts:180-214` — URL hardening with clamping, default elision, route-replace semantics.
- `src/stores/comparison.ts:46-55` — `partialize` + `skipHydration` + `<ComparisonRehydrator>` is the textbook Zustand-on-Next pattern.
- `src/hooks/use-has-mounted.ts` — `useSyncExternalStore`-based hydration check, cleaner than `useState`+`useEffect`.
- `src/app/globals.css:449-512` — full glassmorphism a11y coverage (`prefers-reduced-transparency`, `prefers-contrast: more`, `@supports not (backdrop-filter)`).
- `src/app/blog/[slug]/page.tsx` — correctly types `params: Promise<{ slug: string }>` (the Next 15+ breaking change many codebases miss).
- `src/components/ui/header/mobile-menu.tsx:227-302` — `aria-expanded` + `aria-controls` + focus return + `useFocusTrap` (modulo theme C fix needed).
- `MotionConfigProvider` + `reducedMotion="user"` at the root — ensures every Motion animation respects user preference without per-component guards.
- `.storybook` + Vitest 3-project setup (unit/jsdom/browser-Playwright) — high-fidelity testing for visual components.
- `src/components/scholarships/scholarship-grid.tsx:153-164` — the "all-on-page-dimmed" detection with Jump-to-page-N banner is a thoughtful UX call most filtered grids don't bother with.

---

## Recommended order of action

1. **Today** — items 1, 2, 3, 4 (the 4 critical-severity findings).
2. **This week** — Quick wins #5 through #16 (most are <15 min each).
3. **Next sprint** — Medium initiatives, prioritizing the Zustand selector migration (theme B) and the reading-progress refactor (theme F) — both have measurable perf impact.
4. **Roadmap** — Larger initiatives (Turbopack, static-vs-server, typecheck gate). Treat `output: "export"` direction as a strategic decision, not a fix.

Total surface area: 5 critical, ~20 high-impact, ~30 medium, ~25 low/nits across all five reports. Roughly 8 hours of focused work to clear everything from "critical" through "high-impact".

---

# Status update — 2026-05-10

Re-audit of the live tree against the May-08 findings. Original report bodies are unchanged; only this appendix and per-file "Status update" sections reflect 2026-05-10 state.

## Resolved since 2026-05-08

- **Quick win #11** — `src/components/scholarships/match-badge.tsx` deleted (no remaining references).
- **Medium initiative — corpus split** — `src/data/scholarships.ts` reduced from 5,360 → 135 lines (corpus relocated; the home-page `featured-scholarships.tsx` no longer drags the full JSON into its bundle).
- **Quick win #9 — partial** — `src/app/blog/loading.tsx` and `src/app/contact/loading.tsx` were added.

## Resolved-but-incomplete

- The blog/contact `loading.tsx` files shipped without their `error.tsx` siblings, and **without** the skeleton-vs-grid CLS fix from item #9 — see Theme A below. This combination means the original CLS risk that #9 flagged is **now live in production** rather than dormant. Treat as escalated, not resolved.

## Still applicable — Critical/High table (re-audited)

| # | Severity | Status | Note |
|---|---|---|---|
| 1 | Critical | **OPEN** | `src/app/global-error.tsx` still missing |
| 2 | Critical | **OPEN** | `package.json:8` `"start": "next start"` + `next.config.ts:6` `output: "export"` both unchanged |
| 3 | Critical | **NEEDS RUNTIME VERIFICATION** | `pagination.tsx:52-53` unchanged. `Button` *does* spread `{...props}` so `render` flows to `@base-ui/react/button`, but `ref={buttonRef}` is hard-typed `HTMLButtonElement`. Confirm middle-click + `aria-current` work in the browser; if yes, mark resolved. |
| 4 | Critical | **OPEN** | `use-focus-trap.ts:26-60` still has no `previouslyFocused` capture/restore |
| 5 | Critical | **OPEN** | `pretext-hooks.stories.tsx:559-570` still calls `useTextLayout` twice inside `render: () => {...}` |
| 6 | High | **OPEN** | All four files (`scholarship-card.tsx:38`, `scholarship-list-card.tsx:56`, `comparison-fab.tsx:10`, `comparison-sheet.tsx:28`) still destructure `useComparisonStore()` without selectors |
| 7 | High | **OPEN** | `hero-section.tsx:13` still uses `React.lazy`; line 48 still has `key={resolvedTheme}` |
| 8 | High | **OPEN** | `blog/[slug]/page.tsx:78` dynamic `import()` still has no try/catch |
| 9 | High | **ESCALATED** | Skeleton (8 cards + featured) vs grid (up to 9, no featured on page 2+) divergence unchanged in `blog-grid-skeleton.tsx:77-80`. Now visible because `blog/loading.tsx` shipped. |
| 10 | High | **OPEN** | `sheet/sheet.tsx:32` still uses `className \|\| "glass-elevated"` short-circuit |

## Cross-cutting themes — re-audit

- **A. Glass violations** — all three sites unchanged: `mobile-menu.tsx:260, 290` (raw `backdrop-blur-2xl` / `backdrop-blur-md`), `dialog.tsx:34` (raw `bg-black/80 supports-backdrop-filter:backdrop-blur-xs`), `blog-card-featured.tsx:73` (`backdrop-blur-sm` on category chip).
- **B. Zustand selector migration** — open across the same 4 files as item #6.
- **C. `mounted` gating** — all three sites unchanged: `contact-form-section.tsx:153` (`MobileContactImage`), `theme-toggle.tsx:14` (`useSyncExternalStore` mounted-check), `scholarship-filters.tsx:54-66` (`if (isMobile === null)` JS branch).
- **D. Per-segment loading/error boundaries** — `loading.tsx` shipped for both blog and contact, but `blog/error.tsx` and `contact/error.tsx` are still missing.
- **E. Untyped metadata** — open in `blog/page.tsx:6`, `contact/page.tsx:6`, `privacy/page.tsx:3`, `terms/page.tsx`, `cookies/page.tsx`. Home `app/page.tsx` still has no metadata export.
- **F. Reading-progress perf + reduced-motion** — open: `reading-progress.tsx:32-36` (`["start start","end end"]` offset), 45-66 (3 React state setters per scroll frame + `getElementById` per heading), 90-94 / 117-129 (un-gated spring + scale celebration).
- **G. Inverted lib ↔ hook dependency** — open: `scholarship-utils.ts:5-7` still imports `Month`/`MonthFilter` from `@/hooks/use-scholarship-filters`; `lib/constants.ts` still only contains `SITE_URL`.
- **H. Reduced-motion coverage gaps** — see Theme F (reading-progress) and report 03 for `four-oh-four/not-found-client.tsx`.
- **I. Duplicate / legacy structural-shape types** — open: stale `T08/T11/T14` migration comments and local structural-shape duplicates remain in `blog-card.tsx`, `blog-card-featured.tsx`, `blog-grid.tsx`, `blog-detail.tsx`, `related-posts.tsx`.

## Quick-wins re-audit

| # | Status | Note |
|---|---|---|
| 1 | Open | `global-error.tsx` |
| 2 | Open | `start` vs `output: "export"` |
| 3 | Open | dynamic MDX `import()` try/catch |
| 4 | Open | focus-trap restore |
| 5 | Open | Sheet overlay default |
| 6 | Open | `CLSPrevention` story render |
| 7 | Open | type the 5 untyped metadata exports |
| 8 | Open | `metadata` export on home `page.tsx` |
| 9 | **Partial / escalated** | `loading.tsx` shipped; `error.tsx` missing; skeleton CLS now live |
| 10 | Open | sitemap privacy/terms/cookies + stable build dates |
| 11 | **Done** | `match-badge.tsx` deleted |
| 12 | Open | duplicate `src/components/ui/table.tsx` still exists alongside `table/table.tsx` |
| 13 | Open | Zustand selectors |
| 14 | Open | Spline `useMemo`-cached URL |
| 15 | Open | `--font-geist-mono` dangling reference in `globals.css:12` (the Geist_Mono import remains commented out at `layout.tsx:28-31`) |
| 16 | Open | `disableTransitionOnChange` + `enableColorScheme` on `ThemeProvider` |

## Medium initiatives re-audit

- Slider migration to `@base-ui/react/slider` — open (`@radix-ui/react-slider` still in `package.json:24` and imported at `slider.tsx:3`).
- `remark-gfm` — open (not in `next.config.ts:21`, not in `package.json`).
- `ExpandedScholarship` → `Sheet`/`Dialog` migration — open (`expanded-scholarship.tsx:8-9, 282-284` still use manual `useFocusTrap` + `useScrollLock`).
- **`scholarships.ts` split — done.**
- `reading-progress.tsx` rAF + `useMotionValue` refactor — open.
- `contact-form-section.tsx` flatten into 4 sibling files — open.
- `Month`/`MonthFilter` move to `lib/constants.ts` — open.
- Replace structural blog-post types with `Pick<BlogPost, ...>` — open (Theme I).
- Nested-interactive markup (`<a><button>` etc.) — open in `scholarship-card.tsx:81-83`, `scholarship-list-card.tsx:64-87`, `blog-card.tsx:61, 147-162`, `blog-card-featured.tsx:39, 117-128`.

## Recommended next pass

1. **Same-day** — items 1, 2, 4, 10, **plus #9's `error.tsx` siblings** (now actively a CLS risk because `loading.tsx` shipped without the skeleton fix).
2. **This week** — items 5, 8; the metadata typing pass; the Zustand selector migration (theme B); delete duplicate `table.tsx`.
3. **Validate now (no code change required)** — item #3: open `/scholarships` paginated, middle-click "2", confirm it opens in a new tab. If yes, that one's resolved.
4. **Defer** — `--font-geist-mono` token (cosmetic), themes A and I (polish), theme G (refactor with no runtime impact).

Roughly **8 of the original 10 critical/high issues remain**, but the corpus split is real progress on the Medium tier and the dead-code cleanup is done. Net delta from May-08: 2 items resolved, 1 item escalated.
