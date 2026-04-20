import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { ScholarshipCategory } from "@/data/scholarships"

export interface UserProfile {
  discipline: ScholarshipCategory | null
  yearInSchool: "freshman" | "sophomore" | "junior" | "senior" | "graduate" | null
  gpaRange: "3.5-4.0" | "3.0-3.49" | "2.5-2.99" | "below-2.5" | null
}

interface ProfileState {
  profile: UserProfile
  isSetup: boolean
  setProfile: (profile: Partial<UserProfile>) => void
  clearProfile: () => void
}

const DEFAULT_PROFILE: UserProfile = {
  discipline: null,
  yearInSchool: null,
  gpaRange: null,
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      profile: DEFAULT_PROFILE,
      isSetup: false,
      setProfile: (updates) =>
        set((state) => {
          const profile = { ...state.profile, ...updates }
          const isSetup = profile.discipline !== null
          return { profile, isSetup }
        }),
      clearProfile: () => set({ profile: DEFAULT_PROFILE, isSetup: false }),
    }),
    { name: "ms-profile" },
  ),
)

/** Compute a match percentage between a user profile and a scholarship */
export function computeMatchScore(
  profile: UserProfile,
  scholarshipCategory: ScholarshipCategory,
): number {
  if (!profile.discipline) return 0

  let score = 0
  let factors = 0

  // Category match (50% weight)
  factors += 50
  if (profile.discipline === scholarshipCategory) {
    score += 50
  } else if (profile.discipline === "All") {
    score += 25
  } else {
    // Partial match for related categories
    const related: Record<string, string[]> = {
      Technology: ["STEM"],
      STEM: ["Technology", "Science"],
      Science: ["STEM", "Medical"],
      Medical: ["Science"],
      Business: ["General"],
      Arts: ["General"],
      General: ["Business", "Arts", "Technology", "STEM", "Science", "Medical"],
    }
    if (related[profile.discipline]?.includes(scholarshipCategory)) {
      score += 20
    }
  }

  // GPA range (30% weight)
  if (profile.gpaRange) {
    factors += 30
    if (profile.gpaRange === "3.5-4.0") score += 30
    else if (profile.gpaRange === "3.0-3.49") score += 22
    else if (profile.gpaRange === "2.5-2.99") score += 15
    else score += 8
  }

  // Year in school (20% weight)
  if (profile.yearInSchool) {
    factors += 20
    // All years are generally eligible, but juniors/seniors/graduates get a slight boost
    if (profile.yearInSchool === "graduate") score += 20
    else if (profile.yearInSchool === "senior") score += 18
    else if (profile.yearInSchool === "junior") score += 16
    else if (profile.yearInSchool === "sophomore") score += 14
    else score += 12
  }

  return factors > 0 ? Math.round((score / factors) * 100) : 0
}
