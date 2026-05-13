import type { ImgHTMLAttributes, ReactNode } from "react"
import type { MDXComponents } from "mdx/types"
import Image from "next/image"

import { cn, slugify } from "@/lib/utils"
import { Callout } from "@/components/blog/callout"
import { InlineScholarshipCard } from "@/components/blog/inline-scholarship-card"
import { PullQuote } from "@/components/blog/pull-quote"

/**
 * Flattens a heading's children to plain text so its id can be slugified.
 * Mirrors the rule used by `extractHeadings` in `src/lib/blog.ts` so the DOM
 * id rendered here matches the id stored on the post's `headings` array.
 */
function nodeToText(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node)
  if (Array.isArray(node)) return node.map(nodeToText).join("")
  if (node && typeof node === "object" && "props" in node) {
    return nodeToText((node as { props: { children?: ReactNode } }).props.children)
  }
  return ""
}

/**
 * Blog MDX component map.
 *
 * Maps standard markdown elements to design-system class strings ported from
 * `blog-detail-content.tsx` so that prose authored in MDX matches the editorial
 * styling of legacy posts. Custom components (PullQuote, Callout,
 * InlineScholarshipCard) are exposed in MDX scope without import.
 *
 * Consumed by server components — do NOT add "use client".
 */
export function useMDXComponents(
  components?: MDXComponents,
): MDXComponents {
  return {
    ...components,
    h2: ({ className, id, children, ...props }) => {
      const headingId = id ?? slugify(nodeToText(children))
      return (
        <h2
          id={headingId || undefined}
          className={cn(
            "mt-12 scroll-mt-32 font-heading text-2xl font-bold text-on-surface md:text-3xl",
            className,
          )}
          {...props}
        >
          {children}
        </h2>
      )
    },
    h3: ({ className, id, children, ...props }) => {
      const headingId = id ?? slugify(nodeToText(children))
      return (
        <h3
          id={headingId || undefined}
          className={cn(
            "mt-8 scroll-mt-32 font-heading text-xl font-bold text-on-surface md:text-2xl",
            className,
          )}
          {...props}
        >
          {children}
        </h3>
      )
    },
    p: ({ className, ...props }) => (
      <p
        className={cn(
          "mt-4 text-base leading-relaxed text-on-surface",
          className,
        )}
        {...props}
      />
    ),
    ul: ({ className, ...props }) => (
      <ul
        className={cn(
          "mt-4 list-disc space-y-2 pl-6 text-base leading-relaxed text-on-surface",
          className,
        )}
        {...props}
      />
    ),
    ol: ({ className, ...props }) => (
      <ol
        className={cn(
          "mt-4 list-decimal space-y-2 pl-6 text-base leading-relaxed text-on-surface",
          className,
        )}
        {...props}
      />
    ),
    li: ({ className, ...props }) => (
      <li className={cn("leading-relaxed", className)} {...props} />
    ),
    a: ({ className, ...props }) => (
      <a
        className={cn(
          "text-primary underline underline-offset-4 transition-colors hover:text-primary/80",
          className,
        )}
        {...props}
      />
    ),
    code: ({ className, ...props }) => (
      <code
        className={cn(
          "rounded-md bg-surface-container px-1.5 py-0.5 font-mono text-[0.9em] text-on-surface",
          className,
        )}
        {...props}
      />
    ),
    pre: ({ className, ...props }) => (
      <pre
        className={cn(
          "my-6 overflow-x-auto rounded-xl bg-surface-container-high p-4 font-mono text-sm leading-relaxed text-on-surface",
          className,
        )}
        {...props}
      />
    ),
    blockquote: ({ className, ...props }) => (
      <blockquote
        className={cn(
          "my-6 border-l-4 border-primary/40 pl-5 font-heading text-lg italic leading-relaxed text-on-surface",
          className,
        )}
        {...props}
      />
    ),
    img: ({
      src,
      alt,
      width,
      height,
      className,
    }: ImgHTMLAttributes<HTMLImageElement>) => {
      const altText = alt ?? ""
      const imgClassName = cn(
        "my-8 w-full rounded-2xl object-cover",
        className,
      )

      // MDX-provided src is always a string URL; the wider HTML img typing
      // technically allows Blob, which we don't support here.
      const srcUrl = typeof src === "string" ? src : undefined

      // If MDX omits a string src or dimensions, fall back to a plain <img>.
      // next/image *requires* explicit width/height (or fill + an
      // aspect-ratio wrapper), neither of which we have in the missing-dims
      // path. The project also sets `images: { unoptimized: true }` because
      // of `output: "export"`, so swapping to next/image here would offer no
      // optimization gain — only crash on missing props.
      if (!srcUrl || !width || !height) {
        return (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={srcUrl}
            alt={altText}
            className={imgClassName}
            loading="lazy"
            decoding="async"
          />
        )
      }

      const numericWidth =
        typeof width === "string" ? Number.parseInt(width, 10) : width
      const numericHeight =
        typeof height === "string" ? Number.parseInt(height, 10) : height

      return (
        <Image
          src={srcUrl}
          alt={altText}
          width={numericWidth}
          height={numericHeight}
          className={imgClassName}
        />
      )
    },
    PullQuote,
    Callout,
    InlineScholarshipCard,
  }
}
