import { PageMeta } from '@/components/seo/PageMeta'
import { Button } from '@/components/ui/Button'
import { notFoundContent, pageMeta } from '@/data/pages'
import { PageTitle } from '@/sections/shared/PageTitle'

export function NotFoundPage() {
  return (
    <>
      <PageMeta {...pageMeta.notFound} />
      <PageTitle
        tone="dark"
        content={{
          eyebrow: notFoundContent.eyebrow,
          title: notFoundContent.title,
          intro: notFoundContent.body,
        }}
      >
        <div className="flex flex-wrap items-center gap-4">
          <Button to={notFoundContent.home.to} withArrow>
            {notFoundContent.home.label}
          </Button>
          <Button
            to={notFoundContent.start.to}
            variant="secondary"
            analytics={{ event: 'Start project click', props: { location: '404' } }}
          >
            {notFoundContent.start.label}
          </Button>
        </div>
      </PageTitle>
    </>
  )
}
