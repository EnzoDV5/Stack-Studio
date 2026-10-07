import { lazy } from 'react'
import { DeferredSection } from '@/components/layout/DeferredSection'
import { PageMeta } from '@/components/seo/PageMeta'
import { clients as clientList } from '@/data/clients'
import { media, serviceMedia } from '@/data/media'
import { homeContent, pageMeta, pricingContent, workContent } from '@/data/pages'
import { planFamilies, plans } from '@/data/plans'
import { getProject, projects } from '@/data/projects'
import { rates } from '@/data/rates'
import { offerings, serviceStages } from '@/data/services'
import { founders } from '@/data/studio'
import { technologies, technologyContent } from '@/data/technologies'
import { testimonials } from '@/data/testimonials'
import { stageRows } from '@/lib/offer'
import { HomeHero } from '@/sections/home/HomeHero'
import { WorkReel } from '@/sections/home/WorkReel'
import type { PlanFamily, StageId } from '@/types'

// Home is a short summary of the whole site, one stop per page: what we do (with the stack behind
// the work), the work and what clients say, how we work, and the founders, then the closing band.
// No prices or detail: each section links to the page that has it. Heavy sections mount only as
// they approach the viewport.
const PathChooser = lazy(() =>
  import('@/sections/home/PathChooser').then((m) => ({ default: m.PathChooser })),
)
const ClientVoices = lazy(() =>
  import('@/sections/home/ClientVoices').then((m) => ({ default: m.ClientVoices })),
)
const ProcessSnippet = lazy(() =>
  import('@/sections/home/ProcessSnippet').then((m) => ({ default: m.ProcessSnippet })),
)
const StudioSnippet = lazy(() =>
  import('@/sections/home/StudioSnippet').then((m) => ({ default: m.StudioSnippet })),
)

const familyItem = (id: PlanFamily) => ({
  name: planFamilies.find((f) => f.id === id)?.name ?? id,
})

const stageNames = Object.fromEntries(serviceStages.map((s) => [s.id, s.name])) as Record<
  StageId,
  string
>

/**
 * Home's four paths. Take over is folded into its neighbours, as on Services: fixing joins Grow
 * (quoted by the hour through the brief's `existing` path) and a new home joins Run (a care
 * plan, so it opens the plans).
 */
const homePaths = ['build', 'grow', 'run', 'partner'] as const

/** Home keeps each path short: 2–3 example offerings or plan families, without prices. */
function stageItems(stage: StageId) {
  switch (stage) {
    case 'grow':
      return homeContent.paths.fixExamples
    case 'run':
      return [familyItem('care'), familyItem('managed'), familyItem('partner')]
    case 'partner':
      return homeContent.paths.partnerExamples
    default:
      return stageRows(stage, { offerings, plans, rates }, pricingContent.priceLabels, {
        pricedOnly: true,
        prices: false,
      })
        .slice(0, 3)
        .map((row) => ({ name: row.name }))
  }
}

export function HomePage() {
  const { hero, work, clients, paths, process, studio } = homeContent

  return (
    <>
      <PageMeta {...pageMeta.home} />

      <HomeHero {...hero} video={media.home.showreel} />

      <DeferredSection minHeight="110vh">
        <PathChooser
          index={1}
          tone="dark"
          eyebrow={paths.eyebrow}
          title={paths.title}
          intro={paths.intro}
          labels={{ items: paths.itemsLabel }}
          more={paths.more}
          technologies={{ ...technologyContent, rows: [technologies] }}
          stages={homePaths.flatMap((id, i) => {
            const stage = serviceStages.find((s) => s.id === id)
            if (!stage) return []
            return [
              {
                id,
                index: i + 1,
                name: stage.name,
                prompt: paths.prompts[id],
                line: stage.line,
                items: stageItems(id),
                details: { label: paths.details, to: `/services#stage-${id}` },
                estimate:
                  id === 'run'
                    ? paths.plans
                    : {
                        label: paths.estimate,
                        to: id === 'partner' ? stage.cta.to : `/start?path=${stage.briefPath}`,
                      },
                media: serviceMedia[id],
              },
            ]
          })}
        />
      </DeferredSection>

      <WorkReel
        index={2}
        eyebrow={work.eyebrow}
        title={work.title}
        projects={projects}
        clients={clientList}
        stageNames={stageNames}
        labels={{
          cta: work.cardCta,
          cursor: work.cursorLabel,
          sample: workContent.sampleLabel,
          sector: work.sectorLabel,
          stages: work.stagesLabel,
        }}
        more={work.more}
        outro={work.outro}
      />

      <DeferredSection minHeight="90vh">
        <ClientVoices
          index={3}
          tone="paper"
          eyebrow={clients.eyebrow}
          title={clients.title}
          more={clients.more}
          voices={testimonials.map((t) => {
            const project = getProject(t.projectSlug)
            return {
              id: t.id,
              quote: t.quote,
              name: t.name,
              role: t.role,
              company: t.company,
              link: project
                ? { label: clients.caseLink(t.company), to: `/work/${project.slug}` }
                : undefined,
            }
          })}
        />
      </DeferredSection>

      <DeferredSection minHeight="80vh">
        <ProcessSnippet
          index={4}
          tone="paper"
          eyebrow={process.eyebrow}
          title={process.title}
          steps={process.steps}
          more={process.more}
        />
      </DeferredSection>

      <DeferredSection minHeight="95vh">
        <StudioSnippet
          index={5}
          tone="paper"
          eyebrow={studio.eyebrow}
          title={studio.title}
          intro={studio.intro}
          founders={founders}
          more={studio.more}
        />
      </DeferredSection>
    </>
  )
}
