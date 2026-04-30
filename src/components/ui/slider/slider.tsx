"use client"

import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

interface SliderProps extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  thumbLabels?: string[]
}

function Slider({ className, thumbLabels, ref, ...props }: SliderProps & { ref?: React.Ref<React.ComponentRef<typeof SliderPrimitive.Root>> }) {
  const thumbCount = props.value?.length ?? props.defaultValue?.length ?? 1

  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn(
        "relative flex w-full touch-none select-none items-center data-disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-on-surface/10">
        <SliderPrimitive.Range className="absolute h-full bg-primary" />
      </SliderPrimitive.Track>
      {Array.from({ length: thumbCount }, (_, index) => (
        <SliderPrimitive.Thumb
          key={index}
          aria-label={thumbLabels?.[index]}
          className="block size-5 rounded-full border-2 border-primary bg-white shadow-sm transition-colors focus-visible:outline-[3px] focus-visible:outline-ring/40 data-disabled:cursor-not-allowed"
        />
      ))}
    </SliderPrimitive.Root>
  )
}

Slider.displayName = "Slider"

export { Slider }
export type { SliderProps }
