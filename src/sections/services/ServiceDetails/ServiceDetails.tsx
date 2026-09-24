import { Section, type Tone } from '@/components/layout/Section'
import { FadeUp } from '@/components/motion/FadeUp'
import { Button } from '@/components/ui/Button'
import { formatPrice, pad2 } from '@/lib/format'
import type { Service } from '@/types'

export interface ServiceDetailItem extends Service {
  fromPrice?: number
  /** For recurring services: lowest monthly plan price. */
  monthlyFrom?: number
}

export interface ServiceDetailsProps {
  services: ServiceDetailItem[]
  labels: {
    deliverables: string
    timeline: string
    from: string
    monthlyFrom: string
    perMonth: string
    start: string
  }
  tone?: Tone
}

/** One editorial block per service: what it is, what you get, timing, price and a pre-filled CTA. */
export function ServiceDetails({ services, labels, tone = 'paper' }: ServiceDetailsProps) {
  return (
    <Section tone={tone}>
      <div className="container-site">
        {services.map((service, i) => (
          <FadeUp
            as="article"
            key={service.id}
            className="grid gap-10 border-t border-tone py-16 first:border-t-0 first:pt-0 md:py-24 lg:grid-cols-12"
          >
            <div className="lg:col-span-5">
              <p className="mb-5 eyebrow text-accent">{pad2(i + 1)}</p>
              <h2 id={`service-${service.id}`} className="text-display-lg">
                {service.name}
              </h2>
              <p className="mt-6 max-w-[40ch] text-body-lg">{service.summary}</p>
            </div>
            <div className="space-y-5 text-muted lg:col-span-4 lg:col-start-7">
              {service.description.map((p) => (
                <p key={p}>{p}</p>
              ))}
              <div className="pt-4">
                <p className="mb-4 eyebrow">{labels.deliverables}</p>
                <ul className="space-y-2 text-(--tone-fg)">
                  {service.deliverables.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 bg-marker" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <aside className="flex flex-col gap-6 lg:col-span-2 lg:col-start-11">
              <div>
                <p className="mb-2 eyebrow text-muted">{labels.timeline}</p>
                <p>{service.timeline}</p>
              </div>
              {service.fromPrice !== undefined && (
                <div>
                  <p className="mb-2 eyebrow text-muted">{labels.from}</p>
                  <p className="numeric text-heading-lg">{formatPrice(service.fromPrice)}</p>
                </div>
              )}
              {service.monthlyFrom !== undefined && (
                <div>
                  <p className="mb-2 eyebrow text-muted">{labels.monthlyFrom}</p>
                  <p className="numeric text-heading-lg">
                    {formatPrice(service.monthlyFrom)}
                    <span className="text-small text-muted">{labels.perMonth}</span>
                  </p>
                </div>
              )}
              <Button
                to={service.briefType ? `/start?type=${service.briefType}` : '/start'}
                size="sm"
                withArrow
                aria-describedby={`service-${service.id}`}
                analytics={{
                  event: 'Start project click',
                  props: { location: `services:${service.id}` },
                }}
              >
                {labels.start}
              </Button>
            </aside>
          </FadeUp>
        ))}
      </div>
    </Section>
  )
}
