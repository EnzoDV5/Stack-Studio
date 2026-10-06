import { PageMeta } from '@/components/seo/PageMeta'
import { faqsFor } from '@/data/faqs'
import { pageMeta, pricingContent } from '@/data/pages'
import { planFamilies, plans } from '@/data/plans'
import { policies } from '@/data/policies'
import { quotePresets } from '@/data/quotes'
import { getOffering } from '@/data/services'
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
 * No fixed price list: how a quote is reached, ready-made starting quotes that open the
 * quote builder pre-filled, then the monthly plans and the terms.
 */
export function PricingPage() {
  const tabs = planFamilies.map((family) => ({
    id: family.id,
    name: family.name,
    description: family.description,
    note: family.note,
    actions:
      family.id === 'partner'
        ? [
            {
              label: c.plans.partnerChoose,
              to: '/start?partner=custom',
              location: 'pricing-partner:custom',
            },
            {
              label: c.plans.partnerDiscuss,
              to: '/start?partner=discuss',
              location: 'pricing-partner:discuss',
            },
          ]
        : undefined,
    plans: plans
      .filter((p) => p.family === family.id && isVisible(p))
      .map((p) => ({
        id: p.id,
        name: p.name,
        tagline: p.tagline,
        price: planPrice(p, l),
        hours: p.hoursLabel
          ? family.id === 'partner'
            ? c.plans.reservedHours(p.hoursLabel)
            : l.hours(p.hoursLabel)
          : undefined,
        includes: p.includes,
        highlighted: p.highlighted,
        cta: {
          label: family.id === 'partner' ? c.plans.partnerStart : c.plans.choose,
          to: `/start?plan=${p.id}`,
          location: `pricing-plan:${p.id}`,
        },
      })),
  }))

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
        <PlanTabs
          tone="dark"
          eyebrow={c.plans.eyebrow}
          title={c.plans.title}
          tabsLabel={c.plans.tabsLabel}
          tabs={tabs}
          recommendedLabel={c.plans.recommended}
          footnotes={[c.plans.minTerm(policies.minimumTermMonths), policies.hostingOnRequest]}
        />
      </div>
      <div id="pricing-included">
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
