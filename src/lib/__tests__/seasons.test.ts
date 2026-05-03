import { describe, it, expect } from "vitest"
import {
  seasonForMonthIndex,
  seasonForMonthName,
  getCurrentSeason,
  getNextSeason,
  type Season,
} from "../seasons"

describe("seasonForMonthIndex", () => {
  const cases: [number, Season][] = [
    [0, "winter"],
    [1, "winter"],
    [2, "spring"],
    [3, "spring"],
    [4, "spring"],
    [5, "summer"],
    [6, "summer"],
    [7, "summer"],
    [8, "fall"],
    [9, "fall"],
    [10, "fall"],
    [11, "winter"],
  ]

  it.each(cases)("month %i returns %s", (month, expected) => {
    expect(seasonForMonthIndex(month)).toBe(expected)
  })
})

describe("seasonForMonthName", () => {
  it("returns winter for lowercase 'january'", () => {
    expect(seasonForMonthName("january")).toBe("winter")
  })

  it("returns winter for uppercase 'DECEMBER'", () => {
    expect(seasonForMonthName("DECEMBER")).toBe("winter")
  })

  it("returns spring for uppercase 'MARCH'", () => {
    expect(seasonForMonthName("MARCH")).toBe("spring")
  })

  it("returns spring for uppercase 'MAY'", () => {
    expect(seasonForMonthName("MAY")).toBe("spring")
  })

  it("returns summer for uppercase 'JUNE'", () => {
    expect(seasonForMonthName("JUNE")).toBe("summer")
  })

  it("returns summer for uppercase 'AUGUST'", () => {
    expect(seasonForMonthName("AUGUST")).toBe("summer")
  })

  it("returns undefined for an unknown month name", () => {
    expect(seasonForMonthName("not-a-month")).toBeUndefined()
  })
})

describe("getCurrentSeason", () => {
  it("returns winter for January 15, 2026", () => {
    expect(getCurrentSeason(new Date(2026, 0, 15))).toBe("winter")
  })
})

describe("getNextSeason", () => {
  it("cycles through seasons correctly", () => {
    expect(getNextSeason("winter")).toBe("spring")
    expect(getNextSeason("spring")).toBe("summer")
    expect(getNextSeason("summer")).toBe("fall")
    expect(getNextSeason("fall")).toBe("winter")
  })
})
