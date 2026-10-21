import { useSearchParams } from 'react-router'
import { PageMeta } from '@/components/seo/PageMeta'
import { pageMeta, workContent } from '@/data/pages'
import { projects } from '@/data/projects'
import { PageTitle } from '@/sections/shared/PageTitle'
import { WorkGrid } from '@/sections/work/WorkGrid'

/** One filter per project, so every piece of work can be picked out on its own. */
const filters = projects.map((project) => ({ id: project.slug, label: project.name }))

export function WorkPage() {
  const [params, setParams] = useSearchParams()
  const raw = params.get('filter')
  const filter = filters.some((f) => f.id === raw) ? raw : null

  return (
    <>
      <PageMeta {...pageMeta.work} />
      <PageTitle content={workContent.hero} />
      <WorkGrid
        projects={projects}
        filters={filters}
        activeFilter={filter}
        onFilterChange={(next) =>
          setParams(next ? { filter: next } : {}, { replace: true, preventScrollReset: true })
        }
        labels={{
          filter: workContent.filterLabel,
          all: workContent.allLabel,
          empty: workContent.emptyLabel,
          sample: workContent.sampleLabel,
          cardCta: workContent.cardCta,
          count: workContent.countLabel,
        }}
      />
    </>
  )
}
