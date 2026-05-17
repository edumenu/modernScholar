---
name: Multi-group Playwright contention on shared dev server
description: When multiple QA agent groups run concurrently against one dev server / Playwright session, every navigate/resize/eval is racing
type: feedback
---

When the user runs "Group 1 / Group 2 / Group 3" tablet (or any) QA passes in parallel against a single already-running dev server, the agents share a single Playwright MCP browser tab. Each group's `browser_navigate`, `browser_resize`, `browser_evaluate`, and `browser_take_screenshot` calls collide.

**Why:** A QA pass on 2026-05-16 (legal & 404 group) hit constant contention: pages auto-navigated to other groups' targets (`/blog`, `/`, `/blog/<slug>`, `about:blank`), viewport was silently resized between my own resize and screenshot calls, `localStorage` cleared mid-sequence, and `prefers-reduced-motion` flipped between captures (changing whether the 404 page rendered Spline or its static fallback). Eval calls failed with `Execution context was destroyed, most likely because of a navigation`.

**How to apply:**
1. Before starting, ask the user if they want groups to run serially or in parallel. If serial, the brief's "do not start a new dev server" rule still holds — just don't run other groups simultaneously.
2. If parallel is required, chain navigate + eval + screenshot in one assistant turn (single `<function_calls>` block) to minimize the contention window. Don't use `browser_wait_for` (the wait yields control and the parallel agent will grab it).
3. ALWAYS verify each saved screenshot after-the-fact with `sips -g pixelWidth -g pixelHeight <file>` — the filename may say `tablet-landscape-light` but the actual capture could be portrait-dark because viewport/theme drifted between resize and screenshot.
4. Skim each saved capture image with the Read tool. Don't trust the filename. Re-capture any that show the wrong route, wrong orientation, or wrong theme.
5. For theme switching, forcibly mutate `document.documentElement.classList` AND `localStorage.theme` AND `style.colorScheme` in a single eval right before the screenshot, then screenshot in the same turn. Going through next-themes' toggle button is slower and gives the parallel agent more time to interfere.
6. Don't rely on `localStorage` survival across navigate calls — the parallel agent may navigate to `about:blank`, which raises `SecurityError` on the next `localStorage.setItem`.
