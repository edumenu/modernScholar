import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CanvasText } from "./canvas-text";
import { PRETEXT_FONTS } from "@/lib/pretext/fonts";

const meta: Meta<typeof CanvasText> = {
  title: "Pretext/CanvasText",
  component: CanvasText,
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
    height: { control: { type: "number", min: 50, max: 600, step: 10 } },
    color: { control: "color" },
    align: {
      control: "select",
      options: ["left", "center", "right"],
    },
    scrollReveal: { control: "boolean" },
  },
};
export default meta;

type Story = StoryObj<typeof CanvasText>;

/* ─── Basic solid color ─── */

export const Default: Story = {
  args: {
    text: "Canvas-rendered text with pixel-perfect line breaks",
    font: PRETEXT_FONTS.heroHeadline,
    lineHeight: 56,
    height: 200,
    color: "#76312D",
    align: "center",
    className: "w-full max-w-3xl",
  },
};

/* ─── Alignment options ─── */

export const LeftAligned: Story = {
  args: {
    text: "Left-aligned canvas text for editorial layouts and long-form content sections",
    font: PRETEXT_FONTS.sectionHeading,
    lineHeight: 40,
    height: 160,
    color: "#1a1a1a",
    align: "left",
    className: "w-full max-w-lg",
  },
};

export const RightAligned: Story = {
  args: {
    text: "Right-aligned for pull quotes or accent text",
    font: PRETEXT_FONTS.sectionHeading,
    lineHeight: 40,
    height: 120,
    color: "#1a1a1a",
    align: "right",
    className: "w-full max-w-md",
  },
};

/* ─── Gradient fills ─── */

export const GradientWarmSunset: Story = {
  name: "Gradient — Warm Sunset",
  args: {
    text: "Gradient text fills that CSS cannot achieve on multiline text",
    font: PRETEXT_FONTS.heroHeadline,
    lineHeight: 56,
    height: 200,
    gradient: { start: "#943E30", end: "#D4A574" },
    align: "center",
    className: "w-full max-w-3xl",
  },
};

export const GradientOceanBreeze: Story = {
  name: "Gradient — Ocean Breeze",
  args: {
    text: "A cool blue-to-teal gradient across the full text width",
    font: PRETEXT_FONTS.heroHeadline,
    lineHeight: 56,
    height: 200,
    gradient: { start: "#1e40af", end: "#0d9488" },
    align: "center",
    className: "w-full max-w-3xl",
  },
};

export const GradientBrandColors: Story = {
  name: "Gradient — Brand Colors",
  args: {
    text: "Modern Scholar branded gradient using primary and tertiary colors",
    font: PRETEXT_FONTS.heroHeadline,
    lineHeight: 56,
    height: 200,
    gradient: { start: "#76312D", end: "#536256" },
    align: "center",
    className: "w-full max-w-3xl",
  },
};

/* ─── Dark background showcase ─── */

export const OnDarkBackground: Story = {
  render: () => (
    <div className="rounded-2xl bg-on-surface p-12">
      <CanvasText
        text="Light text on a dark background with gradient fill"
        font={PRETEXT_FONTS.heroHeadline}
        lineHeight={56}
        height={200}
        gradient={{ start: "#fbbf24", end: "#f97316" }}
        align="center"
        className="w-full"
      />
    </div>
  ),
};

/* ─── Scroll reveal ─── */

export const ScrollReveal: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <p className="text-sm text-on-surface-variant">
        Scroll down to see the reveal effect. The text wipes in line-by-line as
        you scroll.
      </p>
      <div className="h-[60vh]" />
      <CanvasText
        text="This text reveals as you scroll — each line wipes in progressively from left to right"
        font={PRETEXT_FONTS.heroHeadline}
        lineHeight={56}
        height={250}
        color="#76312D"
        align="center"
        scrollReveal
        className="w-full max-w-3xl mx-auto"
      />
      <div className="h-[40vh]" />
    </div>
  ),
  parameters: {
    layout: "fullscreen",
  },
};

export const ScrollRevealWithGradient: Story = {
  render: () => (
    <div className="flex flex-col gap-8 px-8">
      <p className="text-sm text-on-surface-variant">
        Scroll down to see the gradient text reveal.
      </p>
      <div className="h-[60vh]" />
      <CanvasText
        text="Gradient fills combined with scroll-driven reveal create striking entrance animations"
        font={PRETEXT_FONTS.heroHeadline}
        lineHeight={56}
        height={250}
        gradient={{ start: "#943E30", end: "#D4A574" }}
        align="center"
        scrollReveal
        className="w-full max-w-3xl mx-auto"
      />
      <div className="h-[40vh]" />
    </div>
  ),
  parameters: {
    layout: "fullscreen",
  },
};

/* ─── Typography showcase ─── */

export const BodyText: Story = {
  args: {
    text: "Canvas rendering also works well for body text. This lets you apply effects like gradient fills to paragraphs — something CSS background-clip can do for single lines, but struggles with across multiple lines of wrapped text.",
    font: PRETEXT_FONTS.body,
    lineHeight: 28,
    height: 180,
    color: "#444",
    align: "left",
    className: "w-full max-w-lg",
  },
};

export const SmallText: Story = {
  args: {
    text: "Even small text like captions and labels can be rendered to canvas with precise line breaks. Useful for data visualizations or overlays where DOM text doesn't work.",
    font: PRETEXT_FONTS.bodySmall,
    lineHeight: 22,
    height: 120,
    color: "#666",
    align: "left",
    className: "w-full max-w-sm",
  },
};

/* ─── All alignments comparison ─── */

export const AlignmentComparison: Story = {
  render: () => (
    <div className="flex flex-col gap-12">
      {(["left", "center", "right"] as const).map((alignment) => (
        <div key={alignment}>
          <p className="mb-4 text-xs font-medium uppercase tracking-widest text-tertiary">
            align: &quot;{alignment}&quot;
          </p>
          <div className="rounded-lg border border-outline-variant/20 p-4">
            <CanvasText
              text="Pretext measures exact line widths, enabling precise alignment on canvas"
              font={PRETEXT_FONTS.sectionHeading}
              lineHeight={40}
              height={130}
              color="#76312D"
              align={alignment}
              className="w-full"
            />
          </div>
        </div>
      ))}
    </div>
  ),
};

/* ─── Gradient gallery ─── */

export const GradientGallery: Story = {
  render: () => {
    const gradients = [
      { name: "Burgundy to Gold", start: "#76312D", end: "#D4A574" },
      { name: "Sage to Emerald", start: "#536256", end: "#059669" },
      { name: "Rose to Violet", start: "#e11d48", end: "#7c3aed" },
      { name: "Sky to Indigo", start: "#0ea5e9", end: "#4f46e5" },
      { name: "Amber to Crimson", start: "#f59e0b", end: "#dc2626" },
      { name: "Teal to Cyan", start: "#0d9488", end: "#06b6d4" },
    ];

    return (
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        {gradients.map((g) => (
          <div key={g.name}>
            <p className="mb-3 text-xs font-medium uppercase tracking-widest text-tertiary">
              {g.name}
            </p>
            <CanvasText
              text="Gradient text"
              font={PRETEXT_FONTS.heroHeadline}
              lineHeight={56}
              height={80}
              gradient={{ start: g.start, end: g.end }}
              align="left"
              className="w-full"
            />
          </div>
        ))}
      </div>
    );
  },
};
