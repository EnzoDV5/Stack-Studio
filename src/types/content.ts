import type { ImageAsset } from './media'

/** A column on the Home process timeline: a week, or the time after launch. */
export interface TimelineColumn {
  label: string
  /** Shown on phones, where the columns are narrow. */
  short: string
}

export interface ProcessStep {
  id: string
  title: string
  duration: string
  /**
   * Where the step sits on the process timeline (Services): 1-based, inclusive column indexes into
   * `servicesContent.process.columns` in data/pages.ts (weeks, then "after launch").
   */
  span: { from: number; to: number }
  summary: string
  points: string[]
}

export type FaqCategory = 'general' | 'services' | 'plans' | 'process'

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
  /** Path to a transparent logo asset in /public. When absent, a text tile is rendered. */
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
