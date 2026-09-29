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
          variant="split"
          eyebrow={intro.eyebrow}
          title={intro.title}
          intro={intro.intro}
        />
        <ul className="mt-16 grid gap-14 lg:grid-cols-2 lg:gap-10">
          {founders.map((founder) => (
            <li
              key={founder.id}
              className="grid gap-6 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-8 xl:grid-cols-[12rem_minmax(0,1fr)]"
            >
              <div className="relative aspect-4/5 w-40 overflow-hidden rounded-sm bg-ink-700 sm:w-auto">
                <Parallax amount={12} className="absolute inset-x-0 top-[-7%] h-[114%]">
                  <Image
                    image={founder.portrait}
                    sizes="(min-width: 1280px) 12rem, (min-width: 640px) 10rem, 10rem"
                  />
                </Parallax>
              </div>
              <div className="min-w-0">
                <h3 className="text-heading-xl">{founder.name}</h3>
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
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  )
}
