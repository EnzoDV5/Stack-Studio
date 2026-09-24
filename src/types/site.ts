import type { ImageAsset } from './media'

export interface SocialLink {
  id: 'instagram' | 'linkedin' | 'whatsapp' | 'email'
  label: string
  handle: string
  href: string
}

export interface WhatsAppConfig {
  /** Digits only, international format without "+" (wa.me format), e.g. 27821234567. */
  number: string
  /** Human-readable, e.g. "+27 82 123 4567". */
  display: string
  /** Pre-filled opening message. */
  message: string
}

export interface SiteConfig {
  name: string
  shortName: string
  tagline: string
  description: string
  /** Canonical origin without trailing slash. */
  url: string
  locale: string
  email: string
  whatsapp: WhatsAppConfig
  location: { city: string; region: string; country: string }
  foundedYear: number
  socials: SocialLink[]
  ogImage: ImageAsset
  /** Shown in the footer bottom row. */
  legal: { copyright: string; privacyLabel: string }
  /** Promise shown under contact options, e.g. "We reply within one business day." */
  responsePromise: string
}

export interface NavItem {
  label: string
  to: string
  /** Shown in the mobile menu under the label. */
  description?: string
}

export interface CtaLink {
  label: string
  to: string
}
