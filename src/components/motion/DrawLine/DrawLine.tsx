import { useRef, type ReactNode } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { cn } from '@/lib/cn'
import { gsap, useGSAP } from '@/lib/gsap'
import { drawLine, duration, ease, trigger as triggerTokens } from '@/lib/motion-tokens'

export interface DrawLineProps {
  children: ReactNode
  orientation?: 'horizontal' | 'vertical'
  className?: string
  /**
   * Positions and sizes the line inside the wrapper, e.g. "inset-x-0 top-2 h-0.5 w-full".
   * Give the SVG an explicit width and height: an absolutely positioned SVG otherwise
   * falls back to its viewBox size.
   */
  lineClassName: string
  /**
   * 'scrub' ties the draw to scroll position; 'enter' draws it once as it scrolls into view
   * (use it when a neighbouring section already scrubs).
   */
  trigger?: 'scrub' | 'enter'
  /** ScrollTrigger range the draw is scrubbed across ('scrub' only). */
  start?: string
  end?: string
}

const clamp = gsap.utils.clamp(0, 0.96)

/**
 * A line that draws itself (scrubbed with scroll, or once on enter) and lights up the steps
 * along it.
 * Descendants marked [data-draw-step] fade from dim to full as the line reaches their
 * [data-draw-marker] (or their centre); a [data-draw-fill] inside a step fades in with it.
 * The draw is a clip-path reveal on an SVG line, so only clip-path and opacity animate.
 * Fully drawn and lit with reduced motion.
 */
export function DrawLine({
  children,
  orientation = 'horizontal',
  className,
  lineClassName,
  trigger = 'scrub',
  start = 'top 80%',
  end = 'bottom 40%',
}: DrawLineProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const drawnRef = useRef<SVGSVGElement>(null)
  const reducedMotion = useReducedMotion()
  const horizontal = orientation === 'horizontal'
  const scrub = trigger === 'scrub'

  useGSAP(
    () => {
      const root = rootRef.current
      const drawn = drawnRef.current
      if (reducedMotion || !root || !drawn) return

      const box = drawn.getBoundingClientRect()
      const length = horizontal ? box.width : box.height
      // Scrubbed, the timeline is scroll-relative (0–1); on enter it lasts duration.slow.
      const span = scrub ? 1 : duration.slow
      const fade = scrub ? 0.04 : duration.micro
      const timeline = gsap.timeline({
        defaults: { ease: ease.none },
        onComplete: () => gsap.set(drawn, { willChange: 'auto' }),
        scrollTrigger: scrub
          ? {
              trigger: root,
              start,
              end,
              scrub: true,
              onToggle: ({ isActive }) =>
                gsap.set(drawn, { willChange: isActive ? 'clip-path' : 'auto' }),
            }
          : {
              trigger: root,
              start: triggerTokens.startLate,
              once: true,
              onEnter: () => gsap.set(drawn, { willChange: 'clip-path' }),
            },
      })

      timeline.fromTo(
        drawn,
        { clipPath: horizontal ? 'inset(0% 100% 0% 0%)' : 'inset(0% 0% 100% 0%)' },
        { clipPath: 'inset(0% 0% 0% 0%)', duration: span },
        0,
      )

      for (const step of gsap.utils.toArray<HTMLElement>('[data-draw-step]', root)) {
        const marker = step.querySelector('[data-draw-marker]') ?? step
        const rect = marker.getBoundingClientRect()
        const along = horizontal
          ? rect.left + rect.width / 2 - box.left
          : rect.top + rect.height / 2 - box.top
        const at = clamp(length > 0 ? along / length : 0) * span
        timeline.fromTo(step, { opacity: drawLine.dim }, { opacity: 1, duration: fade }, at)
        const fill = step.querySelector('[data-draw-fill]')
        if (fill) timeline.fromTo(fill, { opacity: 0 }, { opacity: 1, duration: fade }, at)
      }
    },
    {
      scope: rootRef,
      dependencies: [reducedMotion, horizontal, scrub, start, end],
      revertOnUpdate: true,
    },
  )

  const line = (
    <line
      x1="0"
      y1={horizontal ? 1 : 0}
      x2={horizontal ? 100 : 0}
      y2={horizontal ? 1 : 100}
      stroke="currentColor"
      strokeWidth="2"
      vectorEffect="non-scaling-stroke"
    />
  )
  const viewBox = horizontal ? '0 0 100 2' : '0 0 2 100'

  return (
    <div ref={rootRef} className={cn('relative', className)}>
      <svg
        aria-hidden="true"
        viewBox={viewBox}
        preserveAspectRatio="none"
        className={cn('absolute overflow-visible text-(--tone-border)', lineClassName)}
      >
        {line}
      </svg>
      <svg
        ref={drawnRef}
        aria-hidden="true"
        viewBox={viewBox}
        preserveAspectRatio="none"
        className={cn('absolute overflow-visible text-orange', lineClassName)}
      >
        {line}
      </svg>
      {children}
    </div>
  )
}
