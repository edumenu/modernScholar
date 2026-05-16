import createMDX from "@next/mdx";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  pageExtensions: ["ts", "tsx", "mdx"],
  // Strict Mode's intentional mount → unmount → remount cycle in dev tears down
  // and recreates the LogoLoader's DOM, which restarts its CSS animation
  // partway through the first cycle (visible as "tip shows, pauses, restarts").
  // Production never runs Strict Mode anyway, so dev now matches prod here.
  // TODO: Make LogoLoader restart-tolerant (e.g. animation-fill-mode: forwards
  // with a one-shot trigger class) so we can re-enable Strict Mode and regain
  // double-invocation checks across the rest of the app.
  reactStrictMode: false,
  // images.unoptimized is required by output: "export" — Next can't run the
  // image optimization server in static mode. If we ever drop static export,
  // re-evaluate this and the mdx-components.tsx <img> fallback together.
  images: {
    unoptimized: true,
  },
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production" ? { exclude: ["error"] } : false,
  },
};

const withMDX = createMDX({
  options: {
    // remark-frontmatter strips the YAML block so it doesn't render as body text.
    // gray-matter still parses the same block separately for metadata in src/lib/blog.ts.
    // remark-gfm adds tables, strikethrough, task lists, and autolinks so blog
    // MDX authored in standard GitHub-Flavored Markdown renders correctly.
    remarkPlugins: [remarkFrontmatter, remarkGfm],
    rehypePlugins: [],
  },
});

export default withMDX(nextConfig);
