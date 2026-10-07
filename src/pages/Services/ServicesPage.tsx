import { PageMeta } from '@/components/seo/PageMeta'
import { faqsFor } from '@/data/faqs'
import { media, serviceMedia } from '@/data/media'
import { homeContent, pageMeta, pricingContent, servicesContent } from '@/data/pages'
import { plans } from '@/data/plans'
import { policies } from '@/data/policies'
import { rates } from '@/data/rates'
import { getQuotePreset } from '@/data/quotes'
import { offerings, serviceStages } from '@/data/services'
import { processSteps } from '@/data/process'
import { site } from '@/data/site'
import { estimate } from '@/lib/estimate'
import { formatPrice, formatPriceRange } from '@/lib/format'
import { stageRows, type OfferRow } from '@/lib/offer'
import { AppShowcase } from '@/sections/services/AppShowcase'
import { DesktopShowcase } from '@/sections/services/DesktopShowcase'
import { NextSteps } from '@/sections/services/NextSteps'
import { ProcessLine } from '@/sections/services/ProcessLine'
import { ServicesHero } from '@/sections/services/ServicesHero'
import { StageExplorer, type StageExplorerStage } from '@/sections/services/StageExplorer'
import { FaqSection } from '@/sections/shared/FaqSection'
import { SectionNavigator } from '@/sections/shared/SectionNavigator'
import type { StageId } from '@/types'

const c = servicesContent
const l = pricingContent.priceLabels
const data = { offerings, plans, rates }

/**
 * Services shows no prices. Each build service opens the brief
 * with that service picked, so choosing one is the way in.
 */
const withStart = (row: OfferRow): OfferRow =>
  offerings.some((o) => o.id === row.id && o.briefCategory)
    ? { ...row, start: { label: c.labels.start, to: `/start?type=${row.id}` } }
    : row
const rowsFor = (stage: StageId) => stageRows(stage, data, l, { prices: false }).map(withStart)

const stage = (id: StageId) => serviceStages.find((s) => s.id === id)

// Build splits in three, the way visitors look for it: websites (the offerings the brief files
// under 'website'), desktop software (listed in servicesContent, with the laptop) and apps and
// software (the rest, with the phone).
const buildRows = rowsFor('build')
const isWebsite = (id: string) => offerings.find((o) => o.id === id)?.briefCategory === 'website'
const desktopIds: readonly string[] = c.desktop.offerings
const websiteRows = buildRows.filter((row) => isWebsite(row.id))
const desktopRows = desktopIds.flatMap((id) => buildRows.filter((row) => row.id === id))
const appRows = buildRows.filter((row) => !isWebsite(row.id) && !desktopIds.includes(row.id))

const websites: StageExplorerStage = {
  id: 'stage-build',
  index: 1,
  name: c.websites.name,
  line: c.websites.line,
  rows: websiteRows,
  cta: c.websites.cta,
  media: serviceMedia.build,
  layout: 'feature',
}

// After launch (04–05), as on Home. Take over is folded into its neighbours: fixing is quoted by
// the hour like any improvement, and a new home (audit, then takeover) leads onto a care plan,
// so that group opens the plans on /pricing. Each group has its own layout.
const grow = stage('grow')
const run = stage('run')
const afterLaunch: StageExplorerStage[] = [
  ...(grow
    ? [
        {
          id: 'stage-grow',
          index: 4,
          name: homeContent.paths.prompts.grow,
          line: grow.line,
          rows: rowsFor('grow'),
          notes: [c.improve.note],
          cta: grow.cta,
          layout: 'figures' as const,
        },
      ]
    : []),
  ...(run
    ? [
        {
          id: 'stage-run',
          index: 5,
          name: homeContent.paths.prompts.run,
          line: run.line,
          rows: [...rowsFor('takeover'), ...rowsFor('run')],
          notes: [policies.hostingOnRequest],
          cta: homeContent.paths.plans,
          media: serviceMedia.run,
          layout: 'split' as const,
        },
      ]
    : []),
]

// The next-steps cards show real numbers: the "Launch website" starting quote's estimate range
// (as the brief shows it) and a fixed total inside it.
const starter = (() => {
  const preset = getQuotePreset('launch')
  const result = preset ? estimate(preset.answers) : undefined
  if (!result || result.kind !== 'range') return { estimate: '', total: '' }
  return {
    estimate: formatPriceRange(result.low, result.high, 1_000),
    total: formatPrice(Math.round((result.low + result.high) / 2 / 1_000) * 1_000),
  }
})()

/**
 * Services groups work the way people look for it: websites, apps
 * and software (the phone), desktop software (the laptop), then fixing or improving what exists
 * and hosting and care; then how a project runs week by week and what happens once
 * you get in touch. The brief gives project estimates; ongoing plans are on /pricing.
 */
export function ServicesPage() {
  return (
    <>
      <PageMeta {...pageMeta.services} />
      <SectionNavigator {...c.navigation} />
      <div id="services-top">
        <ServicesHero content={c.hero} />
      </div>
      <StageExplorer className="pt-4 md:pt-8" stages={[websites]} labels={c.labels} />
      {/* The phone turn is scrubbed; the laptop after it plays once (an enter), so the two
          device sections never share a trigger. */}
      <AppShowcase
        id="apps"
        index={2}
        eyebrow={c.apps.eyebrow}
        title={c.apps.title}
        intro={c.apps.intro}
        rows={appRows}
        includesLabel={c.labels.includes}
        cta={c.apps.cta}
        phone={media.apps.phone}
      />
      <DesktopShowcase
        id="desktop"
        index={3}
        eyebrow={c.desktop.eyebrow}
        title={c.desktop.title}
        intro={c.desktop.intro}
        rows={desktopRows}
        includesLabel={c.labels.includes}
        cta={c.desktop.cta}
        laptop={media.desktop.laptop}
      />
      <StageExplorer stages={afterLaunch} labels={c.labels} />
      {/* How a project runs, then how to start one: the plan plays on entry, and the step
          cards after it deal out on scroll, so the two never share a trigger. */}
      <ProcessLine
        id="process"
        eyebrow={c.process.eyebrow}
        title={c.process.title}
        steps={processSteps}
        stepLabel={c.process.stepLabel}
        nowLabel={c.process.nowLabel}
        overview={c.process.overview}
        columns={c.process.columns}
        more={c.process.more}
      />
      <NextSteps
        eyebrow={c.nextSteps.eyebrow}
        title={c.nextSteps.title}
        intro={c.nextSteps.intro}
        brief={{ ...c.nextSteps.brief, estimate: starter.estimate }}
        reply={{ ...c.nextSteps.reply, email: site.email }}
        meeting={c.nextSteps.meeting}
        quote={{ ...c.nextSteps.quote, total: starter.total }}
        cta={c.nextSteps.cta}
      />
      <div id="services-faq">
        <FaqSection tone="dark" intro={c.faq} faqs={faqsFor('general', 'services', 'process')} />
      </div>
    </>
  )
}
