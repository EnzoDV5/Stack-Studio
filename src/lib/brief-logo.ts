import type { BriefLogoImages } from './brief-pdf'

function readAsDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(blob)
  })
}

async function imageDataUrl(file: string): Promise<string> {
  const response = await fetch(`${import.meta.env.BASE_URL}${file}`)
  if (!response.ok) throw new Error(`Could not load ${file} for the brief PDF.`)
  return readAsDataUrl(await response.blob())
}

let cachedLogo: Promise<BriefLogoImages> | undefined

/** Load the real Stack Studio artwork only when a PDF is requested. */
export function loadBriefLogo(): Promise<BriefLogoImages> {
  cachedLogo ??= Promise.all([imageDataUrl('StackLogo2.png'), imageDataUrl('StackLogo1.png')]).then(
    ([mark, wordmark]) => ({ mark, wordmark }),
  )
  return cachedLogo
}
