import { Section, type Tone } from '@/components/layout/Section'
import { StaggerGroup } from '@/components/motion/StaggerGroup'
import { Tag } from '@/components/ui/Tag'
import { ProjectCard } from '@/sections/shared/ProjectCard'
import type { Project, ProjectCategory, ProjectCategoryId } from '@/types'

export interface WorkGridProps {
  projects: Project[]
  categories: ProjectCategory[]
  /** null = all. */
  activeFilter: ProjectCategoryId | null
  onFilterChange: (filter: ProjectCategoryId | null) => void
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

/** Filterable project grid. The filter lives in the URL (?filter=), so views can be shared. */
export function WorkGrid({
  projects,
  categories,
  activeFilter,
  onFilterChange,
  labels,
  tone = 'paper',
}: WorkGridProps) {
  const visible = activeFilter
    ? projects.filter((p) => p.categories.includes(activeFilter))
    : projects
  // Only show filters that have at least one project.
  const usable = categories.filter((c) => projects.some((p) => p.categories.includes(c.id)))

  return (
    <Section tone={tone} spacing="sm">
      <div className="container-site">
        <div className="flex flex-col gap-6 border-b border-tone pb-8 md:flex-row md:items-center md:justify-between">
          <div role="group" aria-label={labels.filter} className="flex flex-wrap gap-2">
            <Tag onClick={() => onFilterChange(null)} active={activeFilter === null}>
              {labels.all}
            </Tag>
            {usable.map((category) => (
              <Tag
                key={category.id}
                onClick={() => onFilterChange(category.id)}
                active={activeFilter === category.id}
              >
                {category.label}
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
          <StaggerGroup
            key={activeFilter ?? 'all'}
            className="mt-14 grid gap-x-8 gap-y-20 md:grid-cols-2"
          >
            {visible.map((project, i) => (
              <ProjectCard
                key={project.slug}
                project={project}
                reveal={false}
                priority={i === 0}
                headingLevel="h2"
                ctaLabel={labels.cardCta}
                cursorLabel={labels.cursor}
                sampleLabel={labels.sample}
                className={i % 2 === 1 ? 'md:mt-32' : undefined}
              />
            ))}
          </StaggerGroup>
        )}
      </div>
    </Section>
  )
}
