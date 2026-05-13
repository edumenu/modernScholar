import path from "node:path"
import type { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/constants"
import { getAllPosts } from "@/lib/blog"
import { getGitLastModified } from "@/lib/git-mtime"

export const dynamic = "force-static"

// Resolve each route's last-modified date from the git history of the route's
// source file. This way the sitemap stays in sync with actual content edits
// (a) without per-build churn, and (b) without anyone having to remember to
// bump a STABLE_*_DATE constant when the legal copy is finalized.
const APP_DIR = path.join(process.cwd(), "src", "app")
const routeFile = (segment: string) => path.join(APP_DIR, segment, "page.tsx")

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: getGitLastModified(path.join(APP_DIR, "page.tsx")),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/scholarships`,
      lastModified: getGitLastModified(routeFile("scholarships")),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: getGitLastModified(routeFile("blog")),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: getGitLastModified(routeFile("contact")),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: getGitLastModified(routeFile("privacy")),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified: getGitLastModified(routeFile("terms")),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/cookies`,
      lastModified: getGitLastModified(routeFile("cookies")),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ]

  const posts = await getAllPosts()

  const blogRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.updatedDate ?? post.publishDate),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }))

  return [...staticRoutes, ...blogRoutes]
}
