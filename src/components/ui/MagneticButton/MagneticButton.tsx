import { useRef } from 'react'
import { Button, type ButtonProps } from '@/components/ui/Button'
import { useIsTouch } from '@/hooks/useIsTouch'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { cn } from '@/lib/cn'
import { gsap, useGSAP } from '@/lib/gsap'
import { magnetic } from '@/lib/motion-tokens'

export type MagneticButtonProps = ButtonProps & {
  /** 0–1: how far the button follows the pointer. */
  strength?: number
  wrapperClassName?: string
}

/**
 * A <Button> that leans toward the pointer and springs back on leave. Desktop fine pointers
 * only. On touch or with reduced motion it's a plain Button.
 */
export function MagneticButton(props: MagneticButtonProps) {
  const { strength = magnetic.strength, wrapperClassName, ...buttonProps } = props
  const zoneRef = useRef<HTMLSpanElement>(null)
  const isTouch = useIsTouch()
  const reducedMotion = useReducedMotion()
  const enabled = !isTouch && !reducedMotion

  useGSAP(
    (_context, contextSafe) => {
      const zone = zoneRef.current
      const target = zone?.firstElementChild as HTMLElement | null
      if (!enabled || !zone || !target || !contextSafe) return

      const label = target.querySelector<HTMLElement>('[data-magnetic-label]')
      const tween = { duration: magnetic.duration, ease: magnetic.ease }
      const moveX = gsap.quickTo(target, 'x', tween)
      const moveY = gsap.quickTo(target, 'y', tween)
      const labelX = label ? gsap.quickTo(label, 'x', tween) : null
      const labelY = label ? gsap.quickTo(label, 'y', tween) : null

      const onMove = contextSafe((event: PointerEvent) => {
        const rect = zone.getBoundingClientRect()
        const dx = event.clientX - (rect.left + rect.width / 2)
        const dy = event.clientY - (rect.top + rect.height / 2)
        moveX(dx * strength)
        moveY(dy * strength)
        labelX?.(dx * magnetic.labelStrength)
        labelY?.(dy * magnetic.labelStrength)
      })

      const onLeave = contextSafe(() => {
        gsap.to([target, label].filter(Boolean), {
          x: 0,
          y: 0,
          duration: magnetic.releaseDuration,
          ease: magnetic.release,
          overwrite: true,
        })
      })

      zone.addEventListener('pointermove', onMove)
      zone.addEventListener('pointerleave', onLeave)
      return () => {
        zone.removeEventListener('pointermove', onMove)
        zone.removeEventListener('pointerleave', onLeave)
      }
    },
    { scope: zoneRef, dependencies: [enabled, strength], revertOnUpdate: true },
  )

  return (
    <span ref={zoneRef} className={cn('-m-4 inline-flex p-4', wrapperClassName)}>
      <Button {...(buttonProps as ButtonProps)} />
    </span>
  )
}
