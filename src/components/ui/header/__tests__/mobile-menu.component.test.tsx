import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { userEvent } from "@testing-library/user-event"

vi.mock("next-themes", () => ({
  useTheme: () => ({ theme: "light", resolvedTheme: "light", setTheme: vi.fn() }),
}))

vi.mock("next/image", () => ({
  __esModule: true,
  default: ({ alt }: { alt: string }) => <span data-alt={alt} />,
}))

vi.mock("next/link", () => ({
  __esModule: true,
  default: ({
    children,
    href,
    ...rest
  }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}))

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}))

vi.mock("@iconify/react", () => ({
  Icon: () => <span data-testid="icon" />,
}))

vi.mock("use-sound", () => ({
  __esModule: true,
  default: () => [vi.fn()],
}))

vi.mock("../theme-toggle", () => ({
  ThemeToggle: () => <span data-testid="theme-toggle" />,
}))

// Strip motion animations for deterministic rendering; forward props (incl. ref).
vi.mock("motion/react", () => {
  type DivProps = React.HTMLAttributes<HTMLDivElement> & {
    children?: React.ReactNode
  }
  // Accept and discard motion-specific props so they don't hit the DOM.
  const MotionDiv = (props: DivProps) => {
    const { children, ...rest } = props as DivProps & Record<string, unknown>
    // Drop known motion keys
    delete (rest as Record<string, unknown>).variants
    delete (rest as Record<string, unknown>).initial
    delete (rest as Record<string, unknown>).animate
    delete (rest as Record<string, unknown>).exit
    delete (rest as Record<string, unknown>).transition
    delete (rest as Record<string, unknown>).custom
    delete (rest as Record<string, unknown>).layout
    delete (rest as Record<string, unknown>).layoutId
    delete (rest as Record<string, unknown>).whileHover
    delete (rest as Record<string, unknown>).whileTap
    delete (rest as Record<string, unknown>).whileFocus
    delete (rest as Record<string, unknown>).onAnimationComplete
    return <div {...(rest as DivProps)}>{children}</div>
  }
  const MotionPath = (props: React.SVGAttributes<SVGPathElement>) => {
    const { ...rest } = props as Record<string, unknown>
    delete rest.variants
    delete rest.initial
    delete rest.animate
    delete rest.exit
    delete rest.transition
    return <path {...(rest as React.SVGAttributes<SVGPathElement>)} />
  }
  return {
    motion: { div: MotionDiv, path: MotionPath },
    AnimatePresence: ({ children }: { children?: React.ReactNode }) => (
      <>{children}</>
    ),
    useReducedMotion: () => false,
  }
})

describe("MobileMenuButton accessibility", () => {
  it("button has aria-controls pointing to the drawer id", async () => {
    const { MobileMenuButton } = await import("../mobile-menu")
    render(<MobileMenuButton />)

    const btn = screen.getByRole("button", { name: /open menu/i })
    expect(btn).toHaveAttribute("aria-controls", "mobile-nav-drawer")
    expect(btn).toHaveAttribute("aria-expanded", "false")
  })

  it("drawer opens with role=dialog, aria-modal, and matching id", async () => {
    const { MobileMenuButton } = await import("../mobile-menu")
    render(<MobileMenuButton />)

    const btn = screen.getByRole("button", { name: /open menu/i })
    await userEvent.click(btn)

    expect(btn).toHaveAttribute("aria-expanded", "true")

    const drawer = document.getElementById("mobile-nav-drawer")
    expect(drawer).not.toBeNull()
    expect(drawer).toHaveAttribute("role", "dialog")
    expect(drawer).toHaveAttribute("aria-modal", "true")
    expect(drawer).toHaveAttribute("aria-label", "Mobile navigation")
  })

  it("returns focus to the trigger button when closed", async () => {
    const { MobileMenuButton } = await import("../mobile-menu")
    render(<MobileMenuButton />)

    const btn = screen.getByRole("button", { name: /open menu/i })
    await userEvent.click(btn)
    // The trap auto-focuses first element inside drawer; close again.
    const closeBtn = screen.getByRole("button", { name: /close menu/i })
    await userEvent.click(closeBtn)

    // requestAnimationFrame fires in jsdom within the next tick.
    await new Promise((resolve) => requestAnimationFrame(() => resolve(null)))

    const triggerAfter = screen.getByRole("button", { name: /open menu/i })
    expect(document.activeElement).toBe(triggerAfter)
  })
})
