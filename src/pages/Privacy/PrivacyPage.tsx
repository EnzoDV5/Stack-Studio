import { PageMeta } from '@/components/seo/PageMeta'
import { pageMeta, privacyContent } from '@/data/pages'
import { site } from '@/data/site'
import { PrivacyNotice } from '@/sections/privacy/PrivacyNotice'
import { PageHero } from '@/sections/shared/PageHero'

export function PrivacyPage() {
  return (
    <>
      <PageMeta {...pageMeta.privacy} />
      <PageHero content={privacyContent.hero} />
      <PrivacyNotice
        updated={privacyContent.updated}
        sections={privacyContent.sections}
        contact={{ label: privacyContent.contactLabel, email: site.email }}
        back={privacyContent.backToBrief}
      />
    </>
  )
}
