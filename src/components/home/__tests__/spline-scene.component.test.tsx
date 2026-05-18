import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"

vi.mock("@splinetool/react-spline", () => ({
  __esModule: true,
  default: () => <div data-testid="spline-canvas" />,
}))

vi.mock("lenis/react", () => ({
  useLenis: () => null,
}))

describe("SplineScene", () => {
  it("sets touch-action: pan-y on the wrapper div so vertical pans bypass Spline's preventDefault", async () => {
    const { SplineScene } = await import("../spline-scene")

    render(<SplineScene scene="any" className="test-class" />)

    const canvas = screen.getByTestId("spline-canvas")
    const wrapper = canvas.parentElement as HTMLElement

    expect(wrapper).not.toBeNull()
    expect(wrapper.style.touchAction).toBe("pan-y")
  })
})
