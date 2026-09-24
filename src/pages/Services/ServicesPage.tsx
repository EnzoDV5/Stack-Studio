import { PageMeta } from '@/components/seo/PageMeta'
import { faqsFor } from '@/data/faqs'
import { homeContent, pageMeta, servicesContent } from '@/data/pages'
import { monthlyPlans, projectPackages } from '@/data/pricing'
import { processSteps } from '@/data/process'
import { services } from '@/data/services'
import { ServiceDetails } from '@/sections/services/ServiceDetails'
import { FaqSection } from '@/sections/shared/FaqSection'
import { PageHero } from '@/sections/shared/PageHero'
import { ProcessPinned } from '@/sections/shared/ProcessPinned'

const lowestMonthly = Math.min(...monthlyPlans.map((p) => p.pricePerMonth))

export function ServicesPage() {
  const items = services.map((service) => ({
    ...service,
    fromPrice: projectPackages.find((p) => p.id === service.pricePackageId)?.fromPrice,
    monthlyFrom: service.id === 'care' ? lowestMonthly : undefined,
  }))

  return (
    <>
      <PageMeta {...pageMeta.services} />
      <PageHero content={servicesContent.hero} />
      <ServiceDetails services={items} labels={servicesContent.detailLabels} />
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
