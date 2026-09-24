import type { ElementType } from 'react'
import { cn } from '@/lib/cn'
import { pad2 } from '@/lib/format'

export interface EyebrowProps {
  label: string
  /** Section number, rendered as "01 · LABEL". */
  index?: number
  as?: ElementType
  /** Show the small orange square before the label. */
  marker?: boolean
  className?: string
}

/** Mono, uppercase, letter-spaced section label, e.g. "01 · WORK". */
export function Eyebrow({ label, index, as: Tag = 'p', marker = true, className }: EyebrowProps) {
  return (
    <Tag className={cn('eyebrow flex items-center gap-3 text-muted', className)}>
      {marker && <span aria-hidden="true" className="size-1.5 shrink-0 bg-orange" />}
      {index !== undefined && (
        <>
          <span className="text-accent">{pad2(index)}</span>
          <span aria-hidden="true">·</span>
        </>
      )}
      <span>{label}</span>
    </Tag>
  )
}
