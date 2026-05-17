import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
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

describe("formatLastUpdated", () => {
  // The formatter is pinned to `timeZone: "UTC"`, so the rendered day must
  // match the ISO date regardless of the runtime's local timezone. We stub
  // `TZ` to `America/New_York` (UTC-5/-4) to make the regression explicit —
  // before the fix this assertion would have produced "May 13, 2026".
  beforeEach(() => {
    vi.stubEnv("TZ", "America/New_York")
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it("formats a YYYY-MM-DD ISO date in UTC regardless of runtime TZ", async () => {
    const { formatLastUpdated } = await import("../legal-layout")

    expect(formatLastUpdated("2026-05-14")).toBe("May 14, 2026")
  })

  it("returns the raw input when the date string is invalid", async () => {
    const { formatLastUpdated } = await import("../legal-layout")

    expect(formatLastUpdated("not-a-date")).toBe("not-a-date")
  })
})
