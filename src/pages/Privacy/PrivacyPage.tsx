import { PageMeta } from '@/components/seo/PageMeta'
import { pageMeta, privacyContent } from '@/data/pages'
import { site } from '@/data/site'
import { PrivacyNotice } from '@/sections/privacy/PrivacyNotice'
import { PageTitle } from '@/sections/shared/PageTitle'

export function PrivacyPage() {
  return (
    <>
      <PageMeta {...pageMeta.privacy} />
      <PageTitle content={privacyContent.hero} />
      <PrivacyNotice
        updated={privacyContent.updated}
        sections={privacyContent.sections}
        contact={{ label: privacyContent.contactLabel, email: site.email }}
        back={privacyContent.backToBrief}
      />
    </>
  )
}
