# Module 2: Scholarship Discovery

> Part of the [UX/UI Audit](ux-audit-overview.md) — Priority: P0

## Problem Statement

The scholarship discovery page has critical functional gaps: the search bar, tag filters, and sort options capture user input but never filter results. The expanded card modal has no apply CTA, no focus trap, and uses hardcoded colors that break in dark mode. Filter state is not URL-persisted, so users can't share filtered results. On mobile, category selection requires extra taps to dismiss the filter sheet, and native HTML checkboxes break visual consistency on iOS. The hero section undersells the page with no scale or urgency indicators.

## Solution

Make the scholarship discovery page fully functional, accessible, and design-system-compliant. Add working search/sort/tag filtering, a proper modal with CTA, URL-persisted filter state, and an enriched hero that communicates scale and urgency.

## User Stories

1. As a student, I want to search scholarships by keyword, so that I can quickly find opportunities matching my field.
2. As a student, I want to filter by tags (Featured, Popular, New, Top Pick), so that I can prioritize high-signal scholarships.
3. As a student, I want to sort by deadline, amount, or rating, so that I can organize results by what matters most to me.
4. As a student, I want to see how many scholarships exist in each category tab, so that I can make informed filter decisions without clicking each one.
5. As a student, I want to share a filtered URL with my counselor, so that they can see the exact same results I'm looking at.
6. As a student viewing an expanded scholarship, I want an "Apply Now" button, so that I can take action on scholarships I'm interested in.
7. As a student viewing an expanded scholarship, I want to save or share it, so that I can come back to it later.
8. As a keyboard/screen reader user, I want the expanded modal to trap focus, so that I can navigate within it without accidentally interacting with background content.
9. As a dark mode user, I want the expanded modal content to be legible, so that I can read scholarship details at night.
10. As a mobile user selecting a category filter, I want the filter sheet to auto-close, so that I don't need extra taps to see results.
11. As a mobile user, I want styled filter chips instead of native checkboxes, so that the experience is visually consistent across devices.
12. As a user landing on the scholarships page, I want to immediately see how many scholarships are available and how many deadlines are approaching, so that I feel the scale and urgency of the platform.
13. As a user browsing dimmed (non-matching) cards, I want to still interact with them (hover, click to switch filter), so that I can explore without losing context.
14. As a user on the last page of results, I want the grid height to match actual content, so that there's no large empty space below the cards.
15. As a mobile user, I want to see a result count after filtering, so that I get immediate feedback on my filter selections.

## Implementation Decisions

### 1. Functional Search, Sort, and Tag Filtering

Wire up the existing `searchQuery`, `sortBy`, and `tagFilters` state to actually filter `visibleItems` in `ScholarshipGrid`. The `sortByFilter` function needs to be extended to accept these parameters. Add text search across `title`, `provider`, `description`, and `category` fields. Add an empty state with icon, message, and "Clear all filters" button when `filteredItems.length === 0`.

**Components affected**: `scholarship-grid.tsx`, `scholarship-filters.tsx`

### 2. URL-Persisted Filter State

Replace local state for `searchQuery`, `sortBy`, and `tagFilters` with `nuqs` URL query state (already used for `page`). Parameters: `q` (string), `sort` (string), `tags` (string array). This makes the discovery experience shareable and browser-back-friendly.

**Components affected**: `scholarship-grid.tsx`, `scholarship-filters.tsx`, `scholarship-filters-mobile.tsx`

### 3. Category Count Badges

Derive category counts from the full dataset at render time. Display as pill badges inside each category tab. The count badge participates in the existing spring layout transition.

**Components affected**: `scholarship-filters.tsx`

### 4. Expanded Modal Fixes

- **Focus trap**: Use Base UI's `FocusTrap` component (already in the stack) to wrap the modal content. If `layoutId` shared-element transition is essential, wrap `FocusTrap` around the `motion.div`.
- **Apply CTA**: Add a primary "Apply Now" button, a bookmark/save icon button, and a share icon button at the bottom of the modal content section with a border-t separator.
- **Dark mode colors**: Replace all hardcoded `text-gray-800/*` with design system tokens (`text-on-surface/*`).
- **Category badge background**: Add `bg-secondary/15 text-secondary` to the category span.
- **Mobile image height**: Reduce from `min-h-80` to `min-h-48` on mobile to give more room to content and the new CTA.

**Components affected**: `scholarship-grid.tsx`

### 5. Card Design Fixes

- **Shadow**: Replace neumorphic shadow with `shadow-md hover:shadow-lg` (warm ambient, per design system Z-1 convention).
- **Hover scale**: Increase from `1.009` to `1.025` with `y: -4` lift. Use spring with `stiffness: 400, damping: 28`.
- **Dimmed interaction**: Remove `pointer-events-none`. Dimmed cards remain interactive — clicking a dimmed card switches the active filter to that card's category.
- **"View Details" visibility**: Make the button permanently visible (not hover-only). Animate its styling on hover instead.
- **Image `sizes`**: Update to `(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 25vw, 325px`.

**Components affected**: `scholarship-card.tsx`

### 6. Bento Layout Height Fix

Replace fixed `h-205` with content-aware sizing. Use `min-h` based on item count in the chunk (full chunk: `min-h-[820px]`, partial: `min-h-[400px]`). Or switch to CSS grid with `grid-rows` for column spanning.

**Components affected**: `scholarship-grid.tsx`

### 7. Mobile Filter UX

- **Auto-close on category selection**: Call `setSheetOpen(false)` after `onFilterChange(category)` for single-select category changes.
- **Styled tag chips**: Replace native `<input type="checkbox">` with toggle-pill buttons using `rounded-full px-4 py-2` with primary fill when active.
- **Search focus ring**: Add `focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/20` to the search container.
- **Result count feedback**: Add animated result count below the filter bar.

**Components affected**: `scholarship-filters-mobile.tsx`

### 8. Enriched Hero

Add a stat strip above the heading: "69 scholarships | 8 categories | Up to $15,000". Add an urgency badge: "14 deadlines this month" using the tertiary color. Increase heading weight to `font-bold` with tighter tracking.

**Components affected**: `scholarship-hero.tsx`

### 9. Filter Layout Consolidation

Collapse the two-row desktop filter layout into a single row: `[Category tabs][Search] | [Layout toggle][Sort dropdown][Filters dropdown]`. This puts all controls at the same scan level.

**Components affected**: `scholarship-filters.tsx`

## Testing Decisions

- **Modules to test**: Search filtering logic (unit test: query matches title/provider/description/category), sort logic (unit test: deadline/amount/rating ordering), URL state persistence (Playwright: navigate with query params, verify filter state), modal focus trap (Playwright: Tab key stays within modal), empty state rendering (unit test: zero results shows empty state)
- **Prior art**: Existing Vitest setup, Playwright browser testing

## Out of Scope

- Backend API integration (current static data is sufficient for this phase)
- Scholarship application flow (the "Apply Now" CTA links to a detail page; actual application submission is a separate feature)
- Scholarship comparison drawer (Module 6)
- Deadline urgency arcs on cards (Module 6)
- Masonry layout mode (Module 6)

## Further Notes

- Consider reducing `PAGE_SIZE` from 30 to 12-15 so pages feel meaningfully chunked, or switching to "Load More" pattern for browse-oriented discovery.
- The bento layout on mobile degrades to a plain two-column grid identical to "uniform" — consider giving mobile bento a distinct character (alternating aspect ratios or CSS columns masonry).
- Layout toggle animation could benefit from staggered card entrance (cards appearing in waves) rather than the current single-block fade.
