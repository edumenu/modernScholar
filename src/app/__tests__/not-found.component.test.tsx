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

// next/image renders as a plain <img> in test so we can assert against it.
vi.mock("next/image", () => ({
  default: ({
    src,
    alt,
    className,
    ...props
  }: {
    src: string
    alt: string
    className?: string
  }) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} className={className} {...props} />
  },
}))

describe("Not Found page", () => {
  it("renders the static 404 backdrop images (light + dark)", async () => {
    const { default: NotFound } = await import("../not-found")
    const { container } = render(<NotFound />)

    const lightImg = container.querySelector('img[src="/404_Light.jpg"]')
    const darkImg = container.querySelector('img[src="/404_Dark.jpg"]')

    expect(lightImg).not.toBeNull()
    expect(darkImg).not.toBeNull()
    expect(lightImg?.className).toContain("dark:hidden")
    expect(darkImg?.className).toContain("dark:block")
  })

  it("does not mount Spline", async () => {
    const { default: NotFound } = await import("../not-found")
    const { container } = render(<NotFound />)

    // The previous implementation rendered a <canvas> element via @splinetool.
    expect(container.querySelector("canvas")).toBeNull()
  })

  it("renders the 'couldn't find that page' heading", async () => {
    const { default: NotFound } = await import("../not-found")
    render(<NotFound />)

    expect(
      screen.getByRole("heading", { name: /couldn.t find that page/i }),
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
