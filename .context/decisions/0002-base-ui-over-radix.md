# ADR 0002 — Base UI as the primitive library

**Status:** Accepted
**Date:** 2026-03

## Context

We need an accessible headless primitive library for dialogs, sheets, popovers, tabs, dropdowns, tooltips, etc. The mature options are Radix UI and Base UI (`@base-ui/react`, from the Material UI team).

## Decision

Default to **Base UI** for every primitive. Use Radix only where Base UI lacks coverage.

Currently only one Radix import is in the tree: `@radix-ui/react-slider` (Base UI's slider was missing at the time).

## Why

- Base UI's prop API is closer to native HTML and composes better with our `cn()`-based class strategy.
- Single dependency tree → smaller bundle than mixing both libraries broadly.
- The Material UI team's roadmap aligns with our editorial-but-accessible aesthetic.

## Consequences

- AI suggestions that import from `@radix-ui/react-*` should be rewritten to Base UI unless we already use the Radix equivalent (slider).
- We accept lock-in to Base UI's API shape.
- Watch for Base UI v2 release notes; some primitive APIs are still pre-1.0.
