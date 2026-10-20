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

/** A layer of the stack diagram (Studio), in build order: one or more categories. */
export interface TechnologyLayer {
  id: string
  label: string
  /** What the layer is for, in a few words. */
  line: string
  /** A technology sits in the layer that holds its primary (first) category. */
  categories: readonly TechnologyCategory[]
}

/** A kind of build the stack diagram can filter to, and the technologies it uses. */
export interface StackBuild {
  id: string
  label: string
  /** One line on what the stack does for this kind of build. */
  summary: string
  /** Technology ids; empty means every technology. */
  technologies: readonly string[]
}
