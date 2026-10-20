import { useId, useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import { Section, type Tone } from '@/components/layout/Section'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { cn } from '@/lib/cn'
import { pad2 } from '@/lib/format'
import { Flip, gsap, useGSAP } from '@/lib/gsap'
import { ease, stackFilter } from '@/lib/motion-tokens'
import { layersTouching, stackRows, usesTechnology } from '@/lib/stack'
import { SectionHeader } from '@/sections/shared/SectionHeader'
import type { SectionIntro } from '@/types'
import type { StackBuild, Technology, TechnologyLayer } from '@/types/technology'
import styles from './StackDiagram.module.css'
import { StackDetail, type StackDetailLabels } from './StackDetail'

export interface StackDiagramLabels extends StackDetailLabels {
  filterLabel: string
}

export interface StackDiagramProps {
  intro: SectionIntro
  labels: StackDiagramLabels
  technologies: readonly Technology[]
  layers: readonly TechnologyLayer[]
  /** The first build is shown first (normally "everything"). */
  builds: readonly StackBuild[]
  tone?: Tone
}

/**
 * The stack as a diagram: technologies in layers along a spine, from design to shipping. Pick
 * a kind of build and the spine lights up through the layers it uses, its logos pop in turn
 * and the rest dims; hover, focus or tap a tool for what it's for and which builds use it (the
 * layers it touches light up). Logos hop on hover. Signature motion: hover and click (CSS
 * only, off with reduced motion).
 */
export function StackDiagram({
  intro,
  labels,
  technologies,
  layers,
  builds,
  tone = 'dark',
}: StackDiagramProps) {
  const headingId = useId()
  const [buildId, setBuildId] = useState(builds[0]?.id ?? '')
  const [hovered, setHovered] = useState<string | null>(null)
  const [pinned, setPinned] = useState<string | null>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const indicatorRef = useRef<HTMLSpanElement>(null)
  const listRef = useRef<HTMLOListElement>(null)
  // Where every tile sat before a build change, so the ones that stay can glide to their new
  // place (GSAP Flip, transforms only).
  const flipState = useRef<Flip.FlipState | null>(null)
  const reducedMotion = useReducedMotion()

  const build = builds.find((b) => b.id === buildId) ?? builds[0]
  const rows = stackRows(technologies, layers)
  const used = (id: string) => !build || usesTechnology(build, id)
  const usedCount = technologies.filter((t) => used(t.id)).length
  const activeId = hovered ?? pinned
  const active = technologies.find((t) => t.id === activeId)
  const related = new Set(active ? layersTouching(layers, active).map((layer) => layer.id) : [])
  // Layers the build uses, numbered in order (the others are hidden).
  const layerNumber = new Map(
    rows
      .filter((row) => row.technologies.some((t) => used(t.id)))
      .map((row, i) => [row.layer.id, i + 1]),
  )

  // The highlight slides between the build pills (a clip-path, so only the clip animates).
  useLayoutEffect(() => {
    const track = trackRef.current
    const indicator = indicatorRef.current
    if (!track || !indicator) return
    const place = () => {
      const pill = track.querySelector<HTMLElement>(`[data-build="${buildId}"]`)
      if (!pill) return
      const right = track.offsetWidth - pill.offsetLeft - pill.offsetWidth
      const bottom = track.offsetHeight - pill.offsetTop - pill.offsetHeight
      indicator.style.clipPath = `inset(${pill.offsetTop}px ${right}px ${bottom}px ${pill.offsetLeft}px round 999px)`
    }
    place()
    // Animate only after the first placement, so it doesn't sweep in on load.
    const frame = requestAnimationFrame(() => indicator.setAttribute('data-placed', ''))
    const observer = new ResizeObserver(place)
    observer.observe(track)
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [buildId])

  const selectBuild = (id: string) => {
    const next = builds.find((b) => b.id === id)
    if (!next || id === buildId) return
    if (!reducedMotion && listRef.current) {
      flipState.current = Flip.getState(listRef.current.querySelectorAll('[data-flip-id]'))
    }
    setBuildId(id)
    setHovered(null)
    if (pinned && !usesTechnology(next, pinned)) setPinned(null)
  }

  // After a build change, one continuous move: layers and tools that leave fade and shrink out
  // where they were, the ones that stay glide to their new place (tiles ride inside their
  // layer), and the ones that return fade in once there's room for them.
  useGSAP(
    () => {
      const state = flipState.current
      if (!state) return
      flipState.current = null
      Flip.from(state, {
        duration: stackFilter.duration,
        ease: stackFilter.ease,
        nested: true,
        absoluteOnLeave: true,
        onLeave: (leaving) =>
          gsap.to(leaving, {
            opacity: 0,
            scale: stackFilter.scale,
            duration: stackFilter.fade,
            ease: ease.outQuart,
          }),
        onEnter: (entering) =>
          gsap.fromTo(
            entering,
            { opacity: 0, scale: stackFilter.scale },
            {
              opacity: 1,
              scale: 1,
              duration: stackFilter.duration,
              delay: stackFilter.enterDelay,
              ease: stackFilter.ease,
              stagger: stackFilter.stagger,
              clearProps: 'transform,opacity',
            },
          ),
      })
    },
    { scope: listRef, dependencies: [buildId] },
  )

  return (
    <Section tone={tone} aria-labelledby={headingId}>
      <div className="container-site">
        <SectionHeader
          id={headingId}
          variant="split"
          eyebrow={intro.eyebrow}
          title={intro.title}
          intro={intro.intro}
        />

        <div className="-mx-gutter mt-12 scrollbar-none overflow-x-auto px-gutter">
          <div
            ref={trackRef}
            role="group"
            aria-label={labels.filterLabel}
            className={styles.filters}
          >
            <span ref={indicatorRef} aria-hidden="true" className={styles.indicator} />
            {builds.map((b) => (
              <button
                key={b.id}
                type="button"
                data-build={b.id}
                aria-pressed={b.id === build?.id}
                className={styles.filter}
                onClick={() => selectBuild(b.id)}
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>
        {build && (
          <p className="mt-4 max-w-[52ch] text-small text-muted lg:hidden">
            {build.summary}{' '}
            <span className="numeric">({labels.countLabel(usedCount, technologies.length)})</span>
          </p>
        )}

        <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-12">
          <ol
            ref={listRef}
            className={cn(styles.rows, 'lg:col-span-8')}
            onPointerLeave={() => setHovered(null)}
          >
            {rows.map((row) => (
              <li
                key={row.layer.id}
                data-flip-id={`layer-${row.layer.id}`}
                className={cn(styles.row, !layerNumber.has(row.layer.id) && 'hidden')}
                data-related={related.has(row.layer.id) || undefined}
              >
                <span aria-hidden="true" className={styles.node} />
                <div className={styles.label}>
                  <p className="eyebrow text-accent">{pad2(layerNumber.get(row.layer.id) ?? 0)}</p>
                  <h3 className={cn(styles.layerName, 'mt-1.5 text-heading-md')}>
                    {row.layer.label}
                  </h3>
                  <p className="mt-1 text-small text-muted max-md:hidden">{row.layer.line}</p>
                </div>
                <ul className={styles.tiles}>
                  {row.technologies.map((technology) => (
                    <li
                      key={technology.id}
                      data-flip-id={technology.id}
                      className={cn(!used(technology.id) && 'hidden')}
                    >
                      <button
                        type="button"
                        className={styles.tile}
                        data-active={activeId === technology.id || undefined}
                        aria-pressed={pinned === technology.id}
                        aria-label={technology.name}
                        onPointerEnter={(event) => {
                          if (event.pointerType === 'mouse') setHovered(technology.id)
                        }}
                        onFocus={() => setHovered(technology.id)}
                        onBlur={() => setHovered(null)}
                        onClick={() =>
                          setPinned((id) => (id === technology.id ? null : technology.id))
                        }
                      >
                        <span aria-hidden="true" className={styles.mark}>
                          {technology.logo ? (
                            <span
                              className={styles.logo}
                              style={{ maskImage: `url("${technology.logo}")` } as CSSProperties}
                            />
                          ) : (
                            <span className={styles.monogram}>{technology.name}</span>
                          )}
                        </span>
                        <span aria-hidden="true" className={styles.name}>
                          {technology.name}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>

          {build && (
            <StackDetail
              technology={active}
              pinned={pinned !== null && pinned === activeId}
              build={build}
              builds={builds}
              used={usedCount}
              total={technologies.length}
              labels={labels}
              onSelectBuild={selectBuild}
              onClose={() => setPinned(null)}
              className="lg:col-span-4 lg:col-start-9 lg:row-start-1"
            />
          )}
        </div>
      </div>
    </Section>
  )
}
