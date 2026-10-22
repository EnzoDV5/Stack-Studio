import { cn } from '@/lib/cn'

export interface CountStepProps {
  id: string
  label: string
  value: number
  min: number
  max: number
  unit: { one: string; other: string }
  onChange: (value: number) => void
  labels: { decrease: string; increase: string }
  /** e.g. "5 included in the price." */
  note?: string
  error?: string
}

const stepButton =
  'grid size-14 place-items-center rounded-pill border border-tone text-heading-lg transition-colors hover:border-(--tone-fg) disabled:opacity-40'

/** Number stepper: − / input / +. Arrow keys work natively on the input. */
export function CountStep({
  id,
  label,
  value,
  min,
  max,
  unit,
  onChange,
  labels,
  note,
  error,
}: CountStepProps) {
  const clamp = (n: number) => Math.min(max, Math.max(min, Math.round(n)))
  const errorId = `${id}-error`
  return (
    <div>
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            type="button"
            className={stepButton}
            onClick={() => onChange(clamp(value - 1))}
            disabled={value <= min}
            aria-label={labels.decrease}
            aria-controls={id}
          >
            −
          </button>
          <label htmlFor={id} className="visually-hidden">
            {label}
          </label>
          <input
            id={id}
            type="number"
            inputMode="numeric"
            min={min}
            max={max}
            value={value}
            onChange={(e) => {
              const n = Number(e.target.value)
              if (Number.isFinite(n)) onChange(clamp(n))
            }}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            className={cn(
              'h-14 w-24 rounded-md border bg-ink-800 text-center numeric text-heading-lg text-paper',
              error ? 'border-error' : 'border-tone',
            )}
          />
          <button
            type="button"
            className={stepButton}
            onClick={() => onChange(clamp(value + 1))}
            disabled={value >= max}
            aria-label={labels.increase}
            aria-controls={id}
          >
            +
          </button>
        </div>
        <span className="text-body-lg text-muted" aria-hidden="true">
          {value === 1 ? unit.one : unit.other}
        </span>
      </div>
      {note && <p className="mt-4 text-small text-muted">{note}</p>}
      {error && (
        <p id={errorId} className="mt-2 text-small text-error">
          {error}
        </p>
      )}
    </div>
  )
}
