"use client"

import * as React from "react"
import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox"
import { motion, AnimatePresence } from "motion/react"
import { cn } from "@/lib/utils"

interface CheckboxProps {
  checked?: boolean
  onCheckedChange?: (checked: boolean | "indeterminate") => void
  disabled?: boolean
  children?: React.ReactNode
  className?: string
}

function Checkbox({
  checked = false,
  onCheckedChange,
  disabled = false,
  children,
  className,
}: CheckboxProps) {
  return (
    <label
      className={cn(
        "group flex cursor-default items-center gap-3 select-none",
        disabled && "pointer-events-none opacity-50",
        className,
      )}
    >
      <CheckboxPrimitive.Root
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        className={cn(
          "flex size-4.5 shrink-0 items-center justify-center rounded-[5px] border-2 transition-colors duration-150 outline-none",
          "focus-visible:ring-[3px] focus-visible:ring-ring/50",
          checked
            ? "border-primary bg-primary"
            : "border-on-surface/30 bg-transparent hover:border-on-surface/50",
        )}
      >
        <CheckboxPrimitive.Indicator className="flex items-center justify-center">
          <AnimatePresence>
            {checked && (
              <motion.svg
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
              >
                <motion.path
                  d="M2.5 6.5L5 9L9.5 3.5"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  exit={{ pathLength: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30, delay: 0.05 }}
                />
              </motion.svg>
            )}
          </AnimatePresence>
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
      {children && (
        <span className="text-sm text-on-surface">{children}</span>
      )}
    </label>
  )
}

export { Checkbox }
export type { CheckboxProps }
