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

// Mock motion to render static elements
vi.mock("motion/react", () => ({
  motion: {
    article: ({ children, className, onClick, ...rest }: React.ComponentProps<"article"> & Record<string, unknown>) => (
      <article className={className as string} onClick={onClick} data-testid="card-root" {...rest}>
        {children}
      </article>
    ),
    span: ({ children, className, style, ...rest }: React.ComponentProps<"span"> & Record<string, unknown>) => (
      <span className={className as string} style={style} {...rest}>{children}</span>
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
}

describe("ScholarshipCard", () => {
  it("renders title, provider, amount, deadline, and description", () => {
    render(<ScholarshipCard scholarship={baseScholarship} onExpand={() => {}} />)

    expect(screen.getByText("Test Scholarship")).toBeInTheDocument()
    expect(screen.getByText("Test Foundation")).toBeInTheDocument()
    expect(screen.getByText("$10,000")).toBeInTheDocument()
    expect(screen.getByText("Deadline March 1")).toBeInTheDocument()
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

  it("applies neutral background with classification accent stripe", () => {
    const { container } = render(
      <ScholarshipCard scholarship={baseScholarship} onExpand={() => {}} />,
    )
    const card = container.querySelector("[data-testid='card-root']")
    // All cards use neutral surface background
    expect(card?.className).toContain("bg-surface-container-low")
    // Undergraduate uses secondary-600 border stripe
    expect(card?.className).toContain("border-secondary-600")
  })

  it("applies primary border stripe for High School", () => {
    const hs = { ...baseScholarship, classification: ["High School"] as Scholarship["classification"] }
    const { container } = render(
      <ScholarshipCard scholarship={hs} onExpand={() => {}} />,
    )
    const card = container.querySelector("[data-testid='card-root']")
    expect(card?.className).toContain("border-primary-400")
  })

  it("applies tertiary border stripe for Graduate", () => {
    const grad = { ...baseScholarship, classification: ["Graduate"] as Scholarship["classification"] }
    const { container } = render(
      <ScholarshipCard scholarship={grad} onExpand={() => {}} />,
    )
    const card = container.querySelector("[data-testid='card-root']")
    expect(card?.className).toContain("border-tertiary-600")
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

  it("adds invisible class when isExpanded", () => {
    const { container } = render(
      <ScholarshipCard scholarship={baseScholarship} isExpanded onExpand={() => {}} />,
    )
    const card = container.querySelector("[data-testid='card-root']")
    expect(card?.className).toContain("invisible")
  })
})
