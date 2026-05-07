import type { Scholarship } from "@/data/scholarships"

/** Parse a scholarship deadline string + year into a timestamp (ms).
 *  Mirrors the existing parsing pattern in `data/scholarships.ts` so all
 *  surfaces use the same definition of "deadline". Returns NaN when the
 *  combined string isn't parseable. */
function parseDeadlineTimestamp(deadline: string, year: number): number {
  return new Date(`${deadline}, ${year}`).getTime()
}

/** Returns true when the scholarship's deadline is strictly before `today`.
 *  Inverse of `isScholarshipActive`. Defaults to `new Date()` so callers can
 *  share a single source of truth without threading a clock. */
export function isExpired(
  scholarship: Scholarship,
  today: Date = new Date(),
): boolean {
  const deadlineTime = parseDeadlineTimestamp(
    scholarship.deadline,
    scholarship.deadlineYear,
  )
  if (Number.isNaN(deadlineTime)) return false
  return deadlineTime < today.getTime()
}

/** Returns the user-facing reopen message for an expired scholarship:
 *  always `"Check back in {deadlineYear + 1}"`. Centralized so cards,
 *  expanded views, and the comparison sheet never drift. */
export function getReopenLabel(scholarship: Scholarship): string {
  return `Check back in ${scholarship.deadlineYear + 1}`
}

/** Convenience composer for surfaces that need both signals at once.
 *  `label` is null when the scholarship is still active so callers can
 *  branch on a single value without re-checking expiry. */
export function getExpiredBadge(
  scholarship: Scholarship,
  today: Date = new Date(),
): { isExpired: boolean; label: string | null } {
  const expired = isExpired(scholarship, today)
  return {
    isExpired: expired,
    label: expired ? getReopenLabel(scholarship) : null,
  }
}
