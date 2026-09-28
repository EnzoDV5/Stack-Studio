/**
 * Debounced ScrollTrigger.refresh(). Pins and scrubs measure positions once; anything that
 * changes layout afterwards (fonts swapping in, media metadata, lazy routes and sections
 * mounting) would leave them misaligned. Everything funnels through one timer so a burst of
 * loads costs a single refresh.
 */
import { ScrollTrigger } from './gsap'
import { scroll } from './motion-tokens'

let timer = 0
let forced = false
let lastHeight = -1

/**
 * Queue a refresh. Without `force` it's skipped when the page height hasn't changed, so
 * images with explicit dimensions (most of them) don't trigger needless re-measures.
 */
export function requestRefresh({ force = false }: { force?: boolean } = {}): void {
  forced ||= force
  window.clearTimeout(timer)
  timer = window.setTimeout(() => {
    if (forced || document.documentElement.scrollHeight !== lastHeight) ScrollTrigger.refresh()
    // Measured after the refresh, so the pin spacers it sizes don't queue another one.
    lastHeight = document.documentElement.scrollHeight
    forced = false
  }, scroll.refreshDebounceMs)
}

/**
 * Refresh once web fonts are ready, whenever an image or video finishes loading, and
 * whenever the page's height changes (a lazy route or section rendering in).
 */
export function watchLayoutChanges(): () => void {
  let alive = true
  lastHeight = document.documentElement.scrollHeight

  const onMediaLoad = (event: Event) => {
    const target = event.target
    if (target instanceof HTMLImageElement || target instanceof HTMLVideoElement) {
      requestRefresh()
    }
  }

  // A refresh briefly takes pinned elements out of their spacers and puts them back, which
  // drops keyboard focus inside them. Put it back where it was.
  let focused: HTMLElement | null = null
  const rememberFocus = () => {
    focused = document.activeElement instanceof HTMLElement ? document.activeElement : null
  }
  const restoreFocus = () => {
    if (focused?.isConnected && document.activeElement !== focused) {
      focused.focus({ preventScroll: true })
    }
    focused = null
  }

  // load and loadedmetadata don't bubble, so listen in the capture phase.
  document.addEventListener('load', onMediaLoad, true)
  document.addEventListener('loadedmetadata', onMediaLoad, true)
  const resize = new ResizeObserver(() => requestRefresh())
  resize.observe(document.body)
  ScrollTrigger.addEventListener('refreshInit', rememberFocus)
  ScrollTrigger.addEventListener('refresh', restoreFocus)
  void document.fonts.ready.then(() => {
    if (alive) requestRefresh({ force: true })
  })

  return () => {
    alive = false
    window.clearTimeout(timer)
    document.removeEventListener('load', onMediaLoad, true)
    document.removeEventListener('loadedmetadata', onMediaLoad, true)
    resize.disconnect()
    ScrollTrigger.removeEventListener('refreshInit', rememberFocus)
    ScrollTrigger.removeEventListener('refresh', restoreFocus)
  }
}
