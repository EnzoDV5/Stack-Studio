import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/cn'

export interface PlanCardProps {
  anchorId?: string
  accent?: boolean
  name: string
  tagline: string
  price: string
  /** e.g. "2 hours included each month". */
  hours?: string
  includes: string[]
  excludes: string[]
  labels: { included: string; excluded: string }
  cta: { label: string; to: string; location: string }
}

/** One monthly plan: name, price, hours, what's included and a pre-filled CTA. */
export function PlanCard({
  anchorId,
  accent = false,
  name,
  tagline,
  price,
  hours,
  includes,
  excludes,
  labels,
  cta,
}: PlanCardProps) {
  return (
    <li
      id={anchorId}
      className={cn(
        'relative flex flex-col rounded-lg border p-6 md:p-7',
        accent ? 'border-orange bg-orange text-ink' : 'border-tone',
      )}
    >
      <h3 className="text-heading-lg">{name}</h3>
      <p className={cn('mt-1 text-small', accent ? 'text-ink/80' : 'text-muted')}>{tagline}</p>
      <p className="mt-7 numeric text-heading-xl">{price}</p>
      {hours && (
        <p className={cn('mt-3 eyebrow', accent ? 'text-ink/80' : 'text-muted')}>{hours}</p>
      )}
      <div className={cn('mt-6 flex-1 border-t pt-5', accent ? 'border-ink/20' : 'border-tone')}>
        <h4 className={cn('eyebrow', accent ? 'text-ink' : 'text-accent')}>{labels.included}</h4>
        <ul className="mt-3 space-y-2 text-small">
          {includes.map((item) => (
            <li key={item} className="flex gap-3">
              <span
                aria-hidden="true"
                className={cn('mt-2 size-1.5 shrink-0', accent ? 'bg-ink' : 'bg-marker')}
              />
              {item}
            </li>
          ))}
        </ul>
        <h4
          className={cn(
            'mt-6 border-t pt-5 eyebrow',
            accent ? 'border-ink/20 text-ink/70' : 'border-tone text-muted',
          )}
        >
          {labels.excluded}
        </h4>
        <ul className={cn('mt-3 space-y-2 text-small', accent ? 'text-ink/80' : 'text-muted')}>
          {excludes.map((item) => (
            <li key={item} className="flex gap-3">
              <span aria-hidden="true" className="shrink-0">
                –
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>
      <Button
        to={cta.to}
        variant={accent ? 'inverse' : 'secondary'}
        size="sm"
        withArrow
        className="mt-8 self-start"
        aria-label={`${cta.label} ${name}`}
        analytics={{ event: 'Start project click', props: { location: cta.location } }}
      >
        {cta.label}
      </Button>
    </li>
  )
}
