import { describe, it, expect, vi } from "vitest"
import { render, fireEvent } from "@testing-library/react"

const resize = vi.fn()

vi.mock("lenis/react", () => ({
  useLenis: () => ({ resize }),
}))

describe("LegalTOC", () => {
  it("calls lenis.resize() when the details element toggles", async () => {
    const { LegalTOC } = await import("../legal-toc")

    const { container } = render(
      <LegalTOC
        sections={[
          { id: "a", title: "A" },
          { id: "b", title: "B" },
        ]}
      />,
    )

    const details = container.querySelector("details")
    expect(details).not.toBeNull()

    resize.mockClear()
    fireEvent(details!, new Event("toggle"))
    expect(resize).toHaveBeenCalledTimes(1)

    fireEvent(details!, new Event("toggle"))
    expect(resize).toHaveBeenCalledTimes(2)
  })

  it("renders an anchor for every section", async () => {
    const { LegalTOC } = await import("../legal-toc")

    const { container } = render(
      <LegalTOC
        sections={[
          { id: "intro", title: "Intro" },
          { id: "data", title: "Data" },
        ]}
      />,
    )

    const links = container.querySelectorAll("a")
    expect(links).toHaveLength(2)
    expect(links[0]).toHaveAttribute("href", "#intro")
    expect(links[1]).toHaveAttribute("href", "#data")
  })
})
