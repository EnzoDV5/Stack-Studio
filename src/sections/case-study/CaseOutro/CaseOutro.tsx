import { Link } from 'react-router'
import { Section, type Tone } from '@/components/layout/Section'
import { Image } from '@/components/media/Image'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { Heading } from '@/components/ui/Heading'
import { MagneticButton } from '@/components/ui/MagneticButton'
import type { CtaContent, Project } from '@/types'

export interface CaseOutroProps {
  /** "Start a project like this": `to` should carry the brief pre-fill (?type=). */
  cta: CtaContent
  next?: Project
  nextLabel: string
  cursorLabel: string
  tone?: Tone
}

/**
 * End of a case study. Readers who got this far trust us most, so the pre-filled CTA
 * comes first and the next-project link second.
 */
export function CaseOutro({ cta, next, nextLabel, cursorLabel, tone = 'dark' }: CaseOutroProps) {
  return (
    <Section tone={tone} className="border-t border-tone">
      <div className="container-site grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-5">
          {cta.eyebrow && <Eyebrow label={cta.eyebrow} className="mb-6" />}
          <Heading size="display-lg" className="max-w-[12ch]" compile>
            {cta.title}
          </Heading>
          {cta.body && <p className="mt-6 max-w-[40ch] text-muted">{cta.body}</p>}
          <div className="mt-10">
            <MagneticButton
              to={cta.to}
              size="lg"
              withArrow
              analytics={{ event: 'Start project click', props: { location: 'case-study' } }}
            >
              {cta.label}
            </MagneticButton>
          </div>
        </div>

        {next && (
          <Link
            to={`/work/${next.slug}`}
            className="group block lg:col-span-6 lg:col-start-7"
            data-cursor-label={cursorLabel}
          >
            <p className="mb-6 eyebrow text-muted">{nextLabel} →</p>
            <div className="aspect-video overflow-hidden bg-ink-700">
              <Image
                image={next.thumbnail}
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="group-hover:scale-[1.04]"
              />
            </div>
            <p className="mt-6 text-display-lg transition-colors group-hover:text-orange">
              {next.name}
            </p>
            <p className="mt-2 text-muted">{next.summary}</p>
          </Link>
        )}
      </div>
    </Section>
  )
}
