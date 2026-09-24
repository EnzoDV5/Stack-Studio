import { cn } from '@/lib/cn'
import { pad2 } from '@/lib/format'

export interface BriefProgressProps {
  /** Zero-based current step. */
  current: number
  labels: string[]
  label: string
  stepOf: (current: number, total: number) => string
}

/** Progress bar plus step names. The bar is the accessible progressbar; names are visual. */
export function BriefProgress({ current, labels, label, stepOf }: BriefProgressProps) {
  const total = labels.length
  const value = current + 1
  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-4">
        <p className="eyebrow text-accent">{stepOf(value, total)}</p>
        <p className="eyebrow text-muted">{labels[current]}</p>
      </div>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={value}
        aria-valuetext={`${stepOf(value, total)}: ${labels[current] ?? ''}`}
        className="h-0.5 w-full bg-(--tone-border)"
      >
        <div
          className="h-full bg-orange transition-[width] duration-(--duration-base) ease-out-expo"
          style={{ width: `${(value / total) * 100}%` }}
        />
      </div>
      {total <= 7 && (
        <ol className="mt-4 hidden gap-4 sm:flex" aria-hidden="true">
          {labels.map((name, i) => (
            <li
              key={name}
              className={cn(
                'flex-1 truncate font-mono text-micro tracking-[0.08em] uppercase transition-colors',
                i <= current ? 'text-(--tone-fg)' : 'text-muted opacity-60',
              )}
            >
              {pad2(i + 1)} {name}
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}
