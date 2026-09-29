import { useId, useState } from 'react'
import { Link } from 'react-router'
import { GridOverlay } from '@/components/layout/GridOverlay'
import { Section } from '@/components/layout/Section'
import { Video } from '@/components/media/Video'
import { SplitReveal } from '@/components/motion/SplitReveal'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { MagneticButton } from '@/components/ui/MagneticButton'
import { TextLink } from '@/components/ui/TextLink'
import { cn } from '@/lib/cn'
import { pad2 } from '@/lib/format'
import { ProjectMedia } from '@/sections/shared/ProjectMedia'
import type { CtaLink, Project, VideoAsset } from '@/types'

export interface HomeHeroProps {
  eyebrow: string
  title: string
  intro: string
  cta: CtaLink
  secondaryCta: CtaLink
  video: VideoAsset
  /** The project index (first three are shown). */
  projects: Project[]
  indexLabel: string
  cursorLabel: string
}

const layer =
  'absolute inset-0 transition-opacity duration-(--duration-fast) ease-out-expo motion-reduce:transition-none'

/**
 * Work-led opener. The statement rises line by line over the showreel as the preloader
 * lifts, and a project index sits beside it, so work is on the very first screen.
 * Signature motion: hovering or focusing a project crossfades the background from the
 * showreel to that project's preview. Only the visible layer's video plays. On mobile the
 * index becomes a row of chips under the statement.
 */
export function HomeHero({
  eyebrow,
  title,
  intro,
  cta,
  secondaryCta,
  video,
  projects,
  indexLabel,
  cursorLabel,
}: HomeHeroProps) {
  const indexId = useId()
  const [active, setActive] = useState<string | null>(null)
  // Project media only mounts once someone reaches for the index, so it never competes
  // with the hero's first paint.
  const [primed, setPrimed] = useState(false)
  const shown = projects.slice(0, 3)

  const activate = (slug: string) => {
    setPrimed(true)
    setActive(slug)
  }

  return (
    <Section
      tone="dark"
      solid
      spacing="none"
      className="flex min-h-svh flex-col justify-end overflow-hidden pt-(--spacing-header) pb-8 md:pb-12"
    >
      <div className="absolute inset-0 -z-20">
        <div className={cn(layer, active ? 'opacity-0' : 'opacity-100')}>
          <Video
            video={video}
            priority
            mode="controlled"
            playing={active === null}
            className="absolute! inset-0"
          />
        </div>
        {primed && (
          <div aria-hidden="true">
            {shown.map((project) => (
              <div
                key={project.slug}
                className={cn(layer, active === project.slug ? 'opacity-100' : 'opacity-0')}
              >
                <ProjectMedia
                  project={project}
                  variant="showcase"
                  playing={active === project.slug}
                  sizes="100vw"
                />
              </div>
            ))}
          </div>
        )}
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-linear-to-t from-ink via-ink/70 to-ink/25"
      />
      <GridOverlay fade="radial" className="-z-10" />

      <div className="container-site grid gap-10 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-8">
          <Eyebrow label={eyebrow} className="text-grey-300" />
          <SplitReveal
            as="h1"
            trigger="intro"
            className="mt-5 max-w-[11ch] font-display text-display-2xl text-paper lg:text-[length:min(var(--text-display-2xl),14.5svh)]"
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

          <nav aria-label={indexLabel} className="mt-10 lg:hidden">
            <ul className="-mx-(--spacing-gutter) no-scrollbar flex gap-2 overflow-x-auto px-(--spacing-gutter)">
              {shown.map((project) => (
                <li key={project.slug} className="shrink-0">
                  <Link
                    to={`/work/${project.slug}`}
                    className="inline-flex h-11 items-center gap-2 rounded-pill border border-white/20 bg-ink/40 px-4 text-small text-paper backdrop-blur-sm"
                  >
                    {project.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <nav
          aria-labelledby={indexId}
          className="hidden lg:col-span-4 lg:block"
          onPointerEnter={() => setPrimed(true)}
          onPointerLeave={() => setActive(null)}
        >
          <p id={indexId} className="mb-4 eyebrow text-grey-400">
            {indexLabel}
          </p>
          <ol>
            {shown.map((project, i) => {
              const isActive = active === project.slug
              return (
                <li key={project.slug}>
                  <Link
                    to={`/work/${project.slug}`}
                    data-cursor-label={cursorLabel}
                    onPointerEnter={() => activate(project.slug)}
                    onFocus={() => activate(project.slug)}
                    onBlur={() => setActive(null)}
                    className="grid grid-cols-[2.5rem_minmax(0,1fr)_auto] items-baseline gap-x-3 gap-y-1 border-t border-white/15 py-4"
                  >
                    <span className="eyebrow text-grey-400">{pad2(i + 1)}</span>
                    <span
                      className={cn(
                        'text-heading-lg transition-colors duration-(--duration-micro)',
                        isActive ? 'text-orange' : 'text-paper',
                      )}
                    >
                      {project.name}
                    </span>
                    <span className="eyebrow text-grey-400">{project.year}</span>
                    <span className="col-span-2 col-start-2 text-small text-grey-400">
                      {project.services.slice(0, 2).join(' · ')}
                    </span>
                  </Link>
                </li>
              )
            })}
          </ol>
        </nav>
      </div>
    </Section>
  )
}
