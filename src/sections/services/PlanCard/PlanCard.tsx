import { Button } from '@/components/ui/Button'
import { StackMark } from '@/components/ui/StackMark'
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
  /** Show the stack illustration behind the content, running off the bottom-right corner. */
  mark?: boolean
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
  mark = false,
}: PlanCardProps) {
  const [amount, period] = price.split('/', 2)
  return (
    <li
      id={anchorId}
      className={cn(
        'group @container relative isolate flex flex-col overflow-hidden rounded-lg border p-6 md:p-7',
        accent ? 'border-orange bg-orange text-ink' : 'border-tone',
      )}
    >
      {mark && (
        <StackMark className="pointer-events-none absolute -right-8 -bottom-[22cqi] -z-10 w-[52cqi] max-w-72 text-ink" />
      )}
      <h3 className="text-heading-lg">{name}</h3>
      <p className={cn('mt-1 text-small', accent ? 'text-ink/80' : 'text-muted')}>{tagline}</p>
      <p className="mt-7 numeric text-heading-xl">
        {amount}
        {/* The billing period sits smaller so the price fits a three-column row on tablets. */}
        {period && (
          <span className={cn('text-heading-md', accent ? 'text-ink/80' : 'text-muted')}>
            /{period}
          </span>
        )}
      </p>
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
        <ul
          className={cn(
            'mt-3 space-y-2 text-small',
            accent ? 'text-ink/80' : 'text-muted',
            // Wrap before the stack mark so no line runs over it.
            mark && 'max-w-[60%] md:max-w-[55%] lg:max-w-[62%] xl:max-w-[55%]',
          )}
        >
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
