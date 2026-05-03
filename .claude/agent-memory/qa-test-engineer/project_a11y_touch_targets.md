---
name: Mobile filter touch targets
description: Documented sizes of mobile filter controls and WCAG implications for the scholarships page
type: project
---

Measured at 375px viewport in the mobile filter sheet (`scholarship-filters-mobile.tsx`):

- Education level chips ("All", "High School", etc.): **34 × {47–139}px**
- Eligibility category accordion buttons ("Gender-Specific", etc.): **36 × 327px**
- Sort pill buttons ("Deadline", "Amount"): **36 × {89, 95}px**
- Sheet close X button: **34 × 34px**
- Page-level layout toggle (Grid/List): **34 × 34px**
- Filter button (trigger): **93 × 34px**

**Why:** WCAG 2.5.8 (Level AA, new in 2.2) requires ≥24×24 CSS px — these all PASS that bar. WCAG 2.5.5 (Level AAA) requires ≥44×44 CSS px and Apple HIG recommends 44×44 — these all FAIL that bar.

**How to apply:** When auditing the mobile filter UX, flag any new control that's smaller than the existing 34×34 or 36×N pattern as a regression. If the team decides to upsize, the icon buttons (34×34) are the lowest-hanging fruit since they have no text constraints.

The desktop filter row uses similar pill heights (~32-36px) and is acceptable for mouse precision. Don't apply mobile-touch-target rules to desktop unless the user explicitly opts into a touch profile.
