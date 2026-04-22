import { describe, it, expect, vi, afterEach } from "vitest"
import { render, screen, cleanup, within } from "@testing-library/react"
import { userEvent } from "@testing-library/user-event"

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

import ErrorPage from "../error"

afterEach(cleanup)

describe("Error page", () => {
  it("renders error heading and message", () => {
    const reset = vi.fn()
    render(<ErrorPage error={new Error("test")} reset={reset} />)

    expect(
      screen.getByRole("heading", { name: /something went wrong/i }),
    ).toBeInTheDocument()
    expect(screen.getByText(/unexpected error/i)).toBeInTheDocument()
  })

  it("renders Try Again button that calls reset", async () => {
    const reset = vi.fn()
    render(<ErrorPage error={new Error("test")} reset={reset} />)

    const button = screen.getByRole("button", { name: /try again/i })
    expect(button).toBeInTheDocument()

    await userEvent.click(button)
    expect(reset).toHaveBeenCalledOnce()
  })

  it("renders a link back to home", () => {
    const reset = vi.fn()
    const { container } = render(<ErrorPage error={new Error("test")} reset={reset} />)

    const homeLink = within(container).getByRole("link", { name: /go home/i })
    expect(homeLink).toBeInTheDocument()
    expect(homeLink).toHaveAttribute("href", "/")
  })
})
