/**
 * Top-level MDX components map per the Next.js 16 file convention.
 *
 * The actual mapping (design-system class strings + custom components like
 * PullQuote, Callout, InlineScholarshipCard) lives in the blog map at
 * `src/components/blog/mdx-components.tsx`. We re-export `useMDXComponents`
 * from there so Next.js picks it up at the project root.
 */
export { useMDXComponents } from "@/components/blog/mdx-components"
