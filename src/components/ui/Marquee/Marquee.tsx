import type { CSSProperties, ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { marquee } from '@/lib/motion-tokens'
import styles from './Marquee.module.css'

export interface MarqueeProps {
  children: ReactNode
  /** Seconds per loop. */
  duration?: number
  reverse?: boolean
  pauseOnHover?: boolean
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
  gap = '1rem',
  className,
  'aria-label': ariaLabel,
}: MarqueeProps) {
  const style = { '--marquee-duration': `${duration}s`, '--marquee-gap': gap } as CSSProperties
  return (
    <div
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
