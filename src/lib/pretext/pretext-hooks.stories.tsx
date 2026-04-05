import { useRef, useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useTextLayout } from "./use-text-layout";
import { useTextLines } from "./use-text-lines";
import { useContainerWidth } from "./use-container-width";
import { PRETEXT_FONTS, PRETEXT_FALLBACK_FONTS } from "./fonts";

/* ─── Wrapper components for hook demos ─── */

function TextLayoutDemo({
  text,
  font,
  maxWidth,
  lineHeight,
}: {
  text: string;
  font: string;
  maxWidth: number;
  lineHeight: number;
}) {
  const { height, lineCount, isReady } = useTextLayout({
    text,
    font,
    maxWidth,
    lineHeight,
  });

  return (
    <div className="flex flex-col gap-4">
      <div
        className="overflow-hidden rounded-lg border border-outline-variant/30 p-4"
        style={{ width: maxWidth }}
      >
        <p style={{ font, maxWidth, lineHeight: `${lineHeight}px` }}>{text}</p>
      </div>
      <div className="flex gap-6 text-sm">
        <span className="rounded-full bg-primary/10 px-3 py-1 font-medium text-primary">
          Lines: {lineCount}
        </span>
        <span className="rounded-full bg-secondary/10 px-3 py-1 font-medium text-secondary">
          Height: {height}px
        </span>
        <span className="rounded-full bg-tertiary/10 px-3 py-1 font-medium text-tertiary">
          Ready: {isReady ? "Yes" : "No"}
        </span>
      </div>
    </div>
  );
}

function TextLinesDemo({
  text,
  font,
  lineHeight,
  containerWidth,
}: {
  text: string;
  font: string;
  lineHeight: number;
  containerWidth: number;
}) {
  const { lines, height, lineCount, isReady } = useTextLines({
    text,
    font,
    maxWidth: containerWidth,
    lineHeight,
  });

  return (
    <div className="flex flex-col gap-4">
      <div
        className="rounded-lg border border-outline-variant/30 p-4"
        style={{ width: containerWidth }}
      >
        {isReady &&
          lines.map((line, i) => (
            <div
              key={i}
              className="border-b border-dashed border-outline-variant/20 py-0.5 font-heading"
              style={{ font, lineHeight: `${lineHeight}px` }}
            >
              <span className="mr-2 inline-block w-5 text-right text-xs text-on-surface-variant/50">
                {i + 1}
              </span>
              {line}
            </div>
          ))}
      </div>
      <div className="flex gap-6 text-sm">
        <span className="rounded-full bg-primary/10 px-3 py-1 font-medium text-primary">
          Lines: {lineCount}
        </span>
        <span className="rounded-full bg-secondary/10 px-3 py-1 font-medium text-secondary">
          Height: {height}px
        </span>
      </div>
    </div>
  );
}

function ResponsiveWidthDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const width = useContainerWidth(ref);

  const text =
    "Resize this container to see how pretext re-measures the text in real time. The line count and height update instantly.";
  const font = PRETEXT_FONTS.body;
  const lineHeight = 28;

  const { lines, lineCount, height, isReady } = useTextLines({
    text,
    font,
    maxWidth: width,
    lineHeight,
  });

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-on-surface-variant">
        Drag the right edge to resize:
      </p>
      <div
        ref={ref}
        className="overflow-auto rounded-lg border border-outline-variant/30 p-4"
        style={{ resize: "horizontal", minWidth: 200, maxWidth: 800 }}
      >
        {isReady &&
          lines.map((line, i) => (
            <span key={i} className="block" style={{ lineHeight: `${lineHeight}px` }}>
              {line}
            </span>
          ))}
        {!isReady && <span className="text-on-surface-variant">{text}</span>}
      </div>
      <div className="flex gap-6 text-sm">
        <span className="rounded-full bg-surface-container px-3 py-1 text-on-surface-variant">
          Width: {width ?? "—"}px
        </span>
        <span className="rounded-full bg-primary/10 px-3 py-1 font-medium text-primary">
          Lines: {lineCount}
        </span>
        <span className="rounded-full bg-secondary/10 px-3 py-1 font-medium text-secondary">
          Height: {height}px
        </span>
      </div>
    </div>
  );
}

