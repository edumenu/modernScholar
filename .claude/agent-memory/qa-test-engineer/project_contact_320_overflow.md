---
name: /contact email row overflows at 320px viewport
description: Email span + copy button in flex-nowrap row pushes document width past 320 viewport, causing horizontal scroll
type: project
---

On `/contact` at viewport widths around 320px, the email row introduces a horizontal scrollbar. The DOM shape is `<div class="flex items-center gap-3"><span>dearmodernscholar@gmail.com</span><button aria-label="Copy email address" /></div>` with `flex-wrap: nowrap` and the copy button as `shrink-0`. Total inner width ≈ 285px, anchored at x=56 from the centered column, yielding right edge x=341 (overshoots 320 viewport by 21px).

**Why:** the span has no `truncate` / `min-w-0`, so the email text dictates the row's intrinsic width regardless of column width. Other pages don't have this exact pattern.

**How to apply:**
- When testing /contact at iPhone SE (1st gen) or any ≤320 viewport, expect `document.scrollWidth > window.innerWidth`.
- Don't generalize "no horizontal scroll" from the 375 viewport — re-verify at 320.
- Suggested fix path: `min-w-0` + `truncate` on the email span, or wrap the row at narrow widths, or render the email as a `<a href="mailto:…">` that can ellipsize.
