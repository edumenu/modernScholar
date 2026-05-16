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

describe("LegalLayout", () => {
  it("renders the title as the H1", async () => {
    const { LegalLayout } = await import("../legal-layout")
    const { LegalSection } = await import("../legal-section")

    render(
      <LegalLayout
        title="Privacy Policy"
        lastUpdated="2026-05-14"
        tldr={<p>TL;DR summary text content.</p>}
      >
        <LegalSection id="x" title="X-Section">
          body
        </LegalSection>
      </LegalLayout>,
    )

    const h1 = screen.getByRole("heading", { level: 1 })
    expect(h1).toHaveTextContent("Privacy Policy")
  })

  it("formats the last-updated date as a human-readable label", async () => {
    const { LegalLayout } = await import("../legal-layout")
    const { LegalSection } = await import("../legal-section")

    const { container } = render(
      <LegalLayout
        title="Privacy Policy"
        lastUpdated="2026-05-14"
        tldr={<p>TL;DR summary text content.</p>}
      >
        <LegalSection id="x" title="X-Section">
          body
        </LegalSection>
      </LegalLayout>,
    )

    expect(screen.getByText(/Last updated/i)).toBeInTheDocument()

    // The `<time>` element preserves the canonical ISO date, while its
    // rendered text contains the human-formatted month name + year.
    const timeEl = container.querySelector("time")
    expect(timeEl).not.toBeNull()
    expect(timeEl).toHaveAttribute("dateTime", "2026-05-14")
    expect(timeEl?.textContent).toMatch(/May .*2026/)
  })

  it("renders the TL;DR summary content", async () => {
    const { LegalLayout } = await import("../legal-layout")
    const { LegalSection } = await import("../legal-section")

    render(
      <LegalLayout
        title="Privacy Policy"
        lastUpdated="2026-05-14"
        tldr={<p>TL;DR summary text content.</p>}
      >
        <LegalSection id="x" title="X-Section">
          body
        </LegalSection>
      </LegalLayout>,
    )

    expect(
      screen.getByText("TL;DR summary text content."),
    ).toBeInTheDocument()
  })

  it("renders the child LegalSection H2", async () => {
    const { LegalLayout } = await import("../legal-layout")
    const { LegalSection } = await import("../legal-section")

    render(
      <LegalLayout
        title="Privacy Policy"
        lastUpdated="2026-05-14"
        tldr={<p>TL;DR summary text content.</p>}
      >
        <LegalSection id="x" title="X-Section">
          body
        </LegalSection>
      </LegalLayout>,
    )

    const h2 = screen.getByRole("heading", { level: 2, name: "X-Section" })
    expect(h2).toBeInTheDocument()
  })
})
