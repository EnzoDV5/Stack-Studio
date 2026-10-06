import { Section, type Tone } from '@/components/layout/Section'
import { Button } from '@/components/ui/Button'
import { SectionHeader } from '@/sections/shared/SectionHeader'
import type { CtaLink } from '@/types'

export interface CareOptionsProps {
  id: string
  title: string
  eyebrow: string
  intro: string
  comparison: { label: string; body: string }[]
  cta: CtaLink
  tone?: Tone
}

/** Explains the three levels before their detailed plan cards. */
export function CareOptions({
  id,
  title,
  eyebrow,
  intro,
  comparison,
  cta,
  tone = 'paper',
}: CareOptionsProps) {
  const headingId = `${id}-heading`

  return (
    <Section
      id={id}
      tone={tone}
      spacing="none"
      className="pt-8 pb-section md:pt-12"
      aria-labelledby={headingId}
    >
      <div className="container-site">
        <SectionHeader
          id={headingId}
          variant="split"
          eyebrow={eyebrow}
          title={title}
          intro={intro}
        />
        <dl className="mt-12 border-t border-tone md:mt-16">
          {comparison.map((item) => (
            <div
              key={item.label}
              className="grid gap-2 border-b border-tone py-5 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] sm:gap-8 md:py-7"
            >
              <dt className="eyebrow text-accent">{item.label}</dt>
              <dd className="text-body-lg">{item.body}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-8">
          <Button to={cta.to} withArrow>
            {cta.label}
          </Button>
        </div>
      </div>
    </Section>
  )
}
