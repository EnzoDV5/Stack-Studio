import type { ReactNode } from 'react'
import { Section, type Tone } from '@/components/layout/Section'
import { MaskedHeading } from '@/components/motion/MaskedHeading'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { MagneticButton } from '@/components/ui/MagneticButton'
import type { CtaContent } from '@/types'

export interface ClosingCtaProps {
  content: CtaContent
  /** Decorative code used to scramble the headline before it resolves. */
  codeLines: string[]
  /** Analytics location for the CTA click, e.g. 'home-closing'. */
  location: string
  tone?: Tone
  /** Optional secondary action (e.g. WhatsApp). */
  secondary?: ReactNode
}

/**
 * The closing CTA band. Orange by default: the one big orange moment per page. The heading
 * begins as same-size code characters, then compiles once into the readable title when the
 * band enters. The final glyph widths keep the line length stable throughout.
 */
export function ClosingCta({
  content,
  codeLines,
  location,
  tone = 'orange',
  secondary,
}: ClosingCtaProps) {
  const buttonVariant = tone === 'orange' ? 'inverse' : 'primary'

  return (
    <Section id="start-project" tone={tone} solid grid="radial" className="overflow-hidden">
      <div className="container-site flex flex-col items-center text-center">
        {content.eyebrow && <Eyebrow label={content.eyebrow} className="mb-8 justify-center" />}
        <MaskedHeading
          text={content.title}
          codeLines={codeLines}
          className="max-w-[16ch] font-display text-[clamp(2.75rem,1.55rem+5.4vw,7.5rem)] leading-[0.9] font-extrabold tracking-[-0.032em]"
        />
        {content.body && (
          <p className="mt-10 max-w-[40ch] text-body-lg text-muted">{content.body}</p>
        )}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
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
    </Section>
  )
}
