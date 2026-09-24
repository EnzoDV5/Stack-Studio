export type TechnologyCategory =
  | 'Design'
  | 'Languages'
  | 'Frontend'
  | 'Backend'
  | 'Mobile'
  | 'Desktop'
  | 'Database'
  | 'AI'
  | 'Infrastructure'
  | 'Tools'

export interface Technology {
  id: string
  name: string
  /** Primary category first; shared technologies appear only once in the strip. */
  categories: readonly TechnologyCategory[]
  description: string
  /** Locally vendored official brand SVG. Omit for standards with no official logo. */
  logo?: string
}
