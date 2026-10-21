import { useId } from 'react'
import { Section, type Tone } from '@/components/layout/Section'
import { MediaReveal } from '@/components/media/MediaReveal'
import { ServiceMedia } from '@/components/media/ServiceMedia'
import { Button } from '@/components/ui/Button'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { Heading } from '@/components/ui/Heading'
import { pad2 } from '@/lib/format'
import type { CtaLink } from '@/types'
import type { ServiceMediaItem } from '@/types/service-media'

export interface CareStepsProps {
  eyebrow: string
  title: string
  intro: string
  mediaCaption: string
  mediaLabel: string
  media: ServiceMediaItem
  steps: { title: string; body: string }[]
  cta: CtaLink
  tone?: Tone
}

/** How care runs once a site is live (on /process): an editorial video and three numbered steps. */
export function CareSteps({
  eyebrow,
  title,
  intro,
  mediaCaption,
  mediaLabel,
  media,
  steps,
  cta,
  tone = 'dark',
}: CareStepsProps) {
  const headingId = useId()

  return (
    <Section
      tone={tone}
      spacing="none"
      className="pt-10 pb-section md:pt-16"
      aria-labelledby={headingId}
    >
      <div className="container-site">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-stretch lg:gap-8">
          <div className="flex flex-col items-start lg:col-span-5 lg:py-5">
            <Eyebrow label={eyebrow} className="mb-7" />
            <Heading as="h2" id={headingId} size="display-lg" compile className="max-w-[11ch]">
              {title}
            </Heading>
            <p className="mt-7 max-w-[38ch] text-body-lg text-muted">{intro}</p>
            <Button to={cta.to} withArrow className="mt-9 lg:mt-auto">
              {cta.label}
            </Button>
          </div>

          <MediaReveal
            from="left"
            className="relative aspect-[5/4] overflow-hidden rounded-lg bg-ink sm:aspect-[16/10] lg:col-span-7 lg:aspect-auto lg:min-h-[24rem]"
          >
            <ServiceMedia
              item={media}
              active
              paused={false}
              sizes="(min-width: 1024px) 58vw, 100vw"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-linear-to-t from-ink/75 via-transparent to-ink/15"
            />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 text-paper md:p-8">
              <p className="max-w-[22ch] text-heading-md">{mediaCaption}</p>
              <span className="hidden shrink-0 border border-paper/50 px-3 py-2 eyebrow text-paper sm:block">
                {mediaLabel}
              </span>
            </div>
          </MediaReveal>
        </div>

        <ol className="mt-16 grid border-t border-tone md:grid-cols-3">
          {steps.map((step, i) => (
            <li
              key={step.title}
              className="grid grid-cols-[4rem_1fr] gap-4 border-b border-tone py-7 md:block md:border-r md:border-b-0 md:px-7 md:py-9 md:first:pl-0 md:last:border-r-0 md:last:pr-0"
            >
              <span className="numeric text-heading-lg text-accent md:text-display-lg">
                {pad2(i + 1)}
              </span>
              <div className="md:mt-7">
                <h3 className="text-heading-md">{step.title}</h3>
                <p className="mt-2 max-w-[34ch] text-small text-muted">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  )
}
