import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { userEvent } from "@testing-library/user-event"

vi.mock("motion/react", () => ({
  motion: {
    span: ({ children }: { children?: React.ReactNode }) => (
      <span>{children}</span>
    ),
  },
}))

vi.mock("@iconify/react", () => ({
  Icon: () => <span data-testid="icon" />,
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

describe("FAQSection ARIA attributes", () => {
  it("accordion buttons have id and aria-controls", async () => {
    const { FAQSection } = await import("../faq-section")
    render(<FAQSection />)

    const buttons = screen.getAllByRole("button")

    buttons.forEach((button, i) => {
      expect(button).toHaveAttribute("id", `faq-btn-${i}`)
      expect(button).toHaveAttribute("aria-controls", `faq-panel-${i}`)
      expect(button).toHaveAttribute("aria-expanded", "false")
    })
  })

  it("panels have role=region with correct id and aria-labelledby", async () => {
    const { FAQSection } = await import("../faq-section")
    const { container } = render(<FAQSection />)

    const buttons = Array.from(container.querySelectorAll("button[aria-controls]"))
    expect(buttons.length).toBeGreaterThan(0)
    buttons.forEach((button) => {
      const index = button.id.replace("faq-btn-", "")
      const panel = button.nextElementSibling
      expect(panel).not.toBeNull()
      expect(panel).toHaveAttribute("id", `faq-panel-${index}`)
      expect(panel).toHaveAttribute("role", "region")
      expect(panel).toHaveAttribute("aria-labelledby", `faq-btn-${index}`)
    })
  })

  it("clicking a button sets aria-expanded to true", async () => {
    const { FAQSection } = await import("../faq-section")
    render(<FAQSection />)

    const buttons = screen.getAllByRole("button")
    expect(buttons[0]).toHaveAttribute("aria-expanded", "false")

    await userEvent.click(buttons[0])
    expect(buttons[0]).toHaveAttribute("aria-expanded", "true")
  })
})