function OverflowDetectionDemo() {
  const items = [
    { title: "Short Title", subtitle: "Provider" },
    {
      title: "Digital Learning Platform Excellence Award",
      subtitle: "TechForward Foundation International",
    },
    { title: "Campus Life", subtitle: "University Alliance" },
    {
      title: "Collaborative Learning & Community Engagement Scholarship",
      subtitle: "Community Scholars Network for Educational Development",
    },
    { title: "STEM Grant", subtitle: "Tech Council" },
  ];

  const cardWidth = 280;

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-on-surface-variant">
        Cards with pretext overflow detection — truncated text shows a red
        indicator. Hover to see the full text in a tooltip.
      </p>
      <div className="flex flex-wrap gap-4">
        {items.map((item, idx) => (
          <OverflowCard
            key={idx}
            title={item.title}
            subtitle={item.subtitle}
            width={cardWidth}
          />
        ))}
      </div>
    </div>
  );
}

function OverflowCard({
  title,
  subtitle,
  width,
}: {
  title: string;
  subtitle: string;
  width: number;
}) {
  const { lineCount: titleLines } = useTextLayout({
    text: title,
    font: PRETEXT_FONTS.cardTitle,
    maxWidth: width - 32,
    lineHeight: 25,
  });

  const { lineCount: subtitleLines } = useTextLayout({
    text: subtitle,
    font: PRETEXT_FONTS.bodySmall,
    maxWidth: width - 32,
    lineHeight: 20,
  });

  const titleOverflows = titleLines > 1;
  const subtitleOverflows = subtitleLines > 1;

  return (
    <div
      className="rounded-xl border border-outline-variant/30 p-4"
      style={{ width }}
    >
      <div className="flex items-center gap-2">
        <h3
          className="flex-1 truncate text-lg font-medium text-on-surface"
          title={titleOverflows ? title : undefined}
        >
          {title}
        </h3>
        {titleOverflows && (
          <span className="shrink-0 size-2 rounded-full bg-tertiary" title="Text is truncated" />
        )}
      </div>
      <div className="mt-1 flex items-center gap-2">
        <p
          className="flex-1 truncate text-sm text-on-surface-variant"
          title={subtitleOverflows ? subtitle : undefined}
        >
          {subtitle}
        </p>
        {subtitleOverflows && (
          <span className="shrink-0 size-2 rounded-full bg-tertiary" title="Text is truncated" />
        )}
      </div>
      <div className="mt-3 flex gap-2 text-xs text-on-surface-variant/60">
        <span>Title: {titleLines} line{titleLines > 1 ? "s" : ""}</span>
        <span>&middot;</span>
        <span>
          Subtitle: {subtitleLines} line{subtitleLines > 1 ? "s" : ""}
        </span>
      </div>
    </div>
  );
}

