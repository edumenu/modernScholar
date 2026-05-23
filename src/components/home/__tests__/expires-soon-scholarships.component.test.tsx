import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

const mockPush = vi.fn();

vi.mock("next/image", () => ({
  __esModule: true,
  default: ({ alt }: { alt: string }) => <span data-alt={alt} />,
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

vi.mock("@iconify/react", () => ({
  Icon: ({ icon }: { icon: string }) => <span data-testid="icon" data-icon={icon} />,
}));

let mockReducedMotion = false;

vi.mock("motion/react", () => ({
  useReducedMotion: () => mockReducedMotion,
  motion: {
    div: ({
      children,
      animate,
      style,
      className,
      drag: _drag,
      onDragStart: _onDragStart,
      onDragEnd: _onDragEnd,
      dragConstraints: _dragConstraints,
      dragElastic: _dragElastic,
      transition: _transition,
      ...rest
    }: Record<string, unknown> & { children?: React.ReactNode }) => (
      <div
        className={className as string}
        style={style as React.CSSProperties}
        data-animate={animate ? JSON.stringify(animate) : undefined}
        {...(rest as React.HTMLAttributes<HTMLDivElement>)}
      >
        {children}
      </div>
    ),
  },
}));

vi.mock("@/components/ui/animatedSection/animated-section", () => ({
  AnimatedSection: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

vi.mock("@/components/ui/parallax-layer", () => ({
  ParallaxLayer: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

vi.mock("@/components/ui/button/button", () => ({
  Button: ({
    children,
    ...props
  }: React.ButtonHTMLAttributes<HTMLButtonElement> & { children?: React.ReactNode }) => (
    <button {...props}>{children}</button>
  ),
}));

vi.mock("@/components/ui/button/button-link", () => ({
  ButtonLink: ({
    children,
    href,
  }: {
    children?: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

vi.mock("@/lib/pretext/use-text-layout", () => ({
  useTextLayout: () => ({ lineCount: 1 }),
}));

vi.mock("@/lib/pretext/fonts", () => ({
  PRETEXT_FONTS: {
    cardTitle: {},
    bodySmall: {},
  },
}));

// Freeze "now" so the in-month slice stays stable as the corpus ages. The
// component reads `SESSION_DATE` (captured at module load via `new Date()`),
// so `vi.resetModules()` in beforeEach ensures session-date re-evaluates with
// the faked system time.
const FROZEN_NOW = new Date("2026-05-07T12:00:00Z");

describe("ExpiresSoonScholarships with CoverflowCarousel", () => {
  beforeEach(() => {
    mockReducedMotion = false;
    mockPush.mockClear();
    vi.useFakeTimers();
    vi.setSystemTime(FROZEN_NOW);
    vi.resetModules();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  function getCarousel(container: HTMLElement) {
    return container.querySelector('[aria-roledescription="carousel"]') as HTMLElement;
  }

  // Mirror the component's in-month + ascending sort + cap-10 logic so the
  // assertions don't break when the underlying data changes.
  async function getActiveCarouselNames(): Promise<string[]> {
    const { scholarships } = await import("@/data/scholarships");
    return scholarships
      .map((s) => ({
        s,
        ms: new Date(`${s.deadline}, ${s.deadlineYear}`).getTime(),
      }))
      .filter(({ ms }) => {
        if (!Number.isFinite(ms) || ms === 0) return false;
        const d = new Date(ms);
        return (
          d.getFullYear() === FROZEN_NOW.getFullYear() &&
          d.getMonth() === FROZEN_NOW.getMonth() &&
          ms >= FROZEN_NOW.getTime()
        );
      })
      .sort((a, b) => a.ms - b.ms)
      .slice(0, 10)
      .map(({ s }) => s.name);
  }

  it("renders carousel with aria-roledescription", async () => {
    const { ExpiresSoonScholarships } = await import("../expires-soon-scholarships");
    const { container } = render(<ExpiresSoonScholarships />);

    const carousel = getCarousel(container);
    expect(carousel).not.toBeNull();
    expect(carousel.getAttribute("aria-roledescription")).toBe("carousel");
  });

  it("renders 10 slides with aria-roledescription='slide'", async () => {
    const { ExpiresSoonScholarships } = await import("../expires-soon-scholarships");
    const { container } = render(<ExpiresSoonScholarships />);

    const slides = container.querySelectorAll('[aria-roledescription="slide"]');
    expect(slides.length).toBe(10);
  });

  it("has a live region announcing the active scholarship", async () => {
    const { ExpiresSoonScholarships } = await import("../expires-soon-scholarships");
    const { container } = render(<ExpiresSoonScholarships />);

    const liveRegion = container.querySelector('[aria-live="polite"]');
    expect(liveRegion).not.toBeNull();
    const names = await getActiveCarouselNames();
    expect(liveRegion!.textContent).toContain(names[0]);
  });

  it("advances to next card on ArrowRight key", async () => {
    const { ExpiresSoonScholarships } = await import("../expires-soon-scholarships");
    const { container } = render(<ExpiresSoonScholarships />);

    const carousel = getCarousel(container);
    carousel.focus();
    fireEvent.keyDown(carousel, { key: "ArrowRight" });

    const liveRegion = container.querySelector('[aria-live="polite"]');
    const names = await getActiveCarouselNames();
    expect(liveRegion!.textContent).toContain(names[1]);
  });

  it("goes to previous card on ArrowLeft key", async () => {
    const { ExpiresSoonScholarships } = await import("../expires-soon-scholarships");
    const { container } = render(<ExpiresSoonScholarships />);

    const carousel = getCarousel(container);
    carousel.focus();
    // ArrowLeft from index 0 wraps to the last active slot
    fireEvent.keyDown(carousel, { key: "ArrowLeft" });

    const liveRegion = container.querySelector('[aria-live="polite"]');
    const names = await getActiveCarouselNames();
    expect(liveRegion!.textContent).toContain(names[names.length - 1]);
  });

  it("navigates to /scholarships?q={id} when clicking center card", async () => {
    const { ExpiresSoonScholarships } = await import("../expires-soon-scholarships");
    render(<ExpiresSoonScholarships />);

    // First active scholarship in the carousel slice is the center card by default.
    const names = await getActiveCarouselNames();
    const centerName = names[0];
    // Escape any regex specials in the name for the accessible-name matcher.
    const namePattern = new RegExp(centerName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    const buttons = screen.getAllByRole("button", { name: namePattern });
    const centerButton = buttons.find(
      (btn) => btn.getAttribute("data-cursor-text") === "View",
    );
    expect(centerButton).toBeDefined();
    fireEvent.click(centerButton!);

    expect(mockPush).toHaveBeenCalledWith(
      `/scholarships?q=${encodeURIComponent(centerName)}`,
    );
  });

  it("rotates side card to center on click instead of navigating", async () => {
    const { ExpiresSoonScholarships } = await import("../expires-soon-scholarships");
    const { container } = render(<ExpiresSoonScholarships />);

    // Find a side card (data-cursor-text="Focus")
    const sideButtons = container.querySelectorAll<HTMLButtonElement>(
      '[data-cursor-text="Focus"]',
    );
    expect(sideButtons.length).toBeGreaterThan(0);
    fireEvent.click(sideButtons[0]);

    // Should NOT navigate
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("renders arrow buttons with correct aria-labels", async () => {
    const { ExpiresSoonScholarships } = await import("../expires-soon-scholarships");
    render(<ExpiresSoonScholarships />);

    expect(screen.getByLabelText("Previous scholarship")).toBeDefined();
    expect(screen.getByLabelText("Next scholarship")).toBeDefined();
  });

  it("advances on next arrow click", async () => {
    const { ExpiresSoonScholarships } = await import("../expires-soon-scholarships");
    const { container } = render(<ExpiresSoonScholarships />);

    const nextBtn = screen.getByLabelText("Next scholarship");
    fireEvent.click(nextBtn);

    const liveRegion = container.querySelector('[aria-live="polite"]');
    const names = await getActiveCarouselNames();
    expect(liveRegion!.textContent).toContain(names[1]);
  });

  it("renders reduced motion fallback as scrollable list without 3D", async () => {
    mockReducedMotion = true;
    const { ExpiresSoonScholarships } = await import("../expires-soon-scholarships");
    const { container } = render(<ExpiresSoonScholarships />);

    const carousel = getCarousel(container);
    expect(carousel).not.toBeNull();
    expect(carousel.getAttribute("aria-roledescription")).toBe("carousel");
    // Should have snap-x class for scroll snapping
    expect(carousel.className).toContain("snap-x");
    // Should NOT have arrow buttons
    expect(screen.queryByLabelText("Previous scholarship")).toBeNull();
    expect(screen.queryByLabelText("Next scholarship")).toBeNull();
  });

  it("renders heading with current month name", async () => {
    const { ExpiresSoonScholarships } = await import("../expires-soon-scholarships");
    const { container } = render(<ExpiresSoonScholarships />);

    const heading = container.querySelector("#expires-soon-heading");
    expect(heading).not.toBeNull();
    expect(heading!.textContent).toBe("Expires in May");
  });
});

// Rollover path: when the current calendar month has zero remaining deadlines,
// the section advances to the next calendar month.
const FROZEN_NOW_ROLLOVER = new Date("2026-11-30T12:00:00Z");

describe("ExpiresSoonScholarships rollover to next month", () => {
  beforeEach(() => {
    mockReducedMotion = false;
    mockPush.mockClear();
    vi.useFakeTimers();
    vi.setSystemTime(FROZEN_NOW_ROLLOVER);
    vi.resetModules();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders heading with next month name when current month has no remaining deadlines", async () => {
    const { ExpiresSoonScholarships } = await import("../expires-soon-scholarships");
    const { container } = render(<ExpiresSoonScholarships />);

    const heading = container.querySelector("#expires-soon-heading");
    expect(heading).not.toBeNull();
    expect(heading!.textContent).toBe("Expires in December");
  });

  it("renders carousel with next-month items", async () => {
    const { ExpiresSoonScholarships } = await import("../expires-soon-scholarships");
    const { container } = render(<ExpiresSoonScholarships />);

    const slides = container.querySelectorAll('[aria-roledescription="slide"]');
    expect(slides.length).toBeGreaterThan(0);

    // Expected first slide name: earliest December 2026 deadline.
    const { scholarships } = await import("@/data/scholarships");
    const decItems = scholarships
      .map((s) => ({
        s,
        ms: new Date(`${s.deadline}, ${s.deadlineYear}`).getTime(),
      }))
      .filter(({ ms }) => {
        if (!Number.isFinite(ms) || ms === 0) return false;
        const d = new Date(ms);
        return d.getFullYear() === 2026 && d.getMonth() === 11;
      })
      .sort((a, b) => a.ms - b.ms);

    expect(decItems.length).toBeGreaterThan(0);

    const liveRegion = container.querySelector('[aria-live="polite"]');
    expect(liveRegion!.textContent).toContain(decItems[0].s.name);
  });
});
