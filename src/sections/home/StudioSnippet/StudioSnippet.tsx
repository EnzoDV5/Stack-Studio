import { useId } from 'react'
import { Section, type Tone } from '@/components/layout/Section'
import { Image } from '@/components/media/Image'
import { Parallax } from '@/components/motion/Parallax'
import { Button } from '@/components/ui/Button'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { Heading } from '@/components/ui/Heading'
import { cn } from '@/lib/cn'
import type { CtaLink, Founder } from '@/types'

export interface StudioSnippetProps {
  index?: number
  eyebrow: string
  title: string
  body: string
  founders: Founder[]
  cta: CtaLink
  tone?: Tone
}

/** The two founders, with portraits drifting slightly on scroll (parallax). */
export function StudioSnippet({
  index,
  eyebrow,
  title,
  body,
  founders,
  cta,
  tone = 'paper',
}: StudioSnippetProps) {
  const headingId = useId()
  return (
    <Section tone={tone} aria-labelledby={headingId}>
      <div className="container-site grid gap-14 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-5">
          <Eyebrow label={eyebrow} index={index} className="mb-6" />
          <Heading id={headingId} size="display-lg" className="max-w-[12ch]">
            {title}
          </Heading>
          <p className="mt-8 max-w-[46ch] text-body-lg text-muted">{body}</p>
          <Button to={cta.to} variant="secondary" withArrow className="mt-10">
            {cta.label}
          </Button>
        </div>

        <ul className="grid grid-cols-2 gap-4 md:gap-6 lg:col-span-6 lg:col-start-7">
          {founders.map((founder, i) => (
            <li key={founder.id} className={cn(i % 2 === 1 && 'mt-16 md:mt-28')}>
              <div className="aspect-4/5 overflow-hidden rounded-sm bg-paper-200">
                <Parallax amount={14} className="h-[115%] -translate-y-[7%]">
                  <Image image={founder.portrait} sizes="(min-width: 1024px) 25vw, 50vw" />
                </Parallax>
              </div>
              <p className="mt-4 font-semibold">{founder.name}</p>
              <p className="text-small text-muted">{founder.role}</p>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  )
}
