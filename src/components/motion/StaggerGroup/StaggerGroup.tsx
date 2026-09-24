import { useRef, type ElementType, type ReactNode } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { gsap, useGSAP } from '@/lib/gsap'
import { distance, duration, ease, stagger as staggerTokens, trigger } from '@/lib/motion-tokens'

export interface StaggerGroupProps {
  children: ReactNode
  as?: ElementType
  className?: string
  /** Which descendants animate. Defaults to direct children. */
  selector?: string
  stagger?: number
  start?: string
}

/**
 * Staggered rise-in for a group (cards, list rows, logos). Direct children by default, or
 * mark specific items with data-stagger and pass selector="[data-stagger]".
 */
export function StaggerGroup({
  children,
  as: Tag = 'div',
  className,
  selector = ':scope > *',
  stagger = staggerTokens.base,
  start = trigger.start,
}: StaggerGroupProps) {
  const ref = useRef<HTMLElement>(null)
  const reducedMotion = useReducedMotion()

  useGSAP(
    () => {
      const el = ref.current
      if (reducedMotion || !el) return
      const items = el.querySelectorAll(selector)
      if (!items.length) return
      gsap.from(items, {
        y: distance.rise,
        autoAlpha: 0,
        duration: duration.base,
        ease: ease.out,
        stagger,
        scrollTrigger: { trigger: el, start, once: true },
      })
    },
    { scope: ref, dependencies: [reducedMotion, selector, stagger, start], revertOnUpdate: true },
  )

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  )
}
