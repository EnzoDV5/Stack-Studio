import type { ReactNode } from 'react'
import type { briefCopy } from '@/data/brief'
import { cn } from '@/lib/cn'
import type { EstimateResult } from '@/lib/estimate'
import { formatPrice, formatPriceRange } from '@/lib/format'
import { planPrice, type PriceLabels } from '@/lib/offer'
import styles from './EstimatePanel.module.css'

export interface EstimatePanelProps {
  result: EstimateResult
  copy: (typeof briefCopy)['estimate']
  priceLabels: PriceLabels
  /** e.g. "Limited to 3 partner clients at a time." */
  partnerNote?: string
  /** Hide the heading when rendered inside the mobile drawer. */
  compact?: boolean
  className?: string
}

function Headline({ label, children }: { label: string; children: ReactNode }) {
  return (
    <>
      <p className="eyebrow text-muted">{label}</p>
      <p className="mt-2 numeric text-heading-lg">{children}</p>
    </>
  )
}

function Notes({ items }: { items: (string | false | null | undefined)[] }) {
  const list = items.filter(Boolean) as string[]
  if (!list.length) return null
  return (
    <ul className="mt-6 space-y-2 border-t border-tone pt-6 text-small">
      {list.map((note) => (
        <li key={note} className="flex gap-3">
          <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 bg-marker" />
          {note}
        </li>
      ))}
    </ul>
  )
}

/** Live estimate for every result kind: range, discovery, audit, plan and consult. */
export function EstimatePanel({
  result,
  copy,
  priceLabels: l,
  partnerNote,
  compact = false,
  className,
}: EstimatePanelProps) {
  const body = (() => {
    switch (result.kind) {
      case 'none':
        return <p className="text-muted">{copy.empty}</p>

      case 'range': {
        const range = formatPriceRange(result.low, result.high, 1_000)
        return (
          <>
            <Headline label={copy.range.label}>
              <span key={range} className={styles.tick}>
                {range}
              </span>
            </Headline>
            {result.carePlan && (
              <p className="mt-3 numeric text-body-lg">
                + {result.carePlan.name} {formatPrice(result.carePlan.pricePerMonth)}
                <span className="text-muted">{copy.perMonth}</span>
              </p>
            )}
            <Notes items={[copy.range.careNudge(formatPrice(result.careFrom))]} />
            <details className="group mt-6 border-t border-tone pt-5 text-small">
              <summary className="flex cursor-(--cursor-pointer) list-none items-center justify-between text-muted hover:text-paper [&::-webkit-details-marker]:hidden">
                {copy.breakdownLabel}
                <span aria-hidden="true" className="transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <ul className="mt-4 space-y-2">
                {result.lines.map((line) => (
                  <li key={line.id} className="flex justify-between gap-4">
                    <span>
                      {line.kind === 'pages' && line.count
                        ? copy.range.extraPages(line.count)
                        : line.kind === 'languages' && line.count
                          ? copy.range.extraLanguages(line.count)
                          : line.label}
                    </span>
                    <span className="numeric text-muted">{formatPrice(line.amount)}</span>
                  </li>
                ))}
                {result.timelineMultiplier !== 1 && (
                  <li className="flex justify-between gap-4">
                    <span>{copy.timelineAdjust}</span>
                    <span className="numeric text-muted">
                      {result.timelineMultiplier > 1 ? '+' : '−'}
                      {Math.round(Math.abs(result.timelineMultiplier - 1) * 100)}%
                    </span>
                  </li>
                )}
              </ul>
            </details>
          </>
        )
      }

      case 'discovery': {
        const price = formatPrice(result.discovery.fromPrice)
        return (
          <>
            <Headline label={copy.discovery.label}>
              {result.required ? copy.discovery.required(price) : result.discovery.name}
            </Headline>
            <Notes
              items={[
                !result.required && copy.discovery.optional(price),
                copy.discovery.context(
                  result.offering.name,
                  `${l.from} ${formatPrice(result.offering.fromPrice)}`,
                ),
                copy.discovery.why,
              ]}
            />
          </>
        )
      }

      case 'audit':
        return (
          <>
            <Headline label={copy.audit.label}>
              {copy.audit.title(
                result.audit.name,
                formatPrice(result.audit.fromPrice),
                result.auditIsFrom,
              )}
            </Headline>
            <Notes
              items={[
                result.credit && copy.audit.credit,
                copy.audit.next(result.takeover.name, formatPrice(result.takeover.fromPrice)),
                result.emergencyRate &&
                  copy.audit.emergency(formatPrice(result.emergencyRate.pricePerHour)),
              ]}
            />
          </>
        )

      case 'plan': {
        const [primary, ...alternatives] = result.plans
        return (
          <>
            {result.hourlyRate && (
              <p className="mb-4 text-body-lg">
                {copy.plan.hourly(
                  result.hourlyRate.name,
                  formatPrice(result.hourlyRate.pricePerHour),
                )}
              </p>
            )}
            {primary && (
              <>
                <p className="eyebrow text-muted">
                  {result.hourlyRate ? copy.plan.alternative : copy.plan.label}
                </p>
                <p className="mt-2 text-heading-lg">{primary.name}</p>
                <p className="mt-1 numeric text-body-lg">{planPrice(primary, l)}</p>
              </>
            )}
            {alternatives.map((plan) => (
              <p key={plan.id} className="mt-3 text-small text-muted">
                {copy.plan.alternative}: {plan.name} {planPrice(plan, l)}
              </p>
            ))}
            <Notes
              items={[
                primary?.hoursLabel &&
                  (primary.family === 'partner'
                    ? copy.plan.reservedHours(primary.hoursLabel)
                    : copy.plan.hours(primary.hoursLabel)),
                primary && copy.plan.minTerm(primary.minimumTermMonths),
                result.needsAudit && copy.plan.needsAudit,
                result.limited && partnerNote,
              ]}
            />
          </>
        )
      }

      case 'consult':
        return (
          <>
            <p className="eyebrow text-muted">{copy.consult.label}</p>
            <p className="mt-2 text-heading-md">
              {result.topic === 'partner' ? copy.consult.partnerBody : copy.consult.body}
            </p>
          </>
        )
    }
  })()

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
      {/* Polite live region: screen readers hear the new result after each change. */}
      <div aria-live="polite" aria-atomic="true">
        {body}
      </div>
      <p className="mt-6 text-micro text-muted">{copy.disclaimer}</p>
    </div>
  )
}
