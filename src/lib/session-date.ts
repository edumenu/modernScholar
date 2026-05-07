// Snapshot taken at module load. Every active/expired check in the same browsing
// session reads this so the grid, filter sheet, hero, and card surfaces never
// disagree about whether a given scholarship is still active. Crossing midnight
// requires a full reload to refresh.
export const SESSION_DATE = new Date()
