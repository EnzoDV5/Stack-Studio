import { lazy } from 'react'
import { DeferredSection } from '@/components/layout/DeferredSection'
import { PageMeta } from '@/components/seo/PageMeta'
import { clients } from '@/data/clients'
import { homeContent, pageMeta, workContent } from '@/data/pages'
import { founders } from '@/data/studio'
import { media } from '@/data/media'
import { monthlyPlans, pricingSettings, projectPackages } from '@/data/pricing'
import { processSteps } from '@/data/process'
import { featuredProjects } from '@/data/projects'
import { services } from '@/data/services'
import { testimonials } from '@/data/testimonials'
import { FeaturedWork } from '@/sections/home/FeaturedWork'
import { HomeHero } from '@/sections/home/HomeHero'
import { ServicesRows } from '@/sections/home/ServicesRows'
import { LogoMarquee } from '@/sections/shared/LogoMarquee'

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

const packagePrice = (id?: string) => projectPackages.find((p) => p.id === id)?.fromPrice
const lowestMonthly = Math.min(...monthlyPlans.map((p) => p.pricePerMonth))

export function HomePage() {
  const { hero, work, process, pricing, studio } = homeContent
  const testimonial = testimonials[0]

  return (
    <>
      <PageMeta {...pageMeta.home} />

      <HomeHero {...hero} video={media.home.showreel} />

      <LogoMarquee label={homeContent.clients.label} clients={clients} />

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

      <ServicesRows
        index={2}
        eyebrow={homeContent.services.eyebrow}
        title={homeContent.services.title}
        intro={homeContent.services.intro}
        services={services.map((s) => ({ ...s, fromPrice: packagePrice(s.pricePackageId) }))}
        labels={{
          from: homeContent.services.fromLabel,
          start: homeContent.services.startLabel,
          deliverables: homeContent.services.deliverablesLabel,
          timeline: homeContent.services.timelineLabel,
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

      <DeferredSection minHeight="100vh">
        <PricingTeaser
          index={4}
          eyebrow={pricing.eyebrow}
          title={pricing.title}
          intro={pricing.intro}
          fromLabel={pricing.fromLabel}
          packages={projectPackages}
          monthly={{ ...pricing.monthly, fromPrice: lowestMonthly }}
          cta={pricing.cta}
          estimateCta={pricing.estimateCta}
          notes={[
            pricingSettings.vatNote,
            ...(pricingSettings.isPlaceholder ? [pricingSettings.placeholderNotice] : []),
          ]}
        />
      </DeferredSection>

      <DeferredSection minHeight="90vh">
        <StudioSnippet index={5} {...studio} founders={founders} />
        {testimonial && <Testimonial testimonial={testimonial} />}
      </DeferredSection>
    </>
  )
}
