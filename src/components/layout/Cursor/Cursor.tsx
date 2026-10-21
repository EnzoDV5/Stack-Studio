import { useRef } from 'react'
import { useIsTouch } from '@/hooks/useIsTouch'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { gsap, useGSAP } from '@/lib/gsap'
import { cursor as cursorTokens, duration, ease } from '@/lib/motion-tokens'
import styles from './Cursor.module.css'

const LABELLED = '[data-cursor-label]'

/** The tilted Stack mark from scripts/cursor/render.mjs (32px box, tip at the hotspot). */
const MARK = {
  chevron: 'M3.9 2.5L27.04 16.45L20.98 19.67L9.35 12.75L8.56 26.28L2.5 29.5Z',
  triangle: 'M11.31 16.44L18.76 20.85L10.8 25.09Z',
  hotspot: [4, 3],
  /** The tilt the render applies; the mark rights itself as it morphs away. */
  tilt: 28,
} as const

function CursorInner() {
  const rootRef = useRef<HTMLDivElement>(null)
  const markRef = useRef<SVGSVGElement>(null)
  const bubbleRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)

  useGSAP(
    () => {
      const root = rootRef.current
      const mark = markRef.current
      const bubble = bubbleRef.current
      const label = labelRef.current
      if (!root || !mark || !bubble || !label) return

      document.documentElement.classList.add('has-cursor-bubble')

      const xTo = gsap.quickTo(root, 'x', {
        duration: cursorTokens.follow,
        ease: cursorTokens.followEase,
      })
      const yTo = gsap.quickTo(root, 'y', {
        duration: cursorTokens.follow,
        ease: cursorTokens.followEase,
      })

      // The mark shrinks into the hotspot as the bubble grows out of it. Enter and leave are
      // separate ease-out tweens: reversing an ease-out starts on its slow tail, which reads
      // as a delay before the bubble lets go.
      const [hx, hy] = MARK.hotspot
      const visible = styles.visible ?? ''
      gsap.set(mark, { transformOrigin: `${hx}px ${hy}px` })
      gsap.set(bubble, { scale: 0, opacity: 0 })
      gsap.set(label, { opacity: 0 })

      let active = false

      const activate = (event: PointerEvent, text: string) => {
        label.textContent = text
        if (active) return
        active = true
        if (!root.classList.contains(visible)) {
          // Jump to the pointer so the mark sits exactly where the system cursor was.
          xTo(event.clientX, event.clientX)
          yTo(event.clientY, event.clientY)
          gsap.set(mark, { scale: 1, rotate: 0, opacity: 1 })
          gsap.set(bubble, { scale: 0.15, opacity: 0 })
          root.classList.add(visible)
        }
        gsap.to(mark, {
          scale: 0,
          rotate: MARK.tilt,
          opacity: 0,
          duration: duration.micro,
          ease: ease.out,
          overwrite: 'auto',
        })
        gsap.to(bubble, {
          scale: 1,
          opacity: 1,
          duration: duration.fast,
          ease: ease.out,
          overwrite: 'auto',
        })
        gsap.to(label, {
          opacity: 1,
          duration: duration.micro,
          delay: duration.micro / 2,
          overwrite: 'auto',
        })
      }

      // The system cursor is back the moment the pointer leaves the card, so the bubble
      // starts shrinking into the pointer straight away instead of handing back to the mark.
      const deactivate = () => {
        if (!active) return
        active = false
        gsap.to(label, { opacity: 0, duration: duration.micro / 2, overwrite: 'auto' })
        gsap.to(bubble, {
          scale: 0,
          opacity: 0,
          duration: duration.micro,
          ease: ease.outQuart,
          overwrite: 'auto',
          onComplete: () => root.classList.remove(visible),
        })
      }

      const onMove = (event: PointerEvent) => {
        if (event.pointerType !== 'mouse') return
        // Glide while the bubble is on screen (shrinking away too), jump while it's hidden.
        if (root.classList.contains(visible)) {
          xTo(event.clientX)
          yTo(event.clientY)
        } else {
          xTo(event.clientX, event.clientX)
          yTo(event.clientY, event.clientY)
        }
      }

      const onOver = (event: PointerEvent) => {
        if (event.pointerType !== 'mouse') return
        const target = (event.target as Element | null)?.closest<HTMLElement>(LABELLED)
        const text = target?.dataset.cursorLabel
        if (text) activate(event, text)
        else deactivate()
      }

      window.addEventListener('pointermove', onMove, { passive: true })
      document.addEventListener('pointerover', onOver, { passive: true })
      document.documentElement.addEventListener('pointerleave', deactivate)

      return () => {
        document.documentElement.classList.remove('has-cursor-bubble')
        window.removeEventListener('pointermove', onMove)
        document.removeEventListener('pointerover', onOver)
        document.documentElement.removeEventListener('pointerleave', deactivate)
      }
    },
    { scope: rootRef },
  )

  return (
    <div ref={rootRef} className={styles.cursor} aria-hidden="true">
      <div ref={bubbleRef} className={styles.bubble}>
        <span ref={labelRef} className={styles.label} />
      </div>
      <svg
        ref={markRef}
        className={styles.mark}
        width="32"
        height="32"
        viewBox="0 0 32 32"
        style={{ left: -MARK.hotspot[0], top: -MARK.hotspot[1] }}
      >
        <path className={styles.chevron} d={MARK.chevron} />
        <path d={MARK.triangle} />
      </svg>
    </div>
  )
}

/**
 * The system cursor is the Stack mark (CSS, public/cursor). Over [data-cursor-label]
 * elements (project cards) this takes over: the mark morphs into an orange bubble with the
 * label. Desktop fine pointers only, and off with reduced motion.
 */
export function Cursor() {
  const isTouch = useIsTouch()
  const reducedMotion = useReducedMotion()
  if (isTouch || reducedMotion) return null
  return <CursorInner />
}
