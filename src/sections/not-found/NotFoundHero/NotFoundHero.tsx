import { Section } from '@/components/layout/Section'
import { SplitReveal } from '@/components/motion/SplitReveal'
import { Button } from '@/components/ui/Button'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { MagneticButton } from '@/components/ui/MagneticButton'
import type { CtaLink } from '@/types'

export interface NotFoundHeroProps {
  eyebrow: string
  title: string
  body: string
  home: CtaLink
  start: CtaLink
}

/** On-brand 404 with a giant outlined "404" and two ways forward. */
export function NotFoundHero({ eyebrow, title, body, home, start }: NotFoundHeroProps) {
  return (
    <Section
      tone="dark"
      grid="radial"
      spacing="none"
      className="flex min-h-svh flex-col justify-center overflow-hidden pt-(--spacing-header) pb-16"
    >
      <p
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 -translate-y-1/2 text-center font-display text-[clamp(10rem,40vw,36rem)] leading-none font-extrabold tracking-[-0.06em] text-transparent select-none [-webkit-text-stroke:1px_rgb(255_255_255/0.1)]"
      >
        404
      </p>
      <div className="container-site">
        <Eyebrow label={eyebrow} className="mb-8" />
        <SplitReveal as="h1" trigger="intro" className="max-w-[12ch] font-display text-display-xl">
          {title}
        </SplitReveal>
        <p className="mt-8 max-w-[44ch] text-body-lg text-muted">{body}</p>
        <div className="mt-12 flex flex-wrap items-center gap-4">
          <MagneticButton to={home.to} size="lg" withArrow>
            {home.label}
          </MagneticButton>
          <Button
            to={start.to}
            variant="secondary"
            size="lg"
            analytics={{ event: 'Start project click', props: { location: '404' } }}
          >
            {start.label}
          </Button>
        </div>
      </div>
    </Section>
  )
}
