import { Section, type Tone } from '@/components/layout/Section'
import { TextLink } from '@/components/ui/TextLink'

export interface CaseMetaProps {
  labels: { client: string; year: string; services: string; live: string; visit: string }
  client: string
  year: number
  services: string[]
  liveUrl?: string
  tone?: Tone
}

/** Client, year, services and live link, as a definition list. */
export function CaseMeta({
  labels,
  client,
  year,
  services,
  liveUrl,
  tone = 'dark',
}: CaseMetaProps) {
  return (
    <Section tone={tone} spacing="sm" className="pt-8">
      <dl className="container-site grid gap-8 border-y border-tone py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <dt className="mb-3 eyebrow text-muted">{labels.client}</dt>
          <dd>{client}</dd>
        </div>
        <div>
          <dt className="mb-3 eyebrow text-muted">{labels.year}</dt>
          <dd className="numeric">{year}</dd>
        </div>
        <div>
          <dt className="mb-3 eyebrow text-muted">{labels.services}</dt>
          <dd>
            <ul>
              {services.map((service) => (
                <li key={service}>{service}</li>
              ))}
            </ul>
          </dd>
        </div>
        {liveUrl && (
          <div>
            <dt className="mb-3 eyebrow text-muted">{labels.live}</dt>
            <dd>
              <TextLink href={liveUrl}>{labels.visit}</TextLink>
            </dd>
          </div>
        )}
      </dl>
    </Section>
  )
}
