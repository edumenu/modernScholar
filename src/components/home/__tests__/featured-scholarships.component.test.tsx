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

// Freeze "now" so the active-scholarship slice stays stable as the corpus
// ages. Both the carousel (calls `new Date()` at render) and the test helper
// below see the same instant.
const FROZEN_NOW = new Date("2026-05-07T12:00:00Z");

describe("FeaturedScholarships with CoverflowCarousel", () => {
  beforeEach(() => {
    mockReducedMotion = false;
    mockPush.mockClear();
    vi.useFakeTimers();
    vi.setSystemTime(FROZEN_NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  function getCarousel(container: HTMLElement) {
    return container.querySelector('[aria-roledescription="carousel"]') as HTMLElement;
  }

  it("renders carousel with aria-roledescription", async () => {
    const { FeaturedScholarships } = await import("../featured-scholarships");
    const { container } = render(<FeaturedScholarships />);

    const carousel = getCarousel(container);
    expect(carousel).not.toBeNull();
    expect(carousel.getAttribute("aria-roledescription")).toBe("carousel");
  });

  it("renders 10 slides with aria-roledescription='slide'", async () => {
    const { FeaturedScholarships } = await import("../featured-scholarships");
    const { container } = render(<FeaturedScholarships />);

    const slides = container.querySelectorAll('[aria-roledescription="slide"]');
    expect(slides.length).toBe(10);
  });

  // The carousel filters its source feed to active-only at runtime, then takes
  // the first 10. We compute the same slice in the tests so the assertions
  // don't break when the underlying data changes.
  async function getActiveCarouselNames(): Promise<string[]> {
    const { scholarships } = await import("@/data/scholarships");
    const { isScholarshipActive } = await import("@/data/scholarships");
    return scholarships
      .slice(0, 10)
      .filter((s) => isScholarshipActive(s, FROZEN_NOW))
      .map((s) => s.name);
  }

  it("has a live region announcing the active scholarship", async () => {
    const { FeaturedScholarships } = await import("../featured-scholarships");
    const { container } = render(<FeaturedScholarships />);

    const liveRegion = container.querySelector('[aria-live="polite"]');
    expect(liveRegion).not.toBeNull();
    const names = await getActiveCarouselNames();
    expect(liveRegion!.textContent).toContain(names[0]);
  });

  it("advances to next card on ArrowRight key", async () => {
    const { FeaturedScholarships } = await import("../featured-scholarships");
    const { container } = render(<FeaturedScholarships />);

    const carousel = getCarousel(container);
    carousel.focus();
    fireEvent.keyDown(carousel, { key: "ArrowRight" });

    const liveRegion = container.querySelector('[aria-live="polite"]');
    const names = await getActiveCarouselNames();
    expect(liveRegion!.textContent).toContain(names[1]);
  });

  it("goes to previous card on ArrowLeft key", async () => {
    const { FeaturedScholarships } = await import("../featured-scholarships");
    const { container } = render(<FeaturedScholarships />);

    const carousel = getCarousel(container);
    carousel.focus();
    // ArrowLeft from index 0 wraps to the last active slot
    fireEvent.keyDown(carousel, { key: "ArrowLeft" });

    const liveRegion = container.querySelector('[aria-live="polite"]');
    const names = await getActiveCarouselNames();
    expect(liveRegion!.textContent).toContain(names[names.length - 1]);
  });

  it("navigates to /scholarships?q={id} when clicking center card", async () => {
    const { FeaturedScholarships } = await import("../featured-scholarships");
    render(<FeaturedScholarships />);

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
    const { FeaturedScholarships } = await import("../featured-scholarships");
    const { container } = render(<FeaturedScholarships />);

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
    const { FeaturedScholarships } = await import("../featured-scholarships");
    render(<FeaturedScholarships />);

    expect(screen.getByLabelText("Previous scholarship")).toBeDefined();
    expect(screen.getByLabelText("Next scholarship")).toBeDefined();
  });

  it("advances on next arrow click", async () => {
    const { FeaturedScholarships } = await import("../featured-scholarships");
    const { container } = render(<FeaturedScholarships />);

    const nextBtn = screen.getByLabelText("Next scholarship");
    fireEvent.click(nextBtn);

    const liveRegion = container.querySelector('[aria-live="polite"]');
    const names = await getActiveCarouselNames();
    expect(liveRegion!.textContent).toContain(names[1]);
  });

  it("renders reduced motion fallback as scrollable list without 3D", async () => {
    mockReducedMotion = true;
    const { FeaturedScholarships } = await import("../featured-scholarships");
    const { container } = render(<FeaturedScholarships />);

    const carousel = getCarousel(container);
    expect(carousel).not.toBeNull();
    expect(carousel.getAttribute("aria-roledescription")).toBe("carousel");
    // Should have snap-x class for scroll snapping
    expect(carousel.className).toContain("snap-x");
    // Should NOT have arrow buttons
    expect(screen.queryByLabelText("Previous scholarship")).toBeNull();
    expect(screen.queryByLabelText("Next scholarship")).toBeNull();
  });
});
