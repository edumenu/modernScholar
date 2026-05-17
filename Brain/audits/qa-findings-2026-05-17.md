# Mobile QA Findings — 2026-05-17

**Scope**: 9 routes @ 375×812 (primary), 320×720 (edge case). Screenshots in `screenshots/`.

## / (home)

Screenshots: `home-375.png`, `home-375-mid.png`, `home-375-faq.png`, `home-375-footer.png`, `home-375-menu-open.png`, `home-320.png`

### P1
- **No `<h1>`** — hero heading is `<h2>`. Breaks WCAG 1.3.1 doc outline.
- **Footer link targets ~19.5px tall** (`padding: 0`, ~36px row gap). Misses WCAG 2.5.5 (44px) and 2.5.8 (24px).
- **Mobile menu social links sub-target**: Instagram 62×16, LinkedIn 48×16, Twitter 40×16. Easy to mis-tap.

### P2
- Mobile menu theme toggle 64×32 (under 44px height).
- Hero heading uses Poppins 20px instead of Noto Serif (design-system deviation).
- Hero H2 at 20px reads smaller than the "Featured Scholarships" H2 (30px) below it.

### Possible bug
- **Escape doesn't close mobile sheet**. Reproduced once. Only "Close" button or link click dismisses. Likely Lenis or focus-trap interception.

### Looks good
- Hamburger 46×46, menu items 66px tall, FAQ accordion 327×88, mobile close 46×46, hero CTA 200×56. Carousel x-overflow intentional, body `overflow-x: hidden` holds.

### 320 edge
- No new breakage.

---

## /scholarships

Screenshots: `scholarships-375.png`, `scholarships-375-filter-sheet.png`, `scholarships-375-mid.png`, `scholarships-375-pagination.png`, `scholarships-320.png`

### P1
- **Pagination total stale** — `?level=K-12` returns 22 results but UI still shows `1, 2, …, 38`. Root cause likely `sortedItems.length` (full 421-item corpus) being used for `totalPages` instead of filtered match count. Tapping page 38 with filter lands on empty/clamped page.
- **Filter sheet education chips 34px tall** (All / High School / Undergrad / Graduate / K-12). Misses 44px.
- **Filter checkbox rows 20px tall**, 36px row gap. Easy to mis-tap adjacent.
- **Filter category accordion buttons 327×36** (Gender / Race / Disability sections).
- **Filter sheet Close (X) 34×34**.
- **Card "Add to comparison" 32×32, "View details" 34×34** — both sub-44.
- **Nested interactives in card**: `<article role="button" tabIndex=0>` contains 2 child `<button>`s. ARIA 1.2 forbids — AT may collapse.

### P2
- Compare floating button glyph 32×32 inside ~52×52 chip.
- Search input pill 327×42 — 2px shy of 44, but full-width so functionally fine.

### Looks good
- H1 Noto Serif 36px (sr-only fallback for AnimatedLines). Pagination prev/next 44×44+. Filters trigger 107×44. Search font 16px (no iOS auto-zoom). Filter sheet `role="dialog"` + Nuqs URL state confirmed.

### 320 edge
- No new breakage.

---

## /contact

Screenshots: `contact-375.png`, `contact-375-topics.png`, `contact-375-bottom.png`, `contact-320.png`

### P1
- **Horizontal scroll @ 320** — email row `flex flex-nowrap gap-3` containing 239px email span + 34×34 copy button (`shrink-0`) sums ~285px, parent missing `min-w-0`, pushes right edge to x=341 (vs vw 320). Document scrolls sideways. Fix: `min-w-0` + `truncate` on email span.
- **Copy email button 34×34**.

### P2
- Topic-card grid 3-col cramped at 320 (~61px cells). Labels wrap 2 lines.
- Email rendered as `<span>`, not `<a href="mailto:">`. Long-press copy unreliable.
- Static contact illustration: 263×190 served from 1474×1064 source (`<img>` not `next/image`).
- `<canvas>` (Spline) mounts at 0×0 on mobile (intentionally `hidden lg:block`). Could unmount entirely.

### Looks good
- H1 Noto Serif 36px. "SEND EMAIL" 200×56. FAQ buttons 327×64–88. No horizontal scroll at 375.

---

## /blog

Screenshots: `blog-375.png`, `blog-375-filters-open.png`, `blog-320.png`

### P1
- **Search pill 42px tall** (`py-2` wrap). 2px under 44.
- **Filter dialog category chips 34px** ("All" 47×34, "Tips & Guides" 126×34, "First-Generation" 146×34). Apply Filters at 327×44 correct.
- **Filter dialog Close (X) 34×34**.
- **Sub-grid "Read Blog" buttons 83×28** on cards 2-4 (12px font). Hero card uses 103×34 — inconsistent. Buttons are decorative (parent `<a>` activates).

### P2
- Filters trigger 93×34 (`size="sm"`).
- Card hero places `<button>` inside `<a>` — invalid HTML5. All 4 cards.
- `<img alt="2 min read">` for read-time — read-time is text, image markup off.

### Looks good
- No horizontal scroll. H1 clamp(48px → 112px) renders 48px @ 375 cleanly. Escape dismisses filter dialog. Apply Filters 327×44.

### 320 edge
- No new breakage.

---

## /blog/[slug] (how-to-write-a-winning-scholarship-essay)

Screenshots: `blog-post-375.png`, `blog-post-320.png`

### P1
- **Excerpt duplicated** — hero shows `frontmatter.excerpt`, then first body `<p>` repeats verbatim ("Master the art of scholarship essay writing…"). Confirmed `paragraphs[0] === paragraphs[1]`.
- **Heading hierarchy skip H1→H3** — article body sections are H3, not H2. `### ` MDX convention emits H3 but they're top-level article sections.
- **"Back to Blog" 139×23** (23px tall). Primary mobile escape hatch — sub-44 fail.
- **Related Blogs Prev/Next 34×34** — primary affordance to reveal off-canvas cards 2/3 (at x=335 / x=614).

