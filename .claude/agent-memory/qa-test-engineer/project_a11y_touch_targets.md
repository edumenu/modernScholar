---
name: Mobile filter touch targets
description: Documented sizes of mobile filter controls and WCAG implications for the scholarships page
type: project
---

Measured at 375px viewport on the /scholarships page (2026-05-07):

Page-level filter controls:
- Grid layout / List layout toggle buttons: **44 × 44px** (improved from 34×34) — pass WCAG 2.5.5 AAA / Apple HIG
- Filters button (trigger): **107 × 44px** — pass AAA
- Month dropdown trigger: **96.66 × 34px** — passes 2.5.8 AA (≥24×24); fails AAA (≥44×44)
- Sort button: ~36px tall — same as Month

Inside cards (grid layout):
- "Add to comparison" toggle: **32 × 32px** — passes AA, fails AAA
- "View details for X" arrow button: **34 × 34px** — passes AA, fails AAA

Inside the filter sheet (Base UI Sheet):
- Sheet close X button: ~34 × 34px (per prior QA)
- Eligibility category accordion buttons: ~36 × ~327px (full-width)
- Sort pill buttons: ~36 × {89, 95}px
- Education level chips (mobile): ~34 × {47–139}px

**Why:** WCAG 2.5.8 (Level AA, new in 2.2) requires ≥24×24 CSS px — these all PASS. WCAG 2.5.5 (Level AAA) and Apple HIG recommend ≥44×44 CSS px — most page-level controls now pass except the month/sort dropdown triggers (height 34) and the in-card icon buttons (32 / 34).

**How to apply:** When auditing the mobile filter UX, the in-card 32×32 / 34×34 buttons are the lowest-hanging fruit if upsizing is requested. Don't apply mobile-touch-target rules to desktop unless the user explicitly opts into a touch profile.

**Horizontal-scroll note (320 px viewport):** the page currently overflows at 320px because the Filters button (107px) + Month + Layout toggle row totals ~336px. Standard test viewport is 375; if 320 support is required, the filter row needs a wrap or a narrower Filter trigger.
