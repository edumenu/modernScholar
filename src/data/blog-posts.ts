export interface BlogAuthor {
  name: string
  role: string
  avatar: string
}

export interface ArticleSection {
  id: string
  title: string
  content: string[]
  blockquote?: string
  list?: string[]
}

export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  category: string
  image: string
  publishDate: string
  readTime: string
  author: BlogAuthor
  content: ArticleSection[]
  featured?: boolean
}

const authors: Record<string, BlogAuthor> = {
  priya: {
    name: "Priya Sharma",
    role: "Scholarship Advisor",
    avatar: "/authors/priya-sharma.jpg",
  },
  david: {
    name: "David Chen",
    role: "STEM Education Writer",
    avatar: "/authors/david-chen.jpg",
  },
  amara: {
    name: "Amara Osei",
    role: "Student Success Coach",
    avatar: "/authors/amara-osei.jpg",
  },
  elena: {
    name: "Elena Rodriguez",
    role: "Financial Aid Specialist",
    avatar: "/authors/elena-rodriguez.jpg",
  },
  james: {
    name: "James Whitfield",
    role: "Admissions Consultant",
    avatar: "/authors/james-whitfield.jpg",
  },
  mei: {
    name: "Mei Lin",
    role: "International Education Editor",
    avatar: "/authors/mei-lin.jpg",
  },
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
    author: authors.priya,
    featured: true,
    content: [
      {
        id: "section-power-of-story",
        title: "The Power of a Personal Story",
        content: [
          "Every winning scholarship essay begins with a story that only you can tell. Reviewers read hundreds of applications, and the ones that stand out are those rooted in genuine, specific experiences rather than broad generalizations about ambition or passion.",
          "Think about a moment that changed your perspective — a conversation with a mentor, a challenge you overcame, or a discovery that redirected your goals. That moment is your hook, and it should appear in your opening paragraph.",
        ],
      },
      {
        id: "section-structure",
        title: "Structuring Your Essay for Impact",
        content: [
          "A strong essay follows a clear arc: situation, complication, resolution, and forward vision. Start with the specific, move to the broader significance, and end with where you're headed. This structure gives reviewers a narrative they can follow and remember.",
          "Keep paragraphs short and purposeful. Each paragraph should advance your story or argument. If a paragraph doesn't serve the essay's central theme, cut it — no matter how well-written it is.",
        ],
        blockquote:
          "The students who succeed aren't necessarily the ones with the highest grades — they're the ones who tell the most compelling stories about who they are and where they're going.",
      },
      {
        id: "section-tailoring",
        title: "Tailoring to the Scholarship's Mission",
        content: [
          "Generic essays are the fastest way to the rejection pile. Before writing a single word, research the organization offering the scholarship. What do they value? What impact do they want to make? Your essay should demonstrate alignment between your goals and their mission.",
        ],
        list: [
          "Read the scholarship's mission statement and past winner profiles carefully.",
          "Mirror their language naturally — if they emphasize 'community impact,' show your community impact with specific examples.",
          "Quantify your achievements wherever possible: '50 students tutored' beats 'helped many students.'",
          "Ask for recommendation letters at least three weeks in advance and provide recommenders with context.",
          "Proofread ruthlessly — spelling and grammar errors signal a lack of care.",
        ],
      },
    ],
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
    author: authors.david,
    content: [
      {
        id: "section-stem-landscape",
        title: "The STEM Funding Landscape in 2026",
        content: [
          "STEM fields continue to attract significant scholarship investment from both private foundations and government agencies. In 2026, over $3.2 billion in dedicated STEM scholarships are available to undergraduate and graduate students in the United States alone.",
          "The key shift this year is the growing number of scholarships targeting interdisciplinary STEM work — programs that blend computer science with biology, or engineering with environmental science. If your interests span multiple fields, you may have an advantage.",
        ],
      },
      {
        id: "section-top-programs",
        title: "Top Programs Worth Your Attention",
        content: [
          "While the most visible scholarships like the Goldwater or NSF Graduate Fellowship are highly competitive, there are hundreds of mid-tier STEM scholarships with acceptance rates above 10%. These are where strategic applicants focus their energy.",
        ],
        list: [
          "The Barry Goldwater Scholarship — for sophomores and juniors pursuing research careers in STEM.",
          "NSF Graduate Research Fellowship — three years of support for graduate students in STEM fields.",
          "Society of Women Engineers scholarships — multiple awards for women in engineering disciplines.",
          "SMART Scholarship — full tuition plus stipend in exchange for Department of Defense service.",
          "Hertz Foundation Fellowship — one of the most generous graduate fellowships in applied science.",
        ],
      },
      {
        id: "section-strengthening-app",
        title: "Strengthening Your STEM Application",
        content: [
          "STEM scholarship reviewers value research experience above almost everything else. Even a single semester of undergraduate research can dramatically strengthen your application. Seek out faculty mentors and get involved early.",
          "Beyond research, demonstrating outreach — teaching, mentoring, or science communication — shows the kind of well-rounded commitment that scholarship committees reward.",
        ],
        blockquote:
          "The best STEM scholarship applications don't just list achievements — they tell the story of a curious mind solving real problems.",
      },
    ],
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
    author: authors.amara,
    content: [
      {
        id: "section-first-gen-advantage",
        title: "Your First-Gen Status Is a Strength",
        content: [
          "Being the first in your family to attend college is not a disadvantage in the scholarship world — it's a compelling part of your story. Many scholarships specifically target first-generation students because foundations understand the unique challenges and determination required to pursue higher education without a family roadmap.",
          "Lean into your story. The resourcefulness, resilience, and motivation that brought you to this point are exactly what scholarship committees want to fund.",
        ],
      },
      {
        id: "section-hidden-opportunities",
        title: "Finding Hidden Opportunities",
        content: [
          "First-generation students often miss scholarships because they lack the networks that pass information down. Your high school counselor or college financial aid office may not have time to match every student with every opportunity. You need to become your own advocate.",
        ],
        list: [
          "Register on scholarship databases like Fastweb, Scholarships.com, and your state's higher education agency portal.",
          "Contact the financial aid office directly — many schools have emergency and departmental scholarships that aren't widely advertised.",
          "Look for community foundation scholarships — local organizations often have less competition and deeply value first-gen applicants.",
          "Reach out to first-gen student organizations at your target schools. They often maintain curated scholarship lists.",
        ],
        blockquote:
          "I didn't have parents who could guide me through this process, but I found mentors who could. That made all the difference.",
      },
      {
        id: "section-building-support",
        title: "Building Your Support System",
        content: [
          "The scholarship process can feel isolating for first-generation students. Building a support network of mentors, peers, and advisors is just as important as the applications themselves. Seek out first-gen programs at your institution — they exist at most universities and can provide guidance, community, and even additional funding.",
          "Remember that financial aid offices are valuable resources that many students overlook. They can help you identify opportunities, review your applications, and connect you with alumni who have successfully navigated the scholarship process.",
        ],
      },
    ],
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
    author: authors.james,
    content: [
      {
        id: "section-common-pitfalls",
        title: "The Most Common Pitfalls",
        content: [
          "Scholarship committees see the same mistakes repeated thousands of times each cycle. The good news is that most of these errors are entirely avoidable with a bit of awareness and preparation. Avoiding them puts you ahead of a significant portion of the applicant pool.",
          "The most damaging mistake isn't a typo or a missed deadline — it's submitting a generic application that could have been written by anyone. Specificity is what separates winners from the rest.",
        ],
      },
      {
        id: "section-essay-errors",
        title: "Essay Errors That Cost You",
        content: [
          "Your essay is your chance to speak directly to the committee, and too many students waste it on clichés. Opening with 'I have always been passionate about...' tells the reviewer nothing. Opening with a specific scene or moment tells them everything.",
        ],
        list: [
          "Avoid vague language — replace 'I want to make a difference' with specific, measurable goals.",
          "Never recycle an essay verbatim for multiple scholarships. Tailoring is non-negotiable.",
          "Don't ignore the word count — going over signals you can't follow instructions; going under signals you don't care enough.",
          "Have someone else proofread. You will miss your own errors after reading your essay ten times.",
          "Don't list achievements without context — explain what you learned and how it changed your trajectory.",
        ],
        blockquote:
          "An application without proofreading is like showing up to an interview in pajamas — it tells the committee exactly how much you care.",
      },
      {
        id: "section-process-mistakes",
        title: "Process and Logistics Mistakes",
        content: [
          "Beyond the essay, many students stumble on logistics. Missing deadlines, submitting incomplete applications, or failing to follow formatting instructions are surprisingly common. Create a spreadsheet tracking every scholarship's requirements, deadlines, and submission status.",
          "Request recommendation letters early — at least three weeks before the deadline. Provide your recommenders with a brief about the scholarship and talking points about your qualifications. A rushed, generic recommendation letter can sink an otherwise strong application.",
        ],
      },
    ],
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
    author: authors.mei,
    content: [
      {
        id: "section-global-landscape",
        title: "The Global Scholarship Landscape",
        content: [
          "Studying abroad is one of the most transformative educational experiences available, but the financial barriers can seem insurmountable. Fortunately, thousands of scholarships exist specifically for international students — from government-funded programs to university-specific awards.",
          "The key is understanding which countries and institutions invest most heavily in international student support. The United States, United Kingdom, Germany, Canada, and Australia each have robust scholarship ecosystems, but the application processes and timelines vary significantly.",
        ],
      },
      {
        id: "section-government-programs",
        title: "Government-Funded Programs",
        content: [
          "Many countries fund prestigious scholarship programs to attract international talent. These are often the most generous awards available, covering tuition, living expenses, travel, and sometimes even language training.",
        ],
        list: [
          "Fulbright Program (USA) — the flagship international exchange program with opportunities in over 160 countries.",
          "Chevening Scholarships (UK) — fully funded master's degrees for future leaders from eligible countries.",
          "DAAD Scholarships (Germany) — comprehensive funding for international students at German universities.",
          "Australia Awards — scholarships and fellowships funded by the Australian Government for developing countries.",
          "Erasmus Mundus (EU) — joint master's degree programs with full scholarships across multiple European universities.",
        ],
      },
      {
        id: "section-application-strategy",
        title: "Building Your International Application Strategy",
        content: [
          "International scholarship applications require additional planning compared to domestic ones. You'll need to account for document translation, credential evaluation, language testing, and visa timelines. Start at least 12 months before your intended start date.",
          "Cultural context matters in your essays. What resonates with a Fulbright committee may differ from what a DAAD reviewer values. Research the program's cultural expectations and adjust your narrative accordingly — authenticity matters, but so does cultural intelligence.",
        ],
        blockquote:
          "The most successful international scholarship applicants don't just demonstrate academic excellence — they show how crossing borders will amplify their impact back home.",
      },
    ],
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
    author: authors.james,
    content: [
      {
        id: "section-why-letters-matter",
        title: "Why Recommendation Letters Can Make or Break Your Application",
        content: [
          "A strong recommendation letter does something your essay cannot — it provides an external, credible validation of your character, abilities, and potential. Scholarship committees weigh these letters heavily because they reveal how others perceive you, not just how you perceive yourself.",
          "The difference between a generic letter ('This student is hardworking and dedicated') and a powerful one ('In fifteen years of teaching, I have rarely seen a student approach research with the combination of rigor and creativity that Sarah demonstrates') is enormous.",
        ],
      },
      {
        id: "section-choosing-recommenders",
        title: "Choosing the Right Recommenders",
        content: [
          "The best recommender is not necessarily the most impressive person you know — it's the person who knows you best and can speak with specificity about your strengths. A detailed letter from your biology professor who supervised your research is worth more than a vague letter from a senator you met once.",
        ],
        list: [
          "Choose people who have directly observed your work, growth, or leadership.",
          "Prioritize depth of relationship over title or prestige.",
          "Aim for diversity — one academic recommender and one from a professional or community context.",
          "Never ask someone who might say no or write a lukewarm letter. If they hesitate when you ask, find someone else.",
        ],
        blockquote:
          "The right recommender isn't the most famous person you know — it's the one who can tell your story with conviction.",
      },
      {
        id: "section-making-it-easy",
        title: "Making It Easy for Your Recommenders",
        content: [
          "Recommenders are busy people doing you a favor. The easier you make the process, the better your letter will be. Provide them with everything they need: the scholarship's mission, your resume, your essay draft, specific anecdotes you'd like them to reference, and a clear deadline.",
          "Follow up politely one week before the deadline. After the letter is submitted, send a thank-you note. These relationships are long-term investments — treat them that way.",
        ],
      },
    ],
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
    author: authors.amara,
    content: [
      {
        id: "section-the-rejections",
        title: "Twelve Rejections in One Spring",
        content: [
          "Sarah Martinez applied to twelve scholarships during her junior year of high school. She was rejected from all twelve. For a first-generation student from a small town in New Mexico, each rejection felt like confirmation that she didn't belong in the world of competitive academics.",
          "But Sarah didn't stop. She asked for feedback on three of her rejected applications. Two organizations responded, and their feedback was consistent: her essays were well-written but generic. They didn't reveal the specific, human Sarah behind the grades and activities list.",
        ],
      },
      {
        id: "section-the-turning-point",
        title: "The Turning Point",
        content: [
          "That summer, Sarah rewrote her core essay from scratch. Instead of opening with her GPA and extracurriculars, she opened with the morning she translated a medical diagnosis for her mother at the county hospital — the moment she decided to pursue healthcare administration. The essay was raw, specific, and entirely her own.",
          "She also changed her strategy. Instead of applying to every scholarship she found, she identified eight programs whose missions aligned closely with her story and goals. She tailored every word of every application.",
        ],
        blockquote:
          "The rejections didn't break me — they taught me that I was applying as the student I thought they wanted, not the student I actually was.",
      },
      {
        id: "section-the-outcome",
        title: "Full Ride and Beyond",
        content: [
          "Sarah was awarded a full-ride scholarship to the University of New Mexico, plus two additional awards totaling $15,000 per year. She's now in her second year, maintaining a 3.9 GPA, and mentoring other first-generation students through the scholarship process.",
          "Her advice to students facing rejection: 'Every 'no' is data. Use it. The committee isn't rejecting you as a person — they're telling you that your application didn't communicate your value clearly enough. That's fixable.'",
        ],
      },
    ],
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
    author: authors.elena,
    content: [
      {
        id: "section-humanities-funding",
        title: "Yes, Humanities Scholarships Exist — and They're Substantial",
        content: [
          "There's a persistent myth that scholarship money only flows to STEM students. While STEM fields do attract significant corporate funding, the humanities have a rich ecosystem of fellowships, grants, and scholarships supported by foundations, cultural organizations, and government agencies.",
          "The National Endowment for the Humanities, the Mellon Foundation, and countless university-specific programs fund thousands of humanities students each year. The key is knowing where to look.",
        ],
      },
      {
        id: "section-top-humanities-awards",
        title: "Top Awards for Humanities Students",
        content: [
          "Whether you're studying literature, history, philosophy, languages, or the visual and performing arts, dedicated funding sources exist at every level of education.",
        ],
        list: [
          "The Rhodes Scholarship — the oldest international fellowship, with a strong humanities tradition.",
          "The Marshall Scholarship — funds American students for graduate study in the UK across all disciplines.",
          "Jack Kent Cooke Foundation — generous scholarships for high-achieving students with financial need, including humanities majors.",
          "Davidson Fellows Scholarship — recognizes outstanding projects in literature, music, philosophy, and more.",
          "National YoungArts Foundation — for emerging artists in visual, literary, and performing arts.",
        ],
      },
      {
        id: "section-making-case",
        title: "Making the Case for Your Humanities Degree",
        content: [
          "When applying for scholarships as a humanities major, lean into the skills that make your field essential: critical thinking, persuasive communication, cultural literacy, and the ability to synthesize complex information. These are the skills employers and graduate programs consistently say they need most.",
          "Don't apologize for your major. Frame your work in terms of impact — how does studying 19th-century literature help you understand contemporary media? How does historical analysis inform better policy? Make the connection explicit.",
        ],
        blockquote:
          "The humanities don't just teach us what to think — they teach us how to think. That's exactly the kind of investment scholarship committees want to make.",
      },
    ],
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
    author: authors.priya,
    content: [
      {
        id: "section-personal-vs-essay",
        title: "Personal Statement vs. Scholarship Essay",
        content: [
          "While scholarship essays respond to a specific prompt, a personal statement is your chance to define the narrative on your own terms. It's the most open-ended and, for many students, the most daunting piece of writing in the application process.",
          "Think of your personal statement as a lens through which the committee sees everything else in your application. It should contextualize your transcript, your activities, and your goals into a coherent story about who you are and why you matter.",
        ],
      },
      {
        id: "section-finding-theme",
        title: "Finding Your Central Theme",
        content: [
          "The best personal statements are organized around a single, clear theme — not a chronological summary of your life. This theme should emerge naturally from your experiences and point toward your future.",
        ],
        list: [
          "Ask yourself: what is the one thing I want the committee to remember about me?",
          "Identify 2-3 experiences that illustrate this theme from different angles.",
          "Avoid trying to cover everything — depth beats breadth in personal statements.",
          "Your theme should connect your past experiences to your future ambitions in a way that feels inevitable.",
        ],
        blockquote:
          "A personal statement isn't a biography — it's an argument for why you deserve this opportunity, told through story.",
      },
      {
        id: "section-revision-process",
        title: "The Revision Process",
        content: [
          "First drafts of personal statements are almost always too broad, too safe, or too focused on achievements rather than growth. Plan for at least three full revision cycles. In each round, ask yourself: is this specific enough? Does every sentence earn its place?",
          "Read your statement aloud. If it sounds like a press release, rewrite it to sound like you talking to a mentor you trust. Authenticity resonates more than polish.",
        ],
      },
    ],
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
    author: authors.elena,
    content: [
      {
        id: "section-grad-funding-types",
        title: "Understanding Graduate Funding Types",
        content: [
          "Graduate funding works differently from undergraduate scholarships. The primary mechanisms are fellowships (external awards), assistantships (teaching or research positions with tuition waivers), and grants (project-based funding). Understanding the distinctions helps you build a comprehensive funding strategy.",
          "Many doctoral programs are fully funded by default, meaning the program covers tuition and provides a living stipend in exchange for teaching or research. Master's programs, however, are less consistently funded — this is where external scholarships and fellowships become critical.",
        ],
      },
      {
        id: "section-fellowship-landscape",
        title: "The Fellowship Landscape",
        content: [
          "Prestigious fellowships can transform your graduate experience by providing funding without service obligations, giving you the freedom to focus entirely on your research.",
        ],
        list: [
          "NSF Graduate Research Fellowship — three years of support for STEM and social science graduate students.",
          "Ford Foundation Fellowship — for PhD students committed to diversity and inclusion in academia.",
          "Soros Fellowship for New Americans — for immigrants and children of immigrants pursuing graduate study.",
          "SSRC Doctoral Fellowships — for social science doctoral students at various stages of their program.",
          "Hertz Foundation Fellowship — one of the most generous fellowships in applied physical and biological sciences.",
        ],
        blockquote:
          "Fully funding your graduate education isn't just about money — it's about the freedom to pursue ideas without compromise.",
      },
      {
        id: "section-negotiating-packages",
        title: "Negotiating Your Funding Package",
        content: [
          "Many students don't realize that graduate funding packages are often negotiable. If you've been admitted to multiple programs, you can leverage competing offers. Be professional and transparent — programs expect this and often have discretionary funds available.",
          "Beyond the headline number, pay attention to health insurance, conference travel funding, summer support, and dissertation completion fellowships. These 'hidden' benefits can be worth thousands of dollars per year and significantly impact your quality of life as a graduate student.",
        ],
      },
    ],
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
    author: authors.elena,
    content: [
      {
        id: "section-transfer-path",
        title: "The Transfer Path Is More Supported Than You Think",
        content: [
          "Community college transfer students are one of the fastest-growing populations in higher education, and institutions are investing heavily in making the transition smoother. Many four-year universities now have dedicated transfer scholarship programs specifically for community college students.",
          "The key is planning early. Most transfer scholarships require you to apply during your second year at community college, and some have GPA thresholds or course requirements that need to be met before you transfer.",
        ],
      },
      {
        id: "section-top-transfer-scholarships",
        title: "Top Transfer Scholarship Programs",
        content: [
          "Several national programs and many state-specific initiatives provide significant funding for transfer students.",
        ],
        list: [
          "Jack Kent Cooke Undergraduate Transfer Scholarship — up to $55,000 per year for exceptional community college students.",
          "Phi Theta Kappa Transfer Scholarships — hundreds of partner institutions offer scholarships to PTK members.",
          "Kaplan Leadership Program — for community college students demonstrating leadership and academic excellence.",
          "State-specific articulation agreements — many states guarantee admission and scholarships for students who complete associate degrees.",
        ],
      },
      {
        id: "section-maximizing-transfer",
        title: "Maximizing Your Transfer Application",
        content: [
          "Transfer applications are evaluated differently from freshman applications. Committees focus heavily on your community college GPA, your reasons for transferring, and your ability to articulate how the four-year institution will help you achieve specific goals.",
          "Don't overlook the power of community college faculty recommendations. Professors who have watched you grow over two years can write remarkably specific and compelling letters — often more powerful than recommendations from a large university where you're one of two hundred students in a lecture hall.",
        ],
        blockquote:
          "Starting at community college isn't a detour — it's a strategic choice. The scholarship world is finally recognizing that.",
      },
    ],
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
    author: authors.amara,
    content: [
      {
        id: "section-the-numbers",
        title: "The $200,000 Question",
        content: [
          "When Marcus Thompson was accepted to medical school, the estimated cost of attendance was $320,000 over four years. His family couldn't contribute, and he was determined not to graduate with six figures of debt. So he treated scholarship applications like a part-time job — and it paid off.",
          "Over four years, Marcus secured $217,000 in scholarships from eleven different sources. His strategy wasn't about luck — it was about systems, specificity, and persistence.",
        ],
      },
      {
        id: "section-the-system",
        title: "Building the System",
        content: [
          "Marcus created a spreadsheet tracking every scholarship he found — 67 in total. He categorized them by deadline, award amount, eligibility requirements, and how closely they aligned with his story. Then he ranked them by expected return on time invested.",
        ],
        list: [
          "Applied to scholarships with fewer than 500 applicants first — higher odds, less competition.",
          "Reused essay frameworks but customized every application's specific examples and mission alignment.",
          "Set a schedule: five hours every Sunday dedicated to scholarship work, no exceptions.",
          "Asked every professor and mentor for leads on field-specific scholarships not listed in databases.",
          "Kept a 'wins folder' of acceptance letters and positive feedback to stay motivated during rejections.",
        ],
        blockquote:
          "I stopped thinking of scholarships as lottery tickets and started thinking of them as job applications. That shift changed everything.",
      },
      {
        id: "section-advice-to-others",
        title: "Marcus's Advice to Pre-Med Students",
        content: [
          "Marcus emphasizes that medical school scholarships exist at every stage — pre-med, during medical school, and even during residency. Many students only look for funding during admission and miss significant opportunities in their second, third, and fourth years.",
          "'The biggest mistake I see is students who apply to five scholarships, get rejected, and give up. I was rejected from the majority of what I applied to. But the ones I won more than covered the time I invested. Think of it as a numbers game with compounding returns.'",
        ],
      },
    ],
  },
]
