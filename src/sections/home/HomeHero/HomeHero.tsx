import { GridOverlay } from '@/components/layout/GridOverlay'
import { Section } from '@/components/layout/Section'
import { Video } from '@/components/media/Video'
import { SplitReveal } from '@/components/motion/SplitReveal'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { Logo } from '@/components/ui/Logo'
import { MagneticButton } from '@/components/ui/MagneticButton'
import { TextLink } from '@/components/ui/TextLink'
import type { CtaLink, VideoAsset } from '@/types'

export interface HomeHeroProps {
  eyebrow: string
  title: string
  intro: string
  cta: CtaLink
  secondaryCta: CtaLink
  video: VideoAsset
}

/**
 * The opener. The statement rises line by line over the showreel as the preloader lifts
 * (the section's one motion), and the Stack mark fills the right-hand side of the
 * background, running off the edge. On small screens the mark sits faintly behind the
 * statement so the text stays readable.
 */
export function HomeHero({ eyebrow, title, intro, cta, secondaryCta, video }: HomeHeroProps) {
  return (
    <Section
      tone="dark"
      solid
      spacing="none"
      className="flex min-h-svh flex-col justify-end overflow-hidden pt-(--spacing-header) pb-8 md:pb-12"
    >
      <div className="absolute inset-0 -z-20">
        <Video video={video} priority mode="controlled" playing className="absolute! inset-0" />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-linear-to-t from-ink via-ink/70 to-ink/25"
      />
      <GridOverlay fade="radial" className="-z-10" />

      {/* The mark: huge, anchored to the right and bleeding off it, fading into the ink at
          the bottom so the gradient above still reads. Decorative. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 -z-10 flex items-center justify-end overflow-hidden [mask-image:linear-gradient(to_bottom,black_55%,transparent)] opacity-15 lg:opacity-90"
      >
        <Logo
          variant="mark"
          title=""
          className="-mr-[12vw] translate-y-[6svh] text-[min(62svh,52vw)] lg:-mr-[6vw] lg:text-[min(66svh,40vw)]"
        />
      </div>

      <div className="container-site">
        <Eyebrow label={eyebrow} className="text-grey-300" />
        {/* 4em: wider than the longest phrase (Grow it., 3.2em), narrower than two (4.8em), so
            it sets one phrase per line at any size: Build it. / Run it. / Grow it. */}
        <SplitReveal
          as="h1"
          trigger="intro"
          className="mt-5 max-w-[4em] font-display text-display-2xl text-paper lg:text-[length:min(var(--text-display-2xl),14.5svh)]"
        >
          {title}
        </SplitReveal>
        <p className="mt-7 max-w-[44ch] text-body-lg text-grey-300">{intro}</p>
        <div className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-5">
          <MagneticButton
            to={cta.to}
            size="lg"
            withArrow
            analytics={{ event: 'Start project click', props: { location: 'home-hero' } }}
          >
            {cta.label}
          </MagneticButton>
          <TextLink to={secondaryCta.to} arrow className="text-paper">
            {secondaryCta.label}
          </TextLink>
        </div>
      </div>
    </Section>
  )
}
