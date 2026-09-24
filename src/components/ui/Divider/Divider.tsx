import { cn } from '@/lib/cn'

export interface DividerProps {
  /** Optional mono label sitting on the line. */
  label?: string
  className?: string
}

export function Divider({ label, className }: DividerProps) {
  if (!label) return <hr className={cn('border-0 border-t border-tone', className)} />

  return (
    <div role="separator" className={cn('flex items-center gap-4', className)}>
      <span className="eyebrow shrink-0 text-muted">{label}</span>
      <span aria-hidden="true" className="h-px flex-1 bg-(--tone-border)" />
    </div>
  )
}
