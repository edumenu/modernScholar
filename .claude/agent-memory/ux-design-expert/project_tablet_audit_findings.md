---
name: Tablet Responsive Audit — Key Findings
description: P0-P1 issues, cross-cutting patterns, and open architecture questions from the 2026-05-16 tablet audit (40 captures across 10 routes)
type: project
---

Tablet audit PRD at Brain/PRDs/05_16_2026/tablet-responsive-audit.md — 40 captures, 10 routes, 768×1024 portrait + 1024×768 landscape, light + dark.

**P0 ship-blockers**:
1. Home dark landscape triggers global error boundary (error.tsx) — src/app/(home)/page.tsx + hero-section.tsx Spline URL resolution
2. /blog/<invalid-slug> crashes with Next.js runtime error — output: "export" + dynamicParams=false are incompatible; bespoke not-found UI is dead code

**Critical cross-cutting P1 patterns**:
- Sub-44px touch targets on footer nav (20px), reading-progress TOC buttons (16px), blog card CTAs (28-34px), filter chips (34px), carousel arrows (34×34) — sitewide fix needed
- Missing :focus-visible ring — global globals.css fix needed; outlineStyle: 'none' confirmed on logo and likely all interactive elements
- Prose measure 96-100ch at landscape — blog-detail-content.tsx:55 (max-w-prose → max-w-[65ch]) and legal-layout.tsx:56 (max-w-3xl → max-w-2xl)
- formatLastUpdated() TZ bug: new Date(`${iso}T00:00:00Z`) + Intl without timeZone: 'UTC' renders prior day — fix: add timeZone: 'UTC' to LAST_UPDATED_FORMATTER

**Architecture decisions pending (Open Questions)**:
- Q1: Drop output: "export" to fix blog 404 routing? (P0 blocker — needs project owner decision)
- Q2: Suppress global footer on /not-found and /error routes? (footer adds 450px below CTAs)
- Q3: Legal page section numbering — harmonize /terms numbered style with /cookies + /privacy?
- Q4: Re-enable reactStrictMode after fixing LogoLoader restart bug
- Q5: MDX heading convention — ### (H3) should be ## (H2) for proper article outline

**Why:** These are architectural decisions, not just styling fixes — the project owner must decide before implementation proceeds on the P0 items.
**How to apply:** When proposing blog routing fixes or legal page content changes, surface the Q1/Q3 open questions first.
