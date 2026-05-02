# Spline 3D Performance Testing Plan

## Goal

Ensure the Spline 3D hero scene does not degrade page load speed, runtime performance, or user experience. Run performance tests across multiple dimensions and establish baseline metrics.

---

## Current Setup

- **Component:** `src/components/home/spline-scene.tsx` (iframe embed)
- **Integration:** `src/components/home/hero-section.tsx` (React lazy + Suspense)
- **Existing optimizations:** `loading="lazy"`, code-split via `lazy()`, Suspense fallback skeleton

---

## Tests to Run

### 1. Lighthouse Audit (Core Web Vitals)

Run Lighthouse against the home page to capture baseline scores.

```bash
npx lighthouse http://localhost:3000 --output=json --output=html --output-path=./Brain/future/lighthouse-report
```

**Metrics to record:**

| Metric | Target | Why it matters |
|--------|--------|----------------|
| LCP | < 2.5s | Spline iframe could delay largest paint |
| TBT | < 200ms | 3D rendering should not block main thread |
| CLS | < 0.1 | Scene container must not shift layout |
| FCP | < 1.8s | Page should paint before 3D loads |
| Speed Index | < 3.4s | Visual progress should not stall |
| Performance Score | > 90 | Overall health check |

**Run twice:** once with the Spline scene enabled, once with it replaced by a static image placeholder, to isolate the 3D scene's impact.

---

### 2. Network Impact Test

Use Chrome DevTools Network tab (or Playwright) to measure:

- **Total transfer size** of the Spline iframe and its sub-resources
- **Number of network requests** triggered by the iframe
- **Time to interactive** on throttled connections:
  - Fast 3G (1.6 Mbps down, 750ms RTT)
  - Slow 3G (500 Kbps down, 2000ms RTT)
  - Regular 4G (no throttle)

**What to look for:**
- Does the Spline scene load resources that compete with critical page assets (fonts, CSS, hero images)?
- Are Spline assets cached on repeat visits?

---

### 3. Runtime Performance Profiling

Use Chrome DevTools Performance tab to record a 10-second session after page load.

**Metrics to capture:**

| Metric | Target | Notes |
|--------|--------|-------|
| Frame rate | Steady 60fps | Drops below 30fps are a red flag |
| GPU memory | < 150MB | 3D scenes can consume significant GPU memory |
| JS heap | Stable over time | Watch for memory leaks (steadily growing heap) |
| CPU usage | < 15% idle | Scene should not burn CPU when not animating |

**Test on:**
- Desktop (high-end) — Chrome
- Mobile simulation — Chrome DevTools device emulation (Moto G Power or similar mid-range device)

---

### 4. Automated Playwright Performance Tests

Write a Playwright test that can be run in CI.

**File:** `tests/performance/spline-hero.spec.ts`

**Test cases:**

1. **Page load timing**
   - Navigate to `/`
   - Assert `DOMContentLoaded` fires within 2s
   - Assert `load` event fires within 5s

2. **Suspense fallback appears**
   - Navigate to `/`
   - Assert the loading skeleton (`.animate-pulse`) is visible before the iframe

3. **Spline iframe loads**
   - Wait for the iframe with title "Interactive 3D model representing academic scholarship"
   - Assert it becomes visible within 8s

4. **Core Web Vitals via Performance Observer**
   - Inject a Performance Observer to capture LCP and CLS
   - Assert LCP < 2.5s and CLS < 0.1

5. **No layout shift from Spline container**
   - Capture layout shift entries
   - Filter for shifts originating from the hero section
   - Assert total shift score < 0.05

---

### 5. A/B Comparison: Iframe vs Static Fallback

Compare the home page under two configurations:

| Variant | Description |
|---------|-------------|
| **A — Spline iframe** | Current implementation |
| **B — Static image** | Replace iframe with a screenshot/poster of the 3D scene |

**Compare across all metrics from tests 1-4.** This isolates the exact cost of the live 3D scene and answers: "Is the visual benefit worth the performance cost?"

---

### 6. Mobile Device Testing

Test on real devices if available, or use Chrome DevTools device emulation with CPU throttling (4x slowdown).

**Key questions:**
- Does the 3D scene cause jank or dropped frames on mid-range phones?
- Does the `loading="lazy"` attribute effectively defer the iframe on mobile?
- Is battery drain noticeable? (real device only)

---

## Potential Optimizations to Evaluate (Based on Results)

If tests reveal performance issues, evaluate these in order of impact:

1. **Add `width` and `height` to the iframe** — prevents CLS (zero effort)
2. **Use `IntersectionObserver` to defer iframe** — only mount when hero enters viewport (though hero is above-the-fold, this helps if users land via anchor links)
3. **Remove unused `@splinetool/runtime` dependency** — saves bundle size, since only the iframe is used
4. **Poster image with lazy swap** — show a static screenshot, swap to iframe after page is interactive
5. **Reduce Spline scene complexity** — fewer polygons, simpler materials (done in Spline editor)
6. **Use `will-change: transform`** — hint to browser to promote the scene to its own compositing layer

---

## How to Run

```bash
# 1. Start the dev server
npm run dev

# 2. Run Lighthouse
npx lighthouse http://localhost:3000 --view

# 3. Run Playwright performance tests (once written)
npx playwright test tests/performance/spline-hero.spec.ts

# 4. Manual profiling
#    Open Chrome DevTools > Performance tab > Record > reload page > Stop after 10s
```

---

## Success Criteria

The Spline 3D scene is acceptable for production if:

- [ ] Lighthouse Performance score remains > 90
- [ ] LCP < 2.5s on desktop, < 3.5s on mobile simulation
- [ ] CLS < 0.1
- [ ] No frame drops below 30fps during or after scene load
- [ ] JS heap does not grow continuously over 30s
- [ ] Page is interactive (text readable, CTA clickable) before the 3D scene finishes loading
