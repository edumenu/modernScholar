/**
 * Centralized constants for the three legal policy pages
 * (`/privacy`, `/terms`, `/cookies`).
 *
 * Editing any value here updates every page that references it, so the
 * operator never has to chase strings across files. Per the PRD, the
 * user-facing "Last Updated" date is intentionally hand-maintained and
 * lives separately from the git-derived `lastModified` used by the
 * sitemap.
 */

export const CONTACT_EMAIL = "dearmodernscholar@gmail.com" as const

export const CONTROLLERS =
  "Edem and Catherine Dumenu, North Carolina, USA" as const

export const GOVERNING_LAW = "the laws of the State of North Carolina, USA" as const

export const DISPUTE_VENUE =
  "the state or federal courts located in North Carolina" as const

export const RESPONSE_WINDOW_DAYS = 30 as const

export const BREACH_WINDOW_HOURS = 72 as const

/**
 * Per-policy user-facing "Last Updated" date (ISO `YYYY-MM-DD`).
 * Bump the relevant key in the same change-set that edits a policy's prose.
 */
export const LAST_UPDATED = {
  privacy: "2026-05-14",
  terms: "2026-05-14",
  cookies: "2026-05-14",
} as const

export type LegalPolicy = keyof typeof LAST_UPDATED
