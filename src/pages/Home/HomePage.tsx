import { lazy } from 'react'
import { DeferredSection } from '@/components/layout/DeferredSection'
import { PageMeta } from '@/components/seo/PageMeta'
import { clients as clientList } from '@/data/clients'
import { media, serviceMedia } from '@/data/media'
import { homeContent, pageMeta, pricingContent, workContent } from '@/data/pages'
import { planFamilies, plans } from '@/data/plans'
import { policies } from '@/data/policies'
import { processSteps } from '@/data/process'
import { getProject, projects } from '@/data/projects'
import { rates } from '@/data/rates'
import { getOffering, offerings, serviceStages } from '@/data/services'
import { founders } from '@/data/studio'
import { testimonials } from '@/data/testimonials'
import { technologies, technologyContent } from '@/data/technologies'
import { formatPrice } from '@/lib/format'
import { familyFrom, familyMin, stageRows } from '@/lib/offer'
import { HomeHero } from '@/sections/home/HomeHero'
import { WorkReel } from '@/sections/home/WorkReel'
import type { PlanFamily, StageId } from '@/types'

// Home leads with the visitor's needs: where they are, how Stack works and indicative
// pricing. Proof, client voices and the founders follow as reassurance before the closing band.
// Heavy sections mount only as they approach the viewport.
const PathChooser = lazy(() =>
  import('@/sections/home/PathChooser').then((m) => ({ default: m.PathChooser })),
)
const ProcessLine = lazy(() =>
  import('@/sections/home/ProcessLine').then((m) => ({ default: m.ProcessLine })),
)
const ClientVoices = lazy(() =>
  import('@/sections/home/ClientVoices').then((m) => ({ default: m.ClientVoices })),
)
const PricingSnapshot = lazy(() =>
  import('@/sections/home/PricingSnapshot').then((m) => ({ default: m.PricingSnapshot })),
)
const StudioSnippet = lazy(() =>
  import('@/sections/home/StudioSnippet').then((m) => ({ default: m.StudioSnippet })),
)

const l = pricingContent.priceLabels
const familyName = (id: PlanFamily) => planFamilies.find((f) => f.id === id)?.name ?? id
const familyItem = (id: PlanFamily) => ({ name: familyName(id), price: familyFrom(id, plans, l) })
const stageNames = Object.fromEntries(serviceStages.map((s) => [s.id, s.name])) as Record<
  StageId,
  string
>

/** Home keeps each stage short: 2–3 priced offerings, or plan families as "from" lines. */
function stageItems(stage: StageId) {
  switch (stage) {
    case 'run':
      return [familyItem('care'), familyItem('managed')]
    case 'partner':
      return [familyItem('partner')]
    default:
      return stageRows(stage, { offerings, plans, rates }, l, {
        pricedOnly: stage !== 'takeover',
      })
        .slice(0, 3)
        .map((row) => ({ name: row.name, price: row.price }))
  }
}

/** A snapshot figure's amount: an offering's from-price or a plan family's cheapest plan. */
function snapshotAmount(source: { offering: string } | { planFamily: PlanFamily }) {
  if ('planFamily' in source) {
    const min = familyMin(source.planFamily, plans)
    return { value: min === null ? '' : formatPrice(min), unit: l.perMonth }
  }
  const offering = getOffering(source.offering)
  return { value: offering ? formatPrice(offering.fromPrice) : '', unit: undefined }
}

export function HomePage() {
  const { hero, work, clients, paths, process, pricing, studio } = homeContent

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
          stages={serviceStages.map((stage) => ({
            id: stage.id,
            index: stage.index,
            name: stage.name,
            prompt: paths.prompts[stage.id],
            line: stage.line,
            items: stageItems(stage.id),
            details: { label: paths.details, to: `/services#stage-${stage.id}` },
            estimate: { label: paths.estimate, to: `/start?path=${stage.briefPath}` },
            media: serviceMedia[stage.id],
          }))}
        />
      </DeferredSection>

      <DeferredSection minHeight="100vh">
        <ProcessLine
          index={2}
          eyebrow={process.eyebrow}
          title={process.title}
          steps={processSteps}
          stepLabel={process.stepLabel}
          nowLabel={process.nowLabel}
          overview={process.overview}
          columns={process.columns}
          more={process.more}
          technologies={{ ...technologyContent, rows: [technologies] }}
        />
      </DeferredSection>

      <DeferredSection minHeight="85vh">
        <PricingSnapshot
          index={3}
          eyebrow={pricing.eyebrow}
          title={pricing.title}
          intro={pricing.intro}
          figures={pricing.items.map((item) => ({
            label: item.label,
            prefix: l.from,
            note: item.note,
            ...snapshotAmount(item.source),
          }))}
          notes={[policies.vatNote]}
          estimateCta={pricing.estimateCta}
          more={pricing.more}
        />
      </DeferredSection>

      <WorkReel
        index={4}
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
          index={5}
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
          index={6}
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
