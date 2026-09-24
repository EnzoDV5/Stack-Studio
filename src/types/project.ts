import type { ImageAsset, MediaSlot, VideoAsset } from './media'

export type ProjectCategoryId = 'website' | 'npo' | 'energy' | 'brand' | 'ecommerce' | 'web-app'

export interface ProjectCategory {
  id: ProjectCategoryId
  label: string
}

export interface ProjectMetric {
  value: string
  label: string
}

export interface NarrativeBlock {
  /** Short statement shown large, e.g. "No way to show real installs." */
  heading: string
  paragraphs: string[]
}

export interface GalleryItem extends ImageAsset {
  /** Layout hint for the gallery grid. */
  span: 'full' | 'half'
  caption?: string
}

export interface Project {
  slug: string
  name: string
  client: string
  year: number
  /** One line for cards and the case study hero. */
  summary: string
  categories: ProjectCategoryId[]
  services: string[]
  liveUrl?: string
  /** Clearly-fake demo project. Shown with a "Sample" tag. */
  isSample?: boolean
  featured?: boolean
  thumbnail: ImageAsset
  /** Short muted loop for hover previews on desktop. */
  preview?: VideoAsset
  hero: MediaSlot
  narrative: {
    problem: NarrativeBlock
    approach: NarrativeBlock
    build: NarrativeBlock
    result: NarrativeBlock
  }
  gallery: GalleryItem[]
  metrics: ProjectMetric[]
  testimonialId?: string
  /** ProjectPackage id used to pre-fill the brief from "Start a project like this". */
  briefType?: string
}
