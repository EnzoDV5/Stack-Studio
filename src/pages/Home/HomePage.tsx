import { lazy } from 'react'
import { DeferredSection } from '@/components/layout/DeferredSection'
import { PageMeta } from '@/components/seo/PageMeta'
import { media, serviceMedia } from '@/data/media'
import { homeContent, pageMeta, pricingContent, workContent } from '@/data/pages'
import { planFamilies, plans } from '@/data/plans'
import { policies } from '@/data/policies'
import { processSteps } from '@/data/process'
import { featuredProjects } from '@/data/projects'
import { rates } from '@/data/rates'
import { getOffering, offerings, serviceStages } from '@/data/services'
import { founders } from '@/data/studio'
import { testimonials } from '@/data/testimonials'
import { technologyContent, technologyRows } from '@/data/technologies'
import { familyFrom, offeringPrice, stageRows } from '@/lib/offer'
import { FeaturedWork } from '@/sections/home/FeaturedWork'
import { HomeHero } from '@/sections/home/HomeHero'
import { ServiceShowcase } from '@/sections/home/ServiceShowcase'
import { TechnologyMarquee } from '@/sections/shared/TechnologyMarquee'
import type { PlanFamily, StageId } from '@/types'

// Below-the-fold sections: separate chunks, mounted as they approach the viewport.
const ProcessPinned = lazy(() =>
  import('@/sections/shared/ProcessPinned').then((m) => ({ default: m.ProcessPinned })),
)
const PricingTeaser = lazy(() =>
  import('@/sections/home/PricingTeaser').then((m) => ({ default: m.PricingTeaser })),
)
const StudioSnippet = lazy(() =>
  import('@/sections/home/StudioSnippet').then((m) => ({ default: m.StudioSnippet })),
)
const Testimonial = lazy(() =>
  import('@/sections/shared/Testimonial').then((m) => ({ default: m.Testimonial })),
)

const l = pricingContent.priceLabels
const familyName = (id: PlanFamily) => planFamilies.find((f) => f.id === id)?.name ?? id
const familyItem = (id: PlanFamily) => ({ name: familyName(id), price: familyFrom(id, plans, l) })

/** Home keeps each stage short: priced offerings, or plan families as one "from" line. */
function stageItems(stage: StageId) {
  switch (stage) {
    case 'run':
      return [familyItem('care'), familyItem('managed')]
    case 'partner':
      return [familyItem('partner')]
    default:
      return stageRows(stage, { offerings, plans, rates }, l, {
        pricedOnly: stage !== 'takeover',
      }).map((row) => ({
        name: row.name,
        price: row.price,
      }))
  }
}

function teaserPrice(source: { offering: string } | { planFamily: PlanFamily }) {
  if ('planFamily' in source) return familyFrom(source.planFamily, plans, l)
  const offering = getOffering(source.offering)
  return offering ? offeringPrice(offering, l) : ''
}

export function HomePage() {
  const { hero, work, process, pricing, studio } = homeContent
  const testimonial = testimonials[0]

  return (
    <>
      <PageMeta {...pageMeta.home} />

      <HomeHero {...hero} video={media.home.showreel} />

      <TechnologyMarquee {...technologyContent} rows={technologyRows} />

      <FeaturedWork
        index={1}
        eyebrow={work.eyebrow}
        title={work.title}
        intro={work.intro}
        cta={work.cta}
        projects={featuredProjects}
        cardCta={work.cardCta}
        cursorLabel={work.cursorLabel}
        sampleLabel={workContent.sampleLabel}
      />

      <ServiceShowcase
        index={2}
        eyebrow={homeContent.services.eyebrow}
        title={homeContent.services.title}
        intro={homeContent.services.intro}
        services={serviceStages.map((s) => ({
          id: s.id,
          name: s.name,
          line: s.line,
          summary: s.summary,
          items: stageItems(s.id),
          cta: s.cta,
          capabilities: homeContent.services.capabilities[s.id],
          media: serviceMedia[s.id],
        }))}
        labels={{
          examples: homeContent.services.itemsLabel,
          ...homeContent.services.showcase,
        }}
      />

      <DeferredSection minHeight="160vh">
        <ProcessPinned
          index={3}
          intro={{ eyebrow: process.eyebrow, title: process.title, intro: process.intro }}
          steps={processSteps}
          stepLabel={process.stepLabel}
        />
      </DeferredSection>

      <DeferredSection minHeight="80vh">
        <PricingTeaser
          index={4}
          eyebrow={pricing.eyebrow}
          title={pricing.title}
          intro={pricing.intro}
          items={pricing.items.map((item) => ({
            label: item.label,
            note: item.note,
            price: teaserPrice(item.source),
          }))}
          cta={pricing.cta}
          estimateCta={pricing.estimateCta}
          notes={[policies.vatNote]}
        />
      </DeferredSection>

      <DeferredSection minHeight="90vh">
        <StudioSnippet index={5} {...studio} founders={founders} />
        {testimonial && <Testimonial testimonial={testimonial} />}
      </DeferredSection>
    </>
  )
}
