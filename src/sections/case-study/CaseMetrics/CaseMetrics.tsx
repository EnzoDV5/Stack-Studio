import { Section, type Tone } from '@/components/layout/Section'
import { CountUp } from '@/components/motion/CountUp'
import { Eyebrow } from '@/components/ui/Eyebrow'
import type { ProjectMetric } from '@/types'

export interface CaseMetricsProps {
  label: string
  metrics: ProjectMetric[]
  /** Small print under the numbers (e.g. while metrics are placeholders). */
  note?: string
  tone?: Tone
}

/**
 * Result numbers, big and tabular, counting up once as they enter. Visually value-first;
 * DOM order stays label → value.
 */
export function CaseMetrics({ label, metrics, note, tone = 'dark' }: CaseMetricsProps) {
  return (
    <Section tone={tone} spacing="sm" aria-label={label}>
      <div className="container-site">
        <Eyebrow as="h2" label={label} className="mb-10" />
        <dl className="grid border-y border-tone sm:grid-cols-3">
          {metrics.map((metric) => (
            <div key={metric.label} className="flex flex-col py-10 sm:pr-8">
              <dt className="order-2 mt-3 text-muted">{metric.label}</dt>
              <dd className="order-1">
                <CountUp value={metric.value} className="numeric text-display-xl" />
              </dd>
            </div>
          ))}
        </dl>
        {note && <p className="mt-6 text-small text-muted">{note}</p>}
      </div>
    </Section>
  )
}
