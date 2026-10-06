import { PageMeta } from '@/components/seo/PageMeta'
import { faqsFor } from '@/data/faqs'
import { pageMeta, pricingContent } from '@/data/pages'
import { plans } from '@/data/plans'
import { policies } from '@/data/policies'
import { quotePresets } from '@/data/quotes'
import { getOffering } from '@/data/services'
import { estimate } from '@/lib/estimate'
import { formatPrice, formatPriceRange } from '@/lib/format'
import { isVisible, planPrice } from '@/lib/offer'
import { MonthlyPlans } from '@/sections/pricing/MonthlyPlans'
import { PoliciesList } from '@/sections/pricing/PoliciesList'
import { PricingSteps } from '@/sections/pricing/PricingSteps'
import { QuoteStarters, type QuoteStarter } from '@/sections/pricing/QuoteStarters'
import { FaqSection } from '@/sections/shared/FaqSection'
import { PageTitle } from '@/sections/shared/PageTitle'
import { SectionNavigator } from '@/sections/shared/SectionNavigator'

const c = pricingContent
const l = c.priceLabels

/**
 * Starting quotes with the range the quote builder itself computes for them, so the
 * Pricing page and /start can never disagree. Presets the estimator can't range are skipped.
 */
const starters: QuoteStarter[] = quotePresets.flatMap((preset) => {
  const result = estimate(preset.answers)
  if (result.kind !== 'range') return []
  return [
    {
      id: preset.id,
      name: preset.name,
      for: preset.for,
      includes: preset.includes,
      // Rounded like the estimate panel on /start, so both show the same range.
      range: formatPriceRange(result.low, result.high, 1_000),
      monthly: result.carePlan
        ? c.quotes.monthly(`${formatPrice(result.carePlan.pricePerMonth)}${l.perMonth}`)
        : undefined,
      cta: { label: c.quotes.start, to: `/start?quote=${preset.id}` },
    },
  ]
})

/** Apps and software vary by scope, so show calculated starting estimates for each type. */
const appIds = c.quotes.apps.offerings
const fromPrice = (id: string) => formatPrice(getOffering(id)?.fromPrice ?? 0)
const appsCard = {
  title: c.quotes.apps.title,
  body: c.quotes.apps.body,
  lines: c.quotes.apps.prices(
    fromPrice(appIds.webApp),
    fromPrice(appIds.desktop),
    fromPrice(appIds.mobile),
  ),
  label: c.quotes.apps.label,
  to: c.quotes.apps.to,
}

/**
 * Ready-made starting quotes open the brief pre-filled. The three ongoing options sit together.
 */
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
      <div id="pricing-approach">
        <PricingSteps
          tone="paper"
          eyebrow={c.approach.eyebrow}
          title={c.approach.title}
          steps={c.approach.steps}
          cta={c.approach.cta}
        />
      </div>
      <div id="pricing-packages">
        <QuoteStarters
          tone="paper"
          eyebrow={c.quotes.eyebrow}
          title={c.quotes.title}
          intro={c.quotes.intro}
          quotes={starters}
          rangeLabel={c.quotes.rangeLabel}
          custom={appsCard}
          notes={[policies.vatNote]}
        />
      </div>
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
