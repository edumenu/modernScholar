export interface WhatsNextPanel {
  id: string
  /** Short heading displayed in the left column above the visual */
  sideHeading: string
  /** Label displayed above the right-column heading (e.g. "What We Build") */
  label: string
  /** Large heading in the right column */
  heading: string
  /** Two-column body text below the heading */
  columns: { left: string; right: string }
  /** Hex color for background transition */
  bgColor: string
  /** Which visual component to render in the left column */
  visual: "orbiting-icons" | "staggered-grid" | "pulsing-icon"
  /** Optional color scheme for text/icons in the visual (defaults to "primary") */
  colorSchema?: "primary" | "secondary" | "tertiary"
}

export const panels: WhatsNextPanel[] = [
  {
    id: "dashboard",
    sideHeading: "Coming Soon",
    label: "Scholarship Dashboard",
    heading:
      "View your scholarship status and progress in one place. Track your applications, deadlines, and outcomes.",
    columns: {
      left: "Overview to view scholarship status and progress. Track applications, deadlines, and outcomes in one place.",
      right:
        "Our platform understands the realities of scholarship applications. We plan every step carefully, stay in close contact with your goals, and adapt to the unexpected so you never miss a deadline.",
    },
    bgColor: "#6d3532",
    visual: "orbiting-icons",
    colorSchema: "primary",
  },
  {
    id: "reminders",
    sideHeading: "Coming Soon",
    label: "Notification and Reminder System",
    heading:
      "Automatic notifications, alerts, updates, and saved reminders so you stay ahead.",
    columns: {
      left: "Set it and forget it. Our reminder system watches every deadline across all your tracked scholarships and nudges you at just the right time.",
      right:
        "Email alerts, in-app notifications, and calendar sync work together so you never scramble at the last minute again.",
    },
    bgColor: "#96a498",
    visual: "staggered-grid",
    colorSchema: "secondary",
  },
  {
    id: "personalization",
    sideHeading: "Coming Soon",
    label: "Scholarship Tracking",
    heading:
      "Scholarship essay tracking and submission checklist tailored to your academic profile.",
    columns: {
      left: "A personalized scholarship list matched to your field, GPA, and background — no more sifting through thousands of irrelevant listings.",
      right:
        "Track every essay draft, required document, and submission step in one place. Know exactly where you stand with each application at a glance.",
    },
    bgColor: "#bb6659",
    visual: "pulsing-icon",
    colorSchema: "tertiary",
  },
]
