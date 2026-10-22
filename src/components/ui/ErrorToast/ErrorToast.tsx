import { useRef } from 'react'
import { createPortal } from 'react-dom'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { gsap, useGSAP } from '@/lib/gsap'
import { distance, duration, ease } from '@/lib/motion-tokens'

export interface ErrorToastProps {
  open: boolean
  title: string
  body: string
  label: string
  dismissLabel: string
  onDismiss: () => void
  onExited: () => void
}

/** Persistent, non-modal feedback: announces the failure without taking focus from the form. */
export function ErrorToast({
  open,
  title,
  body,
  label,
  dismissLabel,
  onDismiss,
  onExited,
}: ErrorToastProps) {
  const rootRef = useRef<HTMLElement>(null)
  const reducedMotion = useReducedMotion()
  const onExitedRef = useRef(onExited)
  // The exit callback can change while the toast stays mounted.
  useGSAP(
    () => {
      onExitedRef.current = onExited
    },
    { dependencies: [onExited] },
  )

  useGSAP(
    () => {
      const root = rootRef.current
      if (!root) return
      if (reducedMotion) {
        gsap.set(root, { opacity: open ? 1 : 0, y: 0 })
        if (!open) onExitedRef.current()
      } else if (open) {
        gsap.fromTo(
          root,
          { opacity: 0, y: -distance.small },
          { opacity: 1, y: 0, duration: duration.fast, ease: ease.out },
        )
      } else {
        gsap.to(root, {
          opacity: 0,
          y: -distance.small / 2,
          duration: duration.micro,
          ease: ease.in,
          onComplete: () => onExitedRef.current(),
        })
      }
    },
    { scope: rootRef, dependencies: [open, reducedMotion], revertOnUpdate: true },
  )

  return createPortal(
    <aside
      ref={rootRef}
      aria-label={label}
      data-error-toast=""
      className="fixed inset-x-(--spacing-gutter) top-[calc(var(--spacing-header)+1rem+env(safe-area-inset-top))] z-[100] mx-auto flex max-w-lg items-start gap-4 rounded-lg border border-error/60 bg-ink-800 p-5 text-paper shadow-xl shadow-ink/60"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        className="mt-0.5 size-6 shrink-0 text-error"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v6m0 3v1" />
      </svg>
      <div role="alert" aria-atomic="true" className="min-w-0 flex-1 wrap-anywhere">
        <p className="font-semibold">{title}</p>
        <p className="mt-2 text-small text-grey-300">{body}</p>
      </div>
      <button
        type="button"
        onClick={onDismiss}
        aria-label={dismissLabel}
        className="-m-2 grid size-11 shrink-0 place-items-center rounded-md text-grey-300 transition-colors duration-(--duration-micro) hover:bg-ink-700 hover:text-paper"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          className="size-5"
          aria-hidden="true"
        >
          <path d="m6 6 12 12M18 6 6 18" />
        </svg>
      </button>
    </aside>,
    document.body,
  )
}
