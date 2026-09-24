import { config } from './config'

/**
 * Lightweight, privacy-friendly analytics (Plausible-compatible: cookieless, no personal
 * data). Completely disabled, with no script and no calls, when VITE_ANALYTICS_ID is empty.
 * Use the useAnalytics() hook in components; this module is the transport.
 */

export type AnalyticsEvent =
  | 'Start project click'
  | 'Brief path selected'
  | 'Brief step complete'
  | 'Brief result shown'
  | 'Brief submitted'
  | 'Brief submit error'
  | 'WhatsApp click'
  | 'Email click'

export type AnalyticsProps = Record<string, string | number | boolean>

interface PlausibleFn {
  (event: string, options?: { props?: AnalyticsProps; u?: string }): void
  q?: unknown[][]
}

declare global {
  interface Window {
    plausible?: PlausibleFn
  }
}

let initialised = false

export const analyticsEnabled = config.analyticsId !== null

/** Injects the script once, when the browser is idle. Queues calls made before it loads. */
export function initAnalytics(): void {
  if (!analyticsEnabled || initialised || typeof window === 'undefined') return
  initialised = true

  const queue: PlausibleFn = (...args) => {
    ;(queue.q ??= []).push(args)
  }
  window.plausible ??= queue

  const inject = () => {
    const script = document.createElement('script')
    script.defer = true
    script.src = config.analyticsScriptSrc
    script.dataset.domain = config.analyticsId ?? ''
    document.head.appendChild(script)
  }

  if ('requestIdleCallback' in window) window.requestIdleCallback(inject, { timeout: 3000 })
  else setTimeout(inject, 1500)
}

export function trackEvent(event: AnalyticsEvent, props?: AnalyticsProps): void {
  if (!analyticsEnabled) {
    if (config.isDev) console.info('[analytics:disabled]', event, props ?? '')
    return
  }
  window.plausible?.(event, props ? { props } : undefined)
}

export function trackPageview(url: string): void {
  if (!analyticsEnabled) return
  window.plausible?.('pageview', { u: url })
}
