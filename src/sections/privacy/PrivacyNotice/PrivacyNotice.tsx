import { Section, type Tone } from '@/components/layout/Section'
import { Button } from '@/components/ui/Button'
import { TextLink } from '@/components/ui/TextLink'
import type { CtaLink } from '@/types'

export interface PrivacyNoticeProps {
  updated: string
  sections: { heading: string; body: string[] }[]
  contact: { label: string; email: string }
  back: CtaLink
  tone?: Tone
}

/** Long-form policy copy with a readable measure. */
export function PrivacyNotice({
  updated,
  sections,
  contact,
  back,
  tone = 'dark',
}: PrivacyNoticeProps) {
  return (
    <Section tone={tone} className="pt-8">
      <div className="container-site grid gap-12 lg:grid-cols-12">
        <p className="eyebrow text-muted lg:col-span-3">{updated}</p>
        <div className="prose-stack lg:col-span-8 lg:col-start-5">
          {sections.map((section) => (
            <section key={section.heading}>
              <h2>{section.heading}</h2>
              {section.body.map((p) => (
                <p key={p} className="mt-4 text-muted">
                  {p}
                </p>
              ))}
            </section>
          ))}
          <p className="pt-6">
            <span className="mr-3 eyebrow text-muted">{contact.label}</span>
            <TextLink href={`mailto:${contact.email}`}>{contact.email}</TextLink>
          </p>
          <div className="pt-8">
            <Button to={back.to} variant="secondary" withArrow>
              {back.label}
            </Button>
          </div>
        </div>
      </div>
    </Section>
  )
}
