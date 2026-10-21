import { useId } from 'react'
import { Section, type Tone } from '@/components/layout/Section'
import { StaggerGroup } from '@/components/motion/StaggerGroup'
import { TextLink } from '@/components/ui/TextLink'
import { QuoteCredit } from '@/sections/shared/QuoteCredit'
import { SectionHeader } from '@/sections/shared/SectionHeader'
import type { ClientLogoSet, CtaLink } from '@/types'

export interface ClientVoice {
  id: string
  quote: string
  name?: string
  role: string
  company: string
  logo?: ClientLogoSet
  /** The client's case study. */
  link?: CtaLink
}

export interface ClientVoicesProps {
  index?: number
  /** Optional small label above the title. */
  eyebrow?: string
  title: string
  voices: ClientVoice[]
  /** "Go deeper" link after the quotes. */
  more: CtaLink
  tone?: Tone
}

/**
 * What clients say, straight after the work they're talking about. Each quote sits with
 * who said it and a link to that project. Signature motion: the quote cards rise in, one
 * after the other, as they enter.
 */
export function ClientVoices({
  index,
  eyebrow,
  title,
  voices,
  more,
  tone = 'dark',
}: ClientVoicesProps) {
  const headingId = useId()
  return (
    <Section tone={tone} aria-labelledby={headingId}>
      <div className="container-site">
        <SectionHeader id={headingId} index={index} eyebrow={eyebrow} title={title} />

        <StaggerGroup as="ul" className="mt-14 grid gap-6 lg:mt-20 lg:grid-cols-3">
          {voices.map((voice) => (
            <li key={voice.id}>
              <figure className="flex h-full flex-col rounded-lg border border-tone p-7 xl:p-8">
                <span
                  aria-hidden="true"
                  className="font-display text-[4rem] leading-[0.6] text-accent"
                >
                  “
                </span>
                <blockquote className="mt-6 flex-1">
                  <p className="font-display text-heading-md xl:text-heading-lg">{voice.quote}</p>
                </blockquote>
                <figcaption className="mt-8 flex flex-col items-start gap-4 border-t border-tone pt-6">
                  {/* One height for every credit, so the dividers line up across the row. */}
                  <div className="flex min-h-16 items-center">
                    <QuoteCredit
                      name={voice.name}
                      role={voice.role}
                      company={voice.company}
                      logo={voice.logo}
                      tone={tone}
                    />
                  </div>
                  {voice.link && (
                    <TextLink to={voice.link.to} arrow className="text-small">
                      {voice.link.label}
                    </TextLink>
                  )}
                </figcaption>
              </figure>
            </li>
          ))}
        </StaggerGroup>

        <div className="mt-12">
          <TextLink to={more.to} arrow>
            {more.label}
          </TextLink>
        </div>
      </div>
    </Section>
  )
}
