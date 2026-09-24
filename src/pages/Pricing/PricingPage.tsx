import { PageMeta } from '@/components/seo/PageMeta'
import { addOns } from '@/data/addons'
import { faqsFor } from '@/data/faqs'
import { pageMeta, pricingContent } from '@/data/pages'
import { planFamilies, plans } from '@/data/plans'
import { policies } from '@/data/policies'
import { rates } from '@/data/rates'
import { getOffering, offerings } from '@/data/services'
import { formatPrice } from '@/lib/format'
import { familyFrom, isVisible, offeringPrice, planPrice, ratePrice } from '@/lib/offer'
import { IncludedVsExcluded } from '@/sections/pricing/IncludedVsExcluded'
import { PlanTabs } from '@/sections/pricing/PlanTabs'
import { PoliciesList } from '@/sections/pricing/PoliciesList'
import { PricingSummary } from '@/sections/pricing/PricingSummary'
import { RatesStrip } from '@/sections/pricing/RatesStrip'
import { FaqSection } from '@/sections/shared/FaqSection'
import { PageTitle } from '@/sections/shared/PageTitle'

export function PricingPage() {
  const c = pricingContent
  const l = c.priceLabels
  const pricedBuild = offerings.filter((o) => o.stage === 'build' && o.visibility === 'pricing')
  const audit = getOffering('website-audit')
  const familyName = (id: string) => planFamilies.find((f) => f.id === id)?.name ?? id

  const groups = [
    {
      id: 'build',
      title: c.summary.groups.build,
      items: pricedBuild.map((o) => ({ name: o.name, price: offeringPrice(o, l) })),
    },
    {
      id: 'takeover',
      title: c.summary.groups.takeover,
      items: audit ? [{ name: audit.name, price: offeringPrice(audit, l) }] : [],
    },
    {
      id: 'run',
      title: c.summary.groups.run,
      items: (['care', 'managed'] as const).map((f) => ({
        name: familyName(f),
        price: familyFrom(f, plans, l),
      })),
    },
    {
      id: 'partner',
      title: c.summary.groups.partner,
      items: [{ name: familyName('partner'), price: familyFrom('partner', plans, l) }],
    },
  ]

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
      <PageTitle content={c.hero} />
      <PricingSummary
        tone="paper"
        eyebrow={c.summary.eyebrow}
        title={c.summary.title}
        groups={groups}
        addOns={{
          title: c.summary.addOnsTitle,
          items: addOns.map((a) => ({
            name: a.name,
            price: `${formatPrice(a.price)}${a.perUnit ? ` ${c.summary.each}` : ''}`,
          })),
        }}
        more={c.summary.more}
        notes={[policies.vatNote]}
      />
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
        tone="paper"
        eyebrow={c.scope.eyebrow}
        title={policies.maintenance.title}
        intro={policies.maintenance.intro}
        included={policies.maintenance.included}
        excluded={policies.maintenance.excluded}
        outro={policies.maintenance.outro}
        labels={{ included: c.scope.includedTitle, excluded: c.scope.excludedTitle }}
      />
      <RatesStrip
        tone="dark"
        eyebrow={c.rates.eyebrow}
        title={c.rates.title}
        rates={rates.map((r) => ({
          id: r.id,
          name: r.name,
          price: ratePrice(r, l),
          description: r.description,
          examples: r.examples ?? [],
        }))}
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
      <FaqSection tone="dark" intro={c.faq} faqs={faqsFor('pricing')} />
    </>
  )
}
