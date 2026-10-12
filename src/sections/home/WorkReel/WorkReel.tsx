import { useEffect, useId, useRef, useState, type FocusEvent } from 'react'
import { Link } from 'react-router'
import { Section, type Tone } from '@/components/layout/Section'
import { Button } from '@/components/ui/Button'
import { TextLink } from '@/components/ui/TextLink'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { cn } from '@/lib/cn'
import { gsap, useGSAP, type ScrollTrigger } from '@/lib/gsap'
import { scrollToY } from '@/lib/lenis'
import { ease, reel } from '@/lib/motion-tokens'
import { coverFrom, insetPath, pinDistance, scrollForOffset } from '@/lib/reel'
import { ProjectMedia } from '@/sections/shared/ProjectMedia'
import { SectionHeader } from '@/sections/shared/SectionHeader'
import type { Client, CtaLink, ImageAsset, Project, StageId } from '@/types'

export interface WorkReelLabels {
  /** Visual "View case study" cue on each panel. */
  cta: string
  cursor: string
  sample: string
  sector: string
  stages: string
}

export interface WorkReelProps {
  index?: number
  /** Optional small label above the title. */
  eyebrow?: string
  title: string
  projects: Project[]
  clients: Client[]
  stageNames: Record<StageId, string>
  labels: WorkReelLabels
  /** "Go deeper" link in the header row. */
  more: CtaLink
  /** The last panel: all work, or start a project like these. */
  outro: { title: string; allWork: CtaLink; start: CtaLink }
  outroIllustration: ImageAsset
  tone?: Tone
}

type Mode = 'pin' | 'carousel' | 'grid'

const NO_INSET = { top: 0, right: 0, bottom: 0, left: 0 }

/** Offset of `el` inside `ancestor`, ignoring transforms (layout position only). */
function offsetWithin(el: HTMLElement, ancestor: HTMLElement) {
  let x = 0
  let y = 0
  let node: HTMLElement | null = el
  while (node && node !== ancestor) {
    x += node.offsetLeft
    y += node.offsetTop
    node = node.offsetParent as HTMLElement | null
  }
  return { x, y }
}

const panelClass: Record<Mode, { project: string; outro: string }> = {
  pin: {
    project: 'h-full w-[min(62vw,68rem)] shrink-0',
    outro: 'h-full w-[min(34vw,30rem)] shrink-0',
  },
  carousel: {
    project: 'w-[82vw] shrink-0 snap-start sm:w-[62vw]',
    outro: 'w-[88vw] shrink-0 snap-start sm:w-[62vw]',
  },
  grid: { project: '', outro: 'md:col-span-2' },
}

/**
 * Selected work. Signature motion (desktop): the first project's media arrives full-bleed
 * as the section enters; the section pins (the page's only pin), the media shrinks into
 * a framed card (scrubbed clip-path, radius and scale) and the panels travel sideways.
 * Pin length is proportional to the panel count. Mobile gets a scroll-snap carousel with
 * a progress bar; reduced motion gets a plain grid. Panels preview their video on hover.
 */
