import type { ComponentType } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { Callout } from "./callout"
import { InlineScholarshipCard } from "./inline-scholarship-card"
import { PullQuote } from "./pull-quote"
import { useMDXComponents } from "./mdx-components"

// Slug from the first entry of src/data/scholarships-enriched.json.
const FIRST_SCHOLARSHIP_SLUG = "engebretson-foundation-scholarship-march-1"

/**
 * Visual reference for the full MDX surface — every prose element rendered
 * through the same component map that powers blog posts, plus the three
 * custom components exposed in MDX scope.
 *
 * Storybook does not compile MDX here; we render JSX through the map directly
 * so the class strings stay in sync without a build step.
 */
// @react-three/fiber augments the global JSX namespace, widening `ElementType`
// until its intersected `children` prop collapses to `never`. Cast the MDX map
// entries to a props-permissive component type instead.
type MDXComponent = ComponentType<Record<string, unknown>>

function MDXKitchenSink() {
  const mdx = useMDXComponents({})
  const H2 = mdx.h2 as MDXComponent
  const H3 = mdx.h3 as MDXComponent
  const P = mdx.p as MDXComponent
  const Ul = mdx.ul as MDXComponent
  const Ol = mdx.ol as MDXComponent
  const Li = mdx.li as MDXComponent
  const A = mdx.a as MDXComponent
  const Code = mdx.code as MDXComponent
  const Pre = mdx.pre as MDXComponent
  const Blockquote = mdx.blockquote as MDXComponent
  const Img = mdx.img as MDXComponent

  return (
    <article>
      <H2>Section heading rendered through the MDX map</H2>
      <P>
        This kitchen sink renders every prose primitive exposed by{" "}
        <Code>useMDXComponents</Code> alongside the three custom components
        available in the MDX scope:{" "}
        <A href="#pullquote">PullQuote</A>,{" "}
        <A href="#callout">Callout</A>, and{" "}
        <A href="#inline">InlineScholarshipCard</A>.
      </P>

      <H3>Subheading and lists</H3>
      <P>An unordered list:</P>
      <Ul>
        <Li>Editorial typography pairs Noto Serif with Poppins.</Li>
        <Li>Color tokens are expressed in OKLCH for perceptual evenness.</Li>
        <Li>Glassmorphism is reserved for floating elements only.</Li>
      </Ul>

      <P>An ordered list:</P>
      <Ol>
        <Li>Identify a scholarship that matches your profile.</Li>
        <Li>Draft your personal statement in plain language.</Li>
        <Li>Submit before the deadline — and keep a copy.</Li>
      </Ol>

      <H3>Inline code and code blocks</H3>
      <P>
        Use <Code>npm run dev</Code> to start the local dev server. For a
        production build, run:
      </P>
      <Pre>
        <Code>{`npm run build\nnpm run start`}</Code>
      </Pre>

      <H3>Blockquote</H3>
      <Blockquote>
        Reading is the silent conversation between author and reader, separated
        only by time.
      </Blockquote>

      <H3>Image</H3>
      <Img
        src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1600&q=80"
        alt="A library reading room with tall arched windows"
        width={1600}
        height={900}
      />

      <H2 id="pullquote">Custom: PullQuote</H2>
      <PullQuote
        quote="The scholarship is not just an award; it is a covenant between the curious mind and the institutions that believe in its potential."
        attribution="Dr. Eleanor Whitcombe"
      />

      <H2 id="callout">Custom: Callouts</H2>
      <Callout type="tip">
        <p>
          Begin your personal statement at least four weeks before the
          deadline.
        </p>
      </Callout>
      <Callout type="warning">
        <p>
          Late submissions are almost never accepted, even when the portal
          appears open.
        </p>
      </Callout>
      <Callout type="note">
        <p>
          Some scholarships accept recommendation letters separately from the
          main application.
        </p>
      </Callout>

      <H2 id="inline">Custom: InlineScholarshipCard</H2>
      <P>
        The inline card breaks out of the prose rhythm with its own surface
        while staying anchored to the reading column.
      </P>
      <InlineScholarshipCard slug={FIRST_SCHOLARSHIP_SLUG} />
      <P>Blog copy continues below the card without crowding it.</P>
    </article>
  )
}

const meta: Meta<typeof MDXKitchenSink> = {
  title: "Blog/MDX Kitchen Sink",
  component: MDXKitchenSink,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div className="mx-auto max-w-3xl bg-background px-6 py-12">
        <Story />
      </div>
    ),
  ],
}
export default meta

type Story = StoryObj<typeof MDXKitchenSink>

export const Default: Story = {}
