import type { ReactNode } from 'react'
import { GridOverlay, type GridFade } from '@/components/layout/GridOverlay'
import { cn } from '@/lib/cn'

export type Tone = 'dark' | 'paper' | 'white' | 'orange'

export interface SectionProps {
  tone?: Tone
  /** Show the grid-line motif, optionally with a fade direction. */
  grid?: boolean | GridFade
  spacing?: 'default' | 'sm' | 'none'
  as?: 'section' | 'div' | 'header' | 'aside'
  /**
   * Keep painting its own background while the page tone flows (ToneController). Use it
   * when the section's own media covers it edge to edge.
   */
  solid?: boolean
  id?: string
  className?: string
  children: ReactNode
  'aria-labelledby'?: string
  'aria-label'?: string
}

const toneClass: Record<Tone, string> = {
  dark: 'tone-dark',
  paper: 'tone-paper',
  white: 'tone-white',
  orange: 'tone-orange',
}

const spacingClass = {
  default: 'py-section',
  sm: 'py-section-sm',
  none: '',
} as const

/**
 * Every section renders inside this: sets tone variables, vertical rhythm and the grid
 * motif. `data-tone` is what ToneController reads to morph the page between sections.
 */
export function Section({
  tone = 'dark',
  grid = false,
  spacing = 'default',
  as: Tag = 'section',
  solid = false,
  id,
  className,
  children,
  ...aria
}: SectionProps) {
  return (
    <Tag
      id={id}
      data-tone={tone}
      data-tone-solid={solid || undefined}
      className={cn('relative isolate', toneClass[tone], spacingClass[spacing], className)}
      {...aria}
    >
      {grid && <GridOverlay fade={grid === true ? 'edges' : grid} className="-z-10" />}
      {children}
    </Tag>
  )
}
