import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"

vi.mock("@/components/ui/page-transition", () => ({
  PageTransition: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}))

vi.mock("@iconify/react", () => ({
  Icon: () => null,
}))

function getHeadingLevel(el: HTMLElement): number {
  const aria = el.getAttribute("aria-level")
  if (aria) return Number(aria)
  const match = el.tagName.match(/^H([1-6])$/)
  return match ? Number(match[1]) : 0
}

describe("Terms page", () => {
  it("renders a single H1 with the policy title", async () => {
    const { default: TermsPage } = await import("../page")
    render(<TermsPage />)

    const h1s = screen.getAllByRole("heading", { level: 1 })
    expect(h1s).toHaveLength(1)
    expect(h1s[0]).toHaveTextContent("Terms of Service")
  })

  it("renders the contact email", async () => {
    const { default: TermsPage } = await import("../page")
    render(<TermsPage />)

    const emailLinks = screen.getAllByRole("link", {
      name: /dearmodernscholar@gmail\.com/i,
    })
    expect(emailLinks.length).toBeGreaterThan(0)
    expect(emailLinks[0]).toHaveAttribute(
      "href",
      "mailto:dearmodernscholar@gmail.com",
    )
  })

  it("renders the 'Last updated' label", async () => {
    const { default: TermsPage } = await import("../page")
    render(<TermsPage />)

    expect(screen.getAllByText(/Last updated/i).length).toBeGreaterThan(0)
  })

  it("uses a valid heading hierarchy with no skipped levels", async () => {
    const { default: TermsPage } = await import("../page")
    render(<TermsPage />)

    const headings = screen.getAllByRole("heading")
    const levels = headings.map((h) => getHeadingLevel(h as HTMLElement))

    expect(levels[0]).toBe(1)
    for (let i = 1; i < levels.length; i++) {
      expect(levels[i]).toBeLessThanOrEqual(levels[i - 1] + 1)
    }
  })
})
