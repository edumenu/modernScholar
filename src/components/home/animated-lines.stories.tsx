import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AnimatedLines } from "./animated-lines";
import { PRETEXT_FONTS, PRETEXT_FALLBACK_FONTS } from "@/lib/pretext/fonts";

const meta: Meta<typeof AnimatedLines> = {
  title: "Pretext/AnimatedLines",
  component: AnimatedLines,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    text: { control: "text" },
    font: {
      control: "select",
      options: Object.values(PRETEXT_FONTS),
    },
    lineHeight: { control: { type: "number", min: 12, max: 80, step: 2 } },
    as: {
      control: "select",
      options: ["h1", "h2", "h3", "p", "span"],
    },
    variant: {
      control: "select",
      options: ["fadeUp", "blurIn", "slideUp"],
    },
    staggerDelay: { control: { type: "number", min: 0, max: 1, step: 0.01 } },
    initialDelay: { control: { type: "number", min: 0, max: 2, step: 0.1 } },
  },
};
export default meta;

type Story = StoryObj<typeof AnimatedLines>;

/* ─── Basic usage ─── */

export const Default: Story = {
  args: {
    text: "Your scholarship journey starts here",
    font: PRETEXT_FONTS.heroHeadline,
    lineHeight: 52,
    as: "h1",
    className:
      "font-heading text-5xl font-bold leading-tight tracking-tight text-on-surface",
    wrapperClassName: "max-w-3xl",
    staggerDelay: 0.12,
    initialDelay: 0,
    variant: "fadeUp",
  },
};

export const Paragraph: Story = {
  args: {
    text: "Discover a world of educational possibilities and scholarship programs designed to support outstanding students who demonstrate academic excellence and community leadership.",
    font: PRETEXT_FONTS.body,
    lineHeight: 28,
    as: "p",
    className: "text-base leading-7 text-on-surface-variant",
    wrapperClassName: "max-w-xl",
    staggerDelay: 0.06,
    variant: "fadeUp",
  },
};

/* ─── Animation variants ─── */

export const FadeUp: Story = {
  args: {
    text: "Each line fades up from below with a staggered delay",
    font: PRETEXT_FONTS.sectionHeading,
    lineHeight: 40,
    as: "h2",
    className:
      "font-heading text-3xl font-medium tracking-tight text-on-surface",
    wrapperClassName: "max-w-md",
    variant: "fadeUp",
    staggerDelay: 0.15,
  },
};

export const BlurIn: Story = {
  args: {
    text: "Lines emerge from a blur, creating a soft focus-to-sharp reveal effect",
    font: PRETEXT_FONTS.sectionHeading,
    lineHeight: 40,
    as: "h2",
    className:
      "font-heading text-3xl font-medium tracking-tight text-on-surface",
    wrapperClassName: "max-w-md",
    variant: "blurIn",
    staggerDelay: 0.18,
  },
};

export const SlideUp: Story = {
  args: {
    text: "A more dramatic slide from far below, great for hero sections",
    font: PRETEXT_FONTS.heroHeadline,
    lineHeight: 56,
    as: "h1",
    className:
      "font-heading text-5xl font-bold leading-tight tracking-tight text-on-surface",
    wrapperClassName: "max-w-lg",
    variant: "slideUp",
    staggerDelay: 0.14,
  },
};

/* ─── CLS prevention with fallback font ─── */

export const WithFallbackFont: Story = {
  args: {
    text: "This text reserves space using a fallback serif font before Noto Serif loads, preventing layout shift",
    font: PRETEXT_FONTS.heroHeadline,
    fallbackFont: PRETEXT_FALLBACK_FONTS.heroHeadline,
    lineHeight: 52,
    as: "h1",
    className:
      "font-heading text-5xl font-bold leading-tight tracking-tight text-on-surface",
    wrapperClassName: "max-w-2xl",
    variant: "fadeUp",
    staggerDelay: 0.1,
  },
};

/* ─── Different widths to show responsive line-breaking ─── */

export const NarrowContainer: Story = {
  args: {
    text: "Pretext accurately splits text at any container width",
    font: PRETEXT_FONTS.sectionHeading,
    lineHeight: 40,
    as: "h2",
    className:
      "font-heading text-3xl font-medium tracking-tight text-on-surface",
    wrapperClassName: "max-w-xs",
    variant: "fadeUp",
    staggerDelay: 0.1,
  },
};

