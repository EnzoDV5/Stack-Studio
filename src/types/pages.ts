import type { ImageAsset } from './media'

export interface PageMetaContent {
  title: string
  description: string
  /** Path without origin, e.g. "/work". */
  path: string
  ogImage?: ImageAsset
  noindex?: boolean
}

export interface SectionIntro {
  eyebrow: string
  title: string
  intro?: string
}

export interface PageHeroContent {
  eyebrow: string
  title: string
  intro: string
}

export interface CtaContent {
  eyebrow?: string
  title: string
  body?: string
  label: string
  to: string
}
