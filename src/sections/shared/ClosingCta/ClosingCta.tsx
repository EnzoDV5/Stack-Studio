import type { ReactNode } from 'react'
import { Section, type Tone } from '@/components/layout/Section'
import { SplitReveal } from '@/components/motion/SplitReveal'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { MagneticButton } from '@/components/ui/MagneticButton'
import type { CtaContent } from '@/types'

export interface ClosingCtaProps {
  content: CtaContent
  /** Analytics location for the CTA click, e.g. 'home-closing'. */
  location: string
  tone?: Tone
  /** Optional secondary action (e.g. WhatsApp). */
  secondary?: ReactNode
}

/** The giant closing CTA band. Orange by default: the one big orange moment per page. */
export function ClosingCta({ content, location, tone = 'orange', secondary }: ClosingCtaProps) {
  const buttonVariant = tone === 'orange' ? 'inverse' : 'primary'
  return (
    <Section tone={tone} grid="radial" className="overflow-hidden">
      <div className="container-site">
        {content.eyebrow && <Eyebrow label={content.eyebrow} className="mb-10" />}
        <SplitReveal as="h2" type="words" className="max-w-[13ch] font-display text-display-2xl">
          {content.title}
        </SplitReveal>
        <div className="mt-14 flex flex-col gap-10 border-t border-tone pt-10 md:flex-row md:items-center md:justify-between">
          {content.body && <p className="max-w-[40ch] text-body-lg text-muted">{content.body}</p>}
          <div className="flex flex-wrap items-center gap-4">
            <MagneticButton
              to={content.to}
              variant={buttonVariant}
              size="lg"
              withArrow
              analytics={{ event: 'Start project click', props: { location } }}
            >
              {content.label}
            </MagneticButton>
            {secondary}
          </div>
        </div>
      </div>
    </Section>
  )
}
