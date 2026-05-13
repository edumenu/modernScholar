export const SITE_URL = "https://modernscholarhq.com"

export const MONTHS = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
] as const
export type Month = (typeof MONTHS)[number]
export type MonthFilter = Month | "all"

export const MONTH_LABELS: Record<MonthFilter, string> = {
  all: "All months",
  january: "January",
  february: "February",
  march: "March",
  april: "April",
  may: "May",
  june: "June",
  july: "July",
  august: "August",
  september: "September",
  october: "October",
  november: "November",
  december: "December",
}
