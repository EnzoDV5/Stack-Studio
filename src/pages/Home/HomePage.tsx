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
import type { ChapterFlowItem } from '@/sections/home/ChapterFlow'
import { WorkReel } from '@/sections/home/WorkReel'
import type { PlanFamily, StageId } from '@/types'

// Home moves from the visitor's need to the offer and process, then proves the work with
// projects, client voices and the founders. Each chapter points to its full page. Heavy
// sections mount only as they approach the viewport.
const PathChooser = lazy(() =>
  import('@/sections/home/PathChooser').then((m) => ({ default: m.PathChooser })),
)
const ClientVoices = lazy(() =>
  import('@/sections/home/ClientVoices').then((m) => ({ default: m.ClientVoices })),
)
const ChapterFlow = lazy(() =>
  import('@/sections/home/ChapterFlow').then((m) => ({ default: m.ChapterFlow })),
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

function chapterClip(stage: StageId): ChapterFlowItem['media'] {
  const video = serviceMedia[stage].video
  if (!video) throw new Error(`Missing video for home chapter ${stage}`)
  return { kind: 'video', video }
}

const chapterMedia: ChapterFlowItem['media'][] = [
  {
    kind: 'website',
    screen: media.projects.gcSolar.screen,
    solutions: media.projects.gcSolar.gallery[0],
    projects: media.projects.gcSolar.gallery[2],
  },
  { kind: 'software', laptop: media.desktop.laptop, phone: media.apps.phone },
  chapterClip('grow'),
  chapterClip('partner'),
  chapterClip('build'),
  chapterClip('run'),
]

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
  const { hero, work, clients, paths, chapterFlow, studio } = homeContent
  const chapters: ChapterFlowItem[] = chapterFlow.items.map((item, i) => {
    const media = chapterMedia[i]
    if (!media) throw new Error(`Missing media for home chapter ${i + 1}`)
    return { ...item, media }
  })

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

      <DeferredSection minHeight="430vh">
        <ChapterFlow index={2} tone="paper" {...chapterFlow} items={chapters} />
      </DeferredSection>

      <WorkReel
        index={3}
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
        outroIllustration={media.home.startToFinish}
      />

      <DeferredSection minHeight="90vh">
        <ClientVoices
          index={4}
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
