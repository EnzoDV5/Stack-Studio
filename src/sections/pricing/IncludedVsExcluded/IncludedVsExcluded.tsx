import { Section, type Tone } from '@/components/layout/Section'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { Heading } from '@/components/ui/Heading'

export interface IncludedVsExcludedProps {
  eyebrow: string
  title: string
  intro: string
  included: string[]
  excluded: string[]
  outro: string
  labels: { included: string; excluded: string }
  tone?: Tone
}

/** "Maintenance is not unlimited features": what plans cover and what they don't, side by side. */
export function IncludedVsExcluded({
  eyebrow,
  title,
  intro,
  included,
  excluded,
  outro,
  labels,
  tone = 'dark',
}: IncludedVsExcludedProps) {
  return (
    <Section tone={tone} spacing="sm">
      <div className="container-site grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Eyebrow label={eyebrow} className="mb-5" />
          <Heading size="heading-xl" compile>
            {title}
          </Heading>
          <p className="mt-4 text-muted">{intro}</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:col-span-7 lg:col-start-6">
          <div className="rounded-lg border border-tone p-6">
            <h3 className="mb-4 eyebrow text-accent">{labels.included}</h3>
            <ul className="space-y-2">
              {included.map((item) => (
                <li key={item} className="flex gap-3">
                  <span aria-hidden="true" className="text-accent">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border border-tone p-6">
            <h3 className="mb-4 eyebrow text-muted">{labels.excluded}</h3>
            <ul className="space-y-2 text-muted">
              {excluded.map((item) => (
                <li key={item} className="flex gap-3">
                  <span aria-hidden="true">–</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <p className="text-small text-muted sm:col-span-2">{outro}</p>
        </div>
      </div>
    </Section>
  )
}
