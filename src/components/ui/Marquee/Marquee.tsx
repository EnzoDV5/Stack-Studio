import { useRef, type CSSProperties, type ReactNode } from 'react'
import { useInView } from '@/hooks/useInView'
import { cn } from '@/lib/cn'
import { marquee } from '@/lib/motion-tokens'
import styles from './Marquee.module.css'

export interface MarqueeProps {
  children: ReactNode
  /** Seconds per loop. */
  duration?: number
  reverse?: boolean
  pauseOnHover?: boolean
  paused?: boolean
  gap?: string
  className?: string
  'aria-label'?: string
}

/**
 * Infinite CSS marquee. Content renders twice; the copy is aria-hidden. With reduced
 * motion it becomes a static, wrapped row.
 */
export function Marquee({
  children,
  duration = marquee.loopSeconds,
  reverse = false,
  pauseOnHover = true,
  paused = false,
  gap = '1rem',
  className,
  'aria-label': ariaLabel,
}: MarqueeProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  // Off screen it stands still: a running CSS animation costs a style update every frame.
  const onScreen = useInView(rootRef, { rootMargin: '100px 0px' })
  const style = {
    '--marquee-duration': `${duration}s`,
    '--marquee-gap': gap,
    // Leave unset while running so a parent can pause multiple rows on hover.
    '--marquee-play-state': paused || !onScreen ? 'paused' : undefined,
  } as CSSProperties
  return (
    <div
      ref={rootRef}
      className={cn(
        styles.marquee,
        reverse && styles.reverse,
        pauseOnHover && styles.pausable,
        className,
      )}
      style={style}
      role={ariaLabel ? 'region' : undefined}
      aria-label={ariaLabel}
    >
      <div className={styles.track}>{children}</div>
      <div className={styles.track} aria-hidden="true" inert>
        {children}
      </div>
    </div>
  )
}
