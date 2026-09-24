import type { ComponentType } from 'react'
import { matchPath } from 'react-router'
import { lazyPage, type PreloadableComponent } from '@/lib/lazy-page'

/**
 * Route table. Every page is its own lazily-loaded chunk. PageTransition calls
 * preloadRoute() while the wipe covers the screen, so the next chunk is usually ready
 * before it's needed.
 */
interface AppRoute {
  path: string
  Page: PreloadableComponent<ComponentType>
}

const HomePage = lazyPage(
  () => import('@/pages/Home'),
  (m) => m.HomePage,
)
const WorkPage = lazyPage(
  () => import('@/pages/Work'),
  (m) => m.WorkPage,
)
const CaseStudyPage = lazyPage(
  () => import('@/pages/CaseStudy'),
  (m) => m.CaseStudyPage,
)
const ServicesPage = lazyPage(
  () => import('@/pages/Services'),
  (m) => m.ServicesPage,
)
const PricingPage = lazyPage(
  () => import('@/pages/Pricing'),
  (m) => m.PricingPage,
)
const StudioPage = lazyPage(
  () => import('@/pages/Studio'),
  (m) => m.StudioPage,
)
const StartPage = lazyPage(
  () => import('@/pages/Start'),
  (m) => m.StartPage,
)
const PrivacyPage = lazyPage(
  () => import('@/pages/Privacy'),
  (m) => m.PrivacyPage,
)
const NotFoundPage = lazyPage(
  () => import('@/pages/NotFound'),
  (m) => m.NotFoundPage,
)

export const appRoutes: AppRoute[] = [
  { path: '/', Page: HomePage },
  { path: '/work', Page: WorkPage },
  { path: '/work/:slug', Page: CaseStudyPage },
  { path: '/services', Page: ServicesPage },
  { path: '/pricing', Page: PricingPage },
  { path: '/studio', Page: StudioPage },
  { path: '/start', Page: StartPage },
  { path: '/privacy', Page: PrivacyPage },
  { path: '*', Page: NotFoundPage },
]

export function preloadRoute(pathname: string): Promise<unknown> {
  const route =
    appRoutes.find((r) => r.path !== '*' && matchPath(r.path, pathname) !== null) ??
    appRoutes[appRoutes.length - 1]
  return route ? route.Page.preload() : Promise.resolve()
}
