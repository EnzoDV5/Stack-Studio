/**
 * The stack diagram (Studio): technologies grouped into layers, and filtered by kind of build.
 * Pure, so the grouping rules are tested.
 */
import type { StackBuild, Technology, TechnologyLayer } from '@/types/technology'

export interface StackRow {
  layer: TechnologyLayer
  /** Technologies whose primary (first) category is this layer, in data order. */
  technologies: Technology[]
}

/** One row per layer; each technology sits once, in its primary category's row. */
export function stackRows(
  technologies: readonly Technology[],
  layers: readonly TechnologyLayer[],
): StackRow[] {
  return layers.map((layer) => ({
    layer,
    technologies: technologies.filter((technology) => technology.categories[0] === layer.id),
  }))
}

/** Whether a build uses a technology (a build with no list uses everything). */
export function usesTechnology(build: StackBuild, id: string): boolean {
  return build.technologies.length === 0 || build.technologies.includes(id)
}

/** The specific builds (not "everything") that use a technology. */
export function buildsUsing(builds: readonly StackBuild[], id: string): StackBuild[] {
  return builds.filter((build) => build.technologies.includes(id))
}
