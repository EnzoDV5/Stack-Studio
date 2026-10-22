import { useRef, type ReactNode } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { gsap, useGSAP } from '@/lib/gsap'
import { distance, duration, ease } from '@/lib/motion-tokens'

/** Inline errors settle into place while the persistent popup remains visible above the page. */
export function AnimatedAlert({
  children,
  id,
  className,
  announce = true,
  onDismiss,
  dismissLabel,
}: {
  children: ReactNode
  id?: string
  className?: string
  announce?: boolean
  onDismiss?: () => void
  dismissLabel?: string
}) {
  const rootRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()
  const { contextSafe } = useGSAP(
    () => {
      if (reducedMotion) return
      gsap.from(rootRef.current, {
        opacity: 0,
        y: distance.small,
        duration: duration.fast,
        ease: ease.out,
      })
    },
    { scope: rootRef, dependencies: [reducedMotion], revertOnUpdate: true },
  )

  const dismiss = () => {
    if (!onDismiss) return
    if (reducedMotion) {
      onDismiss()
      return
    }
    gsap.to(rootRef.current, {
      opacity: 0,
      y: -distance.small / 2,
      duration: duration.micro,
      ease: ease.in,
      overwrite: true,
      onComplete: onDismiss,
    })
  }

  return (
    <div ref={rootRef} id={id} role={announce ? 'alert' : undefined} className={className}>
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">{children}</div>
        {onDismiss && (
          <button
            type="button"
            onClick={() => contextSafe(dismiss)()}
            aria-label={dismissLabel}
            className="-m-2 grid size-11 shrink-0 place-items-center rounded-md text-muted transition-colors duration-(--duration-micro) hover:text-paper"
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
        )}
      </div>
    </div>
  )
}
