import type { ImageAsset } from './media'

export interface ProcessStep {
  id: string
  title: string
  duration: string
  summary: string
  points: string[]
}

export type FaqCategory = 'general' | 'services' | 'pricing' | 'process'

export interface Faq {
  id: string
  category: FaqCategory
  question: string
  answer: string
}

export interface Testimonial {
  id: string
  quote: string
  name: string
  role: string
  company: string
  projectSlug?: string
}

export interface Client {
  id: string
  name: string
  sector: string
  /** Path to an SVG in /public. When absent, a text tile is rendered. */
  logo?: string
}

export interface Founder {
  id: string
  name: string
  role: string
  /** One line for the Home studio snippet. */
  line: string
  bio: string
  focus: string[]
  portrait: ImageAsset
  linkedin?: string
}

export interface ValueItem {
  id: string
  title: string
  body: string
}