### P2
- Article `maxWidth: none` — desktop measure could exceed 80ch.
- `<aside>` complementary sidebar mounts 0×0 on mobile (`hidden md:flex lg:hidden`).
- `<Link><Button>Back to Blog</Button></Link>` — nested interactive.
- Carousel cards 2-3 off-canvas but Tab-focusable; can scroll page horizontally on focus.

### Looks good
- No horizontal scroll. H1 30px / 37.5lh Noto Serif. Body 18px / 29.25lh. H3 20px / 28lh. Carousel "1/3" → "2/3" works. Prev disabled at pos 1.

---

## /cookies

Screenshots: `cookies-375.png`, `cookies-320.png`

### P1
- **No TOC** — 6 sections, all H2s have IDs (`#what-we-store-heading` etc.), no jump nav.
- **Table h-scrolls without affordance** — `scrollWidth 386` inside 327px parent, `overflow-x: auto`, no fade gradient, no `role="region"` + aria-label. Cells wrap aggressively (Purpose 113px → 6 lines text).

### P2
- Table cells very cramped at 375.
- Inline contact email link 262×23 (line-height tall, sub-44).
- "Last updated May 14, 2026" line at 12px — same size as smallprint.

### Looks good
- H1 Noto Serif 30px. 6 H2s Noto Serif 24px. Summary `<aside aria-label="Summary">` TL;DR pattern. `<time datetime>` semantic.

### 320 edge
- No new breakage.

---

## /privacy

Screenshots: `privacy-375.png`, `privacy-320.png`

### P0
- **Document horizontal scroll @ 320** — `docScrollWidth 346` vs vw 320, overflows 26px. Cause: "Children's privacy" Tip Callout flex layout, `flex-1` child missing `min-w-0`, contains unbreakable `dearmodernscholar@gmail.com` (262px intrinsic). Fix: `min-w-0` + `[overflow-wrap:anywhere]` on `data-slot="callout-content"`.

### P1
- **Duplicate "Last updated" 4×** — top header (formatted), body para in "Who we are", body para in "Changes", and entire H2 section at bottom ("This policy was last updated on 2026-05-14" — raw ISO, inconsistent with header).
- **GDPR / CCPA H3s lack `id` attrs** — every H2 has `id` (e.g. `your-rights-heading`); the two jurisdiction H3s don't.
- **No TOC** — 10 H2s + 2 H3s, ~12 screens tall, no jump nav.

### P2
- Tip Callout label "Tip" rendered as plain `<p>` (aria-label on aside already correct — visible text is design choice).
- Bottom-of-article footer string duplicates Contact H2 content.

### Looks good
- H1 Noto Serif 30px. 10 well-titled H2s with IDs. GDPR/CCPA H3s nest correctly under "Your rights". Summary aside present.

### 320 edge
- See P0 above. Otherwise clean.

---

## /terms

Screenshots: `terms-375.png`, `terms-320.png`

### P1
- **No TOC** — 17 numbered H2s with IDs, ~16 screens tall. Longest legal page in repo.
- **Section 17 "Last updated" redundant** — top header already shows it. Numbering implies substantive clause.
- **H2 text embeds numbers** ("1. Acceptance of these terms") — SR reads "Heading level 2: 1. Acceptance…". CSS counters cleaner.

### P2
- Warning Callout fits at 320 (no embedded email in this one).
- Inline email link sub-44 (line-height tall).

### Looks good
- H1 Noto Serif 30px. 17 H2s Noto Serif 24px, all IDs. Warning Callout fits both viewports. 0 console errors.

### 320 edge
- No new breakage.

---

## /not-found (visited /this-does-not-exist)

Screenshots: `not-found-375.png`, `not-found-320.png`

### P1
- **H1 only 24px** ("We couldn't find that page.") — visually smaller than CTA buttons. /scholarships H1 36px and /blog H1 48px+ contrast.
- **Decorative SVG glyphs have `role="img"` no aria-label** — 6 floating Iconify glyphs expose bare "image" entries. SR hears "image, image, image, image, image, image" before H1. Outer wrapper has `aria-hidden="true"` but Iconify may bypass.

### P2
- Spline `<canvas>` lacks explicit `aria-hidden` / `role="presentation"` (parent wrapper has aria-hidden — verify propagation).
- "Read the Blog" CTA uses external-link-style arrow icon for internal link.
- No search / "report broken link" affordance.

### Looks good
- HTTP 404 returned. Unique `<title>`. 3 CTAs (Home / Scholarships / Blog) all 44px tall. Header / footer / skip-link consistent. No JS errors, no h-scroll.

### 320 edge
- H1 wraps 1→3 lines. CTAs reflow 3 stacked rows, each 44px. No breakage.

---

## Cross-cutting themes

- **Sub-44px touch targets** — `button.tsx` `sm` / `icon-sm` variants (32px) propagate across /scholarships filters, /blog filters, /contact, mobile menu social links, footer links.
- **No TOC on legal pages** — `/cookies`, `/privacy`, `/terms` have heading IDs ready but no nav UI.
- **Nested interactive elements** — `<button>` inside `<a>` (BlogCard, BlogDetail back-link), `<article role="button">` with child `<button>`s (ScholarshipCard).
- **Callout flex overflow** — `min-w-0` missing on `callout-content` flex child; breaks at 320 when content contains long unbreakable strings.
- **Heading hierarchy** — `/` missing H1, `/blog/[slug]` skips H1→H3, `/not-found` H1 undersized.
