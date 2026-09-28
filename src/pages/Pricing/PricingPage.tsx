import { DeferredSection } from '@/components/layout/DeferredSection'
import { PageMeta } from '@/components/seo/PageMeta'
import { faqsFor } from '@/data/faqs'
import { pageMeta, pricingContent } from '@/data/pages'
import { planFamilies, plans } from '@/data/plans'
import { policies } from '@/data/policies'
import { quotePresets } from '@/data/quotes'
import { estimate } from '@/lib/estimate'
import { formatPrice, formatPriceRange } from '@/lib/format'
import { isVisible, planPrice } from '@/lib/offer'
import { IncludedVsExcluded } from '@/sections/pricing/IncludedVsExcluded'
import { PlanTabs } from '@/sections/pricing/PlanTabs'
import { PoliciesList } from '@/sections/pricing/PoliciesList'
import { PricingSteps } from '@/sections/pricing/PricingSteps'
import { QuoteStarters, type QuoteStarter } from '@/sections/pricing/QuoteStarters'
import { FaqSection } from '@/sections/shared/FaqSection'
import { PageTitle } from '@/sections/shared/PageTitle'

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

/**
 * No fixed price list: how a quote is reached, ready-made starting quotes that open the
 * quote builder pre-filled, then the monthly plans and the terms.
 */
export function PricingPage() {
  const tabs = planFamilies.map((family) => ({
    id: family.id,
    name: family.name,
    description: family.description,
    note: family.note,
    plans: plans
      .filter((p) => p.family === family.id && isVisible(p))
      .map((p) => ({
        id: p.id,
        name: p.name,
        tagline: p.tagline,
        price: planPrice(p, l),
        hours: p.hoursLabel ? l.hours(p.hoursLabel) : undefined,
        includes: p.includes,
        highlighted: p.highlighted,
        cta: {
          label: c.plans.choose,
          to: `/start?plan=${p.id}`,
          location: `pricing-plan:${p.id}`,
        },
      })),
  }))

  return (
    <>
      <PageMeta {...pageMeta.pricing} />
      <PageTitle content={c.hero} reveal />
      <PricingSteps
        tone="paper"
        eyebrow={c.approach.eyebrow}
        title={c.approach.title}
        steps={c.approach.steps}
        cta={c.approach.cta}
      />
      <QuoteStarters
        tone="paper"
        eyebrow={c.quotes.eyebrow}
        title={c.quotes.title}
        intro={c.quotes.intro}
        quotes={starters}
        rangeLabel={c.quotes.rangeLabel}
        custom={c.quotes.custom}
        notes={[policies.vatNote]}
      />
      {/* Below the fold: mounted as it approaches, so the first render stays light. */}
      <DeferredSection minHeight="120vh">
        <PlanTabs
          tone="dark"
          eyebrow={c.plans.eyebrow}
          title={c.plans.title}
          tabsLabel={c.plans.tabsLabel}
          tabs={tabs}
          popularLabel={c.plans.popular}
          footnotes={[c.plans.minTerm(policies.minimumTermMonths), policies.hostingOnRequest]}
        />
        <IncludedVsExcluded
          tone="dark"
          eyebrow={c.scope.eyebrow}
          title={policies.maintenance.title}
          intro={policies.maintenance.intro}
          included={policies.maintenance.included}
          excluded={policies.maintenance.excluded}
          outro={policies.maintenance.outro}
          labels={{ included: c.scope.includedTitle, excluded: c.scope.excludedTitle }}
        />
        <PoliciesList
          tone="paper"
          eyebrow={c.policies.eyebrow}
          title={c.policies.title}
          scheduleLabel={c.policies.scheduleLabel}
          schedules={policies.paymentSchedules}
          items={policies.items}
          vatNote={policies.vatNote}
          termsLink={c.policies.termsLink}
        />
        <FaqSection tone="paper" intro={c.faq} faqs={faqsFor('pricing')} />
      </DeferredSection>
    </>
  )
}
