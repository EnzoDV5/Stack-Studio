import { cn } from '@/lib/cn'
import type { Estimate } from '@/lib/estimate'
import { formatPrice, formatPriceRange } from '@/lib/format'
import type { briefCopy } from '@/data/brief'
import styles from './EstimatePanel.module.css'

export interface EstimatePanelProps {
  estimate: Estimate
  copy: (typeof briefCopy)['estimate']
  /** e.g. "Placeholder pricing" while prices aren't final. */
  notice?: string
  /** Hide the heading when rendered inside the mobile drawer. */
  compact?: boolean
  className?: string
}

const fitTone = {
  unknown: '',
  comfortable: 'text-success',
  within: 'text-success',
  tight: 'text-orange',
  over: 'text-error',
} as const

/** Live estimate: range, monthly, build time, breakdown and budget fit. Updates as answers change. */
export function EstimatePanel({
  estimate,
  copy,
  notice,
  compact = false,
  className,
}: EstimatePanelProps) {
  const range = formatPriceRange(estimate.onceLow, estimate.onceHigh)
  const fitMessage = copy.budgetFit[estimate.budgetFit]

  return (
    <div className={cn('rounded-lg border border-tone bg-ink-800 p-6 md:p-7', className)}>
      {!compact && (
        <p className="mb-6 flex items-center gap-3 eyebrow text-muted">
          <span aria-hidden="true" className="relative flex size-2">
            <span className="absolute inset-0 animate-ping rounded-pill bg-orange opacity-60 motion-reduce:hidden" />
            <span className="relative size-2 rounded-pill bg-orange" />
          </span>
          {copy.title}
        </p>
      )}

      {/* Polite live region: screen readers hear the new total after each change. */}
      <div aria-live="polite" aria-atomic="true">
        {!estimate.ready ? (
          <p className="text-muted">{copy.empty}</p>
        ) : (
          <>
            <p className="eyebrow text-muted">{copy.onceLabel}</p>
            <p className="mt-2 numeric text-heading-lg">
              <span key={range} className={styles.tick}>
                {range}
              </span>
            </p>
            {estimate.monthlyTotal > 0 && (
              <p className="mt-3 numeric text-body-lg">
                + {formatPrice(estimate.monthlyTotal)}
                <span className="text-muted">{copy.perMonth}</span>
              </p>
            )}
          </>
        )}
      </div>

      {estimate.ready && (
        <>
          <dl className="mt-6 space-y-3 border-t border-tone pt-6 text-small">
            {estimate.weeks && (
              <div className="flex justify-between gap-4">
                <dt className="text-muted">{copy.timelineLabel}</dt>
                <dd className="numeric">{copy.weeks(...estimate.weeks)}</dd>
              </div>
            )}
            {fitMessage && (
              <div className="flex justify-between gap-4">
                <dt className="shrink-0 text-muted">{copy.budgetLabel}</dt>
                <dd className={cn('text-right', fitTone[estimate.budgetFit])}>{fitMessage}</dd>
              </div>
            )}
          </dl>

          <details className="group mt-6 border-t border-tone pt-5 text-small">
            <summary className="flex cursor-pointer list-none items-center justify-between text-muted hover:text-paper [&::-webkit-details-marker]:hidden">
              {copy.breakdownLabel}
              <span aria-hidden="true" className="transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <ul className="mt-4 space-y-2">
              {estimate.lines.map((line) => (
                <li key={line.id} className="flex justify-between gap-4">
                  <span>{line.label}</span>
                  <span className="numeric text-muted">
                    {formatPrice(line.amount)}
                    {line.billing === 'monthly' ? copy.perMonth : ''}
                  </span>
                </li>
              ))}
              {estimate.timelineMultiplier !== 1 && (
                <li className="flex justify-between gap-4">
                  <span>{copy.rushLabel}</span>
                  <span className="numeric text-muted">
                    {estimate.timelineMultiplier > 1 ? '+' : '−'}
                    {Math.round(Math.abs(estimate.timelineMultiplier - 1) * 100)}%
                  </span>
                </li>
              )}
            </ul>
          </details>
        </>
      )}

      <p className="mt-6 text-micro text-muted">{copy.disclaimer}</p>
      {notice && <p className="mt-2 text-micro text-orange">{notice}</p>}
    </div>
  )
}
