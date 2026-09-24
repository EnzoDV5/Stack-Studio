import { useRef, type ReactNode } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { cn } from '@/lib/cn'
import { gsap, useGSAP } from '@/lib/gsap'
import { ease, parallax } from '@/lib/motion-tokens'

export interface ParallaxProps {
  children: ReactNode
  /** Travel as a percentage of the element's height (positive = moves slower than scroll). */
  amount?: number
  className?: string
}

/**
 * Scrubbed vertical drift tied to scroll position. Wrap media in an overflow-hidden parent
 * that is slightly shorter than the child (or scale the child) to avoid gaps. Disabled
 * with reduced motion.
 */
export function Parallax({ children, amount = parallax.amount, className }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()

  useGSAP(
    () => {
      const el = ref.current
      if (reducedMotion || !el) return
      gsap.fromTo(
        el,
        { yPercent: -amount / 2 },
        {
          yPercent: amount / 2,
          ease: ease.none,
          scrollTrigger: {
            trigger: el.parentElement ?? el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        },
      )
    },
    { scope: ref, dependencies: [reducedMotion, amount], revertOnUpdate: true },
  )

  return (
    <div ref={ref} className={cn('will-change-transform', className)}>
      {children}
    </div>
  )
}
