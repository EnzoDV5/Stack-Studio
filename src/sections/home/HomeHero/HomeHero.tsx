import { GridOverlay } from '@/components/layout/GridOverlay'
import { Section } from '@/components/layout/Section'
import { Video } from '@/components/media/Video'
import { SplitReveal } from '@/components/motion/SplitReveal'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { MagneticButton } from '@/components/ui/MagneticButton'
import { TextLink } from '@/components/ui/TextLink'
import type { CtaLink, VideoAsset } from '@/types'

export interface HomeHeroProps {
  eyebrow: string
  title: string
  intro: string
  cta: CtaLink
  secondaryCta: CtaLink
  meta: { label: string; value: string }[]
  scrollLabel: string
  video: VideoAsset
}

/**
 * Full-viewport opener: the statement rises line by line over the showreel as the
 * preloader lifts. The magnetic Start a project button is in view from the first second.
 */
export function HomeHero({
  eyebrow,
  title,
  intro,
  cta,
  secondaryCta,
  meta,
  scrollLabel,
  video,
}: HomeHeroProps) {
  return (
    <Section
      tone="dark"
      spacing="none"
      className="flex min-h-svh flex-col justify-end overflow-hidden pt-(--spacing-header) pb-8 md:pb-12"
    >
      <Video video={video} priority className="absolute! inset-0 -z-20" />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-linear-to-t from-ink via-ink/70 to-ink/20"
      />
      <GridOverlay fade="radial" className="-z-10" />

      <div className="container-site">
        <Eyebrow label={eyebrow} className="text-grey-300" />
        <SplitReveal
          as="h1"
          trigger="intro"
          className="mt-6 max-w-[11ch] font-display text-display-2xl text-paper"
        >
          {title}
        </SplitReveal>

        <div className="mt-12 grid gap-10 border-t border-white/15 pt-8 lg:grid-cols-12 lg:items-end">
          <p className="max-w-[44ch] text-body-lg text-grey-300 lg:col-span-5">{intro}</p>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-5 lg:col-span-4">
            <MagneticButton
              to={cta.to}
              size="lg"
              withArrow
              analytics={{ event: 'Start project click', props: { location: 'home-hero' } }}
            >
              {cta.label}
            </MagneticButton>
            <TextLink to={secondaryCta.to} className="text-paper">
              {secondaryCta.label}
            </TextLink>
          </div>
          <dl className="grid grid-cols-3 gap-4 lg:col-span-3">
            {meta.map((item) => (
              <div key={item.label}>
                <dt className="eyebrow text-grey-400">{item.label}</dt>
                <dd className="mt-2 text-small text-paper">{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <p
          aria-hidden="true"
          className="mt-10 hidden items-center gap-3 eyebrow text-grey-400 md:flex"
        >
          <span className="block h-8 w-px bg-orange" />
          {scrollLabel}
        </p>
      </div>
    </Section>
  )
}
