import { PageMeta } from '@/components/seo/PageMeta'
import { faqsFor } from '@/data/faqs'
import { media, serviceMedia } from '@/data/media'
import { homeContent, pageMeta, pricingContent, servicesContent } from '@/data/pages'
import { plans } from '@/data/plans'
import { policies } from '@/data/policies'
import { rates } from '@/data/rates'
import { offerings, serviceStages } from '@/data/services'
import { isVisible, planPrice, stageRows, type OfferRow } from '@/lib/offer'
import { AppShowcase } from '@/sections/services/AppShowcase'
import { DesktopShowcase } from '@/sections/services/DesktopShowcase'
import { MonthlyPlans } from '@/sections/services/MonthlyPlans'
import { ServicesHero } from '@/sections/services/ServicesHero'
import { StageExplorer, type StageExplorerStage } from '@/sections/services/StageExplorer'
import { FaqSection } from '@/sections/shared/FaqSection'
import { SectionNavigator } from '@/sections/shared/SectionNavigator'
import type { BuildKind, StageId } from '@/types'

const c = servicesContent
const l = pricingContent.priceLabels
const data = { offerings, plans, rates }

/**
 * Services shows no project prices (the brief gives the estimate). Each build service opens the
 * brief with that service picked, so choosing one is the way in. The monthly plans, in Hosting
 * and care, are the one place their prices appear.
 */
const withStart = (row: OfferRow): OfferRow =>
  offerings.some((o) => o.id === row.id && o.briefKind)
    ? { ...row, start: { label: c.labels.start, to: `/start?type=${row.id}` } }
    : row
const rowsFor = (stage: StageId) => stageRows(stage, data, l, { prices: false }).map(withStart)

const stage = (id: StageId) => serviceStages.find((s) => s.id === id)

// Build splits in three, the way visitors look for it and the brief asks for it (briefKind):
// websites, apps (with the phone) and software for your team (desktop, with the laptop).
const buildRows = rowsFor('build')
const rowsOfKind = (kind: BuildKind) =>
  buildRows.filter((row) => offerings.find((o) => o.id === row.id)?.briefKind === kind)
const websiteRows = rowsOfKind('website')
const appRows = rowsOfKind('app')
const desktopRows = rowsOfKind('software')

const websites: StageExplorerStage = {
  id: 'stage-build',
  name: c.websites.name,
  line: c.websites.line,
  rows: websiteRows,
  cta: c.websites.cta,
  media: serviceMedia.build,
  layout: 'feature',
}

// 04 Fix or improve, as on Home. Fixing is quoted by the hour like any improvement.
const grow = stage('grow')
const improve: StageExplorerStage[] = grow
  ? [
      {
        id: 'stage-grow',
        name: homeContent.paths.prompts.grow,
        line: grow.line,
        rows: rowsFor('grow'),
        cta: grow.cta,
        illustration: media.services.fixOrImprove,
        layout: 'figures',
      },
    ]
  : []

// 05 Hosting and care: a new home means a care plan, so the group is the plan cards themselves
// (Website Care, Managed Software, then Partner, which is built from copy and has no fixed price).
const p = pricingContent.plans
const scopeLabels = {
  included: pricingContent.scope.includedTitle,
  excluded: pricingContent.scope.excludedTitle,
}
const monthlyPlans = [
  ...plans
    .filter((plan) => (plan.family === 'care' || plan.family === 'managed') && isVisible(plan))
    .map((plan) => ({
      id: plan.id,
      anchorId: `plan-${plan.family}`,
      name: plan.name,
      tagline: plan.tagline,
      price: planPrice(plan, l),
      includes: plan.includes,
      excludes: plan.excludes ?? [],
      labels: scopeLabels,
      cta: { label: p.choose, to: `/start?plan=${plan.id}`, location: `services-plan:${plan.id}` },
    })),
  {
    id: 'partner',
    anchorId: 'plan-partner',
    accent: true,
    mark: true,
    ...p.partner,
    labels: scopeLabels,
    cta: { ...p.partner.cta, location: 'services-plan:partner' },
  },
]

/**
 * Services is what we offer, grouped the way people look for it: websites, apps and software
 * (the phone), desktop software (the laptop), fixing or improving what exists, and hosting and
 * care (the monthly plans, with prices). How a project runs is on /process.
 */
export function ServicesPage() {
  return (
    <>
      <PageMeta {...pageMeta.services} />
      <SectionNavigator {...c.navigation} />
      <div id="services-top">
        <ServicesHero
          content={c.hero}
          items={c.navigation.items.map((item) => ({
            ...item,
            icon: media.services.icons[item.id],
          }))}
        />
      </div>
      <StageExplorer className="pt-4 md:pt-8" stages={[websites]} labels={c.labels} />
      {/* The phone turn is scrubbed; the laptop after it plays once (an enter), so the two
          device sections never share a trigger. */}
      <AppShowcase
        id="apps"
        title={c.apps.title}
        intro={c.apps.intro}
        rows={appRows}
        includesLabel={c.labels.includes}
        cta={c.apps.cta}
        phone={media.apps.phone}
      />
      <DesktopShowcase
        id="desktop"
        title={c.desktop.title}
        intro={c.desktop.intro}
        rows={desktopRows}
        includesLabel={c.labels.includes}
        cta={c.desktop.cta}
        laptop={media.desktop.laptop}
      />
      {/* The after-launch chapter (paper): fix or improve, then the plans. */}
      <StageExplorer stages={improve} labels={c.labels} />
      <MonthlyPlans
        id="plans"
        tone="dark"
        title={homeContent.paths.prompts.run}
        more={c.plans.more}
        plans={monthlyPlans}
        footnotes={[
          p.boundary,
          p.minTerm(policies.minimumTermMonths),
          policies.hostingOnRequest,
          policies.vatNote,
        ]}
      />
      <div id="services-faq">
        <FaqSection tone="dark" intro={c.faq} faqs={faqsFor('general', 'services', 'plans')} />
      </div>
    </>
  )
}
