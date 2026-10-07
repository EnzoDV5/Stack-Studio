import { useId } from 'react'
import { Section, type Tone } from '@/components/layout/Section'
import { Image } from '@/components/media/Image'
import { Parallax } from '@/components/motion/Parallax'
import { TextLink } from '@/components/ui/TextLink'
import { SectionHeader } from '@/sections/shared/SectionHeader'
import type { CtaLink, Founder } from '@/types'

export interface StudioSnippetProps {
  index?: number
  eyebrow: string
  title: string
  intro: string
  founders: Pick<Founder, 'id' | 'name' | 'role' | 'line' | 'portrait'>[]
  /** "Go deeper" link to the studio page. */
  more: CtaLink
  tone?: Tone
}

/**
 * The two founders, one line each, in about one viewport. Their portraits drift gently
 * toward the pointer; they stay still on touch devices and with reduced motion.
 */
export function StudioSnippet({
  index,
  eyebrow,
  title,
  intro,
  founders,
  more,
  tone = 'dark',
}: StudioSnippetProps) {
  const headingId = useId()
  return (
    <Section tone={tone} spacing="sm" aria-labelledby={headingId}>
      <div className="container-site">
        <SectionHeader
          id={headingId}
          variant="split"
          index={index}
          eyebrow={eyebrow}
          title={title}
          intro={intro}
        />

        <ul data-parallax-area="" className="mt-14 grid gap-10 md:grid-cols-2 lg:mt-16">
          {founders.map((founder) => (
            <li key={founder.id} className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-6">
              <div className="relative aspect-4/5 overflow-hidden rounded-sm bg-tone-surface">
                <Parallax trigger="pointer" amount={8} className="absolute -inset-[6%]">
                  <Image image={founder.portrait} sizes="(min-width: 768px) 20vw, 40vw" />
                </Parallax>
              </div>
              <div className="flex flex-col justify-end">
                <p className="text-heading-lg">{founder.name}</p>
                <p className="mt-2 eyebrow text-accent">{founder.role}</p>
                <p className="mt-4 max-w-[36ch] text-muted">{founder.line}</p>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-12">
          <TextLink to={more.to} arrow>
            {more.label}
          </TextLink>
        </div>
      </div>
    </Section>
  )
}
