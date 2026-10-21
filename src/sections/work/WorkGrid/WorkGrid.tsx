import { useRef } from 'react'
import { Section, type Tone } from '@/components/layout/Section'
import { Tag } from '@/components/ui/Tag'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { Flip, gsap, useGSAP } from '@/lib/gsap'
import { duration, ease } from '@/lib/motion-tokens'
import { requestRefresh } from '@/lib/scroll-refresh'
import { ProjectCard } from '@/sections/shared/ProjectCard'
import type { Project } from '@/types'

export interface WorkFilter {
  /** Project slug, stored in ?filter=. */
  id: string
  label: string
}

export interface WorkGridProps {
  projects: Project[]
  /** One per project. */
  filters: WorkFilter[]
  /** A project slug, or null for all. */
  activeFilter: string | null
  onFilterChange: (filter: string | null) => void
  labels: {
    filter: string
    all: string
    empty: string
    sample: string
    cardCta: string
    cursor: string
    count: (n: number) => string
  }
  tone?: Tone
}

/**
 * Project grid with one filter per project. The filter lives in the URL (?filter=), so views
 * can be shared.
 * Motion: each card's media opens with a clip reveal as it enters; changing the filter
 * Flips the cards that stay into their new places and fades new ones in. Nothing else
 * moves. No Flip with reduced motion.
 */
export function WorkGrid({
  projects,
  filters,
  activeFilter,
  onFilterChange,
  labels,
  tone = 'dark',
}: WorkGridProps) {
  const gridRef = useRef<HTMLDivElement>(null)
  const flipState = useRef<Flip.FlipState | null>(null)
  const reducedMotion = useReducedMotion()
  const visible = activeFilter ? projects.filter((p) => p.slug === activeFilter) : projects

  const change = (next: string | null) => {
    const grid = gridRef.current
    if (!reducedMotion && grid) flipState.current = Flip.getState(grid.children)
    onFilterChange(next)
  }

  useGSAP(
    () => {
      const state = flipState.current
      const grid = gridRef.current
      flipState.current = null
      if (!state || !grid) return
      Flip.from(state, {
        targets: grid.children,
        duration: duration.base,
        ease: ease.out,
        scale: true,
        onEnter: (entering) =>
          gsap.fromTo(entering, { opacity: 0 }, { opacity: 1, duration: duration.fast }),
        onComplete: () => requestRefresh({ force: true }),
      })
    },
    { scope: gridRef, dependencies: [activeFilter] },
  )

  return (
    <Section tone={tone} spacing="sm" className="pt-8">
      <div className="container-site">
        <div className="flex flex-col gap-6 border-b border-tone pb-8 md:flex-row md:items-center md:justify-between">
          <div role="group" aria-label={labels.filter} className="flex flex-wrap gap-2">
            <Tag onClick={() => change(null)} active={activeFilter === null}>
              {labels.all}
            </Tag>
            {filters.map((option) => (
              <Tag
                key={option.id}
                onClick={() => change(option.id)}
                active={activeFilter === option.id}
              >
                {option.label}
              </Tag>
            ))}
          </div>
          <p className="eyebrow text-muted" aria-live="polite">
            {labels.count(visible.length)}
          </p>
        </div>

        {visible.length === 0 ? (
          <p className="py-24 text-center text-body-lg text-muted">{labels.empty}</p>
        ) : (
          <div ref={gridRef} className="mt-14 grid gap-x-8 gap-y-20 md:grid-cols-2">
            {visible.map((project, i) => (
              <div
                key={project.slug}
                data-flip-id={project.slug}
                className={i % 2 === 1 ? 'md:mt-32' : undefined}
              >
                <ProjectCard
                  project={project}
                  priority={i === 0}
                  headingLevel="h2"
                  ctaLabel={labels.cardCta}
                  cursorLabel={labels.cursor}
                  sampleLabel={labels.sample}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </Section>
  )
}
