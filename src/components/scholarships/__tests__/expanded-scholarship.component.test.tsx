import { describe, it, expect, vi } from "vitest"
import { useState } from "react"
import { render, screen, fireEvent, act } from "@testing-library/react"
import { ExpandedScholarship } from "../expanded-scholarship"
import type { Scholarship } from "@/data/scholarships"

let lastOnExitComplete: (() => void) | undefined

vi.mock("motion/react", () => ({
  motion: {
    div: ({ children, ...props }: React.ComponentProps<"div"> & Record<string, unknown>) => (
      <div {...props}>{children}</div>
    ),
    span: ({ children, ...props }: React.ComponentProps<"span"> & Record<string, unknown>) => (
      <span {...props}>{children}</span>
    ),
  },
  AnimatePresence: ({
    children,
    onExitComplete,
  }: {
    children: React.ReactNode
    onExitComplete?: () => void
  }) => {
    lastOnExitComplete = onExitComplete
    return <>{children}</>
  },
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

describe("ExpandedScholarship", () => {
  it("renders nothing when scholarship is null", () => {
    render(<ExpandedScholarship scholarship={null} onClose={() => {}} />)
    expect(screen.queryByRole("dialog")).toBeNull()
  })

  it("renders dialog with correct ARIA when scholarship is provided", () => {
    render(<ExpandedScholarship scholarship={baseScholarship} onClose={() => {}} />)
    const dialog = screen.getByRole("dialog")
    expect(dialog).toHaveAttribute("aria-modal", "true")
    expect(dialog).toHaveAttribute("aria-labelledby", "expanded-dialog-title")
    expect(document.getElementById("expanded-dialog-title")).not.toBeNull()
  })

  it("calls onClose on Escape key", () => {
    const onClose = vi.fn()
    render(<ExpandedScholarship scholarship={baseScholarship} onClose={onClose} />)
    fireEvent.keyDown(window, { key: "Escape" })
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it("calls onClose when backdrop is clicked", () => {
    const onClose = vi.fn()
    const { container } = render(
      <ExpandedScholarship scholarship={baseScholarship} onClose={onClose} />,
    )
    const backdrop = container.querySelector('[aria-hidden="true"].fixed.inset-0') as HTMLElement
    expect(backdrop).not.toBeNull()
    fireEvent.click(backdrop)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it("does not call onClose when dialog body is clicked", () => {
    const onClose = vi.fn()
    render(<ExpandedScholarship scholarship={baseScholarship} onClose={onClose} />)
    fireEvent.click(screen.getByRole("dialog"))
    expect(onClose).not.toHaveBeenCalled()
  })

  it("focus trap: Tab from last focusable cycles to first", () => {
    render(<ExpandedScholarship scholarship={baseScholarship} onClose={() => {}} />)
    const dialog = screen.getByRole("dialog")
    const focusables = dialog.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled])',
    )
    const first = focusables[0]
    const last = focusables[focusables.length - 1]
    last.focus()
    expect(document.activeElement).toBe(last)
    fireEvent.keyDown(document, { key: "Tab" })
    expect(document.activeElement).toBe(first)
  })

  it("focus trap: Shift+Tab from first focusable cycles to last", () => {
    render(<ExpandedScholarship scholarship={baseScholarship} onClose={() => {}} />)
    const dialog = screen.getByRole("dialog")
    const focusables = dialog.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled])',
    )
    const first = focusables[0]
    const last = focusables[focusables.length - 1]
    first.focus()
    expect(document.activeElement).toBe(first)
    fireEvent.keyDown(document, { key: "Tab", shiftKey: true })
    expect(document.activeElement).toBe(last)
  })

  it("focuses close button when dialog opens", () => {
    render(<ExpandedScholarship scholarship={baseScholarship} onClose={() => {}} />)
    expect(document.activeElement).toBe(
      screen.getByRole("button", { name: /close/i }),
    )
  })

  it("restores focus to the previously focused element when dialog closes", () => {
    function Wrapper() {
      const [s, setS] = useState<Scholarship | null>(null)
      return (
        <>
          <button id="trigger" type="button" onClick={() => setS(baseScholarship)}>
            Open
          </button>
          <ExpandedScholarship scholarship={s} onClose={() => setS(null)} />
        </>
      )
    }

    render(<Wrapper />)
    const trigger = document.getElementById("trigger") as HTMLButtonElement
    trigger.focus()
    expect(document.activeElement).toBe(trigger)

    act(() => {
      trigger.click()
    })

    expect(screen.getByRole("dialog")).toBeInTheDocument()

    act(() => {
      fireEvent.keyDown(window, { key: "Escape" })
    })

    expect(screen.queryByRole("dialog")).toBeNull()

    act(() => {
      lastOnExitComplete?.()
    })

    expect(document.activeElement).toBe(trigger)
  })
})
