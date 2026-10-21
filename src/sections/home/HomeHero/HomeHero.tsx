import { useRef } from 'react'
import { GridOverlay } from '@/components/layout/GridOverlay'
import { Section } from '@/components/layout/Section'
import { Video } from '@/components/media/Video'
import { SplitReveal } from '@/components/motion/SplitReveal'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { Logo } from '@/components/ui/Logo'
import { MagneticButton } from '@/components/ui/MagneticButton'
import { TextLink } from '@/components/ui/TextLink'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { gsap, useGSAP } from '@/lib/gsap'
import { ease, heroMark } from '@/lib/motion-tokens'
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
 * The opener. The statement rises line by line over the showreel as the preloader lifts,
 * set high in the viewport under the header. The Stack mark fills the right-hand side of
 * the background, running off the edge, and sinks as the page scrolls (scrubbed, slower
 * than the page), so it follows the visitor down and slips off the bottom of the hero,
 * behind the next section. On small screens the mark is massive and faint behind the
 * statement (so the text stays readable), its base cut off by the bottom of the screen. Reduced motion: the mark stays put.
 */
export function HomeHero({ eyebrow, title, intro, cta, secondaryCta, video }: HomeHeroProps) {
  const frameRef = useRef<HTMLDivElement>(null)
  const markRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()

  useGSAP(
    () => {
      const frame = frameRef.current
      const mark = markRef.current
      if (!frame || !mark || reducedMotion) return
      gsap.to(mark, {
        yPercent: heroMark.travel,
        ease: ease.none,
        scrollTrigger: {
          // The frame spans the hero: from the page top until the hero has scrolled away.
          trigger: frame,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
          onToggle: ({ isActive }) =>
            gsap.set(mark, { willChange: isActive ? 'transform' : 'auto' }),
        },
      })
    },
    { scope: frameRef, dependencies: [reducedMotion], revertOnUpdate: true },
  )

  return (
    <Section
      tone="dark"
      solid
      spacing="none"
      className="flex min-h-svh flex-col justify-center overflow-hidden pt-(--spacing-header) pb-[14svh] short:pt-[calc(var(--spacing-header)+1rem)] short:pb-12"
    >
      <div className="absolute inset-0 -z-20">
        <Video video={video} priority mode="controlled" playing className="absolute! inset-0" />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-linear-to-t from-ink via-ink/70 to-ink/25"
      />
      <GridOverlay fade="radial" className="-z-10" />

      {/* The mark: huge and anchored to the right, bleeding off the edge.
          The hero clips it, so as it sinks it disappears behind the next section. On large
          screens its base already runs off the bottom: the triangle is about 0.98em tall and
          centred in the image, so 62svh - 0.49em puts its base at 112svh at any size. On
          phones it's massive (wider than the screen) and runs off the bottom the same way. */}
      <div
        ref={frameRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 -z-10 flex items-center justify-end overflow-hidden opacity-20 lg:opacity-100"
      >
        <div ref={markRef}>
          <Logo
            variant="mark"
            title=""
            className="-mr-[38vw] translate-y-[calc(62svh-0.49em)] text-[min(150vw,105svh)] lg:-mr-[8vw] lg:text-[min(96svh,50vw)]"
          />
        </div>
      </div>

      <div className="container-site">
        <Eyebrow label={eyebrow} className="text-grey-300" />
        {/* 4em: wider than the longest phrase (Grow it., 3.2em), narrower than two (4.8em),
            so it sets one phrase per line at any size: Build it. / Run it. / Grow it. */}
        <SplitReveal
          as="h1"
          trigger="intro"
          className="mt-5 max-w-[4em] font-display text-display-2xl text-paper max-sm:text-[length:min(23vw,15svh)] landscape:text-[length:min(var(--text-display-2xl),14.5svh)]"
        >
          {title}
        </SplitReveal>
        <p className="mt-7 max-w-[44ch] text-body-lg text-grey-300">{intro}</p>
        <div className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-5">
          <MagneticButton
            to={cta.to}
            size="md"
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
