import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"

vi.mock("@/components/ui/animatedSection/animated-section", () => ({
  AnimatedSection: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}))

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode
    href: string
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

describe("Not Found page", () => {
  it("renders 404 heading and message", async () => {
    const { default: NotFound } = await import("../not-found")
    render(<NotFound />)

    expect(screen.getByText("404")).toBeInTheDocument()
    expect(
      screen.getByRole("heading", { name: /this page doesn't exist/i }),
    ).toBeInTheDocument()
  })

  it("renders links to home and scholarships", async () => {
    const { default: NotFound } = await import("../not-found")
    render(<NotFound />)

    const links = screen.getAllByRole("link")
    const homeLink = links.find((l) => l.getAttribute("href") === "/")
    const scholarshipsLink = links.find(
      (l) => l.getAttribute("href") === "/scholarships",
    )

    expect(homeLink).toBeDefined()
    expect(scholarshipsLink).toBeDefined()
  })
})
