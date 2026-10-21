import type { ClientLogoSet, IllustrationSceneAsset, ImageAsset } from './media'

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
  /** The person quoted; until there is one, the quote is credited to the role and company. */
  name?: string
  role: string
  company: string
  logo?: ClientLogoSet
  projectSlug?: string
}

/** The testimonial carousel's controls (screen-reader names). */
export interface TestimonialLabels {
  /** The carousel's accessible name, e.g. "Client testimonials". */
  carousel: string
  previous: string
  next: string
  /** The accessible name of each slide, e.g. "2 of 3". */
  slide: (index: number, count: number) => string
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
  /** A small line icon that assembles with the list (Studio values). */
  icon?: IllustrationSceneAsset
}

/** A short fact under the Studio page title, e.g. "Based in" · "Centurion, South Africa". */
export interface StudioFact {
  label: string
  value: string
}

/** One founder's turn at the keyboard in the Studio code editor. */
export interface CodeEditorRun {
  /** Shown on the caret's name tag while these lines type. */
  author: string
  lines: string[]
}

export interface CodeEditorExplorerItem {
  name: string
  /** Nesting under the project root (0 = top level). */
  depth: number
  folder?: boolean
}

/** The VS Code-style editor beside "Who we are" (CodeEditor): the team building as code. */
export interface CodeEditorContent {
  /** What the scene shows, for screen readers (the editor is presented as one image). */
  label: string
  project: string
  explorerTitle: string
  explorer: CodeEditorExplorerItem[]
  /** Open tabs; the first is the file on screen. */
  tabs: string[]
  /** The path above the code, e.g. ['stack-studio', 'one-team.ts', 'build()']. */
  breadcrumb: string[]
  runs: CodeEditorRun[]
  terminal: {
    tabs: string[]
    prompt: string
    command: string
    output: string[]
  }
  status: {
    branch: string
    live: string
    items: string[]
    /** The caret position, e.g. "Ln 12, Col 8". */
    position: (line: number, column: number) => string
  }
}
