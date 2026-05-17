"use client"

import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { Icon } from "@iconify/react"

import { cn } from "@/lib/utils"

const baseInputClass =
  "h-9 w-full min-w-0 rounded-md border border-outline-variant/20 bg-surface-container px-3 py-1 text-base text-on-surface transition-colors outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-on-surface-variant/50 focus-visible:border-secondary focus-visible:ring-[3px] focus-visible:ring-secondary/30 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/20 md:text-sm dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40";

function Input({
  className,
  type,
  ref,
  ...props
}: React.ComponentProps<"input">) {
  if (type === "search") {
    return (
      <SearchInput ref={ref} className={className} {...props} />
    )
  }

  return (
    <InputPrimitive
      ref={ref}
      type={type}
      data-slot="input"
      className={cn(baseInputClass, className)}
      {...props}
    />
  )
}

function SearchInput({
  className,
  value,
  onChange,
  ref,
  ...props
}: Omit<React.ComponentProps<"input">, "type">) {
  const localRef = React.useRef<HTMLInputElement>(null)
  const setRefs = React.useCallback(
    (node: HTMLInputElement | null) => {
      localRef.current = node
      if (typeof ref === "function") ref(node)
      else if (ref) (ref as React.RefObject<HTMLInputElement | null>).current = node
    },
    [ref],
  )

  const hasValue = typeof value === "string" && value.length > 0

  const handleClear = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    const input = localRef.current
    onChange?.({
      target: { value: "" },
      currentTarget: input,
    } as unknown as React.ChangeEvent<HTMLInputElement>)
    input?.focus()
  }

  return (
    <span data-slot="input-search" className="relative inline-flex w-full items-center">
      <InputPrimitive
        ref={setRefs}
        type="search"
        value={value}
        onChange={onChange}
        data-slot="input"
        className={cn(
          baseInputClass,
          "[&::-webkit-search-cancel-button]:appearance-none",
          "placeholder:transition-[font-size] placeholder:duration-200 placeholder:ease-out",
          "focus:placeholder:text-[10px]",
          hasValue && "pr-7",
          className,
        )}
        {...props}
      />
      {hasValue && (
        <button
          type="button"
          tabIndex={-1}
          aria-label="Clear search"
          onClick={handleClear}
          className="absolute right-1.5 inline-flex shrink-0 items-center justify-center rounded-full p-0.5 text-on-surface/60 transition-colors hover:text-primary"
        >
          <Icon icon="solar:close-circle-linear" className="size-4" />
        </button>
      )}
    </span>
  )
}

export { Input }
