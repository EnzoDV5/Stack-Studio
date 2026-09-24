import { Section } from '@/components/layout/Section'
import { PageMeta } from '@/components/seo/PageMeta'
import { pageMeta } from '@/data/pages'

export function StartPage() {
  return (
    <>
      <PageMeta {...pageMeta.start} />
      <Section tone="dark" grid className="min-h-screen pt-40">
        <div className="container-site">
          <h1 className="text-display-xl">{pageMeta.start.title}</h1>
        </div>
      </Section>
    </>
  )
}
