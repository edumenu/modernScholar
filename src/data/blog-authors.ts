export type AuthorKey = "Catherine Dumenu"

export interface BlogAuthor {
  name: string
  role: string
  avatar: string
}

export const authors: Record<AuthorKey, BlogAuthor> = {
  "Catherine Dumenu": {
    name: "Catherine Dumenu",
    role: "Scholarship Advisor",
    avatar: "/CatherineDumenu.jpeg",
  },
}
