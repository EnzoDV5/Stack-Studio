import { useState } from 'react'
import { useSearchParams } from 'react-router'
import { Section } from '@/components/layout/Section'
import { PageMeta } from '@/components/seo/PageMeta'
import { briefCopy, briefSteps } from '@/data/brief'
import { pageMeta, pricingContent } from '@/data/pages'
import { planFamilies } from '@/data/plans'
import { quotePresets } from '@/data/quotes'
import { site, whatsappHref } from '@/data/site'
import { loadDraft } from '@/lib/brief-draft'
import { prefillFromParams } from '@/lib/brief-prefill'
import { emptyAnswers } from '@/lib/brief-reducer'
import { firstOpenStepId } from '@/lib/brief-steps'
import { defaultEstimateData } from '@/lib/estimate'
import { BriefFlow } from '@/sections/start/BriefFlow'
import { PageTitle } from '@/sections/shared/PageTitle'
import type { BriefAnswers } from '@/types'

const partnerNote = planFamilies.find((f) => f.id === 'partner')?.note

/**
 * /start: the quote builder. Deep links pre-fill it (?path=, ?type=<offering>, ?plan=<plan>,
 * ?quote=<starting quote>)
 * on top of any draft saved in this tab, then it resumes at the first open step.
 */
export function StartPage() {
  const [params] = useSearchParams()
  const whatsapp = whatsappHref(briefCopy.aside.whatsappMessage)
  const [initial] = useState(() => {
    const prefill = prefillFromParams(params, { ...defaultEstimateData, quotes: quotePresets })
    const base = loadDraft() ?? emptyAnswers
    // A deep link to a different path starts that path fresh.
    const answers: BriefAnswers =
      prefill.answers.path && prefill.answers.path !== base.path
        ? { ...emptyAnswers, contact: base.contact, ...prefill.answers }
        : { ...base, ...prefill.answers }
    const stepId = prefill.stepId ?? firstOpenStepId(briefSteps, answers, defaultEstimateData)
    return { answers, stepId, prefillName: prefill.name }
  })

  return (
    <>
      <PageMeta {...pageMeta.start} />
      <PageTitle content={briefCopy.intro} tone="dark" />
      <Section tone="dark" spacing="none" className="pt-4">
        <BriefFlow
          copy={briefCopy}
          steps={briefSteps}
          data={defaultEstimateData}
          priceLabels={pricingContent.priceLabels}
          partnerNote={partnerNote}
          initialAnswers={initial.answers}
          initialStepId={initial.stepId}
          prefillName={initial.prefillName}
          privacyHref="/privacy"
          whatsapp={
            whatsapp ? { href: whatsapp, label: briefCopy.aside.whatsappLabel } : undefined
          }
          email={site.email}
        />
      </Section>
    </>
  )
}
