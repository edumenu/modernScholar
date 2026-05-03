import createMDX from "@next/mdx";
import remarkFrontmatter from "remark-frontmatter";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  pageExtensions: ["ts", "tsx", "mdx"],
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
    remarkPlugins: [remarkFrontmatter],
    rehypePlugins: [],
  },
});

export default withMDX(nextConfig);
