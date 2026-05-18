import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { ScholarshipListCardSpread } from "../scholarship-list-card"
import type { Scholarship } from "@/data/scholarships"

vi.mock("@/stores/comparison", () => ({
  useComparisonStore: (selector?: (state: unknown) => unknown) => {
    const state = {
      toggle: vi.fn(),
      selectedIds: [] as string[],
    }
    return selector ? selector(state) : state
  },
}))

vi.mock("motion/react", () => ({
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  motion: {
    article: ({
      children,
      className,
      onClick,
      animate,
      layoutId,
      whileHover: _whileHover,
      transition: _transition,
      ...rest
    }: React.ComponentProps<"article"> & Record<string, unknown>) => (
      <article
        className={className as string}
        onClick={onClick}
        data-testid="list-card-root"
        data-animate={animate ? JSON.stringify(animate) : undefined}
        data-layout-id={layoutId as string | undefined}
        {...(rest as React.HTMLAttributes<HTMLElement>)}
      >
        {children}
      </article>
    ),
    div: ({
      children,
      className,
      whileHover: _whileHover,
      transition: _transition,
      ...rest
    }: React.ComponentProps<"div"> & Record<string, unknown>) => (
      <div className={className as string} {...(rest as React.HTMLAttributes<HTMLElement>)}>
        {children}
      </div>
    ),
    span: ({
      children,
      className,
      whileHover: _whileHover,
      transition: _transition,
      ...rest
    }: React.ComponentProps<"span"> & Record<string, unknown>) => (
      <span className={className as string} {...(rest as React.HTMLAttributes<HTMLElement>)}>
        {children}
      </span>
    ),
  },
}))

const baseScholarship: Scholarship = {
  id: "test-42",
  name: "Test Scholarship",
  provider: "Test Foundation",
  awardAmount: "$10,000",
  deadline: "March 1",
  deadlineYear: 2027,
  classification: ["Undergraduate"],
  link: "https://example.com",
  openDate: null,
  eligibility: "Must be enrolled",
  season: "spring",
  description: "A test scholarship for students.",
  eligibilityTags: [],
}

describe("ScholarshipListCardSpread", () => {
  it("renders a layoutId derived from the scholarship id", () => {
    render(
      <ScholarshipListCardSpread
        scholarship={baseScholarship}
        onExpand={() => {}}
      />,
    )

    const article = screen.getByTestId("list-card-root")
    expect(article.getAttribute("data-layout-id")).toBe("card-test-42")
  })

  it("animates to opacity 0 when isExpanded", () => {
    render(
      <ScholarshipListCardSpread
        scholarship={baseScholarship}
        isExpanded
        onExpand={() => {}}
      />,
    )

    const article = screen.getByTestId("list-card-root")
    const animate = article.getAttribute("data-animate")
    expect(animate).toBeTruthy()
    expect(JSON.parse(animate!)).toMatchObject({ opacity: 0 })
  })

  it("animates to idle opacity 1 when neither dimmed nor expanded", () => {
    render(
      <ScholarshipListCardSpread
        scholarship={baseScholarship}
        onExpand={() => {}}
      />,
    )

    const article = screen.getByTestId("list-card-root")
    expect(JSON.parse(article.getAttribute("data-animate")!)).toMatchObject({
      opacity: 1,
    })
  })

  it("animates to opacity 0.4 when dimmed and not expanded", () => {
    render(
      <ScholarshipListCardSpread
        scholarship={baseScholarship}
        dimmed
        onExpand={() => {}}
      />,
    )

    const article = screen.getByTestId("list-card-root")
    expect(JSON.parse(article.getAttribute("data-animate")!)).toMatchObject({
      opacity: 0.4,
    })
  })
})
