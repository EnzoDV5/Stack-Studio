import { useRef } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { cn } from '@/lib/cn'
import { formatCountable, parseCountable } from '@/lib/count-up'
import { gsap, useGSAP } from '@/lib/gsap'
import { duration, ease, trigger } from '@/lib/motion-tokens'

export interface CountUpProps {
  /** The final text, e.g. "R 18 000", "+38%" or "2.1s". The first number in it counts up. */
  value: string
  className?: string
  /** ScrollTrigger start. */
  start?: string
}

/**
 * Counts the number in `value` up from zero once, when it scrolls into view. A GSAP tween
 * on a plain object writes the formatted text each frame. The final value reserves the
 * width (no layout shift) and is what screen readers get. Static with reduced motion.
 */
export function CountUp({ value, className, start = trigger.startLate }: CountUpProps) {
  const rootRef = useRef<HTMLSpanElement>(null)
  const numberRef = useRef<HTMLSpanElement>(null)
  const reducedMotion = useReducedMotion()

  useGSAP(
    () => {
      const el = numberRef.current
      const parts = parseCountable(value)
      if (reducedMotion || !el || !parts) return
      const state = { n: 0 }
      const write = () => {
        el.textContent = formatCountable(parts, state.n)
      }
      write()
      gsap.to(state, {
        n: parts.value,
        duration: duration.slow,
        ease: ease.outQuart,
        onUpdate: write,
        scrollTrigger: { trigger: rootRef.current, start, once: true },
      })
      return () => {
        el.textContent = value
      }
    },
    { scope: rootRef, dependencies: [reducedMotion, value, start], revertOnUpdate: true },
  )

  return (
    <span ref={rootRef} className={cn('relative inline-block whitespace-nowrap', className)}>
      <span className="visually-hidden">{value}</span>
      <span aria-hidden="true" className="invisible">
        {value}
      </span>
      <span ref={numberRef} aria-hidden="true" className="absolute inset-y-0 left-0">
        {value}
      </span>
    </span>
  )
}
