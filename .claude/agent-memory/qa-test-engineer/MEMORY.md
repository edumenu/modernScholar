# Memory Index

- [Scholarships data ground truth](project_scholarships_data.md) — How to verify rendered scholarships against source data
- [Scholarships page architecture](project_scholarships_page.md) — Filter / sort / URL state structure for the /scholarships page
- [Mobile filter touch targets](project_a11y_touch_targets.md) — Documented sizes of mobile filter controls and WCAG implications
- [Hero stats are static](project_hero_stats_static.md) — Hero counters are module-load constants, not reactive
- [Multi-group Playwright contention](feedback_multi_group_playwright_contention.md) — Parallel QA groups share one browser session and race; verify every capture
- [Legal layout shared chrome](project_legal_layout_quirks.md) — formatLastUpdated TZ bug, max-w-3xl readability, section id pattern
- [404 / not-found render states](project_not_found_route.md) — Three rendering paths (reduced-motion fallback, Spline loaded, Spline loading)
- [Pagination total stale on /scholarships](project_pagination_stale.md) — Pagination shows full unfiltered page count regardless of active filter
- [/contact 320 overflow](project_contact_320_overflow.md) — Email row + copy button flex-nowrap pushes document past 320px viewport
- [Mobile menu Escape key](project_mobile_menu_escape.md) — Base UI dialog did not dismiss on Escape during 2026-05-17 audit
- [Blog post rendering quirks](project_blog_post_rendering.md) — /blog/[slug] duplicates excerpt + H1→H3 heading skip in article body
- [Callout overflows at 320 with email](project_callout_email_overflow.md) — Tip/Warning Callout flex-1 child missing min-w-0; long email pushes /privacy past viewport
