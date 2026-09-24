import { useRef } from 'react'
import { useIsTouch } from '@/hooks/useIsTouch'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { cn } from '@/lib/cn'
import { gsap, useGSAP } from '@/lib/gsap'
import { cursor as cursorTokens, duration } from '@/lib/motion-tokens'
import styles from './Cursor.module.css'

const INTERACTIVE = 'a, button, [role="button"], label, summary, [data-cursor]'

function CursorInner() {
  const rootRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)

  useGSAP(
    () => {
      const root = rootRef.current
      const ring = ringRef.current
      const dot = dotRef.current
      const label = labelRef.current
      if (!root || !ring || !dot || !label) return

      document.documentElement.classList.add('has-custom-cursor')

      const ringX = gsap.quickTo(ring, 'x', { duration: cursorTokens.follow, ease: cursorTokens.followEase })
      const ringY = gsap.quickTo(ring, 'y', { duration: cursorTokens.follow, ease: cursorTokens.followEase })
      const dotX = gsap.quickTo(dot, 'x', { duration: duration.micro / 2, ease: 'none' })
      const dotY = gsap.quickTo(dot, 'y', { duration: duration.micro / 2, ease: 'none' })

      const setState = (state: 'none' | 'hover' | 'labelled' | 'magnetic', text = '') => {
        root.classList.toggle(styles.hover ?? '', state === 'hover')
        root.classList.toggle(styles.labelled ?? '', state === 'labelled')
        root.classList.toggle(styles.magnetic ?? '', state === 'magnetic')
        label.textContent = text
      }

      const onMove = (event: PointerEvent) => {
        if (event.pointerType !== 'mouse') return
        root.classList.add(styles.visible ?? '')
        ringX(event.clientX)
        ringY(event.clientY)
        dotX(event.clientX)
        dotY(event.clientY)
      }

      const onOver = (event: PointerEvent) => {
        const target = (event.target as Element | null)?.closest<HTMLElement>(INTERACTIVE)
        if (!target) return setState('none')
        const text = target.dataset.cursorLabel
        if (text) return setState('labelled', text)
        if (target.dataset.cursor === 'magnetic') return setState('magnetic')
        setState('hover')
      }

      const onLeaveWindow = () => root.classList.remove(styles.visible ?? '')
      const onDown = () => root.classList.add(styles.pressed ?? '')
      const onUp = () => root.classList.remove(styles.pressed ?? '')

      window.addEventListener('pointermove', onMove, { passive: true })
      document.addEventListener('pointerover', onOver, { passive: true })
      document.documentElement.addEventListener('pointerleave', onLeaveWindow)
      window.addEventListener('pointerdown', onDown)
      window.addEventListener('pointerup', onUp)

      return () => {
        document.documentElement.classList.remove('has-custom-cursor')
        window.removeEventListener('pointermove', onMove)
        document.removeEventListener('pointerover', onOver)
        document.documentElement.removeEventListener('pointerleave', onLeaveWindow)
        window.removeEventListener('pointerdown', onDown)
        window.removeEventListener('pointerup', onUp)
      }
    },
    { scope: rootRef },
  )

  return (
    <div ref={rootRef} className={cn(styles.cursor)} aria-hidden="true">
      <div ref={ringRef} className={styles.ring}>
        <span ref={labelRef} className={styles.label} />
      </div>
      <div ref={dotRef} className={styles.dot} />
    </div>
  )
}

/**
 * Custom cursor: a dot plus a trailing ring that grows over links and shows a label over
 * [data-cursor-label] elements. Desktop fine pointers only, and off with reduced motion.
 */
export function Cursor() {
  const isTouch = useIsTouch()
  const reducedMotion = useReducedMotion()
  if (isTouch || reducedMotion) return null
  return <CursorInner />
}
