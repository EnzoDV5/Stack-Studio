import { Section } from '@/components/layout/Section'
import { PageMeta } from '@/components/seo/PageMeta'
import { pageMeta } from '@/data/pages'

export function ServicesPage() {
  return (
    <>
      <PageMeta {...pageMeta.services} />
      <Section tone="dark" grid className="min-h-screen pt-40">
        <div className="container-site">
          <h1 className="text-display-xl">{pageMeta.services.title}</h1>
        </div>
      </Section>
    </>
  )
}