import { PageMeta } from '@/components/seo/PageMeta'
import { faqsFor } from '@/data/faqs'
import { media, serviceMedia } from '@/data/media'
import { pageMeta, pricingContent, servicesContent } from '@/data/pages'
import { planFamilies, plans } from '@/data/plans'
import { policies } from '@/data/policies'
import { processSteps } from '@/data/process'
import { rates } from '@/data/rates'
import { offerings, serviceStages } from '@/data/services'
import { stageRows } from '@/lib/offer'
import { AppShowcase } from '@/sections/services/AppShowcase'
import { DesktopShowcase } from '@/sections/services/DesktopShowcase'
import { ServiceIndex } from '@/sections/services/ServiceIndex'
import type { StageLayout } from '@/sections/services/StageBlock'
import { StageExplorer, type StageExplorerStage } from '@/sections/services/StageExplorer'
import { FaqSection } from '@/sections/shared/FaqSection'
import { PageTitle } from '@/sections/shared/PageTitle'
import { ProcessPinned } from '@/sections/shared/ProcessPinned'
import type { StageId } from '@/types'

const c = servicesContent
const l = pricingContent.priceLabels
const data = { offerings, plans, rates }

/** Each group laid out for what it sells; no two share a layout. */
const layouts: Record<Exclude<StageId, 'build'>, StageLayout> = {
  takeover: 'cards',
  run: 'split',
  grow: 'figures',
  partner: 'tiers',
}

const notes: Partial<Record<StageId, string[]>> = {
  run: [policies.hostingOnRequest],
  partner: planFamilies.flatMap((f) => (f.id === 'partner' && f.note ? [f.note] : [])),
}

// Build splits in three, the way visitors look for it: websites (the offerings the brief files
// under 'website'), desktop software (listed in servicesContent, with the laptop) and apps and
// software (the rest, with the phone).
const buildRows = stageRows('build', data, l)
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

// Then what happens to something that already exists: take over, run, grow, partner (04–07).
const afterLaunch: StageExplorerStage[] = serviceStages
  .filter((stage) => stage.id !== 'build')
  .map((stage, i) => ({
    id: `stage-${stage.id}`,
    index: i + 4,
    name: stage.name,
    line: stage.line,
    rows: stageRows(stage.id, data, l),
    notes: notes[stage.id],
    cta: stage.cta,
    // Grow is two hourly rates: a compact row, no image.
    media: stage.id === 'grow' ? undefined : serviceMedia[stage.id],
    layout: layouts[stage.id as Exclude<StageId, 'build'>],
  }))

/**
 * Services, grouped the way people look for them: a "What do you need?" index, websites, apps
 * and software (the phone), desktop software (the laptop), then taking over, running, growing
 * and partnering on what exists.
 */
export function ServicesPage() {
  return (
    <>
      <PageMeta {...pageMeta.services} />
      <PageTitle content={c.hero} />
      <StageExplorer
        className="pt-8"
        lead={<ServiceIndex label={c.index.label} items={c.index.items} />}
        stages={[websites]}
        labels={c.labels}
      />
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
      <ProcessPinned
        id="process"
        tone="dark"
        intro={{
          eyebrow: c.process.eyebrow,
          title: c.process.title,
          intro: c.process.intro,
        }}
        steps={processSteps}
        stepLabel={c.process.stepLabel}
      />
      <FaqSection tone="dark" intro={c.faq} faqs={faqsFor('general', 'services', 'process')} />
    </>
  )
}
