import { Button } from '@/components/ui/Button'

export interface PlanCardProps {
  name: string
  tagline: string
  price: string
  /** e.g. "2 hours included each month". */
  hours?: string
  includes: string[]
  cta: { label: string; to: string; location: string }
}

/** One monthly plan: name, price, hours, what's included and a pre-filled CTA. */
export function PlanCard({
  name,
  tagline,
  price,
  hours,
  includes,
  cta,
}: PlanCardProps) {
  return (
    <li className="relative flex flex-col rounded-lg border border-tone p-7 md:p-8">
      <h3 className="text-heading-lg">{name}</h3>
      <p className="mt-1 text-small text-muted">{tagline}</p>
      <p className="mt-8 numeric text-heading-xl">{price}</p>
      {hours && <p className="mt-3 eyebrow text-muted">{hours}</p>}
      <ul className="mt-6 flex-1 space-y-2 border-t border-tone pt-6 text-small">
        {includes.map((item) => (
          <li key={item} className="flex gap-3">
            <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 bg-marker" />
            {item}
          </li>
        ))}
      </ul>
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
