import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { userEvent } from "@testing-library/user-event"

vi.mock("next/image", () => ({
  __esModule: true,
  default: ({ alt }: { alt: string }) => <span data-alt={alt} />,
}))

vi.mock("next/link", () => ({
  __esModule: true,
  default: ({
    children,
    href,
    ...rest
  }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}))

vi.mock("@iconify/react", () => ({
  Icon: () => <span data-testid="icon" />,
}))

vi.mock("motion/react", () => ({
  useReducedMotion: () => false,
  motion: {
    div: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
  },
}))

vi.mock("@/components/ui/animatedSection/animated-section", () => ({
  AnimatedSection: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}))

vi.mock("@/components/ui/parallax-layer", () => ({
  ParallaxLayer: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}))

vi.mock("@/components/ui/button/button-link", () => ({
  ButtonLink: ({
    children,
    href,
  }: {
    children?: React.ReactNode
    href: string
  }) => <a href={href}>{children}</a>,
}))

vi.mock("@/lib/pretext/use-text-layout", () => ({
  useTextLayout: () => ({ lineCount: 1 }),
}))

vi.mock("@/lib/pretext/fonts", () => ({
  PRETEXT_FONTS: {
    cardTitle: {},
    bodySmall: {},
  },
}))

describe("FeaturedScholarships marquee keyboard accessibility", () => {
  it("renders each row as a list with listitem children", async () => {
    const { FeaturedScholarships } = await import("../featured-scholarships")
    render(<FeaturedScholarships />)

    const lists = screen.getAllByRole("list")
    expect(lists.length).toBeGreaterThan(0)

    const items = screen.getAllByRole("listitem")
    expect(items.length).toBeGreaterThan(0)
  })

  it("wraps real cards in an anchor pointing to /scholarships", async () => {
    const { FeaturedScholarships } = await import("../featured-scholarships")
    const { container } = render(<FeaturedScholarships />)

    const cardLinks = container.querySelectorAll<HTMLAnchorElement>(
      'a[href="/scholarships"]',
    )
    // First row = 5 items * 2 duplicates = 10; row 2 another 10; also the "View All" header link = at least 21
    expect(cardLinks.length).toBeGreaterThanOrEqual(21)
  })

  it("marks duplicated (clone) cards with aria-hidden and tabIndex=-1", async () => {
    const { FeaturedScholarships } = await import("../featured-scholarships")
    const { container } = render(<FeaturedScholarships />)

    const hiddenItems = container.querySelectorAll<HTMLElement>(
      'li[aria-hidden="true"]',
    )
    expect(hiddenItems.length).toBeGreaterThan(0)

    hiddenItems.forEach((li) => {
      const anchor = li.querySelector<HTMLAnchorElement>("a")
      expect(anchor).not.toBeNull()
      expect(anchor?.tabIndex).toBe(-1)
    })
  })

  it("non-clone card anchors are keyboard-focusable (Tab reaches them)", async () => {
    const { FeaturedScholarships } = await import("../featured-scholarships")
    const { container } = render(<FeaturedScholarships />)

    const focusableItems = container.querySelectorAll<HTMLElement>(
      'li:not([aria-hidden="true"])',
    )
    expect(focusableItems.length).toBeGreaterThan(0)
    const firstCardLink = focusableItems[0].querySelector<HTMLAnchorElement>(
      'a[href="/scholarships"]',
    )
    expect(firstCardLink).not.toBeNull()
    firstCardLink!.focus()
    expect(document.activeElement).toBe(firstCardLink)

    await userEvent.tab()
    // Focus should move to something focusable (not stuck). Just assert it moved.
    expect(document.activeElement).not.toBe(firstCardLink)
  })
})
