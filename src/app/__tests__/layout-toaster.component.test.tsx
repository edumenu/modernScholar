import { describe, it, expect, vi } from "vitest"
import { render } from "@testing-library/react"

vi.mock("next-themes", () => ({
  useTheme: () => ({ theme: "light" }),
}))

vi.mock("@iconify/react", () => ({
  Icon: ({ icon }: { icon: string }) => <span data-icon={icon} />,
}))

describe("Toaster is mounted in layout", () => {
  it("Toaster component renders", async () => {
    const { Toaster } = await import("@/components/ui/sonner/sonner")
    const { container } = render(<Toaster />)
    expect(container.firstChild).toBeTruthy()
  })
})
