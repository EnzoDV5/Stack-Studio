import { useEffect } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { tone as toneTokens } from '@/lib/motion-tokens'
import {
  dominantTone,
  isLightTone,
  isToneName,
  mixColor,
  parseColor,
  surfaceAt,
  toCss,
  toneAt,
  toneWeights,
  weightedColor,
  type Rgba,
  type ToneName,
  type ToneStop,
} from '@/lib/tone'

export interface ToneControllerProps {
  /** The pathname on screen. Sections are re-collected whenever it changes. */
  pathname: string
}

const TONES: readonly ToneName[] = ['dark', 'paper', 'white', 'orange']

/** Section tone variable → the page-level variable ToneController interpolates. */
const CHANNELS = [
  ['--tone-bg', '--page-bg'],
  ['--tone-fg', '--page-fg'],
  ['--tone-muted', '--page-muted'],
  ['--tone-border', '--page-border'],
  ['--tone-accent-text', '--page-accent'],
  ['--grid-line', '--page-grid'],
  ['--tone-surface', '--page-surface'],
  ['--tone-marker', '--page-marker'],
  ['--focus-ring', '--page-focus'],
] as const

type Palette = Record<ToneName, Rgba[]>

/** Read each tone's resolved colours from a throwaway element, so tokens.css stays the source. */
function readPalette(): Palette | null {
  const probe = document.createElement('div')
  probe.hidden = true
  document.body.append(probe)
  const palette = {} as Palette
  let ok = true
  for (const name of TONES) {
    probe.className = `tone-${name}`
    const style = getComputedStyle(probe)
    palette[name] = CHANNELS.map(([source]) => {
      const colour = parseColor(style.getPropertyValue(source))
      if (!colour) ok = false
      return colour ?? [0, 0, 0, 0]
    })
  }
  probe.remove()
  return ok ? palette : null
}

interface MeasuredSection {
  el: HTMLElement
  stop: ToneStop
}

/** Top-level [data-tone] sections in page order, measured in document coordinates. */
function measureSections(): MeasuredSection[] {
  const sections: MeasuredSection[] = []
  for (const el of document.querySelectorAll<HTMLElement>('[data-tone]')) {
    const tone = el.dataset.tone
    if (!isToneName(tone) || el.parentElement?.closest('[data-tone]')) continue
    // A pinned element is position: fixed mid-pin; its spacer holds the real place.
    const box = el.parentElement?.classList.contains('pin-spacer') ? el.parentElement : el
    const rect = box.getBoundingClientRect()
    const top = rect.top + window.scrollY
    const stop = { tone, top, bottom: top + rect.height, solid: 'toneSolid' in el.dataset }
    sections.push({ el, stop })
  }
  return sections.sort((a, b) => a.stop.top - b.stop.top)
}

function headerHeight(): number {
  const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16
  const value = getComputedStyle(document.documentElement).getPropertyValue('--spacing-header')
  return value.trim().endsWith('rem') ? parseFloat(value) * rem : parseFloat(value) || 72
}

/**
 * One continuous page instead of hard cuts. Sections become transparent (html.tone-flow)
 * and read page-level colours. A section's tone fades in (eased) from when its top enters
 * the bottom of the viewport until it is 20% from the top, and the live colours glide
 * toward that target over a few frames, so nothing jumps. It also tells
 * the header whether it sits on a light or dark page (html[data-header-tone]): the blended
 * colour in flow, or the section under it with reduced motion.
 * With reduced motion there is no morph: sections keep their own solid backgrounds.
 */
