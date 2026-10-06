import { Button } from '@/components/ui/Button'

export interface PlanCardProps {
  anchorId?: string
  name: string
  tagline: string
  price: string
  priceBreakdown?: string
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
  name,
  tagline,
  price,
  priceBreakdown,
  hours,
  includes,
  excludes,
  labels,
  cta,
}: PlanCardProps) {
  return (
    <li id={anchorId} className="relative flex flex-col rounded-lg border border-tone p-6 md:p-7">
      <h3 className="text-heading-lg">{name}</h3>
      <p className="mt-1 text-small text-muted">{tagline}</p>
      <p className="mt-7 numeric text-heading-xl">{price}</p>
      {priceBreakdown && <p className="mt-2 text-small text-muted">{priceBreakdown}</p>}
      {hours && <p className="mt-3 eyebrow text-muted">{hours}</p>}
      <div className="mt-6 flex-1 border-t border-tone pt-5">
        <h4 className="eyebrow text-accent">{labels.included}</h4>
        <ul className="mt-3 space-y-2 text-small">
          {includes.map((item) => (
            <li key={item} className="flex gap-3">
              <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 bg-marker" />
              {item}
            </li>
          ))}
        </ul>
        <h4 className="mt-6 border-t border-tone pt-5 eyebrow text-muted">{labels.excluded}</h4>
        <ul className="mt-3 space-y-2 text-small text-muted">
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
        variant="secondary"
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
