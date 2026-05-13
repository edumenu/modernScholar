import { execSync } from "node:child_process"
import { statSync } from "node:fs"

/**
 * Returns the most recent git-committed mtime for `filePath` so sitemap
 * lastModified reflects when the content actually changed — not just when
 * the build ran.
 *
 * Resolution order:
 *   1. `git log -1 --format=%cI -- <path>` (committer ISO date)
 *   2. filesystem mtime (untracked files / shallow clones)
 *   3. current build time (last resort)
 *
 * Build-time use only — relies on `node:child_process` and the working tree.
 */
export function getGitLastModified(filePath: string): Date {
  try {
    const iso = execSync(`git log -1 --format=%cI -- "${filePath}"`, {
      encoding: "utf-8",
      stdio: ["pipe", "pipe", "ignore"],
    }).trim()
    if (iso) {
      const d = new Date(iso)
      if (!Number.isNaN(d.getTime())) return d
    }
  } catch {
    // git unavailable (e.g. Docker build without .git), file untracked, or
    // never committed. Fall through to filesystem mtime.
  }

  try {
    return statSync(filePath).mtime
  } catch {
    return new Date()
  }
}
