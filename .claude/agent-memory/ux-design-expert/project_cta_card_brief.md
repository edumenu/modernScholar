---
name: project-cta-card-brief
description: Design brief for the inline CTA card on the scholarships page — goal, voice, placement, and accent direction
metadata:
  type: project
---

CTA card inserted every 9-12 scholarship cards in the grid. Link target: `https://beacons.ai/dearmodernscholar`.

Goal: drive email capture for a personalized scholarship list. Voice: utility-led — "skip the scroll, get a list matched to your profile." Do NOT mention Instagram. User is in evaluation mode.

Sage (`--color-secondary`, #536256) was suggested as an accent direction. Three distinct visual concepts were requested (editorial pull-quote, index card/archival, action panel, asymmetric span — not locked to these). Concepts delivered 2026-05-25, user choosing before implementation.

**Why:** CTA must feel native to the grid rhythm but be distinct enough for a scrolling eye to catch. Must not look like an ad.

**How to apply:** When implementing the chosen concept, inject into `scholarship-grid.tsx` after every 9-12 real card slots in the `visibleItems.map`. Handle both grid and list layout views.
