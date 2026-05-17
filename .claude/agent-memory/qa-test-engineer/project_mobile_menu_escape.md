---
name: Mobile menu dialog may not dismiss on Escape
description: Pressing Escape with the mobile menu open did not close the Base UI dialog; only the explicit Close button worked
type: project
---

During the 2026-05-17 mobile QA audit at 375×812 on `/`, the mobile hamburger menu opened a `role="dialog"` correctly, but the global Escape keypress test (`browser_press_key Escape`) did not dismiss the dialog. The `[role="dialog"]` element was still present in the DOM after Escape. Closing required clicking the "Close menu" button.

**Why:** unclear — possibly Lenis smooth scroll or a custom focus trap intercepting the key event before Base UI's Dialog handler runs. Could also be that Playwright dispatched the key to an element outside the dialog's focus scope.

**How to apply:**
- When validating mobile-menu accessibility, don't rely on Escape closing the dialog as a "pass" without manual verification.
- If reproducing, also try `keyboard.press('Escape')` after explicitly focusing inside the dialog, then test with reduced motion to rule out Lenis interference.
- A11y impact: keyboard-only users (including external bluetooth keyboard mobile users) cannot dismiss the menu via the expected pattern.
