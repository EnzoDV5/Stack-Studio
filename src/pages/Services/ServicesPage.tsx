import { PageMeta } from '@/components/seo/PageMeta'
import { faqsFor } from '@/data/faqs'
import { serviceMedia } from '@/data/media'
import { pageMeta, pricingContent, servicesContent } from '@/data/pages'
import { planFamilies, plans } from '@/data/plans'
import { policies } from '@/data/policies'
import { processSteps } from '@/data/process'
import { rates } from '@/data/rates'
import { offerings, serviceStages } from '@/data/services'
import { stageRows } from '@/lib/offer'
import type { StageLayout } from '@/sections/services/StageBlock'
import { StageExplorer } from '@/sections/services/StageExplorer'
import { FaqSection } from '@/sections/shared/FaqSection'
import { PageTitle } from '@/sections/shared/PageTitle'
import { ProcessPinned } from '@/sections/shared/ProcessPinned'
import type { StageId } from '@/types'

/** Each stage laid out for what it sells; no two stages share a layout. */
const stageLayouts: Record<StageId, StageLayout> = {
  build: 'feature',
  takeover: 'cards',
  run: 'split',
  grow: 'figures',
  partner: 'tiers',
}

const stageNotes: Partial<Record<StageId, string[]>> = {
  run: [policies.hostingOnRequest],
  partner: planFamilies.flatMap((f) => (f.id === 'partner' && f.note ? [f.note] : [])),
}

export function ServicesPage() {
  const data = { offerings, plans, rates }
  const stages = serviceStages.map((stage) => ({
    id: stage.id,
    index: stage.index,
    name: stage.name,
    line: stage.line,
    summary: stage.summary,
    rows: stageRows(stage.id, data, pricingContent.priceLabels),
    notes: stageNotes[stage.id],
    cta: stage.cta,
    media: serviceMedia[stage.id],
    layout: stageLayouts[stage.id],
  }))

  return (
    <>
      <PageMeta {...pageMeta.services} />
      <PageTitle content={servicesContent.hero} reveal />
      <StageExplorer
        stages={stages}
        navLabel={servicesContent.navLabel}
        labels={servicesContent.labels}
      />
      <ProcessPinned
        id="process"
        tone="dark"
        intro={{
          eyebrow: servicesContent.process.eyebrow,
          title: servicesContent.process.title,
          intro: servicesContent.process.intro,
        }}
        steps={processSteps}
        stepLabel={servicesContent.process.stepLabel}
      />
      <FaqSection
        tone="dark"
        intro={servicesContent.faq}
        faqs={faqsFor('general', 'services', 'process')}
      />
    </>
  )
}
