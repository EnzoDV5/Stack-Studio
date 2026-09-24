import { PageMeta } from '@/components/seo/PageMeta'
import { faqsFor } from '@/data/faqs'
import { pageMeta, pricingContent } from '@/data/pages'
import { addOns, monthlyPlans, pricingSettings, projectPackages } from '@/data/pricing'
import { AddOnsTable } from '@/sections/pricing/AddOnsTable'
import { PricingModels } from '@/sections/pricing/PricingModels'
import { CtaBanner } from '@/sections/shared/CtaBanner'
import { FaqSection } from '@/sections/shared/FaqSection'
import { PageHero } from '@/sections/shared/PageHero'

export function PricingPage() {
  const { models } = pricingContent
  return (
    <>
      <PageMeta {...pageMeta.pricing} />
      <PageHero content={pricingContent.hero} />
      <PricingModels
        project={models.project}
        monthly={models.monthly}
        packages={projectPackages}
        plans={monthlyPlans}
        labels={{
          from: models.fromLabel,
          perMonth: models.perMonth,
          popular: models.popularLabel,
          choose: models.choose,
          pages: models.pagesLabel,
          weeks: models.weeksLabel,
          minTerm: models.minTermLabel,
        }}
        notes={[
          pricingSettings.vatNote,
          pricingSettings.disclaimer,
          ...(pricingSettings.isPlaceholder ? [pricingSettings.placeholderNotice] : []),
        ]}
      />
      <AddOnsTable
        intro={{ eyebrow: pricingContent.addOns.eyebrow, title: pricingContent.addOns.title }}
        addOns={addOns}
        labels={{
          once: pricingContent.addOns.onceLabel,
          monthly: pricingContent.addOns.monthlyLabel,
          name: pricingContent.addOns.nameLabel,
          price: pricingContent.addOns.priceLabel,
        }}
      />
      <CtaBanner content={pricingContent.estimator} location="pricing-estimator" />
      <FaqSection intro={pricingContent.faq} faqs={faqsFor('pricing')} />
    </>
  )
}
