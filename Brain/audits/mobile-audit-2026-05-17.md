# Mobile UI/UX Audit & Fix Plan — 2026-05-17

> Scope: 9 routes @ 375×812 + 320×720. Findings: `qa-findings-2026-05-17.md`. Screenshots: `screenshots/`.

## Executive Summary

- **Issues**: 38 total — P0: 1, P1: 21, P2: 16
- **Critical breakage**: `/privacy` h-scroll @ 320 (Callout flex overflow)
- **Top themes**: (1) sub-44px touch targets system-wide; (2) no TOC on 3 legal pages despite ready IDs; (3) heading-hierarchy inconsistencies (`/` no H1, `/blog/[slug]` H1→H3 skip, `/not-found` H1 undersized)
- **Order**: P0 → cross-cutting themes → per-page P1s → P2 polish

---

## Cross-Cutting Fixes

### [P0] Callout flex overflow — `src/components/blog/callout.tsx:72`
- **Affected**: `/privacy` (P0 @ 320), future-proofs all callouts
- **Fix**: Add `min-w-0 [overflow-wrap:anywhere]` to `data-slot="callout-content"` div. Resolves the 320 breakage in one line.
- **Effort**: S

### [P1] Sub-44px touch targets — `src/components/ui/button/button.tsx`
- **Affected**: `/scholarships`, `/blog`, `/contact`, mobile menu, footer
- **Root cause**: `size="sm"` = `h-8` (32px), `size="icon-sm"` = `size-8` (32px). Filter chips with `px-3 py-2` = 34px.
- **Fix**: Either (a) bump `icon-sm` to `size-11` on coarse-pointer via `@media (pointer: coarse)` Tailwind variant, or (b) `before:absolute before:inset-0 before:min-h-11` pseudo-element hit-area pattern preserving visual size. For filter chips specifically, add `min-h-11` to chip class strings in `filter-sheet.tsx` and `blog-filters.tsx`. For accordion buttons (`py-2`), change to `py-2.5`.
- **Effort**: M

