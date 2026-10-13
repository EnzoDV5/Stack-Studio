/**
 * Saves a brief record as the branded PDF. The PDF code (jsPDF) loads on first use only.
 */
import { briefRecordCopy } from '@/data/brief'
import { site } from '@/data/site'
import type { BriefRecord } from './brief-record'

export async function downloadBriefPdf(record: BriefRecord): Promise<void> {
  const [{ briefPdfFilename, createBriefPdf }, { loadBriefLogo }] = await Promise.all([
    import('./brief-pdf'),
    import('./brief-logo'),
  ])
  const pdf = createBriefPdf(
    record,
    briefRecordCopy,
    {
      name: site.name,
      url: site.url,
    },
    await loadBriefLogo(),
  )
  await pdf.save(briefPdfFilename(record), { returnPromise: true })
}
