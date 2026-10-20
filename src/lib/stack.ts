/**
 * The stack diagram (Studio): technologies grouped into layers, and filtered by kind of build.
 * Pure, so the grouping rules are tested.
 */
import type { StackBuild, Technology, TechnologyLayer } from '@/types/technology'

export interface StackRow {
  layer: TechnologyLayer
  /** Technologies whose primary (first) category is in this layer, in data order. */
  technologies: Technology[]
}

/** One row per layer; each technology sits once, in the row holding its primary category. */
export function stackRows(
  technologies: readonly Technology[],
  layers: readonly TechnologyLayer[],
): StackRow[] {
  return layers.map((layer) => ({
    layer,
    technologies: technologies.filter((technology) =>
      technology.categories.slice(0, 1).some((category) => layer.categories.includes(category)),
    ),
  }))
}

/** The layers a technology touches through any of its categories. */
export function layersTouching(
  layers: readonly TechnologyLayer[],
  technology: Technology,
): TechnologyLayer[] {
  return layers.filter((layer) =>
    technology.categories.some((category) => layer.categories.includes(category)),
  )
}

/** Whether a build uses a technology (a build with no list uses everything). */
export function usesTechnology(build: StackBuild, id: string): boolean {
  return build.technologies.length === 0 || build.technologies.includes(id)
}

/** The specific builds (not "everything") that use a technology. */
export function buildsUsing(builds: readonly StackBuild[], id: string): StackBuild[] {
  return builds.filter((build) => build.technologies.includes(id))
}
