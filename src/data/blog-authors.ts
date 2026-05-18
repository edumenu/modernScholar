export type AuthorKey = "Cathy Dumenu"

export interface BlogAuthor {
  name: string
  role: string
  avatar: string
}

export const authors: Record<AuthorKey, BlogAuthor> = {
  "Cathy Dumenu": {
    name: "Cathy Dumenu",
    role: "Scholarship Advisor",
    avatar: "/cathy.jpg",
  },
}
