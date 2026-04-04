"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { Icon } from "@iconify/react"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: (
          <Icon icon="solar:check-circle-line-duotone" className="size-4" />
        ),
        info: (
          <Icon icon="solar:info-circle-line-duotone" className="size-4" />
        ),
        warning: (
          <Icon icon="solar:danger-triangle-line-duotone" className="size-4" />
        ),
        error: (
          <Icon icon="solar:shield-warning-line-duotone" className="size-4" />
        ),
        loading: (
          <Icon icon="solar:refresh-circle-line-duotone" className="size-4 animate-spin" />
        ),
      }}
      style={
        {
          "--normal-bg": "var(--surface-container-highest)",
          "--normal-text": "var(--on-surface)",
          "--normal-border": "rgba(219, 193, 188, 0.15)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast glass-heavy",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
