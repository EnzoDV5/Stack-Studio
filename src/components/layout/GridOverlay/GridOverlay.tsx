import { cn } from '@/lib/cn'
import styles from './GridOverlay.module.css'

export type GridFade = 'none' | 'radial' | 'top' | 'bottom' | 'edges'

export interface GridOverlayProps {
  fade?: GridFade
  className?: string
}

const fadeClass: Record<GridFade, string | undefined> = {
  none: undefined,
  radial: styles.fadeRadial,
  top: styles.fadeTop,
  bottom: styles.fadeBottom,
  edges: styles.fadeEdges,
}

/** The subtle square grid-line motif. Line colour follows the section tone (--grid-line). */
export function GridOverlay({ fade = 'edges', className }: GridOverlayProps) {
  return <div aria-hidden="true" className={cn(styles.grid, 'bg-grid', fadeClass[fade], className)} />
}
