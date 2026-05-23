import { expect, test } from "@playwright/test"

type LenisLike = {
  limit: number
  dimensions: { scrollHeight: number }
}

declare global {
  interface Window {
    __lenis?: LenisLike
  }
}

const TOLERANCE_PX = 5

async function readLenisAndDom(page: import("@playwright/test").Page) {
  return page.evaluate(() => {
    const lenis = window.__lenis
    return {
      limit: lenis?.limit ?? null,
      lenisScrollHeight: lenis?.dimensions.scrollHeight ?? null,
      docScrollHeight: document.documentElement.scrollHeight,
      innerHeight: window.innerHeight,
    }
  })
}

test.describe("/scholarships layout toggle — Lenis dimensions", () => {
  test("Lenis resize fires after grid → list toggle (no truncated scroll)", async ({ page }) => {
    await page.goto("/scholarships")

    const listToggle = page.getByRole("button", { name: /list layout/i })
    await expect(listToggle).toBeVisible()

    await expect
      .poll(async () => (await readLenisAndDom(page)).limit, { timeout: 10_000 })
      .not.toBeNull()

    await listToggle.click()

    await expect
      .poll(
        async () => {
          const state = await readLenisAndDom(page)
          const reachable = state.docScrollHeight - state.innerHeight
          return state.limit !== null && state.limit >= reachable - TOLERANCE_PX
        },
        { timeout: 2_000, intervals: [100, 200, 400] },
      )
      .toBe(true)

    const after = await readLenisAndDom(page)
    const reachable = after.docScrollHeight - after.innerHeight
    expect(after.limit, "Lenis scroll limit must reach the real document bottom").toBeGreaterThanOrEqual(
      reachable - TOLERANCE_PX,
    )
  })
})
