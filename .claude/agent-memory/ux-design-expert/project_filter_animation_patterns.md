---
name: Filter UI Animation Patterns
description: Motion specs for scholarship filter dropdowns and filter sheet entrance — easing, duration, stagger, and chevron indicator patterns
type: project
---

Established animation patterns for the scholarship filter UI (implemented 2026-05-09).

**Why:** The filter controls (sort dropdown, month dropdown, filter sheet) lacked polished motion. The design brief called for editorial, tight animations — not bouncy or playful.

**How to apply:** Use these specs as the canonical reference for any new dropdown or panel animation on this project. Maintain consistency across all filter controls.

## Dropdown animation (DropdownMenuContent in dropdown-menu.tsx)

- Enter: `duration-200 ease-out`, `zoom-in-[0.97]` (subtle scale from 97%), `fade-in-0`, `slide-in-from-top-1` (4px slide, not 8px)
- Exit: `duration-150`, `zoom-out-[0.97]`, `fade-out-0`
- The `zoom-in-[0.97]` value is intentional — more editorial than `zoom-in-95` (which reads as playful)
- Applied to ALL dropdown menus site-wide via the primitive

## Chevron indicator pattern (open state affordance)

- Sort dropdown and Month dropdown both use `group/[name]-trigger` + `group-data-[popup-open]/[name]-trigger:rotate-180`
- Icon: `solar:alt-arrow-down-line-duotone` with `transition-transform duration-200`
- Base UI Menu Trigger exposes `data-popup-open` attribute when open — this drives the CSS rotation
- Month dropdown: calendar icon (left) + chevron (right, rotates). Sort dropdown: text + chevron (right, rotates).

## Sheet entrance animation (SheetContent in sheet.tsx)

- Panel slide: `transition-[transform,opacity] duration-300 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]`
- Exit: `data-ending-style:[transition-timing-function:cubic-bezier(0.4,0,1,1)] data-ending-style:duration-200`
- Translate distance: `1rem` (was 2.5rem — reduced for tighter editorial feel)
- Backdrop: `duration-300 ease-out` (was 150ms)
- The `cubic-bezier(0.22,1,0.36,1)` is an expo-out curve — fast start, graceful settle

## Content stagger within FilterSheet (filter-sheet.tsx)

- Sheet header title: `opacity 0→1, y -6→0`, delay 120ms, 280ms duration
- Award range section: `opacity 0→1, y 8→0`, delay 160ms, 320ms duration
- Separator dividers: `opacity 0→1`, delays 220ms / 300ms
- Flat tags section: `opacity 0→1, y 8→0`, delay 240ms, 320ms duration
- Category accordions: `opacity 0→1, y 8→0`, delay 320ms, 320ms duration
- All use `ease: [0.22, 1, 0.36, 1]` (same expo-out as panel)
- Content re-mounts on every sheet open (Base UI Dialog unmounts portal when closed by default)

## Category accordion within sheet

- Height collapse: `height 0→auto, opacity 0→1`, 220ms, `ease: [0.22, 1, 0.36, 1]`
- Uses `AnimatePresence initial={false}` so accordion doesn't animate on initial render

## Reduced motion

- Global `MotionConfig reducedMotion="user"` in `motion-config-provider.tsx` handles all Motion animations
- CSS animations (tw-animate-css driven) respect `prefers-reduced-motion` via Tailwind utilities
