"use client"

import { useCallback, useEffect, useLayoutEffect, useRef } from "react"
import { AnimatePresence, motion } from "motion/react"
import { Icon } from "@iconify/react"
import { cn } from "@/lib/utils"
import { useFocusTrap } from "@/hooks/use-focus-trap"
import { useScrollLock } from "@/hooks/use-scroll-lock"
import { Button } from "@/components/ui/button/button"
import {
  CLASSIFICATION_COLORS,
  getClassificationTint,
  type Scholarship,
} from "@/data/scholarships"
import { getExpiredBadge } from "@/lib/expired-status";
import { SESSION_DATE } from "@/lib/session-date";

interface ExpandedScholarshipProps {
  scholarship: Scholarship | null
  onClose: () => void
}

interface ExpandedScholarshipContentProps {
  scholarship: Scholarship;
  onClose: () => void;
}

function ExpandedScholarshipContent({
  scholarship,
  onClose,
}: ExpandedScholarshipContentProps) {
  const overlayTint = getClassificationTint(scholarship.classification);
  const { isExpired: expired, label: reopenLabel } = getExpiredBadge(
    scholarship,
    SESSION_DATE,
  );
  // When the scholarship is expired and we have a reopen label, suppress the
  // raw "Opens" line — the closure copy already covers the same information
  // in clearer language.
  const showOpensLine =
    Boolean(scholarship.openDate) && !(expired && reopenLabel);

  return (
    <>
      {/* Tinted header zone */}
      <div
        className={cn(
          "relative w-full shrink-0 px-8 pb-4 pt-6 md:px-12 md:pt-8 md:pb-5",
          overlayTint.bg,
        )}
      >
        <button
          type="button"
          onClick={onClose}
          className={cn(
            "absolute right-6 top-6 z-10 flex size-10 items-center justify-center rounded-full transition-colors",
            "hover:bg-on-surface/10",
            overlayTint.text,
          )}
          aria-label="Close"
        >
          <Icon
            icon="solar:close-circle-linear"
            className="size-8 cursor-pointer"
          />
        </button>

        <div className="flex flex-col gap-4">
          {/* Education level badges */}
          <div className="flex flex-wrap items-center gap-2">
            {scholarship.classification.map((level) => {
              const colors = CLASSIFICATION_COLORS[level];
              return (
                <span
                  key={level}
                  className={cn(
                    "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
                    colors.bg,
                    colors.text,
                  )}
                >
                  {level}
                </span>
              );
            })}
          </div>

          <h2
            id="expanded-dialog-title"
            className={cn(
              "font-heading text-2xl font-bold leading-tight md:text-3xl lg:text-4xl",
              overlayTint.text,
            )}
          >
            {scholarship.name}
          </h2>

          {/* Gradient-fade underline */}
          <div
            className={cn(
              "h-px w-2/3 bg-linear-to-r to-transparent",
              overlayTint.accent,
            )}
            aria-hidden="true"
          />

          <p
            className={cn(
              "text-base font-medium md:text-lg",
              overlayTint.muted,
            )}
          >
            {scholarship.provider}
          </p>

          {/* Amount + deadline */}
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Icon
                icon="solar:money-bag-linear"
                className={cn("size-5", overlayTint.muted)}
              />
              <span
                className={cn(
                  "font-heading text-2xl font-bold",
                  overlayTint.text,
                )}
              >
                {scholarship.awardAmount}
              </span>
            </span>
            <span
              className={cn(
                "flex items-center gap-1.5 text-sm",
                overlayTint.muted,
              )}
            >
              <Icon icon="solar:calendar-linear" className="size-4" />
              Deadline: {scholarship.deadline}, {scholarship.deadlineYear}
            </span>
            {showOpensLine && (
              <span
                className={cn(
                  "flex items-center gap-1.5 text-sm",
                  overlayTint.muted,
                )}
              >
                <Icon icon="solar:calendar-mark-linear" className="size-4" />
                Opens: {scholarship.openDate}
              </span>
            )}
          </div>

          {expired && reopenLabel && (
            <p
              className="flex items-center gap-1.5 text-md font-semibold text-on-surface-variant"
              role="status"
            >
              <Icon
                icon="solar:clock-circle-linear"
                className="size-4 shrink-0"
              />
              <span>This scholarship has closed. {reopenLabel}.</span>
            </p>
          )}
        </div>
      </div>

      {/* Content body */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className="flex shrink flex-col gap-4 overflow-y-auto bg-white p-4 dark:bg-surface-container-low md:px-12"
      >
        {scholarship.description && (
          <p className="text-sm leading-relaxed text-on-surface/70 md:text-base">
            {scholarship.description}
          </p>
        )}

        {/* Eligibility */}
        {scholarship.eligibility && (
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-medium text-on-surface/90">
              Eligibility
            </h3>
            <p className="max-h-40 overflow-y-auto text-sm leading-relaxed text-on-surface/70 whitespace-pre-line">
              {scholarship.eligibility}
            </p>
          </div>
        )}

        {/* CTA row */}
        <div className="flex items-center gap-3 border-t border-outline-variant/30 pt-4 dark:border-white/10">
          <Button
            size="default"
            className="flex-1 sm:flex-none"
            nativeButton={false}
            render={
              <a
                href={scholarship.link}
                target="_blank"
                rel="noopener noreferrer"
              />
            }
          >
            {expired ? "View Details" : "Apply Now"}
            <Icon icon="solar:arrow-right-up-linear" data-icon="inline-end" />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            aria-label="Share scholarship"
          >
            <Icon icon="solar:share-linear" className="size-4" />
          </Button>
        </div>
      </motion.div>
    </>
  );
}

export function ExpandedScholarship({
  scholarship,
  onClose,
}: ExpandedScholarshipProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    if (scholarship !== null && previousFocusRef.current === null) {
      const active =
        typeof document !== "undefined"
          ? (document.activeElement as HTMLElement | null)
          : null;
      previousFocusRef.current = active;
    }
  }, [scholarship]);

  const restorePreviousFocus = useCallback(() => {
    const target = previousFocusRef.current;
    if (target && typeof target.focus === "function") {
      target.focus();
    }
    previousFocusRef.current = null;
  }, []);

  useScrollLock(scholarship !== null);

  useFocusTrap(dialogRef, scholarship !== null);

  useEffect(() => {
    if (scholarship === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [scholarship, onClose]);

  return (
    <AnimatePresence onExitComplete={restorePreviousFocus}>
      {scholarship && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.div
            key="modal-wrapper"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
            onClick={onClose}
          >
            <motion.div
              ref={dialogRef}
              data-modal-content
              role="dialog"
              aria-modal="true"
              aria-labelledby="expanded-dialog-title"
              onClick={(e) => e.stopPropagation()}
              layoutId={`card-${scholarship.id}`}
              className={cn(
                "relative flex w-full max-w-3xl flex-col overflow-hidden rounded-3xl",
                "bg-white shadow-xl dark:bg-surface-container-low dark:shadow-2xl",
                "max-h-[85vh]",
              )}
            >
              <ExpandedScholarshipContent
                scholarship={scholarship}
                onClose={onClose}
              />
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
