import { lazy, type ComponentType, type LazyExoticComponent } from 'react'

export type PreloadableComponent<T extends ComponentType> = LazyExoticComponent<T> & {
  preload: () => Promise<unknown>
}

/**
 * React.lazy with a .preload() so the page wipe can fetch the next route's chunk while the
 * panels are covering the screen. Pages use named exports, so pass a picker:
 *   lazyPage(() => import('@/pages/Home'), (m) => m.HomePage)
 */
export function lazyPage<M, T extends ComponentType>(
  load: () => Promise<M>,
  pick: (module: M) => T,
): PreloadableComponent<T> {
  let promise: Promise<M> | null = null
  const loadOnce = () => (promise ??= load())
  const Component = lazy(async () => ({ default: pick(await loadOnce()) }))
  return Object.assign(Component, { preload: loadOnce })
}

/** Wraps an eagerly imported page so it fits the same route table (preload is a no-op). */
export function eagerPage<T extends ComponentType>(Component: T): PreloadableComponent<T> {
  return Object.assign(Component, {
    preload: () => Promise.resolve(),
  }) as unknown as PreloadableComponent<T>
}