function InteractivePlaygroundDemo() {
  const [text, setText] = useState(
    "Edit this text to see pretext re-measure in real time. Try adding more words or changing the content."
  );
  const [maxWidth, setMaxWidth] = useState(400);
  const [lineHeight, setLineHeight] = useState(28);
  const [fontKey, setFontKey] = useState<keyof typeof PRETEXT_FONTS>("body");

  const font = PRETEXT_FONTS[fontKey];

  const { lines, height, lineCount, isReady } = useTextLines({
    text,
    font,
    maxWidth,
    lineHeight,
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Controls */}
      <div className="grid grid-cols-2 gap-4 rounded-lg bg-surface-container p-4">
        <div className="col-span-2">
          <label className="mb-1 block text-xs font-medium text-on-surface-variant">
            Text
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            className="w-full rounded-md border border-outline-variant/30 bg-surface px-3 py-2 text-sm text-on-surface"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-on-surface-variant">
            Font
          </label>
          <select
            value={fontKey}
            onChange={(e) =>
              setFontKey(e.target.value as keyof typeof PRETEXT_FONTS)
            }
            className="w-full rounded-md border border-outline-variant/30 bg-surface px-3 py-2 text-sm text-on-surface"
          >
            {Object.keys(PRETEXT_FONTS).map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-on-surface-variant">
            Max Width: {maxWidth}px
          </label>
          <input
            type="range"
            min={150}
            max={800}
            value={maxWidth}
            onChange={(e) => setMaxWidth(Number(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-on-surface-variant">
            Line Height: {lineHeight}px
          </label>
          <input
            type="range"
            min={14}
            max={72}
            value={lineHeight}
            onChange={(e) => setLineHeight(Number(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      {/* Output */}
      <div className="flex gap-8">
        {/* Rendered lines */}
        <div
          className="shrink-0 rounded-lg border border-outline-variant/30 p-4"
          style={{ width: maxWidth }}
        >
          {isReady &&
            lines.map((line, i) => (
              <div
                key={i}
                className="border-b border-dashed border-primary/10"
                style={{ lineHeight: `${lineHeight}px`, font }}
              >
                {line}
              </div>
            ))}
        </div>

        {/* Stats */}
        <div className="flex flex-col gap-2 text-sm">
          <div className="rounded-lg bg-primary/5 p-3">
            <div className="text-2xl font-bold text-primary">{lineCount}</div>
            <div className="text-xs text-on-surface-variant">Lines</div>
          </div>
          <div className="rounded-lg bg-secondary/5 p-3">
            <div className="text-2xl font-bold text-secondary">{height}px</div>
            <div className="text-xs text-on-surface-variant">Height</div>
          </div>
          <div className="rounded-lg bg-tertiary/5 p-3">
            <div className="text-2xl font-bold text-tertiary">{maxWidth}px</div>
            <div className="text-xs text-on-surface-variant">Width</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function WidthComparisonDemo() {
  const text =
    "The same text measured at different container widths shows how pretext calculates precise line breaks.";
  const font = PRETEXT_FONTS.body;
  const lineHeight = 28;
  const widths = [200, 300, 400, 600];

  return (
    <div className="flex flex-col gap-8">
      {widths.map((w) => (
        <WidthComparisonItem
          key={w}
          text={text}
          font={font}
          lineHeight={lineHeight}
          maxWidth={w}
        />
      ))}
    </div>
  );
}

function WidthComparisonItem({
  text,
  font,
  lineHeight,
  maxWidth,
}: {
  text: string;
  font: string;
  lineHeight: number;
  maxWidth: number;
}) {
  const { lineCount, height } = useTextLayout({
    text,
    font,
    maxWidth,
    lineHeight,
  });

  return (
    <div>
      <div className="mb-2 flex items-center gap-3">
        <span className="text-xs font-medium uppercase tracking-widest text-tertiary">
          {maxWidth}px
        </span>
        <span className="text-xs text-on-surface-variant">
          {lineCount} lines &middot; {height}px tall
        </span>
      </div>
      <div
        className="rounded-lg border border-outline-variant/30 p-3"
        style={{ width: maxWidth }}
      >
        <p style={{ font, lineHeight: `${lineHeight}px` }}>{text}</p>
      </div>
    </div>
  );
}

/* ─── Meta ─── */

const meta: Meta = {
  title: "Pretext/Hooks",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
};
export default meta;

type Story = StoryObj;

/* ─── Stories ─── */

export const UseTextLayout: Story = {
  name: "useTextLayout — Basic Measurement",
  render: () => (
    <div className="flex flex-col gap-8">
      <p className="text-sm text-on-surface-variant">
        <code className="rounded bg-surface-container px-1.5 py-0.5 text-xs">
          useTextLayout
        </code>{" "}
        returns the height and line count for text at a given width. Useful for
        overflow detection and space reservation.
      </p>
      <TextLayoutDemo
        text="A short text that fits on one line at this width."
        font={PRETEXT_FONTS.body}
        maxWidth={400}
        lineHeight={28}
      />
      <TextLayoutDemo
        text="A longer text that will wrap across multiple lines because the container is narrower. Pretext calculates the exact number of lines."
        font={PRETEXT_FONTS.body}
        maxWidth={300}
        lineHeight={28}
      />
      <TextLayoutDemo
        text="Heading text at a narrow width"
        font={PRETEXT_FONTS.heroHeadline}
        maxWidth={250}
        lineHeight={56}
      />
    </div>
  ),
};

export const UseTextLines: Story = {
  name: "useTextLines — Line Splitting",
  render: () => (
    <div className="flex flex-col gap-8">
      <p className="text-sm text-on-surface-variant">
        <code className="rounded bg-surface-container px-1.5 py-0.5 text-xs">
          useTextLines
        </code>{" "}
        splits text into an array of strings — each string is one rendered line.
        Numbered lines show exactly where pretext breaks the text.
      </p>
      <TextLinesDemo
        text="Pretext splits this text into individual lines based on the container width and font metrics. Each line is returned as a separate string."
        font={PRETEXT_FONTS.body}
        lineHeight={28}
        containerWidth={400}
      />
      <TextLinesDemo
        text="Your scholarship journey starts here"
        font={PRETEXT_FONTS.heroHeadline}
        lineHeight={56}
        containerWidth={500}
      />
    </div>
  ),
};

export const UseContainerWidth: Story = {
  name: "useContainerWidth — Responsive Measurement",
  render: () => (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-on-surface-variant">
        <code className="rounded bg-surface-container px-1.5 py-0.5 text-xs">
          useContainerWidth
        </code>{" "}
        uses ResizeObserver to track an element&apos;s width. Combined with{" "}
        <code className="rounded bg-surface-container px-1.5 py-0.5 text-xs">
          useTextLines
        </code>
        , it re-measures text as the container resizes.
      </p>
      <ResponsiveWidthDemo />
    </div>
  ),
};

export const OverflowDetection: Story = {
  name: "Overflow Detection",
  render: () => <OverflowDetectionDemo />,
};

export const WidthComparison: Story = {
  name: "Width Comparison",
  render: () => (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-on-surface-variant">
        The same text measured at different widths — pretext reports the exact
        line count and height for each.
      </p>
      <WidthComparisonDemo />
    </div>
  ),
};

export const InteractivePlayground: Story = {
  name: "Interactive Playground",
  render: () => (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-on-surface-variant">
        Edit the text, adjust width, line height, and font to see pretext
        re-measure in real time.
      </p>
      <InteractivePlaygroundDemo />
    </div>
  ),
};

export const CLSPrevention: Story = {
  name: "CLS Prevention — Fallback Font",
  render: () => {
    const text = "This text is measured with both a fallback and web font";
    const font = PRETEXT_FONTS.heroHeadline;
    const fallback = PRETEXT_FALLBACK_FONTS.heroHeadline;
    const maxWidth = 500;
    const lineHeight = 56;

    const withWebFont = useTextLayout({
      text,
      font,
      maxWidth,
      lineHeight,
    });
    const withFallback = useTextLayout({
      text,
      font: fallback,
      maxWidth,
      lineHeight,
    });

    return (
      <div className="flex flex-col gap-8">
        <p className="text-sm text-on-surface-variant">
          CLS prevention works by measuring with a system fallback font
          immediately, then re-measuring once the web font loads. The height
          difference is usually small enough to avoid visible layout shift.
        </p>
        <div className="flex gap-8">
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-widest text-tertiary">
              Fallback (serif)
            </p>
            <div
              className="rounded-lg border border-outline-variant/30 p-4"
              style={{ width: maxWidth }}
            >
              <p style={{ font: fallback, lineHeight: `${lineHeight}px` }}>
                {text}
              </p>
            </div>
            <p className="mt-2 text-sm text-on-surface-variant">
              Lines: {withFallback.lineCount} &middot; Height:{" "}
              {withFallback.height}px
            </p>
          </div>
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-widest text-tertiary">
              Web font (Noto Serif)
            </p>
            <div
              className="rounded-lg border border-outline-variant/30 p-4"
              style={{ width: maxWidth }}
            >
              <p
                className="font-heading"
                style={{
                  fontSize: "48px",
                  fontWeight: 700,
                  lineHeight: `${lineHeight}px`,
                }}
              >
                {text}
              </p>
            </div>
            <p className="mt-2 text-sm text-on-surface-variant">
              Lines: {withWebFont.lineCount} &middot; Height:{" "}
              {withWebFont.height}px
            </p>
          </div>
        </div>
        <div className="rounded-lg bg-surface-container p-4 text-sm">
          Height difference:{" "}
          <strong>
            {Math.abs(withWebFont.height - withFallback.height)}px
          </strong>{" "}
          — {withWebFont.height === withFallback.height
            ? "no layout shift"
            : "minimal layout shift"}
        </div>
      </div>
    );
  },
};
