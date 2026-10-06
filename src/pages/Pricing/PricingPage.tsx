import { PageMeta } from '@/components/seo/PageMeta'
import { faqsFor } from '@/data/faqs'
import { pageMeta, pricingContent } from '@/data/pages'
import { plans } from '@/data/plans'
import { policies } from '@/data/policies'
import { isVisible, planPrice } from '@/lib/offer'
import { CareOptions } from '@/sections/pricing/CareOptions'
import { HowItWorks } from '@/sections/pricing/HowItWorks'
import { MonthlyPlans } from '@/sections/pricing/MonthlyPlans'
import { PoliciesList } from '@/sections/pricing/PoliciesList'
import { FaqSection } from '@/sections/shared/FaqSection'
import { PageTitle } from '@/sections/shared/PageTitle'
import { SectionNavigator } from '@/sections/shared/SectionNavigator'

const c = pricingContent
const l = c.priceLabels

/** How the relationship starts, the three support options, then prices and terms. */
export function PricingPage() {
  const fixedPlans = plans
    .filter((plan) => (plan.family === 'care' || plan.family === 'managed') && isVisible(plan))
    .map((plan) => ({
      id: plan.id,
      name: plan.name,
      tagline: plan.tagline,
      price: planPrice(plan, l),
      includes: plan.includes,
      excludes: plan.excludes ?? [],
      labels: { included: c.scope.includedTitle, excluded: c.scope.excludedTitle },
      cta: {
        label: c.plans.choose,
        to: `/start?plan=${plan.id}`,
        location: `pricing-plan:${plan.id}`,
      },
    }))
  const monthlyPlans = [
    ...fixedPlans,
    {
      id: 'partner',
      anchorId: 'pricing-partner',
      accent: true,
      ...c.plans.partner,
      labels: { included: c.scope.includedTitle, excluded: c.scope.excludedTitle },
      cta: { ...c.plans.partner.cta, location: 'pricing-plan:partner' },
    },
  ]

  return (
    <>
      <PageMeta {...pageMeta.pricing} />
      <SectionNavigator {...c.navigation} />
      <div id="pricing-top">
        <PageTitle content={c.hero} />
      </div>
      <div id="pricing-how-it-works">
        <HowItWorks {...c.approach} tone="paper" />
      </div>
      <CareOptions id="pricing-options" {...c.options} tone="paper" />
      <div id="pricing-plans">
        <MonthlyPlans
          tone="dark"
          eyebrow={c.plans.eyebrow}
          title={c.plans.title}
          plans={monthlyPlans}
          footnotes={[
            c.plans.boundary,
            c.plans.minTerm(policies.minimumTermMonths),
            policies.vatNote,
          ]}
        />
      </div>
      <div id="pricing-terms">
        <PoliciesList
          tone="paper"
          eyebrow={c.policies.eyebrow}
          title={c.policies.title}
          scheduleLabel={c.policies.scheduleLabel}
          schedules={policies.paymentSchedules}
          items={policies.items}
          vatNote={policies.vatNote}
        />
      </div>
      <div id="pricing-faq">
        <FaqSection tone="paper" intro={c.faq} faqs={faqsFor('pricing')} />
      </div>
    </>
  )
}
