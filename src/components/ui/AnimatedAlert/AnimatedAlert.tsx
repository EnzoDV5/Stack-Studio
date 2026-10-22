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
}: {
  children: ReactNode
  id?: string
  className?: string
  announce?: boolean
}) {
  const rootRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()
  useGSAP(
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

  return (
    <div ref={rootRef} id={id} role={announce ? 'alert' : undefined} className={className}>
      {children}
    </div>
  )
}
