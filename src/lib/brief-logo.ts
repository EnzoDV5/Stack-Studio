import type { BriefLogoImages } from './brief-pdf'

function readAsDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(blob)
  })
}

async function imageDataUrl(file: string, maxWidth: number): Promise<string> {
  const response = await fetch(`${import.meta.env.BASE_URL}${file}`)
  if (!response.ok) throw new Error(`Could not load ${file} for the brief PDF.`)
  const blob = await response.blob()
  if (typeof createImageBitmap === 'undefined') return readAsDataUrl(blob)
  const image = await createImageBitmap(blob)
  try {
    const scale = Math.min(1, maxWidth / image.width)
    const canvas = document.createElement('canvas')
    canvas.width = Math.max(1, Math.round(image.width * scale))
    canvas.height = Math.max(1, Math.round(image.height * scale))
    const context = canvas.getContext('2d')
    if (!context) return readAsDataUrl(blob)
    context.drawImage(image, 0, 0, canvas.width, canvas.height)
    return canvas.toDataURL('image/png')
  } finally {
    image.close()
  }
}

let cachedLogo: Promise<BriefLogoImages> | undefined

/** Load the real Stack Studio artwork only when a PDF is requested. */
export function loadBriefLogo(): Promise<BriefLogoImages> {
  cachedLogo ??= Promise.all([
    imageDataUrl('StackLogo2.png', 120),
    imageDataUrl('StackLogo1.png', 360),
  ]).then(([mark, wordmark]) => ({ mark, wordmark }))
  return cachedLogo
}
