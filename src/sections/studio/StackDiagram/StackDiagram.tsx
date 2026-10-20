import { useId, useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import { Section, type Tone } from '@/components/layout/Section'
import { cn } from '@/lib/cn'
import { pad2 } from '@/lib/format'
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
  // Bumped on each build change so the lit logos replay their pop (they remount).
  const [pops, setPops] = useState(0)
  const [hovered, setHovered] = useState<string | null>(null)
  const [pinned, setPinned] = useState<string | null>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const indicatorRef = useRef<HTMLSpanElement>(null)

  const build = builds.find((b) => b.id === buildId) ?? builds[0]
  const rows = stackRows(technologies, layers)
  const used = (id: string) => !build || usesTechnology(build, id)
  const usedCount = technologies.filter((t) => used(t.id)).length
  const activeId = hovered ?? pinned
  const active = technologies.find((t) => t.id === activeId)
  const related = new Set(active ? layersTouching(layers, active).map((layer) => layer.id) : [])
  // Each lit logo pops a beat after the one before it, top to bottom.
  const popOrder = new Map(
    rows
      .flatMap((row) => row.technologies)
      .filter((t) => used(t.id))
      .map((t, i) => [t.id, i]),
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
    if (id === buildId) return
    setBuildId(id)
    setPops((n) => n + 1)
    setHovered(null)
  }

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
          <ol className={cn(styles.rows, 'lg:col-span-8')} onPointerLeave={() => setHovered(null)}>
            {rows.map((row, i) => (
              <li
                key={row.layer.id}
                className={styles.row}
                data-live={row.technologies.some((t) => used(t.id)) || undefined}
                data-related={related.has(row.layer.id) || undefined}
              >
                <span aria-hidden="true" className={styles.node} />
                <div className={styles.label}>
                  <p className="eyebrow text-accent">{pad2(i + 1)}</p>
                  <h3 className={cn(styles.layerName, 'mt-1.5 text-heading-md')}>
                    {row.layer.label}
                  </h3>
                  <p className="mt-1 text-small text-muted max-md:hidden">{row.layer.line}</p>
                </div>
                <ul className={styles.tiles}>
                  {row.technologies.map((technology) => (
                    <li key={technology.id}>
                      <button
                        type="button"
                        className={styles.tile}
                        data-on={used(technology.id) || undefined}
                        data-active={activeId === technology.id || undefined}
                        aria-pressed={pinned === technology.id}
                        aria-label={technology.name}
                        style={{ '--i': popOrder.get(technology.id) ?? 0 } as CSSProperties}
                        onPointerEnter={(event) => {
                          if (event.pointerType === 'mouse') setHovered(technology.id)
                        }}
                        onFocus={() => setHovered(technology.id)}
                        onBlur={() => setHovered(null)}
                        onClick={() =>
                          setPinned((id) => (id === technology.id ? null : technology.id))
                        }
                      >
                        <span
                          key={pops}
                          aria-hidden="true"
                          className={styles.mark}
                          data-pop={pops > 0 || undefined}
                        >
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
