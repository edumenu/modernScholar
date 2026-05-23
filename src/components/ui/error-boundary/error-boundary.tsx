"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";

interface ErrorBoundaryProps {
  /** Children rendered inside the boundary. */
  children: ReactNode;
  /** Optional label shown in the fallback eyebrow. Defaults to "Section unavailable". */
  label?: string;
  /** Optional className applied to the fallback wrapper. */
  className?: string;
  /** Called whenever an error is caught — useful for telemetry / console.error. */
  onError?: (error: Error, info: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  error: Error | null;
}

interface FallbackProps {
  error: Error;
  reset: () => void;
  label: string;
  className?: string;
}

/**
 * Calm, in-flow fallback rendered when a child throws during render. This is a
 * section-level boundary (not a page-level one) — it sits inside the normal
 * page surface and uses tonal surface tokens. No glassmorphism: per
 * SystemDesign.md, glass is reserved for Z-2+ floating elements; section
 * cards always use bg-surface-container-* tiers.
 */
function ErrorBoundaryFallback({
  error,
  reset,
  label,
  className,
}: FallbackProps) {
  return (
    <section
      role="alert"
      aria-live="polite"
      className={cn(
        "mx-auto my-12 flex w-full max-w-2xl flex-col items-center gap-4 rounded-lg bg-surface-container-low px-6 py-10 text-center shadow-md",
        className,
      )}
    >
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-tertiary">
        {label}
      </p>
      <div
        aria-hidden="true"
        className="h-px w-16 bg-secondary"
      />
      <h2 className="font-heading text-xl font-medium tracking-tight text-on-surface md:text-2xl">
        This section didn&apos;t load
      </h2>
      <p className="max-w-md text-sm text-on-surface-variant">
        Something went wrong while rendering this part of the page. The rest of
        the page is still available — you can retry just this section.
      </p>
      {process.env.NODE_ENV === "development" && error.message ? (
        <pre className="mt-2 max-w-full overflow-x-auto rounded bg-surface-container px-3 py-2 text-left text-xs text-on-surface-variant">
          {error.message}
        </pre>
      ) : null}
      <button
        type="button"
        onClick={reset}
        className="group/button relative mt-2 inline-flex shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-transparent bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-neu-primary outline-none transition-all select-none hover:text-white focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 active:translate-y-px"
      >
        <span className="relative z-2 inline-flex items-center gap-2">
          <Icon icon="solar:refresh-linear" width={16} height={16} />
          Try again
        </span>
      </button>
    </section>
  );
}

/**
 * Section-scoped React error boundary. Wraps a region of the page so a render
 * error stays contained instead of bubbling to the route-level `error.tsx`
 * and replacing the entire page. Uses a class component because React only
 * exposes error-boundary lifecycle on class components.
 *
 * Usage:
 *   <ErrorBoundary label="Expires Soon">
 *     <ExpiresSoonScholarships />
 *   </ErrorBoundary>
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // Always log so the error surfaces in the dev overlay / browser console;
    // the production telemetry hook is the caller's responsibility via onError.
    if (process.env.NODE_ENV !== "production") {
      console.error("[ErrorBoundary]", error, info);
    }
    this.props.onError?.(error, info);
  }

  reset = (): void => {
    this.setState({ error: null });
  };

  render(): ReactNode {
    const { error } = this.state;
    const { children, label = "Section unavailable", className } = this.props;

    if (error) {
      return (
        <ErrorBoundaryFallback
          error={error}
          reset={this.reset}
          label={label}
          className={className}
        />
      );
    }

    return children;
  }
}
