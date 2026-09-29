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

export interface ClientLogo {
  image: ImageAsset
  /**
   * The background the artwork is drawn for: 'dark' for light artwork (white type), 'light'
   * for dark or full-colour artwork. The logo is always shown on that surface.
   */
  surface: 'light' | 'dark'
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
  /** Work cards and the next-project card (4:3). */
  thumbnail: ImageAsset
  /**
   * Wide (16:9) image for Home (hero backdrop and work reel), a different composition from
   * the thumbnail so the two pages don't repeat. Falls back to the thumbnail.
   */
  showcase?: ImageAsset
  /** The client's logo, shown on the case study. */
  logo?: ClientLogo
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
