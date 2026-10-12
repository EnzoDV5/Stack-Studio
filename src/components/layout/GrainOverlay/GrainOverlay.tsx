import { useEffect, useRef } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { grain } from '@/lib/motion-tokens'
import styles from './GrainOverlay.module.css'

/**
 * Faint film grain over everything. It jumps between a few offsets on a timer instead of a
 * CSS animation: a running CSS animation costs a style update every frame, even stepped to
 * six changes a second, and this layer is on screen all the time. Still with reduced motion.
 */
export function GrainOverlay() {
  const ref = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    const el = ref.current
    if (!el || reducedMotion) return
    let step = 0
    const id = window.setInterval(
      () => {
        if (document.hidden) return
        step = (step + 1) % grain.offsets.length
        const [x, y] = grain.offsets[step] ?? [0, 0]
        el.style.transform = `translate(${x}vw, ${y}vh)`
      },
      (grain.loopSeconds * 1000) / grain.offsets.length,
    )
    return () => {
      window.clearInterval(id)
      el.style.removeProperty('transform')
    }
  }, [reducedMotion])

  return <div ref={ref} aria-hidden="true" className={styles.grain} />
}
