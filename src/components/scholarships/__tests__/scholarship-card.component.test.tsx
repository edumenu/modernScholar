import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { ScholarshipCard } from "../scholarship-card"
import type { Scholarship } from "@/data/scholarships"

// Mock zustand store
vi.mock("@/stores/comparison", () => ({
  useComparisonStore: () => ({
    toggle: vi.fn(),
    isSelected: () => false,
  }),
}))

// Mock motion to render static elements. Forward `animate` as a serialized
// data attribute so tests can introspect target opacity/transforms without
// running the actual animation runtime.
vi.mock("motion/react", () => ({
  motion: {
    article: ({
      children,
      className,
      onClick,
      animate,
      whileHover: _whileHover,
      transition: _transition,
      layoutId: _layoutId,
      ...rest
    }: React.ComponentProps<"article"> & Record<string, unknown>) => (
      <article
        className={className as string}
        onClick={onClick}
        data-testid="card-root"
        data-animate={animate ? JSON.stringify(animate) : undefined}
        {...(rest as React.HTMLAttributes<HTMLElement>)}
      >
        {children}
      </article>
    ),
    span: ({ children, className, style, ...rest }: React.ComponentProps<"span"> & Record<string, unknown>) => (
      <span className={className as string} style={style} {...(rest as React.HTMLAttributes<HTMLElement>)}>{children}</span>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

const baseScholarship: Scholarship = {
  id: "test-1",
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

describe("ScholarshipCard", () => {
  it("renders title, provider, amount, deadline, and description", () => {
    render(<ScholarshipCard scholarship={baseScholarship} onExpand={() => {}} />)

    expect(screen.getByText("Test Scholarship")).toBeInTheDocument()
    expect(screen.getByText("Test Foundation")).toBeInTheDocument()
    expect(screen.getByText("$10,000")).toBeInTheDocument()
    // Deadline renders inside a <span> with interpolated children — narrow the
    // matcher to the SPAN tag to avoid double-matching the wrapping <div>.
    expect(
      screen.getByText((_, node) => {
        if (node?.tagName !== "SPAN") return false
        return (
          node.textContent?.replace(/\s+/g, " ").trim() ===
          "Deadline March 1, 2027"
        )
      }),
    ).toBeInTheDocument()
    expect(screen.getByText("A test scholarship for students.")).toBeInTheDocument()
  })

  it("renders classification pills", () => {
    render(<ScholarshipCard scholarship={baseScholarship} onExpand={() => {}} />)
    expect(screen.getByText("Undergraduate")).toBeInTheDocument()
  })

  it("renders multiple classification pills", () => {
    const multi = {
      ...baseScholarship,
      classification: ["High School", "Undergraduate", "Graduate"] as Scholarship["classification"],
    }
    render(<ScholarshipCard scholarship={multi} onExpand={() => {}} />)
    expect(screen.getByText("High School")).toBeInTheDocument()
    expect(screen.getByText("Undergraduate")).toBeInTheDocument()
    expect(screen.getByText("Graduate")).toBeInTheDocument()
  })

  it("renders CTA elements", () => {
    render(<ScholarshipCard scholarship={baseScholarship} onExpand={() => {}} />)
    expect(screen.getByText("View Details")).toBeInTheDocument()
    expect(screen.getByLabelText("View details for Test Scholarship")).toBeInTheDocument()
  })

  it("applies neutral surface tint regardless of classification", () => {
    const { container } = render(
      <ScholarshipCard scholarship={baseScholarship} onExpand={() => {}} />,
    )
    const card = container.querySelector("[data-testid='card-root']")
    expect(card?.className).toContain("bg-white")
    expect(card?.className).toContain("dark:bg-surface-container-low")
  })

  it("uses the same surface tint for High School cards", () => {
    const hs = { ...baseScholarship, classification: ["High School"] as Scholarship["classification"] }
    const { container } = render(
      <ScholarshipCard scholarship={hs} onExpand={() => {}} />,
    )
    const card = container.querySelector("[data-testid='card-root']")
    expect(card?.className).toContain("bg-white")
  })

  it("uses the same surface tint for Graduate cards", () => {
    const grad = { ...baseScholarship, classification: ["Graduate"] as Scholarship["classification"] }
    const { container } = render(
      <ScholarshipCard scholarship={grad} onExpand={() => {}} />,
    )
    const card = container.querySelector("[data-testid='card-root']")
    expect(card?.className).toContain("bg-white")
  })

  it("calls onExpand with scholarship id on click", async () => {
    const handleExpand = vi.fn()
    render(<ScholarshipCard scholarship={baseScholarship} onExpand={handleExpand} />)
    const card = screen.getByTestId("card-root")
    await userEvent.click(card)
    expect(handleExpand).toHaveBeenCalledWith("test-1")
  })

  it("does not call onExpand when dimmed", async () => {
    const handleExpand = vi.fn()
    render(<ScholarshipCard scholarship={baseScholarship} dimmed onExpand={handleExpand} />)
    const card = screen.getByTestId("card-root")
    await userEvent.click(card)
    expect(handleExpand).not.toHaveBeenCalled()
  })

  it("applies dimmed styles when dimmed", () => {
    const { container } = render(
      <ScholarshipCard scholarship={baseScholarship} dimmed onExpand={() => {}} />,
    )
    const card = container.querySelector("[data-testid='card-root']")
    expect(card?.className).toContain("pointer-events-none")
    expect(card?.className).toContain("saturate-50")
  })

  it("renders gradient-fade underline with initial width", () => {
    const { container } = render(
      <ScholarshipCard scholarship={baseScholarship} onExpand={() => {}} />,
    )
    const underline = container.querySelector("[aria-hidden='true']")
    expect(underline?.className).toContain("w-2/3")
    expect(underline?.className).toContain("group-hover:w-full")
  })

  it("does not render description when empty", () => {
    const noDesc = { ...baseScholarship, description: "" }
    render(<ScholarshipCard scholarship={noDesc} onExpand={() => {}} />)
    expect(screen.queryByText("A test scholarship for students.")).not.toBeInTheDocument()
  })

  it("clamps long titles to 2 lines", () => {
    const longTitle = {
      ...baseScholarship,
      name: "The Extraordinary Educational Achievement Award for Underrepresented Students in STEM and the Humanities",
    }
    render(<ScholarshipCard scholarship={longTitle} onExpand={() => {}} />)
    const title = screen.getByText(longTitle.name)
    expect(title.className).toContain("line-clamp-2")
  })

  it("animates to opacity 0 when isExpanded", () => {
    const { container } = render(
      <ScholarshipCard scholarship={baseScholarship} isExpanded onExpand={() => {}} />,
    )
    const card = container.querySelector("[data-testid='card-root']")
    const animate = card?.getAttribute("data-animate")
    expect(animate).toBeTruthy()
    expect(JSON.parse(animate!)).toMatchObject({ opacity: 0 })
  })
})
