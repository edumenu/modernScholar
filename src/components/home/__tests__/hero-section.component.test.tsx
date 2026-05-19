import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"

const setSplineReady = vi.fn()
let mockIsDesktop: boolean | null = true

vi.mock("next/dynamic", () => ({
  __esModule: true,
  default: () =>
    function SplineSceneMock() {
      return <div data-testid="spline-scene" />
    },
}))

vi.mock("next/image", () => ({
  __esModule: true,
  default: ({ alt, src }: { alt: string; src: string }) => (
    <img data-testid="hero-static-image" alt={alt} src={src} />
  ),
}))

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}))

vi.mock("next-themes", () => ({
  useTheme: () => ({ resolvedTheme: "light" }),
}))

vi.mock("@/hooks/use-media-query", () => ({
  useMediaQuery: () => mockIsDesktop,
}))

vi.mock("@/hooks/use-has-mounted", () => ({
  useHasMounted: () => true,
}))

vi.mock("@/stores/hero-loader-store", () => ({
  useHeroLoaderStore: (selector: (state: unknown) => unknown) =>
    selector({ setSplineReady }),
}))

vi.mock("@/components/ui/parallax-layer", () => ({
  ParallaxLayer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="parallax">{children}</div>
  ),
}))

vi.mock("@/components/ui/animatedSection/animated-section", () => ({
  AnimatedSection: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}))

vi.mock("@/components/ui/animatedLines/animated-lines", () => ({
  AnimatedLines: ({ text }: { text: string }) => <span>{text}</span>,
}))

vi.mock("@/components/ui/button/cta-button", () => ({
  CTAButton: ({ label }: { label: string }) => <button>{label}</button>,
}))

vi.mock("@/config/spline-scenes", () => ({
  splineScenes: {
    heroLight: () => "light.splinecode",
    heroDark: () => "dark.splinecode",
  },
}))

vi.mock("@/lib/pretext/fonts", () => ({
  PRETEXT_FONTS: { heroHeadline: {} },
  PRETEXT_FALLBACK_FONTS: { heroHeadline: {} },
}))

describe("HeroSection", () => {
  beforeEach(() => {
    setSplineReady.mockClear()
  })

  it("renders the static image and calls setSplineReady(true) when not desktop", async () => {
    mockIsDesktop = false
    const { HeroSection } = await import("../hero-section")

    render(<HeroSection />)

    expect(screen.getByTestId("hero-static-image")).toBeInTheDocument()
    expect(screen.queryByTestId("spline-scene")).not.toBeInTheDocument()
    expect(setSplineReady).toHaveBeenCalledWith(true)
  })

  it("renders the Spline scene on desktop (lg+ with fine pointer and hover)", async () => {
    mockIsDesktop = true
    const { HeroSection } = await import("../hero-section")

    render(<HeroSection />)

    expect(screen.getByTestId("spline-scene")).toBeInTheDocument()
    expect(screen.queryByTestId("hero-static-image")).not.toBeInTheDocument()
  })

  it("renders the static image before the media query resolves", async () => {
    mockIsDesktop = null
    const { HeroSection } = await import("../hero-section")

    render(<HeroSection />)

    expect(screen.getByTestId("hero-static-image")).toBeInTheDocument()
    expect(screen.queryByTestId("spline-scene")).not.toBeInTheDocument()
  })
})
