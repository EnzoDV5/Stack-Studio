import { useEffect } from 'react'
import { useLocation } from 'react-router'
import {
  analyticsEnabled,
  initAnalytics,
  trackEvent,
  trackPageview,
  type AnalyticsEvent,
  type AnalyticsProps,
} from '@/lib/analytics'

const api = {
  enabled: analyticsEnabled,
  track: trackEvent,
  /** Shorthand for the main conversion event. */
  trackStartProject: (location: string) => trackEvent('Start project click', { location }),
} as const

export type { AnalyticsEvent, AnalyticsProps }

/** Conversion tracking. A no-op when VITE_ANALYTICS_ID is not set. */
export function useAnalytics(): typeof api {
  return api
}

/** Mount once (in <App>): loads the script and records a pageview per route change. */
export function usePageviewTracking(): void {
  const { pathname } = useLocation()

  useEffect(() => {
    initAnalytics()
  }, [])

  useEffect(() => {
    trackPageview(window.location.origin + pathname)
  }, [pathname])
}
