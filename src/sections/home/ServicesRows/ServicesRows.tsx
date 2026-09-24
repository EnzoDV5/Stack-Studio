import { useId } from 'react'
import { Section, type Tone } from '@/components/layout/Section'
import { Accordion } from '@/components/ui/Accordion'
import { Button } from '@/components/ui/Button'
import { formatPrice } from '@/lib/format'
import { SectionHeader } from '@/sections/shared/SectionHeader'
import type { Service } from '@/types'

export interface ServiceRow extends Service {
  /** Resolved "from" price for the row meta, if the service maps to a package. */
  fromPrice?: number
}

export interface ServicesRowsProps {
  index?: number
  eyebrow: string
  title: string
  intro: string
  services: ServiceRow[]
  labels: { from: string; start: string; deliverables: string; timeline: string }
  tone?: Tone
}

/** Services as big numbered rows that expand to show deliverables, timing and a CTA. */
export function ServicesRows({
  index,
  eyebrow,
  title,
  intro,
  services,
  labels,
  tone = 'dark',
}: ServicesRowsProps) {
  const headingId = useId()
  return (
    <Section tone={tone} grid="edges" aria-labelledby={headingId}>
      <div className="container-site">
        <SectionHeader id={headingId} index={index} eyebrow={eyebrow} title={title} intro={intro} />
        <Accordion
          className="mt-16 lg:mt-24"
          numbered
          defaultOpen={services[0] ? [services[0].id] : []}
          titleClassName="text-heading-xl"
          items={services.map((service) => ({
            id: service.id,
            title: service.name,
            meta: service.fromPrice ? `${labels.from} ${formatPrice(service.fromPrice)}` : undefined,
            content: (
              <div className="grid gap-10 md:grid-cols-12">
                <div className="md:col-span-5">
                  <p className="text-body-lg">{service.summary}</p>
                  <p className="mt-4 text-muted">{service.description[0]}</p>
                </div>
                <div className="md:col-span-4">
                  <p className="eyebrow mb-4 text-muted">{labels.deliverables}</p>
                  <ul className="space-y-2">
                    {service.deliverables.map((item) => (
                      <li key={item} className="flex gap-3">
                        <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 bg-orange" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-col items-start gap-6 md:col-span-3">
                  <div>
                    <p className="eyebrow mb-2 text-muted">{labels.timeline}</p>
                    <p>{service.timeline}</p>
                  </div>
                  <Button
                    to={service.briefType ? `/start?type=${service.briefType}` : '/start'}
                    size="sm"
                    withArrow
                    analytics={{
                      event: 'Start project click',
                      props: { location: `service-row:${service.id}` },
                    }}
                  >
                    {labels.start}
                  </Button>
                </div>
              </div>
            ),
          }))}
        />
      </div>
    </Section>
  )
}
