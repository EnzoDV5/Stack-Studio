import { useRef, type ElementType, type ReactNode } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { gsap, useGSAP } from '@/lib/gsap'
import { distance, duration, ease, trigger } from '@/lib/motion-tokens'

export interface FadeUpProps {
  children: ReactNode
  as?: ElementType
  className?: string
  delay?: number
  /** ScrollTrigger start, e.g. 'top 85%'. */
  start?: string
}

/** Fades and rises a block into place once, on scroll. Static with reduced motion. */
export function FadeUp({
  children,
  as: Tag = 'div',
  className,
  delay = 0,
  start = trigger.start,
}: FadeUpProps) {
  const ref = useRef<HTMLElement>(null)
  const reducedMotion = useReducedMotion()

  useGSAP(
    () => {
      if (reducedMotion || !ref.current) return
      gsap.from(ref.current, {
        y: distance.rise,
        autoAlpha: 0,
        duration: duration.base,
        ease: ease.out,
        delay,
        scrollTrigger: { trigger: ref.current, start, once: true },
      })
    },
    { scope: ref, dependencies: [reducedMotion, delay, start], revertOnUpdate: true },
  )

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  )
}
