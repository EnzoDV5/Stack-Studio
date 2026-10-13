import type { ComponentType } from 'react'
import { matchPath } from 'react-router'
import { eagerPage, lazyPage, type PreloadableComponent } from '@/lib/lazy-page'
import { HomePage as Home } from '@/pages/Home'

/**
 * Route table. Every page is its own lazily-loaded chunk. PageTransition calls
 * preloadRoute() while the wipe covers the screen, so the next chunk is usually ready
 * before it's needed.
 */
type AppRoute =
  | { path: string; Page: PreloadableComponent<ComponentType>; redirect?: never }
  /** An old URL that now lives elsewhere (public/.htaccess sends the same 301 on the server). */
  | { path: string; redirect: string; Page?: never }

// Home is the front door (and the LCP page), so it ships in the main bundle; the rest are lazy.
const HomePage = eagerPage(Home)
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
const ProcessPage = lazyPage(
  () => import('@/pages/Process'),
  (m) => m.ProcessPage,
)
const StudioPage = lazyPage(
  () => import('@/pages/Studio'),
  (m) => m.StudioPage,
)
const StartPage = lazyPage(
  () => import('@/pages/Start'),
  (m) => m.StartPage,
)
const ContactPage = lazyPage(
  () => import('@/pages/Contact'),
  (m) => m.ContactPage,
)
const PrivacyPage = lazyPage(
  () => import('@/pages/Privacy'),
  (m) => m.PrivacyPage,
)
const BriefRecordPage = lazyPage(
  () => import('@/pages/BriefRecord'),
  (m) => m.BriefRecordPage,
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
  { path: '/process', Page: ProcessPage },
  // The plans moved into Services (Hosting and care).
  { path: '/pricing', redirect: '/services#plans' },
  { path: '/studio', Page: StudioPage },
  { path: '/start', Page: StartPage },
  { path: '/contact', Page: ContactPage },
  { path: '/privacy', Page: PrivacyPage },
  // A received brief, opened from the emails (not linked anywhere on the site).
  { path: '/brief', Page: BriefRecordPage },
  { path: '*', Page: NotFoundPage },
]

export function preloadRoute(pathname: string): Promise<unknown> {
  const route =
    appRoutes.find((r) => r.path !== '*' && matchPath(r.path, pathname) !== null) ??
    appRoutes[appRoutes.length - 1]
  if (route?.redirect) return preloadRoute(route.redirect.split('#')[0] ?? '/')
  return route?.Page ? route.Page.preload() : Promise.resolve()
}
