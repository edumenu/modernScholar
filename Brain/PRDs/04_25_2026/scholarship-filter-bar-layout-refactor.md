# Scholarship Filter Bar Layout Refactor

## Problem Statement

The scholarship page filter bar renders all controls in a single horizontal row: category tabs, collapsible search, layout toggle, sort dropdown, filters dropdown, and profile setup trigger. As the number of categories grows and screen widths vary, this row becomes visually cluttered and makes it difficult to distinguish between "what to find" controls (categories, search) and "how to display" controls (layout, sort, filters, profile). The two groups of controls serve fundamentally different purposes but are presented as a single undifferentiated toolbar.

## Solution

Split the desktop filter bar into two visually distinct rows separated by the existing subtle border line:

- **Row 1 (above border):** Category filter tabs on the left, collapsible search on the right. These are the "discovery" controls — they determine what scholarships appear.
- **Row 2 (below border):** Layout toggle on the far left, sort dropdown + filters dropdown + profile setup trigger on the far right. These are the "display" controls — they determine how results are presented.

This change is desktop-only. The mobile layout (bottom sheet pattern via `ScholarshipFiltersMobile`) remains unchanged.

### Target Layout

```
[Category tabs]  ·················  [Search]
───────────────────────────────────────────── (existing shadow border)
[Layout Toggle]  ·····  [Sort | Filters | Profile]

[scholarship grid]
```

## User Stories

1. As a student browsing scholarships on desktop, I want the filter controls to be visually organized by purpose, so that I can quickly find and adjust what I'm looking for versus how results are displayed.
2. As a student using category tabs, I want the search field nearby on the same row, so that both "what to find" controls are grouped together.
3. As a student switching between bento and grid layouts, I want the layout toggle separated from the category filters, so that display preferences don't compete for attention with content filters.
4. As a student on mobile, I want the existing bottom sheet filter experience preserved, so that the mobile UX remains optimized for touch interaction.
5. As a student resizing the browser window, I want the two-row layout to remain stable above the 1024px breakpoint and seamlessly switch to the mobile layout below it.
6. As a student using the collapsible search, I want the expand/collapse animation to continue working correctly in its new position on the right side of row 1.
7. As a student using sort or filter dropdowns, I want dropdown menus to still align properly (end-aligned) relative to their triggers in the new row 2 position.

## Implementation Decisions

### Module: ScholarshipFilters (desktop return block)

**File:** `src/components/scholarships/scholarship-filters.tsx`

This is the only module that requires modification. The change is purely structural — rearranging existing JSX elements into a new container hierarchy. No new components, props, state, or dependencies are introduced.

**Current structure:**
```
div (flex row, justify-between, pb-3, shadow border)
  ├── Left: Category tabs
  └── Right: Search + Layout toggle + Sort + Filters + Profile
```

**New structure:**
```
div (flex column)
  ├── Row 1 (flex row, justify-between, pb-3, shadow border)
  │     ├── Left: Category tabs (unchanged)
  │     └── Right: Search (moved here)
  └── Row 2 (flex row, justify-between, pt-3)
        ├── Left: Layout toggle (moved here)
        └── Right: Sort + Filters + Profile (unchanged grouping)
```

**Key decisions:**
- Outer container changes from `flex items-center justify-between` to `flex flex-col`
- Row 1 retains the existing shadow border (`shadow-[0_1px_0_0_rgba(32,26,25,0.05)]`) and bottom padding (`pb-3`)
- Row 2 gets `pt-3` (12px) top padding to match the spacing rhythm
- No changes to any component props, state management, or event handlers
- No changes to the mobile component (`scholarship-filters-mobile.tsx`)
- No changes to the parent component (`scholarship-grid.tsx`)

## Testing Decisions

- **Modules to test:** No automated tests required for this change. It is a pure layout restructuring with no logic changes.
- **Manual verification:**
  - Desktop layout matches target mockup at widths >= 1024px
  - Category tab animated highlight (LayoutGroup/motion) still works
  - Collapsible search expand/collapse animation works in new position
  - Sort and filter dropdown menus align correctly (end-aligned)
  - Dark mode renders correctly for both rows
  - Mobile layout at < 1024px is completely unchanged
  - Production build succeeds without errors

## Out of Scope

- Mobile filter layout changes
- Adding a desktop result count display
- Changing the border/shadow style
- Modifying filter functionality or state management
- Adding new controls to either row

## Further Notes

- This is a low-risk, isolated refactor. Only one file changes, and the modification is purely presentational.
- If a desktop result count is desired in the future, it could naturally slot into row 2 (e.g., between layout toggle and the right-side controls) without further restructuring.
