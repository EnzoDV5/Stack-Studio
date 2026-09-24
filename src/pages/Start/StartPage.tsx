import { useState } from 'react'
import { useSearchParams } from 'react-router'
import { Section } from '@/components/layout/Section'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { PageMeta } from '@/components/seo/PageMeta'
import { briefCopy } from '@/data/brief'
import { pageMeta } from '@/data/pages'
import { pricingData } from '@/data/pricing'
import { site, whatsappHref } from '@/data/site'
import { loadDraft } from '@/lib/brief-draft'
import { emptyAnswers } from '@/lib/brief-reducer'
import { BriefFlow } from '@/sections/start/BriefFlow'
import type { BriefAnswers } from '@/types'

/**
 * /start: the guided brief. Pre-fills from ?type=<package id> (skips step 1) and
 * ?plan=<monthly plan id>, on top of any draft saved in this tab.
 */
export function StartPage() {
  const [params] = useSearchParams()
  const [initial] = useState(() => {
    const type = params.get('type')
    const plan = params.get('plan')
    const pkg = pricingData.packages.find((p) => p.id === type)
    const monthly = pricingData.monthlyPlans.find((p) => p.id === plan)
    const answers: BriefAnswers = { ...(loadDraft() ?? emptyAnswers) }
    if (pkg) answers.projectType = pkg.id
    if (monthly) answers.monthlyPlan = monthly.id
    return { answers, step: pkg ? 1 : 0, prefillName: pkg?.name }
  })

  return (
    <>
      <PageMeta {...pageMeta.start} />
      <Section
        tone="dark"
        grid="top"
        spacing="none"
        className="pt-[calc(var(--spacing-header)+clamp(2.5rem,6vw,5rem))]"
      >
        <header className="container-site mb-14 grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Eyebrow label={briefCopy.intro.eyebrow} className="mb-6" />
            <h1 className="max-w-[14ch] text-display-xl">{briefCopy.intro.title}</h1>
          </div>
          <p className="max-w-[44ch] text-muted lg:col-span-4 lg:col-start-9">
            {briefCopy.intro.intro}
          </p>
        </header>

        <BriefFlow
          copy={briefCopy}
          pricing={pricingData}
          initialAnswers={initial.answers}
          initialStep={initial.step}
          prefillName={initial.prefillName}
          privacyHref="/privacy"
          whatsapp={{
            href: whatsappHref(briefCopy.aside.whatsappMessage),
            label: briefCopy.aside.whatsappLabel,
          }}
          email={site.email}
        />
      </Section>
    </>
  )
}
