import { useId } from 'react'
import { Section, type Tone } from '@/components/layout/Section'
import { Image } from '@/components/media/Image'
import { Parallax } from '@/components/motion/Parallax'
import { Tag } from '@/components/ui/Tag'
import { TextLink } from '@/components/ui/TextLink'
import { SectionHeader } from '@/sections/shared/SectionHeader'
import type { Founder, SectionIntro } from '@/types'

export interface FounderProfilesProps {
  intro: SectionIntro
  founders: Founder[]
  linkedinLabel: string
  tone?: Tone
}

/** Founder cards: portrait (gentle parallax), name, role, bio and focus areas. */
export function FounderProfiles({
  intro,
  founders,
  linkedinLabel,
  tone = 'dark',
}: FounderProfilesProps) {
  const headingId = useId()
  return (
    <Section tone={tone} aria-labelledby={headingId}>
      <div className="container-site">
        <SectionHeader
          id={headingId}
          eyebrow={intro.eyebrow}
          title={intro.title}
          intro={intro.intro}
        />
        <ul className="mt-16 grid gap-16 md:grid-cols-2 md:gap-10">
          {founders.map((founder) => (
            <li key={founder.id}>
              <div className="aspect-4/5 overflow-hidden rounded-sm bg-ink-700">
                <Parallax amount={12} className="h-[112%] -translate-y-[6%]">
                  <Image image={founder.portrait} sizes="(min-width: 768px) 50vw, 100vw" />
                </Parallax>
              </div>
              <h3 className="mt-8 text-heading-xl">{founder.name}</h3>
              <p className="mt-2 eyebrow text-accent">{founder.role}</p>
              <p className="mt-5 max-w-[48ch] text-muted">{founder.bio}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {founder.focus.map((f) => (
                  <Tag key={f}>{f}</Tag>
                ))}
              </div>
              {founder.linkedin && (
                <p className="mt-6">
                  <TextLink
                    href={founder.linkedin}
                    aria-label={`${founder.name} on ${linkedinLabel}`}
                  >
                    {linkedinLabel}
                  </TextLink>
                </p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </Section>
  )
}
