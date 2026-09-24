import { site } from '@/data/site'
import type { PageMetaContent } from '@/types'

export type PageMetaProps = PageMetaContent

/**
 * Per-page <title>, description, canonical and Open Graph / Twitter tags, using React 19's
 * native metadata hoisting (rendered anywhere, placed in <head>). Reads site-wide defaults
 * from data/site. Page-specific values come from data/pages (or the project for case studies).
 */
export function PageMeta({ title, description, path, ogImage, noindex }: PageMetaProps) {
  const fullTitle = title.includes(site.name) ? title : `${title} — ${site.name}`
  const url = `${site.url}${path === '/' ? '/' : path}`
  const image = ogImage ?? site.ogImage
  const imageUrl = image.src.startsWith('http') ? image.src : `${site.url}${image.src}`

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex, follow" />}

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={site.name} />
      <meta property="og:locale" content={site.locale.replace('-', '_')} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:width" content={String(image.width)} />
      <meta property="og:image:height" content={String(image.height)} />
      <meta property="og:image:alt" content={image.alt} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
    </>
  )
}
