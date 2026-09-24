import { useSearchParams } from 'react-router'
import { PageMeta } from '@/components/seo/PageMeta'
import { pageMeta, workContent } from '@/data/pages'
import { projectCategories, projects } from '@/data/projects'
import { PageTitle } from '@/sections/shared/PageTitle'
import { WorkGrid } from '@/sections/work/WorkGrid'
import type { ProjectCategoryId } from '@/types'

function isCategory(value: string | null): value is ProjectCategoryId {
  return projectCategories.some((c) => c.id === value)
}

export function WorkPage() {
  const [params, setParams] = useSearchParams()
  const raw = params.get('filter')
  const filter = isCategory(raw) ? raw : null

  return (
    <>
      <PageMeta {...pageMeta.work} />
      <PageTitle content={workContent.hero} />
      <WorkGrid
        projects={projects}
        categories={projectCategories}
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
          cursor: workContent.cursorLabel,
          count: workContent.countLabel,
        }}
      />
    </>
  )
}