export const WideContainer: Story = {
  args: {
    text: "Pretext accurately splits text at any container width — this one uses a wider max-width so the text fits on fewer lines",
    font: PRETEXT_FONTS.sectionHeading,
    lineHeight: 40,
    as: "h2",
    className:
      "font-heading text-3xl font-medium tracking-tight text-on-surface",
    wrapperClassName: "max-w-4xl",
    variant: "fadeUp",
    staggerDelay: 0.1,
  },
};

/* ─── All variants side by side ─── */

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-16">
      <div>
        <p className="mb-4 text-xs font-medium uppercase tracking-widest text-tertiary">
          fadeUp
        </p>
        <AnimatedLines
          text="Lines fade up from below with opacity"
          font={PRETEXT_FONTS.sectionHeading}
          lineHeight={40}
          as="h2"
          className="font-heading text-3xl font-medium tracking-tight text-on-surface"
          wrapperClassName="max-w-md"
          variant="fadeUp"
          staggerDelay={0.12}
        />
      </div>
      <div>
        <p className="mb-4 text-xs font-medium uppercase tracking-widest text-tertiary">
          blurIn
        </p>
        <AnimatedLines
          text="Lines sharpen from a blurred state"
          font={PRETEXT_FONTS.sectionHeading}
          lineHeight={40}
          as="h2"
          className="font-heading text-3xl font-medium tracking-tight text-on-surface"
          wrapperClassName="max-w-md"
          variant="blurIn"
          staggerDelay={0.18}
        />
      </div>
      <div>
        <p className="mb-4 text-xs font-medium uppercase tracking-widest text-tertiary">
          slideUp
        </p>
        <AnimatedLines
          text="Lines slide in from far below"
          font={PRETEXT_FONTS.sectionHeading}
          lineHeight={40}
          as="h2"
          className="font-heading text-3xl font-medium tracking-tight text-on-surface"
          wrapperClassName="max-w-md"
          variant="slideUp"
          staggerDelay={0.14}
        />
      </div>
    </div>
  ),
};

/* ─── Stagger speed comparison ─── */

export const StaggerSpeeds: Story = {
  render: () => (
    <div className="flex flex-col gap-16">
      {[0.05, 0.12, 0.25, 0.5].map((delay) => (
        <div key={delay}>
          <p className="mb-4 text-xs font-medium uppercase tracking-widest text-tertiary">
            staggerDelay: {delay}s
          </p>
          <AnimatedLines
            text="Adjust the stagger delay to control how quickly each line appears after the previous one"
            font={PRETEXT_FONTS.body}
            lineHeight={28}
            as="p"
            className="text-base leading-7 text-on-surface-variant"
            wrapperClassName="max-w-md"
            variant="fadeUp"
            staggerDelay={delay}
          />
        </div>
      ))}
    </div>
  ),
};

/* ─── Semantic heading levels ─── */

export const HeadingLevels: Story = {
  render: () => (
    <div className="flex flex-col gap-12">
      <AnimatedLines
        text="Heading 1 — Hero headline"
        font={PRETEXT_FONTS.heroHeadline}
        lineHeight={56}
        as="h1"
        className="font-heading text-5xl font-bold tracking-tight text-on-surface"
        variant="fadeUp"
        staggerDelay={0.1}
      />
      <AnimatedLines
        text="Heading 2 — Section title"
        font={PRETEXT_FONTS.sectionHeading}
        lineHeight={40}
        as="h2"
        className="font-heading text-3xl font-medium tracking-tight text-on-surface"
        variant="fadeUp"
        staggerDelay={0.1}
      />
      <AnimatedLines
        text="Heading 3 — Subsection"
        font={PRETEXT_FONTS.cardTitle}
        lineHeight={28}
        as="h3"
        className="text-lg font-medium text-on-surface"
        variant="fadeUp"
        staggerDelay={0.1}
      />
      <AnimatedLines
        text="Paragraph — Body text with line-by-line reveal for long-form content. Pretext measures each line break so the animation is perfectly synced."
        font={PRETEXT_FONTS.body}
        lineHeight={28}
        as="p"
        className="text-base leading-7 text-on-surface-variant"
        wrapperClassName="max-w-lg"
        variant="fadeUp"
        staggerDelay={0.06}
      />
    </div>
  ),
};
