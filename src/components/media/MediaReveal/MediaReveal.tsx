import { useRef, type ReactNode } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { cn } from '@/lib/cn'
import { gsap, useGSAP } from '@/lib/gsap'
import { duration, ease, trigger } from '@/lib/motion-tokens'

export interface MediaRevealProps {
  children: ReactNode
  /** Direction the mask opens from. */
  from?: 'bottom' | 'left'
  delay?: number
  className?: string
}

const hidden = {
  bottom: 'inset(100% 0% 0% 0%)',
  left: 'inset(0% 100% 0% 0%)',
} as const

/**
 * Signature media entrance: a clip-path mask opens while the image inside settles from a
 * slight zoom. Plays once on scroll. With reduced motion it renders plain.
 */
export function MediaReveal({ children, from = 'bottom', delay = 0, className }: MediaRevealProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()

  useGSAP(
    () => {
      if (reducedMotion || !rootRef.current || !innerRef.current) return
      const tl = gsap.timeline({
        delay,
        scrollTrigger: { trigger: rootRef.current, start: trigger.start, once: true },
      })
      tl.fromTo(
        rootRef.current,
        { clipPath: hidden[from] },
        { clipPath: 'inset(0% 0% 0% 0%)', duration: duration.slow, ease: ease.inOut },
      ).from(innerRef.current, { scale: 1.18, duration: duration.slow * 1.4, ease: ease.out }, 0)
    },
    { scope: rootRef, dependencies: [reducedMotion, from, delay], revertOnUpdate: true },
  )

  return (
    <div ref={rootRef} className={cn('relative overflow-hidden', className)}>
      <div ref={innerRef} className="size-full">
        {children}
      </div>
    </div>
  )
}
