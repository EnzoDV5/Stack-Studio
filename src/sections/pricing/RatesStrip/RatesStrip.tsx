import { Section, type Tone } from '@/components/layout/Section'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { Tag } from '@/components/ui/Tag'

export interface RatesStripProps {
  eyebrow: string
  title: string
  rates: { id: string; name: string; price: string; description: string; examples: string[] }[]
  tone?: Tone
}

/** Public hourly rates for work outside a plan. */
export function RatesStrip({ eyebrow, title, rates, tone = 'paper' }: RatesStripProps) {
  return (
    <Section tone={tone} spacing="sm">
      <div className="container-site">
        <Eyebrow label={eyebrow} className="mb-5" />
        <h2 className="text-heading-xl">{title}</h2>
        <ul className="mt-10 grid gap-px overflow-hidden rounded-lg border border-tone bg-(--tone-border) md:grid-cols-2">
          {rates.map((rate) => (
            <li key={rate.id} className="bg-(--tone-bg) p-7 md:p-8">
              <div className="flex items-baseline justify-between gap-6">
                <h3 className="text-heading-lg">{rate.name}</h3>
                <p className="shrink-0 numeric text-heading-lg">{rate.price}</p>
              </div>
              <p className="mt-3 text-muted">{rate.description}</p>
              {rate.examples.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {rate.examples.map((example) => (
                    <Tag key={example}>{example}</Tag>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </Section>
  )
}