### [P1] Legal pages TOC — `src/components/legal/legal-layout.tsx`
- **Affected**: `/cookies`, `/privacy`, `/terms`
- **Fix**: Accept optional `sections: Array<{ id; title }>` prop. Render between header and `<aside>` as `<nav aria-label="Page contents">` with `<details>`/`<summary>` disclosure ("Contents — tap to expand") collapsed by default. Style: `rounded-xl border border-outline-variant/20 bg-surface-container-low px-5 py-4` (no glass — TOC isn't floating). Add "Back to top" link in layout footer. Pages pass section arrays.
- **Effort**: M

### [P1] Nested interactive elements
- **Affected**: ScholarshipCard, BlogCard, BlogDetail back-button
- **Fix**:
  - **ScholarshipCard** (`scholarship-card.tsx`): Remove `role="button"` from `<motion.article>`. Add hidden full-overlay `<button>` (`absolute inset-0 opacity-0`) firing `onExpand`. Existing icon-buttons remain at higher z-index.
  - **BlogCard** (`blog-card.tsx`): Replace inner `<Button>Read Blog</Button>` with styled `<span>` — card already linked via parent `<Link>`. Removes `e.stopPropagation()` hack.
  - **BlogDetail back-button** (`blog-detail.tsx:51`): Replace `<Link><Button>Back to Blog</Button></Link>` with existing `<ButtonLink href="/blog" variant="ghost" size="default">`.
- **Effort**: M

---

## Per-Route Fixes

### / (home)

- **[P1] No `<h1>`** — `home/hero-section.tsx:109`. Change `<h2 id="hero-heading">` to `<h1>`. `aria-labelledby` reference preserved. (S)
- **[P1] Footer link targets ~20px** — `ui/footer/footer.tsx:57-65, 79-87`. Change link className to add `py-3` (or `before:absolute before:inset-x-0 before:-inset-y-2` pseudo). (S)
- **[P1] Mobile menu social links sub-44** — `ui/header/mobile-menu.tsx:216-239`. Replace bare `<a>` text with icon-button anchors: `flex size-11 items-center justify-center rounded-full bg-on-surface/5` containing brand `<Icon size-5>` + `<span className="sr-only">`. (S)
- **[P2] Theme toggle 64×32** — wrap toggle in `flex items-center min-h-11` container; visual track stays `h-8`. (S)
- **[P2] Hero heading Poppins 20px** — `hero-section.tsx:111`. Add `font-heading` class. Consider bumping size after font swap. (S)
- **[Bug] Escape doesn't close mobile menu** — `ui/header/mobile-menu.tsx`. Custom dialog div, not Base UI. Add `onKeyDown` to backdrop calling `setIsOpen(false)` on Escape; restore focus to button ref. Verify Lenis `KeyboardPlugin` not intercepting. (S)

---

### /scholarships

- **[P1] Pagination stale @ filter** — `scholarship-grid.tsx:87`. `sortedItems` contains all 421 corpus items with `matches` flag, not filtered. Use `sortedItems.filter(i => i.matches).length` for `totalPages`. Grid render still slices `sortedItems` so dimmed cards remain on filtered pages. (M)
- **[P1] Education chips 34px** — `scholarship-filters-mobile.tsx`. Add `min-h-11` to chip buttons. (S — covered by cross-cutting)
- **[P1] Checkbox rows 20px** — `filter-sheet.tsx:163-181, 255-279`. Change `py-1.5` → `py-3`. Ensure wrapping `<label>` has `min-h-11`. (S)
- **[P1] Accordion buttons 327×36** — `filter-sheet.tsx:222`. Change `py-2` → `py-2.5`. (XS)
- **[P1] Sheet Close 34×34** — `ui/sheet/sheet.tsx`. Ensure SheetClose at `size-11`, or apply coarse-pointer override. (S — covered)
- **[P1] Card "Add to comparison" 32×32** — `scholarship-card.tsx:139`. Change `size-8` → `size-11`. Inner icon stays `size-4.5`. (S)
- **[P1] Card "View details" 34×34 + nested role=button** — `scholarship-card.tsx:252-263`. Bundle with cross-cutting nested-interactive fix: consolidate to single full-width activation button `<button className="flex items-center gap-2 min-h-11 px-6 pb-6 pt-5 w-full">` covering the CTA row. (M — bundled)

---

### /contact

- **[P0 @ 320 / P1 @ 375] Email row h-scroll** — `contact-form-section.tsx:345-350`. Outer flex: add `min-w-0`. Email span: change `<span>` → `<a href={\`mailto:${CONTACT_EMAIL}\`}>` with `min-w-0 truncate`. Keep CopyEmailButton alongside. (S)
- **[P1] Copy email button 34×34** — `contact-form-section.tsx:95`. Custom `size-11 rounded-full` override on CopyEmailButton, or coarse-pointer fix on `icon-sm`. (XS)
- **[P2] Topic-card grid cramped @ 320** — line 133. Change `grid-cols-3` → `grid-cols-1 min-[360px]:grid-cols-3`. (XS)
- **[P2] Illustration 1474×1064 source served on mobile** — line 173. Convert bare `<img>` → `next/image` with `sizes="(max-width: 1023px) 100vw"`. (XS)
- **[P2] Spline canvas mounts 0×0 on mobile** — lines 216-229. Gate `<Suspense>` with `{mounted && !isMobile && ...}` using `useMediaQuery`. (S)

---

### /blog

- **[P1] Search pill 42px** — `blog-filters.tsx:69`. Change `py-2` → `py-2.5` on outer wrapper, or add `min-h-11`. (XS)
- **[P1] Filter chips 34px** — `blog-filters.tsx:147-163`. Add `min-h-11` to category chip className. Mobile sheet only — doesn't affect desktop. (S — covered)
- **[P1] Filter Close (X) 34×34** — covered by SheetClose fix. (XS)
- **[P1] "Read Blog" buttons 28px + nested in `<a>`** — `blog-card.tsx:137-154, 162-175`. Replace inner `<Button size="xs">` with styled `<span className="inline-flex items-center gap-1 text-xs font-medium text-secondary">`. Fixes touch-target + invalid nested HTML in one change. (S)
- **[P2] Filters trigger 93×34** — `blog-filters.tsx:100-108`. Add `min-h-11` or change to `size="default"`. (XS)
- **[P2] Read-time `<img alt="2 min read">`** — `blog-card.tsx:186-209`. Current `<div role="img" aria-label={readTime}>` markup correct. Verify no legacy `<img>` element remains. (XS)

---

### /blog/[slug]

- **[P1] Excerpt duplicated** — Layout renders `frontmatter.excerpt` in hero; MDX body opens with same sentence. Two-pronged fix: (a) document content convention in `CLAUDE.md` "Adding a new blog post" — first body paragraph should not duplicate description; (b) layout defensive check in `blog-detail.tsx` or page route — if first `<p>` text matches `frontmatter.description`, skip rendering. (S + S)
- **[P1] Heading H1→H3 skip** — `mdx-components.tsx` maps `###` → `<h3>`. Change `### ` to `## ` (no bold) in `ScholarshipBlogs.md` source convention. Update existing MDX files in `content/blog/` to `##`. Document in `CLAUDE.md`. (S)
- **[P1] "Back to Blog" 139×23** — `blog-detail.tsx:51-55`. Replace `<Link><Button size="sm">` with `<ButtonLink href="/blog" variant="ghost" size="default">` (h-11). Resolves touch + nested. (XS — covered)
- **[P1] Carousel Prev/Next 34×34** — `related-posts.tsx:87-95`. Change `size="icon-sm"` → `size="icon"` (verify variant ≥ 44px; if `size-9` add `size-11` override). (XS)
- **[P2] No `max-w-prose` on desktop** — `blog-detail.tsx:63`. Add `max-w-prose` (65ch) to content wrapper. No mobile impact. (XS)
- **[P2] Carousel off-canvas Tab-focusable** — `related-posts.tsx`. Apply `inert` (or `aria-hidden="true" tabIndex={-1}`) to non-active CarouselItems via Embla's `selectedScrollSnap`. (M)

---

### /cookies

- **[P1] No TOC** — covered by cross-cutting. Pass 6 section IDs as `sections` prop. (M — covered)
- **[P1] Table no scroll affordance / a11y label** — `app/cookies/page.tsx`. Wrap table in `<div role="region" aria-label="Cookie storage details, scroll to see all columns" className="relative overflow-x-auto rounded-lg">`. Add right-edge gradient: `after:pointer-events-none after:absolute after:inset-y-0 after:right-0 after:w-8 after:bg-gradient-to-l after:from-surface-container after:to-transparent`. (S)
- **[P2] Table cells cramped @ mobile** — Quick win: hide Category column with `hidden md:table-cell` on `<th>` + `<td>` (column is constant "Essential / user-initiated", adds no info). Full card-layout redesign deferred to v2. (XS)

---

### /privacy

- **[P0] H-scroll @ 320** — covered by Callout cross-cutting fix. (S — covered)
- **[P1] Duplicate "Last updated" 4×** — `app/privacy/page.tsx`. Remove final `<LegalSection id="last-updated">` block. Header already renders date via `formatLastUpdated`. Also eliminates raw ISO inconsistency. (XS)
- **[P1] GDPR/CCPA H3s lack IDs** — `legal-subsection.tsx` or page. Add `id="gdpr-rights-heading"` / `id="ccpa-rights-heading"`. If `LegalSubsection` auto-derives from title, ensure derivation matches H2 pattern. (XS)
- **[P1] No TOC** — covered. (M — covered)
- **[P2] Callout "Tip" visible label** — `callout.tsx:73`. No action — `aria-label` on `<aside>` already correct; visible `<p>{label}</p>` is intentional design.

---

### /terms

- **[P1] No TOC** — covered. 17 sections — highest TOC priority. (M — covered)
- **[P1] Section 17 redundant** — `app/terms/page.tsx`. Remove final `<LegalSection id="last-updated" title="17. Last updated">`. Renumbers to 16 substantive sections. (XS)
- **[P1] H2 numbers in content** — `<LegalSection title="1. Acceptance...">` etc. v2: move numbers to CSS `counter-reset` on article + `::before` on H2, so SR reads only the title. Current behavior is comprehensible; defer. (M — v2)

---

### /not-found

- **[P1] H1 24px** — `ui/four-oh-four/not-found-client.tsx:219`. Change `text-2xl md:text-3xl` → `text-3xl md:text-4xl` (or `clamp(1.75rem, 5vw+0.5rem, 2.25rem)`). (XS)
- **[P1] Floating glyphs expose `role="img"`** — line 49. Outer wrapper `aria-hidden="true"` should suppress; QA confirmed it doesn't. Add `aria-hidden="true"` directly on each Iconify `<Icon>` prop. (XS)
- **[P2] Spline canvas a11y** — lines 178-193. Verify outer `aria-hidden` propagates to canvas; if not, pass directly to `<SplineScene>`. (XS)

---

## Phasing

### Phase 1 — P0s
1. **Callout `min-w-0 [overflow-wrap:anywhere]`** — `callout.tsx:72`. Fixes `/privacy` @ 320.
2. **Contact email row `min-w-0`** — `contact-form-section.tsx:345`. Fixes `/contact` @ 320.

### Phase 2 — Cross-cutting P1
3. **Touch targets** — `button.tsx` (`icon-sm` / `sm` coarse-pointer min-44 or pseudo hit-area).
4. **SheetClose hit area** — `ui/sheet/sheet.tsx`.
5. **Footer link `py-3`** — `ui/footer/footer.tsx`.
6. **Legal TOC `LegalLayout`** — `legal-layout.tsx` (one change fixes 3 pages).

### Phase 3 — Per-page P1
7. Mobile menu Escape handler — `mobile-menu.tsx`.
8. Home hero `<h2>` → `<h1>` — `hero-section.tsx`.
9. ScholarshipCard compare `size-8` → `size-11`.
10. ScholarshipCard `role="button"` removal + activation consolidation.
11. Pagination total filtered match count — `scholarship-grid.tsx`.
12. Filter checkbox row `py-1.5` → `py-3`.
13. Filter accordion `py-2` → `py-2.5`.
14. Blog search pill `py-2` → `py-2.5`.
15. Blog filter chip `min-h-11`.
16. Back to Blog → `ButtonLink size="default"`.
17. Related posts Prev/Next `size-11`.
18. BlogCard Read Blog → `<span>`.
19. Duplicate excerpt fix — doc + layout check.
20. H1→H3 → H2 hierarchy — MDX source + `CLAUDE.md` doc.
21. 404 H1 size bump.
22. 404 floating icons `aria-hidden`.
23. `/privacy` remove duplicate Last updated section.
24. `/terms` remove section 17.
25. GDPR/CCPA H3 IDs.
26. Cookie table scroll affordance + `role="region"`.
27. Mobile menu social → icon-button anchors.

### Phase 4 — P2 polish
28. Theme toggle hit area.
29. Hero font Noto Serif + size review.
30. Contact topic grid `min-[360px]:grid-cols-3`.
31. Contact email `<a href="mailto:">`.
32. Contact illustration → `next/image` + `sizes`.
33. Contact Spline conditional mount.
34. Cookie table Category column `hidden md:table-cell`.
35. Blog post `max-w-prose` desktop.
36. Carousel off-canvas `inert`.
37. `/terms` CSS counters (v2).

---

## Out of Scope

- **Carousel intentional viewport overflow** — `/`, `/scholarships`, related-posts. Body `overflow-x: hidden` holds. Not a bug.
- **Next.js Dev Tools button** — dev-only injection, disappears in production.
- **Callout visible "Tip"/"Warning" labels** — intentional design; `aria-label` on `<aside>` handles a11y correctly.
- **`<aside>` sidebar 0×0 on mobile** in `/blog/[slug]` — `hidden md:flex lg:hidden` is correct tablet-only pattern.
- **Search input 327×42 on `/scholarships`** — borderline (2px under) but full-width target, no realistic mis-tap risk.

---

Plan complete. Ready for implementation review.
