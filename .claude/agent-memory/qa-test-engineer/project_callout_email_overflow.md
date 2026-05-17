---
name: Callout Component overflow with long email at 320px
description: The MDX/legal Callout (role=note) overflows the viewport at 320 when content contains the unbreakable email link
type: project
---

The Tip/Warning Callout component (`[role="note"]` with flex layout `svg icon | div.flex-1`) **overflows the document past the viewport at 320px** when the callout body contains the unbreakable string `dearmodernscholar@gmail.com` (intrinsic 262px min-width). Confirmed on `/privacy` "Children's privacy" section.

**Why:** The `flex-1` content column is missing `min-w-0`. A flex item's default `min-width: auto` means it can't shrink below its content's intrinsic min size, so the long email word pushes the column to its natural width and the whole callout right-edge spills past the parent.

**Effect:**
- At 375: callout sits at right=351 (24px past viewport but absorbed by gutter)
- At 320: callout right=346, document scrollWidth=346, page horizontally scrolls by 26px (P0 bug)
- `/terms` Tip Callout does NOT overflow because its content has no unbreakable words.
- `/cookies` has no Tip Callout.

**How to apply:** When auditing any page with a Callout containing email links, raw URLs, or long unbroken strings, test 320px specifically. The fix is `min-w-0` on the flex-1 child or `[overflow-wrap:anywhere]` / `break-words` on inner paragraphs. This will also fix any future Callout with a long unbreakable string.
