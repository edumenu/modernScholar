# Supplemental Capture Log — /scholarships + /contact

## Capture Inventory
| # | File | Overflow | Console Errors |
|---|------|----------|----------------|
| 1 | scholarships-tablet-portrait-light.png | N | 0 |
| 2 | scholarships-tablet-portrait-dark.png | N | 0 |
| 3 | scholarships-tablet-landscape-light.png | N | 1 |
| 4 | scholarships-tablet-landscape-dark.png | N | 0 |
| 5 | contact-tablet-portrait-light.png | N | 1 |
| 6 | contact-tablet-portrait-dark.png | N | 1 |
| 7 | contact-tablet-landscape-light.png | N | 1 |
| 8 | contact-tablet-landscape-dark.png | N | 1 |

## Observations
- All 8 captures succeeded; no horizontal overflow detected on any viewport.
- /scholarships landscape-light recorded 1 console error during the capture window (hydration mismatch reported earlier in session attributed to /cookies route navigation from a concurrent agent; may be unrelated to /scholarships itself).
- /contact captures consistently logged ~1 error each plus high-volume warnings (180+ warnings on portrait views); Spline 3D scene loading is the likely warning source.
- Tab interference: a second concurrent playwright-mcp session repeatedly hijacked tab 0 during the capture run. Worked around by opening a dedicated tab (index 1) and re-navigating before each capture; all 8 target captures were saved successfully.
