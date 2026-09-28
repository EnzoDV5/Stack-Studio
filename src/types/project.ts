import type { ImageAsset, MediaSlot, VideoAsset } from './media'
import type { StageId } from './pricing'

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
  /** The client's field, shown on the Home work reel (e.g. "Renewable energy"). */
  sector: string
  services: string[]
  /** Which of Stack's five stages this project involved (Build, Run…). */
  stages: StageId[]
  liveUrl?: string
  /** Clearly-fake demo project. Shown with a "Sample" tag. */
  isSample?: boolean
  featured?: boolean
  thumbnail: ImageAsset
  /** Short muted loop for hover previews on desktop. */
  preview?: VideoAsset
  hero: MediaSlot
  /**
   * A full-page desktop screenshot of the live site (captured 1440 wide, as tall as the page),
   * scrolled top to bottom on the laptop screen in the case study. Falls back to the hero image.
   */
  screen?: ImageAsset
  narrative: {
    problem: NarrativeBlock
    approach: NarrativeBlock
    build: NarrativeBlock
    result: NarrativeBlock
  }
  gallery: GalleryItem[]
  metrics: ProjectMetric[]
  testimonialId?: string
  /** Build offering id used to pre-fill the brief from "Start a project like this". */
  briefType?: string
}
