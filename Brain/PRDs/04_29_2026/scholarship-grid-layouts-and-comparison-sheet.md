## Problem Statement

The scholarship listing page currently uses two grid layouts: a complex "bento" layout with staggered 4-column blocks (~100 lines of column distribution logic) and a standard uniform grid. The bento layout adds significant code complexity without proportional UX value — especially now that scholarship cards no longer use images, removing the visual variety that bento layouts depend on for impact. Additionally, there is no list/row-based view for users who want to scan scholarships quickly by key metadata (amount, deadline) rather than browse visually.

The comparison sheet (right-sliding panel for comparing up to 3 scholarships) still uses a basic HTML table with dead colored squares where scholarship images used to be. The table layout feels dated and doesn't leverage the no-image redesign — column headers are nearly content-free, and at narrow panel widths (max-w-xl), 3-column table cells become too cramped for readable text.

## Solution

### Grid Layouts
Remove the bento layout entirely. Replace the two-layout toggle ("bento" / "uniform") with a new ("grid" / "list") toggle. The grid layout is the existing uniform 4-column grid (renamed). The list layout is a new horizontal row-based card — the "Editorial Spread Row" design — optimized for fast scanning with a two-zone layout: a tinted left panel showing classification and amount, and a right panel showing name, provider, deadline, and description excerpt.

### Comparison Sheet
Replace the table-based comparison content with the "Audit Ledger" design — a CSS Grid-based row layout with per-row winner highlighting. The highest scholarship amount gets a green cell highlight; deadlines within 30 days get red urgency styling. Urgency pills (green/amber/red) replace raw "days left" numbers. Per-column Apply buttons replace the generic "Done" footer.

## User Stories

1. As a student browsing scholarships, I want a list view option so that I can quickly scan many scholarships by amount and deadline without scrolling through large visual cards.
2. As a student using the list view, I want each row to show the scholarship's classification color as a tinted left panel, so that I can visually group scholarships by education level while scanning.
3. As a student using the list view, I want to see the award amount prominently with a wallet icon in the left panel, so that amount comparisons are instant across rows.
4. As a student using the list view, I want the deadline shown inline with the provider in the right panel, so that I can assess urgency without hunting for it.
5. As a student using the list view, I want a single-line description excerpt, so that I get enough context to decide whether to expand without cluttering the row.
6. As a student, I want the layout toggle to show a grid icon and a list icon (solar:hamburger-menu-line-duotone), so that I can switch between browsing and scanning modes.
7. As a student on mobile, I want the list rows to gracefully adapt — the tinted left panel should still be visible but narrower, and the deadline should remain accessible.
8. As a student comparing scholarships, I want the comparison sheet to highlight which scholarship has the highest award amount, so that I can identify the best financial option at a glance.
9. As a student comparing scholarships, I want deadline urgency shown as color-coded pills (green >60 days, amber 31-60 days, red <=30 days), so that I immediately understand time pressure without calculating days.
10. As a student comparing scholarships, I want per-column "Apply" buttons at the bottom of the comparison sheet, so that I can act on my decision without closing the sheet and finding the scholarship again.
11. As a student comparing scholarships, I want each scholarship column header to show a classification color bar, name, and provider, so that I can identify scholarships without images.
12. As a student comparing scholarships, I want to remove a scholarship from the comparison by hovering over its color bar header and clicking the close button, so that removal is discoverable but not obtrusive.
13. As a student comparing scholarships, I want winner highlights (green cell backgrounds for best amount) to animate in with a staggered reveal, so that the comparison feels dynamic and the verdicts are noticed.
14. As a student comparing scholarships, I want the comparison rows ordered by decision priority (Amount, Days Left, Deadline, Education Level, Eligibility, Description), so that the most important criteria appear first.
15. As a developer, I want the bento layout code (BentoBlock component, chunkItems utility, BENTO_CHUNK constant, column distribution logic) fully removed, so that dead code doesn't accumulate.
16. As a developer, I want the GridLayout type renamed from "bento" | "uniform" to "grid" | "list", so that the type accurately reflects the available layouts.
17. As a developer, I want the list card and comparison sheet components to have Storybook stories, so that design review and iteration can happen in isolation.

## Implementation Decisions

### Module 1: Grid Layout Cleanup (modify scholarship-grid.tsx, scholarship-filters.tsx)

Remove all bento layout infrastructure:
- Delete `BentoBlock` component, `chunkItems` utility function, `BENTO_CHUNK` constant, and the `renderedCols`/`distribute` column distribution logic from `scholarship-grid.tsx`
- Update `GridLayout` type in `scholarship-filters.tsx` from `"bento" | "uniform"` to `"grid" | "list"`
- Change default layout state from `"bento"` to `"grid"`
- Update layout toggle icons: grid stays `solar:widget-3-line-duotone`, list becomes `solar:hamburger-menu-line-duotone`
- Update toggle aria-labels to "Grid layout" and "List layout"
- Add third AnimatePresence branch in `scholarship-grid.tsx` for `layout === "list"` rendering list cards in a `flex-col` container

### Module 2: Editorial Spread List Card (new component scholarship-list-card.tsx)

New `ScholarshipListCardSpread` component accepting the same `ScholarshipCardProps` interface pattern (scholarship, dimmed, onExpand).

