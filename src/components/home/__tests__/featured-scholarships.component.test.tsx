import { describe, it, expect, vi, beforeEach } from "vitest";
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

describe("FeaturedScholarships with CoverflowCarousel", () => {
  beforeEach(() => {
    mockReducedMotion = false;
    mockPush.mockClear();
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

  it("has a live region announcing the active scholarship", async () => {
    const { FeaturedScholarships } = await import("../featured-scholarships");
    const { container } = render(<FeaturedScholarships />);

    const liveRegion = container.querySelector('[aria-live="polite"]');
    expect(liveRegion).not.toBeNull();
    expect(liveRegion!.textContent).toContain("Engebretson Foundation Scholarship");
  });

  it("advances to next card on ArrowRight key", async () => {
    const { FeaturedScholarships } = await import("../featured-scholarships");
    const { container } = render(<FeaturedScholarships />);

    const carousel = getCarousel(container);
    carousel.focus();
    fireEvent.keyDown(carousel, { key: "ArrowRight" });

    const liveRegion = container.querySelector('[aria-live="polite"]');
    expect(liveRegion!.textContent).toContain("Horatio Alger: National Scholarship");
  });

  it("goes to previous card on ArrowLeft key", async () => {
    const { FeaturedScholarships } = await import("../featured-scholarships");
    const { container } = render(<FeaturedScholarships />);

    const carousel = getCarousel(container);
    carousel.focus();
    // ArrowLeft from index 0 wraps to last (index 9)
    fireEvent.keyDown(carousel, { key: "ArrowLeft" });

    const liveRegion = container.querySelector('[aria-live="polite"]');
    // 10th scholarship in enriched data
    const allScholarships = (await import("@/data/scholarships")).scholarships;
    const tenthName = allScholarships[9]?.name;
    expect(liveRegion!.textContent).toContain(tenthName);
  });

  it("navigates to /scholarships?q={id} when clicking center card", async () => {
    const { FeaturedScholarships } = await import("../featured-scholarships");
    render(<FeaturedScholarships />);

    // The first card (index 0) is the center card by default
    const buttons = screen.getAllByRole("button", { name: /Engebretson Foundation/i });
    // Find the one that is the center card (data-cursor-text="View")
    const centerButton = buttons.find(
      (btn) => btn.getAttribute("data-cursor-text") === "View",
    );
    expect(centerButton).toBeDefined();
    fireEvent.click(centerButton!);

    expect(mockPush).toHaveBeenCalledWith("/scholarships?q=engebretson-foundation-scholarship-march-1");
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
    expect(liveRegion!.textContent).toContain("Horatio Alger: National Scholarship");
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
