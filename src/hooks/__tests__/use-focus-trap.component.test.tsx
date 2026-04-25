import { describe, it, expect } from "vitest"
import { useRef } from "react"
import { render, screen } from "@testing-library/react"
import { userEvent } from "@testing-library/user-event"
import { useFocusTrap } from "../use-focus-trap"

function TrapHarness({ active }: { active: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  useFocusTrap(ref, active)
  return (
    <div>
      <button type="button">outside before</button>
      <div ref={ref} data-testid="trap">
        <button type="button">first</button>
        <button type="button">middle</button>
        <button type="button">last</button>
      </div>
      <button type="button">outside after</button>
    </div>
  )
}

describe("useFocusTrap", () => {
  it("focuses the first focusable element on activation", async () => {
    render(<TrapHarness active={true} />)
    const first = screen.getByText("first")
    expect(document.activeElement).toBe(first)
  })

  it("wraps from last to first on Tab", async () => {
    render(<TrapHarness active={true} />)
    const first = screen.getByText("first")
    const last = screen.getByText("last")

    last.focus()
    expect(document.activeElement).toBe(last)

    await userEvent.tab()
    expect(document.activeElement).toBe(first)
  })

  it("wraps from first to last on Shift+Tab", async () => {
    render(<TrapHarness active={true} />)
    const first = screen.getByText("first")
    const last = screen.getByText("last")

    first.focus()
    expect(document.activeElement).toBe(first)

    await userEvent.tab({ shift: true })
    expect(document.activeElement).toBe(last)
  })

  it("does nothing when inactive", () => {
    render(<TrapHarness active={false} />)
    // No auto-focus when inactive
    expect(document.activeElement).not.toBe(screen.getByText("first"))
  })
})