**Two-zone horizontal layout (~96px tall):**
- **Left zone** (w-40 mobile, w-56 desktop): Tinted background using classification color at 6-8% opacity. Contains classification pills and award amount as hero element (font-heading text-2xl font-bold) with `solar:wallet-money-linear` icon.
- **Vertical divider**: 1px `bg-outline-variant/15`
- **Right zone** (flex-1): Name in font-heading text-lg, provider in uppercase tracking with deadline inline (calendar icon + abbreviated date), 1-line description excerpt.
- **Actions** (far right): Compare toggle button + ghost arrow CTA, same behavior as grid card.

**Classification tint mapping for left zone:**
- High School: bg-primary/8 (hover: bg-primary/12)
- Undergraduate: bg-secondary/8 (hover: bg-secondary/12)
- Graduate: bg-tertiary/8 (hover: bg-tertiary/12)
- K-8: bg-primary/6 (hover: bg-primary/10)
- K-12: bg-secondary/6 (hover: bg-secondary/10)

**Hover behavior**: Left zone tint deepens from idle to hover opacity. Amount text does subtle scale(1.04) translateY(-1px). Arrow CTA nudges right 3px. No whole-row scale transform (list rows should feel stable).

**Dimmed state**: opacity-40 saturate-50 pointer-events-none (consistent with grid card).

**Container**: bg-surface-container-lowest, border-b border-outline-variant/20 for row separation. No individual card shadows — entire list sits in a container with outer shadow.

### Module 3: Comparison Sheet Audit Ledger (new component comparison-sheet-audit-ledger.tsx)

New `ComparisonSheetAuditLedger` component accepting `items: Scholarship[]` and `onRemove: (id: string) => void`. Renders the comparison content that goes inside the existing Sheet wrapper.

**CSS Grid layout** with `gridTemplateColumns: 100px repeat(N, 1fr)` where N is item count.

**Column headers (sticky):**
- 6px tall color bar using CLASSIFICATION_COLORS[classification[0]].bg spanning full column width
- Scholarship name (font-heading text-sm) + provider (text-[11px]) below
- Remove button (x icon) appears on color bar hover

**Attribute rows (in decision-priority order):**
1. Amount — font-heading text-lg font-bold. Winner (highest parsed amount) gets bg-secondary-50 + border-l-2 border-secondary-400
2. Days Left — urgency pill: green (>60d), amber (31-60d), red (<=30d), "Expired" (0d). Urgent rows get bg-red-50 + border-l-2 border-red-400
3. Deadline — plain date text
4. Education Level — classification pills
5. Eligibility — text-xs, 3-line clamp
6. Description — text-xs, 4-line clamp

Each row has icon + label in left column. Alternating row backgrounds (odd: bg-surface-container-lowest/40).

**Winner highlight animation**: Highlighted cells stagger in with opacity: 0, x: -4 to opacity: 1, x: 0 at 60ms intervals per row.

**Footer row**: Per-column Apply buttons using buttonVariants on anchor elements, opening scholarship.link in new tab.

### Module 4: Comparison Sheet Integration (modify comparison-sheet.tsx)

Replace the existing `ComparisonTable` component inside `comparison-sheet.tsx` with `ComparisonSheetAuditLedger`. Update the selected scholarship display row (remove dead colored squares, use classification-tinted chips instead). Keep the Sheet wrapper, Zustand store integration, and Lenis scroll-lock logic unchanged.

### Module 5: Storybook Stories (new files)

- `scholarship-list-card.stories.tsx`: Stories for the Spread list card — default, multiple rows (5 items with all classification types), dimmed, long title variants.
- `comparison-sheet.stories.tsx`: Stories for the Audit Ledger — 2-item and 3-item configurations with varied scholarship data (different amounts, classifications, deadlines).

## Testing Decisions

- **Modules to test**: Module 1 (grid layout cleanup) — verify filterAndSort still works correctly after bento removal. Module 3 (comparison sheet) — verify winner highlight logic (highest amount detection, urgency day calculation).
- **Prior art**: `src/components/scholarships/__tests__/sort-by-filter.test.ts` tests the filterAndSort pipeline. `src/data/__tests__/scholarships.test.ts` tests parseAwardAmount and season utilities. Follow these patterns for new tests.
- **What not to test**: Visual regression on list card styling (covered by Storybook visual review). Sheet open/close behavior (already tested via existing comparison-sheet integration).

## Out of Scope

- Mobile-specific filter sheet changes (scholarship-filters-mobile.tsx) — will be addressed separately once desktop layouts are confirmed.
- Expanded card overlay modifications for list layout — the existing overlay triggered by `onExpand` works identically regardless of which layout originated the click.
- URL persistence of layout preference (e.g., `?layout=list`) — defer to a future enhancement. Currently layout resets on page load.
- Description expand/collapse in list rows — single line-clamp is intentional; full description lives in the expanded overlay.
- "Quick compare" summary bar above comparison columns — deferred future enhancement noted in design review.

## Further Notes

- The bento layout removal will delete approximately 100 lines of complex column distribution logic from `scholarship-grid.tsx`, significantly reducing maintenance burden.
- The `useMediaQuery("(min-width: 1024px)")` check in `BentoBlock` that gates between bento desktop and fallback grid on mobile will no longer be needed — the grid layout handles responsive columns via Tailwind's `grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4`.
- The comparison sheet's `parseDeadlineDays` helper is duplicated between the current `comparison-sheet.tsx` and the new audit ledger component. During integration, consolidate to a single export from `scholarships.ts`.
- Performance consideration: The list layout renders more items in the viewport simultaneously (~10 vs ~3 for grid). The existing `PAGE_SIZE = 12` pagination should keep DOM size manageable since list rows are simpler than grid cards (no Motion layoutId, no complex hover animations).
