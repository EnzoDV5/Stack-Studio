import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { PageMeta } from '@/components/seo/PageMeta'
import { Button } from '@/components/ui/Button'
import { briefRecordCopy } from '@/data/brief'
import { pageMeta } from '@/data/pages'
import { downloadBriefPdf } from '@/lib/brief-download'
import { decodeBriefRecord, formatSubmitted, type BriefRecord } from '@/lib/brief-record'
import { BriefRecordView } from '@/sections/brief/BriefRecordView'
import { PageTitle } from '@/sections/shared/PageTitle'

const copy = briefRecordCopy

/**
 * /brief#<record>: a received brief, opened from the "Download PDF" button in the team email
 * or the client's auto-reply. The brief lives in the URL fragment (lib/brief-record.ts), so
 * nothing is fetched. `?download` saves the PDF as soon as it opens. Not indexed.
 */
export function BriefRecordPage() {
  const { hash, search } = useLocation()
  const navigate = useNavigate()
  const encoded = hash.slice(1)
  const autoDownload = new URLSearchParams(search).has('download')
  const [decoded, setDecoded] = useState<{ encoded: string; record: BriefRecord | null } | null>(
    null,
  )

  useEffect(() => {
    let cancelled = false
    void decodeBriefRecord(encoded).then((record) => {
      if (cancelled) return
      setDecoded({ encoded, record })
      if (record && autoDownload) {
        // Once: drop ?download so a refresh doesn't save the file again.
        void navigate({ search: '', hash }, { replace: true })
        downloadBriefPdf(record).catch((error: unknown) => console.error(error))
      }
    })
    return () => {
      cancelled = true
    }
  }, [encoded, hash, autoDownload, navigate])

  const current = decoded?.encoded === encoded ? decoded : null
  const record = current?.record ?? null

  return (
    <>
      <PageMeta {...pageMeta.briefRecord} />
      {record ? (
        <>
          <PageTitle
            key={record.ref}
            tone="dark"
            content={{
              eyebrow: `${copy.page.eyebrow} · ${copy.reasons[record.path]}`,
              title: record.contact.name,
              intro: copy.page.intro(record.ref, formatSubmitted(record.submittedAt)),
            }}
          />
          <BriefRecordView
            record={record}
            copy={{ ...copy, download: copy.page.download, home: copy.page.home }}
            onDownload={() => downloadBriefPdf(record)}
          />
        </>
      ) : current ? (
        <PageTitle
          key="invalid"
          tone="dark"
          content={{
            eyebrow: copy.page.eyebrow,
            title: copy.page.invalid.title,
            intro: copy.page.invalid.body,
          }}
        >
          <Button to={copy.page.home.to} withArrow>
            {copy.page.home.label}
          </Button>
        </PageTitle>
      ) : (
        <div className="min-h-dvh bg-ink pt-(--spacing-header)" aria-busy="true">
          <p className="container-site py-12 eyebrow text-grey-400">{copy.page.loading}</p>
        </div>
      )}
    </>
  )
}
