import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

export interface TagProps {
  children: ReactNode
  variant?: 'outline' | 'solid' | 'accent'
  /** Renders a toggle <button aria-pressed> instead of a <span> (e.g. filters). */
  onClick?: () => void
  active?: boolean
  className?: string
}

const base =
  'eyebrow inline-flex h-8 items-center gap-2 rounded-pill border px-3.5 whitespace-nowrap transition-colors duration-(--duration-micro)'

const variants = {
  outline: 'border-tone text-muted',
  solid: 'border-transparent bg-tone-surface',
  accent: 'border-transparent bg-orange text-ink',
} as const

export function Tag({ children, variant = 'outline', onClick, active = false, className }: TagProps) {
  if (onClick) {
    return (
      <button
        type="button"
        aria-pressed={active}
        onClick={onClick}
        className={cn(
          base,
          'h-10 px-4',
          active
            ? 'border-transparent bg-(--tone-fg) text-(--tone-bg)'
            : 'border-tone text-muted hover:text-(--tone-fg)',
          className,
        )}
      >
        {children}
      </button>
    )
  }

  return <span className={cn(base, variants[variant], className)}>{children}</span>
}
