import { useRef, type ReactNode } from 'react'
import { useIsTouch } from '@/hooks/useIsTouch'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { cn } from '@/lib/cn'
import { gsap, useGSAP } from '@/lib/gsap'
import { duration, ease, parallax } from '@/lib/motion-tokens'

export interface ParallaxProps {
  children: ReactNode
  /** Travel as a percentage of the element's size (positive = moves slower than scroll). */
  amount?: number
  /**
   * 'scroll' drifts vertically with scroll position (scrubbed). 'pointer' drifts toward the
   * pointer while it's over the nearest [data-parallax-area] (or the frame), for sections
   * whose neighbours already scrub. Pointer mode needs headroom on every side.
   */
  trigger?: 'scroll' | 'pointer'
  className?: string
}

/**
 * Gentle drift inside a frame. Place it absolutely inside an overflow-hidden frame and make
 * it larger than the frame (offset with top/inset, not a translate utility) so the drift
 * never shows an edge. will-change is only on while it moves. Disabled with reduced
 * motion; pointer mode also needs a fine hover pointer.
 */
export function Parallax({
  children,
  amount = parallax.amount,
  trigger = 'scroll',
  className,
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()
  const isTouch = useIsTouch()

  useGSAP(
    () => {
      const el = ref.current
      if (reducedMotion || !el) return

      if (trigger === 'scroll') {
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
              onToggle: ({ isActive }) =>
                gsap.set(el, { willChange: isActive ? 'transform' : 'auto' }),
            },
          },
        )
        return
      }

      if (isTouch) return
      const area = el.closest<HTMLElement>('[data-parallax-area]') ?? el.parentElement ?? el
      const tween = { duration: duration.slow, ease: ease.out }
      const toX = gsap.quickTo(el, 'xPercent', tween)
      const toY = gsap.quickTo(el, 'yPercent', tween)
      const onMove = (event: PointerEvent) => {
        const box = area.getBoundingClientRect()
        const dx = (event.clientX - box.left) / box.width - 0.5
        const dy = (event.clientY - box.top) / box.height - 0.5
        gsap.set(el, { willChange: 'transform' })
        toX(dx * amount)
        toY(dy * amount)
      }
      const onLeave = () => {
        toX(0)
        toY(0)
        gsap.delayedCall(duration.slow, () => gsap.set(el, { willChange: 'auto' }))
      }
      area.addEventListener('pointermove', onMove)
      area.addEventListener('pointerleave', onLeave)
      return () => {
        area.removeEventListener('pointermove', onMove)
        area.removeEventListener('pointerleave', onLeave)
      }
    },
    { scope: ref, dependencies: [reducedMotion, isTouch, amount, trigger], revertOnUpdate: true },
  )

  return (
    <div ref={ref} className={cn(className)}>
      {children}
    </div>
  )
}
