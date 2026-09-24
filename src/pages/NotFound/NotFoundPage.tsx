import { PageMeta } from '@/components/seo/PageMeta'
import { notFoundContent, pageMeta } from '@/data/pages'
import { NotFoundHero } from '@/sections/not-found/NotFoundHero'

export function NotFoundPage() {
  return (
    <>
      <PageMeta {...pageMeta.notFound} />
      <NotFoundHero {...notFoundContent} />
    </>
  )
}
