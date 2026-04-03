"use client"

import { useTheme } from "next-themes"
import { useCallback, useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "motion/react"
import useSound from "use-sound";

import { Icon } from "@iconify/react"
import { cn } from "@/lib/utils"

function ThemeToggleInner({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme()
  const [playSwitch] = useSound("/sounds/switch-click.mp3", { volume: 0.3 });
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const handleToggle = useCallback(() => {
    playSwitch();
    const nextTheme = resolvedTheme === "dark" ? "light" : "dark";

    if (document.startViewTransition) {
      document.startViewTransition(() => {
        setTheme(nextTheme);
      });
    } else {
      setTheme(nextTheme);
    }
  }, [resolvedTheme, setTheme, playSwitch]);

  if (!mounted) {
    return (
      <div
        className={cn(
          "relative flex h-8 w-16 items-center rounded-full",
          "shadow-[inset_3px_3px_6px_rgba(0,0,0,0.1),inset_-3px_-3px_6px_rgba(255,255,255,0.9)]",
          className
        )}
      />
    )
  }

  const isDark = resolvedTheme === "dark"

  return (
    <button
      type="button"
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      onClick={handleToggle}
      className={cn(
        "relative flex h-8 w-16 cursor-pointer items-center rounded-full p-0.5",
        "shadow-[inset_3px_3px_6px_rgba(0,0,0,0.1),inset_-3px_-3px_6px_rgba(255,255,255,0.9)]",
        "dark:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.3),inset_-3px_-3px_6px_rgba(255,255,255,0.05)]",
        className,
      )}
    >
      {/* Track icons */}
      <span className="absolute inset-0 flex items-center justify-between px-2">
        <Icon
          icon="solar:sun-2-line-duotone"
          className="size-2 lg:size-4 text-on-surface-variant"
        />
        <Icon
          icon="solar:moon-line-duotone"
          className="size-2 lg:size-4 text-on-surface-variant"
        />
      </span>

      {/* Sliding knob */}
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 200, damping: 35 }}
        className={cn(
          "relative z-10 flex size-7 items-center justify-center rounded-full",
          "bg-surface-container-low shadow-[3px_3px_6px_rgba(0,0,0,0.15),-3px_-3px_6px_rgba(255,255,255,0.9)]",
          "dark:bg-surface-container-high dark:shadow-[3px_3px_6px_rgba(0,0,0,0.3),-3px_-3px_6px_rgba(255,255,255,0.05)]",
          isDark ? "ml-auto" : "mr-auto",
        )}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={isDark ? "moon" : "sun"}
            initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.5, rotate: 90 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-center"
          >
            <Icon
              icon={
                isDark ? "solar:moon-line-duotone" : "solar:sun-line-duotone"
              }
              className={cn("size-3 lg:size-3.5", "text-primary")}
            />
          </motion.span>
        </AnimatePresence>
      </motion.span>
    </button>
  );
}

export function ThemeToggle({ className }: { className?: string }) {
  return <ThemeToggleInner className={className} />
}
