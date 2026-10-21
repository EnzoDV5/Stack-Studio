import { ProcessJourney } from '@/components/media/ProcessJourney'
import { PageMeta } from '@/components/seo/PageMeta'
import { faqsFor } from '@/data/faqs'
import { media, serviceMedia } from '@/data/media'
import { pageMeta, processContent } from '@/data/pages'
import { policies } from '@/data/policies'
import { processSteps } from '@/data/process'
import { getQuotePreset } from '@/data/quotes'
import { site } from '@/data/site'
import { estimate } from '@/lib/estimate'
import { formatPrice, formatPriceRange } from '@/lib/format'
import { CareSteps } from '@/sections/process/CareSteps'
import { NextSteps } from '@/sections/process/NextSteps'
import { PoliciesList } from '@/sections/process/PoliciesList'
import { ProcessLine } from '@/sections/process/ProcessLine'
import { FaqSection } from '@/sections/shared/FaqSection'
import { PageTitle } from '@/sections/shared/PageTitle'
import { SectionNavigator } from '@/sections/shared/SectionNavigator'

const c = processContent

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

const termIds: readonly string[] = c.terms.policies
const terms = termIds.flatMap((id) => policies.items.filter((item) => item.id === id))

/**
 * How working with us runs, in the order it happens: what happens once you get in touch, the
 * build week by week, how you pay, then how care runs after launch. What we offer, and what
 * the plans cost, is on /services.
 */
export function ProcessPage() {
  return (
    <>
      <PageMeta {...pageMeta.process} />
      <SectionNavigator {...c.navigation} />
      <div id="process-top">
        <PageTitle
          content={c.hero}
          asidePlacement="beside"
          aside={
            <ProcessJourney
              scene={media.process}
              steps={processSteps.map((step) => step.title)}
              sizes="(min-width: 1280px) 704px, (min-width: 1024px) 512px, 92vw"
              className="w-full lg:w-[32rem] xl:w-[44rem]"
            />
          }
        />
      </div>
      {/* The step cards deal out on scroll, then the plan plays on entry, so the two never
          share a trigger. The title and next steps share one light chapter; the page turns
          dark at the week-by-week timeline. */}
      <NextSteps
        tone="dark"
        eyebrow={c.nextSteps.eyebrow}
        title={c.nextSteps.title}
        intro={c.nextSteps.intro}
        brief={{ ...c.nextSteps.brief, estimate: starter.estimate }}
        reply={{ ...c.nextSteps.reply, email: site.email }}
        meeting={c.nextSteps.meeting}
        quote={{ ...c.nextSteps.quote, total: starter.total }}
        cta={c.nextSteps.cta}
      />
      <ProcessLine
        id="timeline"
        eyebrow={c.process.eyebrow}
        title={c.process.title}
        steps={processSteps}
        stepLabel={c.process.stepLabel}
        nowLabel={c.process.nowLabel}
        overview={c.process.overview}
        columns={c.process.columns}
        more={c.process.more}
      />
      <div id="terms">
        <PoliciesList
          tone="dark"
          eyebrow={c.terms.eyebrow}
          title={c.terms.title}
          scheduleLabel={c.terms.scheduleLabel}
          schedules={policies.paymentSchedules}
          items={terms}
          vatNote={policies.vatNote}
        />
      </div>
      <div id="care">
        <CareSteps {...c.care} media={serviceMedia.partner} tone="dark" />
      </div>
      <div id="process-faq">
        <FaqSection tone="dark" intro={c.faq} faqs={faqsFor('process')} />
      </div>
    </>
  )
}