export function WorkReel({
  index,
  eyebrow,
  title,
  projects,
  clients,
  stageNames,
  labels,
  more,
  outro,
  outroIllustration,
  tone = 'paper',
}: WorkReelProps) {
  const headingId = useId()
  const reducedMotion = useReducedMotion()
  const isDesktop = useMediaQuery('(min-width: 64rem)')
  const mode: Mode = reducedMotion ? 'grid' : isDesktop ? 'pin' : 'carousel'
  const [hovered, setHovered] = useState<string | null>(null)
  const pinRef = useRef<HTMLDivElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLOListElement>(null)
  const barRef = useRef<HTMLSpanElement>(null)
  const pinTrigger = useRef<ScrollTrigger | null>(null)

  useGSAP(
    () => {
      const pin = pinRef.current
      const track = trackRef.current
      if (mode !== 'pin' || !pin || !track) return

      const panels = track.querySelectorAll('[data-reel-panel]')
      const cover = track.querySelector<HTMLElement>('[data-reel-cover]')
      const chrome = pin.querySelectorAll('[data-reel-chrome]')

      // One pinned timeline, in viewport heights of scroll: the full-bleed media arrives
      // whole with the section, then (pinned) shrinks into its card while the chrome fades in,
      // then the track travels sideways.
      const shrink = cover ? reel.shrinkScroll : 0
      const travelFor = pinDistance(panels.length, 1, reel.panelScroll)
      const travel = () => Math.max(0, track.offsetWidth - pin.clientWidth)
      const timeline = gsap.timeline({
        defaults: { ease: ease.none },
        scrollTrigger: {
          trigger: pin,
          start: 'top top',
          end: () => `+=${(shrink + travelFor) * window.innerHeight}`,
          pin: true,
          scrub: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onToggle: (self) => {
            gsap.set([track, cover].filter(Boolean), {
              willChange: self.isActive ? 'transform' : 'auto',
            })
          },
        },
      })

      if (cover) {
        const from = () =>
          coverFrom(
            { ...offsetWithin(cover, pin), width: cover.offsetWidth, height: cover.offsetHeight },
            { width: pin.clientWidth, height: pin.clientHeight },
          )
        timeline
          .fromTo(
            cover,
            {
              transformOrigin: '0 0',
              x: () => from().x,
              y: () => from().y,
              scale: () => from().scale,
              clipPath: () => insetPath(from().inset, 0),
            },
            {
              x: 0,
              y: 0,
              scale: 1,
              clipPath: insetPath(NO_INSET, reel.radius),
              duration: shrink,
              ease: ease.inOut,
            },
            0,
          )
          .fromTo(chrome, { opacity: 0 }, { opacity: 1, duration: shrink * 0.4 }, shrink * 0.6)
      }
      timeline.to(track, { x: () => -travel(), duration: travelFor }, shrink)

      pinTrigger.current = timeline.scrollTrigger ?? null
      return () => {
        pinTrigger.current = null
      }
    },
    { scope: pinRef, dependencies: [mode, projects.length], revertOnUpdate: true },
  )

  // Mobile: the progress bar follows the carousel's scroll (transform only).
  useEffect(() => {
    const scroller = viewportRef.current
    const bar = barRef.current
    if (mode !== 'carousel' || !scroller || !bar) return
    const update = () => {
      const seen = (scroller.scrollLeft + scroller.clientWidth) / scroller.scrollWidth
      bar.style.transform = `scaleX(${Math.min(1, seen)})`
    }
    update()
    scroller.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      scroller.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [mode])

  // Keyboard: while pinned, bring a focused panel into view by scrolling the page.
  const onFocus = (event: FocusEvent<HTMLOListElement>) => {
    const trigger = pinTrigger.current
    const pin = pinRef.current
    const track = trackRef.current
    const viewport = viewportRef.current
    if (mode !== 'pin' || !trigger || !pin || !track) return
    // The browser may scroll the clipped pin to reveal focus; the track moves instead.
    pin.scrollLeft = 0
    if (viewport) viewport.scrollLeft = 0
    const panel = (event.target as HTMLElement).closest<HTMLElement>('[data-reel-panel]')
    if (!panel) return
    const offset = panel.offsetLeft - (pin.clientWidth - panel.offsetWidth) / 2
    const travel = track.offsetWidth - pin.clientWidth
    // The first part of the pin is the shrink; sideways travel starts after it.
    const start = trigger.start + reel.shrinkScroll * window.innerHeight
    scrollToY(scrollForOffset(offset, travel, start, trigger.end - start), true)
  }

  const chrome = mode === 'pin' ? '' : undefined

  return (
    <Section tone={tone} spacing={mode === 'pin' ? 'none' : 'default'} aria-labelledby={headingId}>
      <div
        ref={pinRef}
        className={cn(
          mode === 'pin' &&
            'relative flex h-svh flex-col overflow-hidden pt-[calc(var(--spacing-header)+1.5rem)] pb-8',
        )}
      >
        <div data-reel-chrome={chrome} className="container-site">
          <SectionHeader
            id={headingId}
            variant="inline"
            index={index}
            eyebrow={eyebrow}
            title={title}
            aside={
              <TextLink to={more.to} arrow>
                {more.label}
              </TextLink>
            }
          />
        </div>

        <div
          ref={viewportRef}
          className={cn(
            // No clipping here: the full-bleed cover has to reach above it. The pin clips.
            mode === 'pin' && 'relative mt-8 min-h-0 flex-1',
            mode === 'carousel' &&
              'mt-10 no-scrollbar snap-x snap-mandatory scroll-px-(--spacing-gutter) overflow-x-auto',
            mode === 'grid' && 'container-site mt-12',
          )}
        >
          <ol
            ref={trackRef}
            onFocus={onFocus}
            className={cn(
              mode === 'pin' && 'flex h-full w-max gap-8 px-(--spacing-gutter)',
              mode === 'carousel' && 'flex w-max gap-4 px-(--spacing-gutter)',
              mode === 'grid' && 'grid gap-x-8 gap-y-14 md:grid-cols-2',
            )}
          >
            {projects.map((project, i) => {
              const isCover = mode === 'pin' && i === 0
              const client = clients.find((item) => item.id === project.slug)
              return (
                <li
                  key={project.slug}
                  data-reel-panel=""
                  data-reel-chrome={isCover ? undefined : chrome}
                  className={cn(panelClass[mode].project, isCover && 'relative z-10')}
                >
                  <Link
                    to={`/work/${project.slug}`}
                    data-cursor-label={labels.cursor}
                    className="group flex h-full flex-col"
                    onPointerEnter={() => setHovered(project.slug)}
                    onPointerLeave={() => setHovered(null)}
                    onFocus={() => setHovered(project.slug)}
                    onBlur={() => setHovered(null)}
                  >
                    <div
                      data-reel-cover={isCover ? '' : undefined}
                      className={cn(
                        'overflow-hidden rounded-lg',
                        mode === 'pin' ? 'min-h-0 flex-1' : 'aspect-4/3',
                      )}
                    >
                      <ProjectMedia
                        project={project}
                        variant="showcase"
                        playing={hovered === project.slug}
                        sizes={isCover ? '100vw' : '(min-width: 1024px) 62vw, 82vw'}
                        imageClassName="transition-transform duration-(--duration-base) ease-out-expo group-hover:scale-[1.03]"
                      />
                    </div>
                    <div
                      data-reel-chrome={isCover ? '' : undefined}
                      className="mt-5 flex flex-wrap items-end justify-between gap-x-10 gap-y-4"
                    >
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                          <h3 className="text-heading-xl">{project.name}</h3>
                          {client?.logo && (
                            <span
                              role="img"
                              aria-label={`${client.name} logo`}
                              className="block h-14 w-40 shrink-0 bg-grey-700 sm:h-16 sm:w-48"
                              style={{
                                maskImage: `url(${client.logo})`,
                                maskRepeat: 'no-repeat',
                                maskPosition: 'center',
                                maskSize: 'contain',
                              }}
                            />
                          )}
                        </div>
                        <dl className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-small">
                          <div>
                            <dt className="eyebrow text-muted">{labels.sector}</dt>
                            <dd className="mt-1">{project.sector}</dd>
                          </div>
                          <div>
                            <dt className="eyebrow text-muted">{labels.stages}</dt>
                            <dd className="mt-1">
                              {project.stages.map((id) => stageNames[id]).join(' · ')}
                            </dd>
                          </div>
                        </dl>
                      </div>
                      <span className="flex items-center gap-2 eyebrow">
                        {project.isSample && (
                          <span className="rounded-pill bg-orange px-2.5 py-1 text-ink">
                            {labels.sample}
                          </span>
                        )}
                        {labels.cta}
                        <span
                          aria-hidden="true"
                          className="transition-transform duration-(--duration-fast) ease-out-expo group-hover:translate-x-1"
                        >
                          →
                        </span>
                      </span>
                    </div>
                  </Link>
                </li>
              )
            })}

            <li data-reel-panel="" data-reel-chrome={chrome} className={panelClass[mode].outro}>
              <div
                className={cn(
                  'flex h-full flex-col rounded-lg border border-tone p-5 sm:p-8 lg:p-10',
                  mode !== 'pin' && 'min-h-[34rem]',
                )}
              >
                <div className="flex min-h-0 flex-1 items-center justify-center pb-8">
                  <img
                    src={outroIllustration.src}
                    width={outroIllustration.width}
                    height={outroIllustration.height}
                    alt={outroIllustration.alt}
                    loading="lazy"
                    decoding="async"
                    className="block max-h-[18rem] max-w-full object-contain mix-blend-multiply"
                  />
                </div>
                <div className="flex shrink-0 flex-col gap-10">
                  <p className="max-w-[14ch] font-display text-heading-xl">{outro.title}</p>
                  <div className="flex flex-col items-start gap-6">
                    <TextLink to={outro.allWork.to} arrow className="text-heading-md">
                      {outro.allWork.label}
                    </TextLink>
                    <Button
                      to={outro.start.to}
                      withArrow
                      analytics={{ event: 'Start project click', props: { location: 'home-reel' } }}
                    >
                      {outro.start.label}
                    </Button>
                  </div>
                </div>
              </div>
            </li>
          </ol>
        </div>

        {mode === 'carousel' && (
          <div aria-hidden="true" className="container-site mt-6">
            <div className="h-px bg-(--tone-border)">
              <span
                ref={barRef}
                className="block h-px origin-left bg-orange"
                style={{ transform: 'scaleX(0)' }}
              />
            </div>
          </div>
        )}
      </div>
    </Section>
  )
}
