import { useId } from 'react'
import { Section, type Tone } from '@/components/layout/Section'
import { Accordion } from '@/components/ui/Accordion'
import { Button } from '@/components/ui/Button'
import { SectionHeader } from '@/sections/shared/SectionHeader'
import type { CtaLink } from '@/types'

export interface StageRow {
  id: string
  name: string
  line: string
  summary: string
  /** Key offerings or plans with their price labels. */
  items: { name: string; price: string }[]
  cta: CtaLink
}

export interface ServicesRowsProps {
  index?: number
  eyebrow: string
  title: string
  intro: string
  stages: StageRow[]
  labels: { examples: string }
  tone?: Tone
}

/** The five stages as big numbered rows that expand to show key offerings, prices and a CTA. */
export function ServicesRows({
  index,
  eyebrow,
  title,
  intro,
  stages,
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
          defaultOpen={stages[0] ? [stages[0].id] : []}
          titleClassName="text-heading-xl"
          items={stages.map((stage) => ({
            id: stage.id,
            title: stage.name,
            meta: stage.line,
            content: (
              <div className="grid gap-10 md:grid-cols-12">
                <div className="md:col-span-5">
                  <p className="text-body-lg sm:hidden">{stage.line}</p>
                  <p className="mt-2 text-muted sm:mt-0">{stage.summary}</p>
                  <Button
                    to={stage.cta.to}
                    size="sm"
                    withArrow
                    className="mt-8"
                    analytics={{
                      event: 'Start project click',
                      props: { location: `home-stage:${stage.id}` },
                    }}
                  >
                    {stage.cta.label}
                  </Button>
                </div>
                {stage.items.length > 0 && (
                  <div className="md:col-span-6 md:col-start-7">
                    <p className="mb-4 eyebrow text-muted">{labels.examples}</p>
                    <ul className="divide-y divide-(--tone-border) border-y border-tone">
                      {stage.items.map((item) => (
                        <li
                          key={item.name}
                          className="flex items-baseline justify-between gap-6 py-3"
                        >
                          <span>{item.name}</span>
                          <span className="shrink-0 numeric text-small text-muted">
                            {item.price}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ),
          }))}
        />
      </div>
    </Section>
  )
}
