# Verification Report: Mobile Fixes Phase 2 — Cross-Cutting

**PRD:** [mobile-fixes-phase-2-cross-cutting.md](./mobile-fixes-phase-2-cross-cutting.md)
**Date:** 2026-05-17
**Status:** Complete
**Branch:** fix/mobile-320px-overflow (uncommitted)

## What Shipped

- [x] Coarse-pointer 44px floor on `sm` and `icon-sm` Button variants — unlocks every site-wide callsite.
- [x] SheetClose enlarged to `size="icon"` (size-11) — fixes filter sheets on `/scholarships` and `/blog`.
- [x] Footer links gain `inline-block py-3` (ul gap dropped to `gap-1`) for ≥44px row height.
- [x] `LegalLayout` accepts `sections?: Array<{id;title}>`; renders `<nav><details>` "Contents — tap to expand" collapsed by default, tonal `bg-surface-container-low`, anchor links `block py-3`.
- [x] `<article id="top">` + "Back to top" link in legal footer.
- [x] `/cookies`, `/privacy`, `/terms` pass section arrays (6 / 11 / 17 entries) with IDs that match their `<LegalSection>` `id` props verbatim.

## Files Touched

| File | Change |
| --- | --- |
| src/components/ui/button/button.tsx | `pointer-coarse:min-h-11 pointer-coarse:min-w-11` on `sm` and `icon-sm` |
| src/components/ui/sheet/sheet.tsx | Close button `size="icon-sm"` → `size="icon"` |
| src/components/ui/footer/footer.tsx | Links `inline-block py-3`, ul `gap-3` → `gap-1` |
| src/components/legal/legal-layout.tsx | `sections` prop (ReadonlyArray), collapsible TOC, `id="top"`, back-to-top `pointer-coarse:py-3` |
| src/components/smooth-scroll-provider.tsx | Lenis `anchors: true` — smooth-scroll for `href="#id"` links |
| src/app/cookies/page.tsx | `SECTIONS` const (6); passed as `sections={SECTIONS}` |
| src/app/privacy/page.tsx | `SECTIONS` const (11); passed as `sections={SECTIONS}` |
| src/app/terms/page.tsx | `SECTIONS` const (17); passed as `sections={SECTIONS}` |

## Issues

- Lenis didn't intercept `href="#id"` anchors — fixed by adding `anchors: true` to ReactLenis options. Pre-existing gap surfaced by new TOC.
- `sections!.map(...)` non-null assertion — fixed by narrowing via `&&`.
- `[...SECTIONS]` spread at 3 callsites — fixed by widening prop to `ReadonlyArray<...>`.
- Back-to-top `py-1` under 44px floor — fixed with `pointer-coarse:py-3`.

## Next

`npm run build` clean. 18 legal-related Vitest specs pass. Playwright touch-target + TOC anchor assertions (PRD Testing Decisions) still pending — recommend qa-test-engineer handoff before commit.
