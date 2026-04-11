export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  category: string
  image: string
  publishDate: string
  readTime: string
}

export const blogPosts: BlogPost[] = [
  {
    id: "winning-essay",
    slug: "10-tips-for-writing-a-winning-scholarship-essay",
    title: "10 Tips for Writing a Winning Scholarship Essay",
    excerpt:
      "Master the art of scholarship essay writing with these proven strategies that have helped thousands of students secure funding.",
    category: "Tips & Guides",
    image: "/scholarships/scholarship-1.jpg",
    publishDate: "March 10, 2026",
    readTime: "8 min read",
  },
  {
    id: "stem-opportunities",
    slug: "top-stem-scholarship-opportunities-2026",
    title: "Top STEM Scholarship Opportunities for 2026",
    excerpt:
      "Discover the most competitive STEM scholarships available this year and learn how to strengthen your application.",
    category: "Opportunities",
    image: "/scholarships/scholarship-2.jpg",
    publishDate: "March 5, 2026",
    readTime: "6 min read",
  },
  {
    id: "first-gen-student",
    slug: "navigating-scholarships-as-a-first-generation-student",
    title: "Navigating Scholarships as a First-Generation Student",
    excerpt:
      "A comprehensive guide for first-generation college students looking to fund their education through scholarships.",
    category: "Success Stories",
    image: "/scholarships/scholarship-3.jpg",
    publishDate: "February 28, 2026",
    readTime: "10 min read",
  },
  {
    id: "avoid-mistakes",
    slug: "common-scholarship-application-mistakes-to-avoid",
    title: "Common Scholarship Application Mistakes to Avoid",
    excerpt:
      "Learn from the most frequent errors applicants make and ensure your scholarship application stands out for the right reasons.",
    category: "Tips & Guides",
    image: "/scholarships/scholarship-4.jpg",
    publishDate: "February 20, 2026",
    readTime: "7 min read",
  },
  {
    id: "international-scholarships",
    slug: "scholarship-opportunities-for-international-students",
    title: "Scholarship Opportunities for International Students",
    excerpt:
      "Explore scholarships specifically designed for international students pursuing education abroad.",
    category: "Opportunities",
    image: "/scholarships/scholarship-5.jpg",
    publishDate: "February 15, 2026",
    readTime: "9 min read",
  },
  {
    id: "recommendation-letters",
    slug: "how-to-get-strong-recommendation-letters",
    title: "How to Get Strong Recommendation Letters",
    excerpt:
      "Tips on building relationships with mentors and requesting compelling letters of recommendation for scholarships.",
    category: "Tips & Guides",
    image: "/scholarships/scholarship-6.jpg",
    publishDate: "February 10, 2026",
    readTime: "5 min read",
  },
  {
    id: "sarah-journey",
    slug: "from-rejection-to-full-ride-sarahs-story",
    title: "From Rejection to Full Ride: Sarah's Story",
    excerpt:
      "How one determined student turned multiple rejections into a full-ride scholarship at her dream university.",
    category: "Success Stories",
    image: "/scholarships/scholarship-7.jpg",
    publishDate: "February 5, 2026",
    readTime: "12 min read",
  },
  {
    id: "arts-humanities",
    slug: "scholarships-for-arts-and-humanities-majors",
    title: "Scholarships for Arts and Humanities Majors",
    excerpt:
      "A curated list of scholarships for students pursuing degrees in the arts, literature, history, and other humanities fields.",
    category: "Opportunities",
    image: "/scholarships/scholarship-8.jpg",
    publishDate: "January 30, 2026",
    readTime: "6 min read",
  },
  {
    id: "personal-statement",
    slug: "crafting-a-compelling-personal-statement",
    title: "Crafting a Compelling Personal Statement",
    excerpt:
      "Step-by-step guidance on writing a personal statement that captures your unique story and resonates with reviewers.",
    category: "Tips & Guides",
    image: "/scholarships/scholarship-9.jpg",
    publishDate: "January 25, 2026",
    readTime: "8 min read",
  },
  {
    id: "graduate-funding",
    slug: "funding-your-graduate-education",
    title: "Funding Your Graduate Education",
    excerpt:
      "Explore fellowship, assistantship, and scholarship options available for master's and doctoral students.",
    category: "Opportunities",
    image: "/scholarships/scholarship-10.jpg",
    publishDate: "January 20, 2026",
    readTime: "11 min read",
  },
  {
    id: "community-college",
    slug: "community-college-to-university-scholarships",
    title: "Community College to University Scholarships",
    excerpt:
      "Transfer scholarships and funding opportunities for students moving from community college to four-year institutions.",
    category: "Opportunities",
    image: "/scholarships/scholarship-11.jpg",
    publishDate: "January 15, 2026",
    readTime: "7 min read",
  },
  {
    id: "marcus-journey",
    slug: "how-marcus-funded-his-medical-degree",
    title: "How Marcus Funded His Medical Degree",
    excerpt:
      "A pre-med student shares his strategy for securing over $200,000 in scholarships across four years.",
    category: "Success Stories",
    image: "/scholarships/scholarship-12.jpg",
    publishDate: "January 10, 2026",
    readTime: "9 min read",
  },
]
