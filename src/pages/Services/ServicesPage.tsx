import { PageMeta } from '@/components/seo/PageMeta'
import { faqsFor } from '@/data/faqs'
import { homeContent, pageMeta, pricingContent, servicesContent } from '@/data/pages'
import { planFamilies, plans } from '@/data/plans'
import { policies } from '@/data/policies'
import { processSteps } from '@/data/process'
import { rates } from '@/data/rates'
import { offerings, serviceStages } from '@/data/services'
import { stageRows } from '@/lib/offer'
import { StageExplorer } from '@/sections/services/StageExplorer'
import { FaqSection } from '@/sections/shared/FaqSection'
import { PageTitle } from '@/sections/shared/PageTitle'
import { ProcessPinned } from '@/sections/shared/ProcessPinned'
import type { StageId } from '@/types'

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
  }))

  return (
    <>
      <PageMeta {...pageMeta.services} />
      <PageTitle content={servicesContent.hero} />
      <StageExplorer
        stages={stages}
        navLabel={servicesContent.navLabel}
        labels={servicesContent.labels}
      />
      <ProcessPinned
        tone="dark"
        intro={{
          eyebrow: homeContent.process.eyebrow,
          title: homeContent.process.title,
          intro: homeContent.process.intro,
        }}
        steps={processSteps}
        stepLabel={homeContent.process.stepLabel}
      />
      <FaqSection intro={servicesContent.faq} faqs={faqsFor('general', 'services', 'process')} />
    </>
  )
}
