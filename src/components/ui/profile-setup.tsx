"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Icon } from "@iconify/react"
import { useProfileStore, type UserProfile } from "@/stores/profile"
import { SCHOLARSHIP_CATEGORIES, type ScholarshipCategory } from "@/data/scholarships"
import { Button } from "@/components/ui/button/button"
import { cn } from "@/lib/utils"

const YEAR_OPTIONS = [
  { value: "freshman", label: "Freshman" },
  { value: "sophomore", label: "Sophomore" },
  { value: "junior", label: "Junior" },
  { value: "senior", label: "Senior" },
  { value: "graduate", label: "Graduate" },
] as const

const GPA_OPTIONS = [
  { value: "3.5-4.0", label: "3.5 - 4.0" },
  { value: "3.0-3.49", label: "3.0 - 3.49" },
  { value: "2.5-2.99", label: "2.5 - 2.99" },
  { value: "below-2.5", label: "Below 2.5" },
] as const

interface ProfileSetupProps {
  onClose?: () => void
}

export function ProfileSetup({ onClose }: ProfileSetupProps) {
  const { profile, setProfile } = useProfileStore()
  const [localProfile, setLocalProfile] = useState<UserProfile>(profile)

  const handleSave = () => {
    setProfile(localProfile)
    onClose?.()
  }

  const disciplines = SCHOLARSHIP_CATEGORIES.filter((c) => c !== "All")

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="font-heading text-lg font-medium text-on-surface">
          Your Profile
        </h3>
        <p className="mt-1 text-sm text-on-surface-variant">
          Tell us about yourself to see personalized match scores.
        </p>
      </div>

      {/* Discipline */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium uppercase tracking-wider text-on-surface-variant">
          Field of Study
        </label>
        <div className="flex flex-wrap gap-2">
          {disciplines.map((cat) => (
            <button
              key={cat}
              onClick={() =>
                setLocalProfile((p) => ({
                  ...p,
                  discipline: p.discipline === cat ? null : (cat as ScholarshipCategory),
                }))
              }
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                localProfile.discipline === cat
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-outline-variant/40 text-on-surface-variant hover:border-primary/50",
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Year */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium uppercase tracking-wider text-on-surface-variant">
          Year in School
        </label>
        <div className="flex flex-wrap gap-2">
          {YEAR_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() =>
                setLocalProfile((p) => ({
                  ...p,
                  yearInSchool: p.yearInSchool === opt.value ? null : opt.value,
                }))
              }
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                localProfile.yearInSchool === opt.value
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-outline-variant/40 text-on-surface-variant hover:border-primary/50",
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* GPA */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium uppercase tracking-wider text-on-surface-variant">
          GPA Range
        </label>
        <div className="flex flex-wrap gap-2">
          {GPA_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() =>
                setLocalProfile((p) => ({
                  ...p,
                  gpaRange: p.gpaRange === opt.value ? null : opt.value,
                }))
              }
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                localProfile.gpaRange === opt.value
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-outline-variant/40 text-on-surface-variant hover:border-primary/50",
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <Button size="sm" onClick={handleSave}>
          <Icon icon="solar:check-circle-linear" data-icon="inline-start" />
          Save Profile
        </Button>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
        )}
      </div>
    </div>
  )
}
// TODO: Deprecate this in favor of a more comprehensive profile page in the future
export function ProfileSetupTrigger() {
  const { isSetup, clearProfile } = useProfileStore()
  const [showSetup, setShowSetup] = useState(false)

  return (
    <>
      <button
        onClick={() => {
          if (isSetup) {
            clearProfile()
          } else {
            setShowSetup(true)
          }
        }}
        className={cn(
          "flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
          isSetup
            ? "border-secondary bg-secondary/10 text-secondary"
            : "border-outline-variant/40 text-on-surface-variant hover:border-primary/50",
        )}
      >
        <Icon
          icon={isSetup ? "solar:user-check-rounded-bold" : "solar:user-plus-rounded-linear"}
          className="size-4"
        />
        {isSetup ? "Profile Active" : "Set Profile"}
      </button>

      <AnimatePresence>
        {showSetup && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
              onClick={() => setShowSetup(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="fixed inset-x-4 top-1/2 z-50 mx-auto max-w-md -translate-y-1/2 rounded-2xl bg-background p-6 shadow-xl sm:inset-x-auto"
            >
              <ProfileSetup onClose={() => setShowSetup(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