export function ToneController({ pathname }: ToneControllerProps) {
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    const root = document.documentElement
    const palette = reducedMotion ? null : readPalette()
    const probeY = headerHeight() / 2
    let sections: MeasuredSection[] = []
    let stops: ToneStop[] = []
    // Where each colour should be for this scroll position, and where it is now.
    let target: Rgba[] = []
    let current: Rgba[] = []
    // What each element was last given, so unchanged values are never re-set.
    const written = new WeakMap<HTMLElement, string[]>()
    // The glide in progress: where it started, and when.
    let from: Rgba[] = []
    let startedAt = 0
    let gliding = false
    // When the reader last scrolled (ticker seconds), to tell layout changes from reading.
    let scrolledAt = -Infinity

    const setVars = (el: HTMLElement, values: string[]) => {
      const last = written.get(el) ?? []
      CHANNELS.forEach(([, name], i) => {
        const value = values[i]
        if (value === undefined || last[i] === value) return
        last[i] = value
        el.style.setProperty(name, value)
      })
      written.set(el, last)
    }

    // Custom properties inherit, so changing them restyles the element's whole subtree. Each
    // frame only the sections on screen (and body's own background, which isn't inherited)
    // get the new colours; <html> carries them as a fallback for the rest, and is only
    // updated when the page is re-measured.
    const write = (everywhere = false) => {
      const values = current.map(toCss)
      const bg = values[0]
      if (bg && document.body.style.backgroundColor !== bg) document.body.style.backgroundColor = bg
      if (everywhere) setVars(root, values)
      const top = window.scrollY
      const bottom = top + window.innerHeight
      for (const { el, stop } of sections) {
        if (!stop.solid && stop.top < bottom && stop.bottom > top) setVars(el, values)
      }
    }

    // A short, bounded glide (ease-out over tone.lag seconds) toward the latest target, so a
    // fast scroll or a flick never snaps colours. Every write restyles the whole page, so it
    // must end quickly rather than creep toward the target.
    const glide = (time: number) => {
      const p = Math.min(1, (time - startedAt) / toneTokens.lag)
      const eased = 1 - (1 - p) ** 3
      current = from.map((colour, i) => mixColor(colour, target[i] ?? colour, eased))
      write()
      if (p >= 1) {
        gsap.ticker.remove(glide)
        gliding = false
      }
    }

    const apply = (immediate = false) => {
      const y = window.scrollY
      if (!palette) {
        const under = toneAt(stops, y + probeY) ?? 'dark'
        root.dataset.headerTone = isLightTone(under) ? 'light' : 'dark'
        return
      }

      // A section's tone fades in from when its top enters the bottom of the viewport.
      const weights = toneWeights(
        stops,
        y + window.innerHeight,
        window.innerHeight * toneTokens.band,
      )
      // The header sits over the page colour, unless a solid section or a gap (ink inset,
      // footer) is under it.
      const under = surfaceAt(stops, y + probeY, dominantTone(weights)) ?? 'dark'
      root.dataset.headerTone = isLightTone(under) ? 'light' : 'dark'

      target = CHANNELS.map((_, i) =>
        weightedColor(
          weights.map(({ tone, weight }) => ({ color: palette[tone][i] ?? [0, 0, 0, 0], weight })),
        ),
      )
      if (immediate || current.length === 0) {
        gsap.ticker.remove(glide)
        gliding = false
        current = target
        write(true)
        return
      }
      // Retarget from wherever the colours are now.
      from = current
      startedAt = gsap.ticker.time
      if (!gliding) {
        gliding = true
        gsap.ticker.add(glide)
      }
    }

    // A re-measure while the page is still (a lazy route rendering after the first measure)
    // lands on its colours straight away. One mid-scroll (a deferred section mounting as it
    // arrives) glides like scrolling does, so it can never flash.
    const measure = () => {
      sections = measureSections()
      stops = sections.map((section) => section.stop)
      apply(gsap.ticker.time - scrolledAt > toneTokens.lag * 2)
      write(true)
    }

    if (palette) root.classList.add('tone-flow')
    const trigger = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: () => {
        scrolledAt = gsap.ticker.time
        apply()
      },
    })
    // Fires after every trigger (pins included) has re-measured.
    ScrollTrigger.addEventListener('refresh', measure)
    measure()

    return () => {
      trigger.kill()
      gsap.ticker.remove(glide)
      ScrollTrigger.removeEventListener('refresh', measure)
      root.classList.remove('tone-flow')
      delete root.dataset.headerTone
      document.body.style.removeProperty('background-color')
      for (const { el } of sections) {
        CHANNELS.forEach(([, name]) => el.style.removeProperty(name))
      }
      CHANNELS.forEach(([, name]) => root.style.removeProperty(name))
    }
  }, [pathname, reducedMotion])

  return null
}
