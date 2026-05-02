# Branch 4: Design System Compliance

> Priority: P1 — High priority
> Depends on: None (independent)
> Date: 2026-04-22

## Problem Statement

Multiple components across Modern Scholar violate the design system documented in `SystemDesign.md`. The most pervasive violation is the use of explicit `border` classes on Z-1 cards and containers, directly contradicting the "No-Line Rule." Glassmorphism is applied to filter bar controls at Z-1 elevation instead of being reserved for Z-2+ floating elements. CSS accessibility fallbacks for `prefers-reduced-transparency` and `@supports not (backdrop-filter)` are documented in the design system but absent from `globals.css`. Section spacing uses inconsistent, overlapping mechanisms. These violations undermine the visual coherence of the premium editorial aesthetic the design system was built to enforce.

## Solution

Remove all explicit border classes from Z-1 elements and replace with tonal surface layering and shadow. Restrict glassmorphism to Z-2+ elements only. Add the documented CSS accessibility fallbacks to `globals.css`. Standardize section spacing to a single mechanism.

## User Stories

1. As a user browsing blog cards, I want the card containment to feel like a tonal surface shift rather than a hard border, so that the editorial aesthetic feels premium and cohesive.
2. As a user with reduced transparency enabled in their OS accessibility settings, I want glass panels (header, dropdowns) to fall back to solid opaque backgrounds, so that the interface remains legible.
3. As a user on an older browser without `backdrop-filter` support, I want glass elements to render with solid backgrounds instead of transparent/broken panels, so that the interface is usable.
4. As a user scrolling through the site, I want consistent vertical rhythm between sections, so that the page flow feels intentional rather than arbitrary.
5. As a designer reviewing the implementation, I want the codebase to match the design system documentation, so that the source of truth is reliable.

## Implementation Decisions

### Module 1: No-Line Rule Enforcement

Remove `border` and `border-outline-variant` classes from all Z-1 (card/container) elements. Affected files and their replacements:

**Blog Card** (`src/components/blog/blog-card.tsx`):
- Remove `border border-outline-variant/40` and `dark:border-outline-variant/20`.
- Containment is already established by `bg-surface-container-low` against the page's `bg-surface`. If additional definition is needed, add `shadow-xs` (the lightest ambient shadow from the design system).

**Blog Detail Sidebar** (`src/components/blog/blog-detail.tsx`):
- Remove `border border-outline-variant/40` from all four sidebar/metadata cards (approximately lines 129, 158, 179, 225).
- These cards sit on the same surface — use `bg-surface-container-low` with `rounded-2xl` for implicit containment.

**Scholarship Filter Bar** (`src/components/scholarships/scholarship-filters.tsx`):
- Remove `border-b border-outline-variant` from the filter bar bottom separator.
- Replace with either a `shadow-[0_1px_0_0_rgba(32,26,25,0.05)]` hairline shadow or no separator at all (let vertical spacing create the separation).

**Scholarship Hero Stats** (`src/components/scholarships/scholarship-hero.tsx`):
- Remove the `|` pipe character separators between stat items.
- Use `flex` with `gap-x-6` for spacing — no visual separator needed.

### Module 2: Glass Elevation Correction

In `src/components/scholarships/scholarship-filters.tsx`:
- Remove `glassPill` from the Sort and Filters dropdown trigger buttons. These are inline controls at Z-1 (part of the page surface).
- Replace with `bg-surface-container-low/80 backdrop-blur-none` — a tonal button style without glass.
- The dropdown panels (DropdownMenuContent) that float above the page at Z-3 should retain their glass treatment.

Verify no other Z-1 elements use glass utilities by searching for `glass` class usage across all components and cross-referencing with their elevation context.

### Module 3: CSS Accessibility Fallbacks

Add the following to `src/app/globals.css`, after the existing `.glass-panel`, `.glass-elevated`, and `.glass-heavy` class definitions:

**Reduced Transparency Fallback:**
```css
@media (prefers-reduced-transparency: reduce) {
  .glass-panel {
    background: oklch(var(--color-surface) / 1);
    backdrop-filter: none;
  }
  .glass-elevated {
    background: oklch(var(--color-surface) / 1);
    backdrop-filter: none;
  }
  .glass-heavy {
    background: oklch(var(--color-surface) / 1);
    backdrop-filter: none;
  }
}
```

**High Contrast Fallback:**
```css
@media (prefers-contrast: more) {
  .glass-panel,
  .glass-elevated,
  .glass-heavy {
    background: oklch(var(--color-surface) / 1);
    backdrop-filter: none;
    border: 2px solid oklch(var(--color-outline) / 1);
  }
}
```

**Backdrop Filter Support Fallback:**
```css
@supports not (backdrop-filter: blur(1px)) {
  .glass-panel,
  .glass-elevated,
  .glass-heavy {
    background: oklch(var(--color-surface) / 0.95);
  }
}
```

These fallbacks are documented in `SystemDesign.md` Section 3.5 and 3.7 but were never implemented.

### Module 4: Section Spacing Standardization

Currently, `src/components/ui/page-shell/page-shell.tsx` applies `[&>*+*]:mt-22` (88px) to all direct children of `<main>`, AND individual pages apply their own `flex flex-col gap-16` (64px). This creates double-spacing (152px total) between the hero and grid on scholarships and blog pages.

Decision: Remove the `[&>*+*]:mt-22` rule from `PageShell`. Let each page control its own section rhythm via `gap-*` or explicit margin on the page-level flex container. This gives each page layout flexibility while avoiding the compounding spacing issue.

Define a recommended section spacing token: `--section-gap: 5rem` (80px) as a CSS custom property in `globals.css`, usable as `gap-[var(--section-gap)]` in page layouts. This provides a single source of truth for section rhythm without enforcing it at the shell level.

## Testing Decisions

- **Modules to test**: Module 3 (CSS fallbacks activate under correct media query conditions), Module 4 (section spacing is consistent across all pages)
- **Prior art**: CSS media query fallbacks can be tested via Playwright by emulating `prefers-reduced-transparency` and asserting computed styles. The spacing standardization can be verified visually via Storybook or by measuring the gap between sections in Playwright screenshots.

## Out of Scope

- Typography scale adjustments (covered in Branch 5: UI/UX Polish)
- Color token changes or palette modifications
- New design system components
- Glassmorphism visual design changes (only correcting elevation misuse)

## Further Notes

- The No-Line Rule enforcement (Module 1) will have visible impact across blog and scholarship pages. Coordinate with the team or stakeholder to confirm the tonal-only containment looks correct before shipping.
- The `prefers-reduced-transparency` media query is relatively new (supported in Safari 18+, Chrome 118+). The `@supports not (backdrop-filter)` fallback catches the remaining older browsers.
- After removing `[&>*+*]:mt-22` from PageShell (Module 4), every page should be visually reviewed to ensure no sections collapse together. The home page, which uses individual section padding rather than a gap, should be unaffected.
