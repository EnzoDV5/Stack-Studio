import { useEffect } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { tone as toneTokens } from '@/lib/motion-tokens'
import {
  activeTone,
  HEADER_BACKDROP_AT,
  isLightTone,
  isToneName,
  mixColor,
  parseColor,
  surfaceAt,
  toCss,
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
 * and read page-level colours. When a section's top crosses the middle of the viewport the
 * page switches to its tone in one short fade (tone.switch), so there are no in-between
 * colours while you scroll. It also tells
 * the header whether it sits on a light or dark page (html[data-header-tone]): the page
 * tone once scrolled (so it only changes when the page does), or the section under it with reduced motion.
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
    // The tone the page is switching to (or showing), its colours, and where they are now.
    let active: ToneName | null = null
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

    // One short ease-out fade (tone.switch seconds) from the old tone to the new one. It only
    // starts when the tone changes, so scrolling within a section never moves the colours.
    const glide = (time: number) => {
      const p = Math.min(1, (time - startedAt) / toneTokens.switch)
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

      // The section whose top has crossed the line owns the page colour.
      const tone = activeTone(
        stops,
        y + window.innerHeight * toneTokens.line,
        window.innerHeight * toneTokens.minSection,
      )

      // The header follows the page colour, so it changes only when (and exactly when) the
      // page does, not at every section edge, the orange band or the footer. Its scrolled
      // backdrop keeps it readable over anything. Right at the top it has no backdrop yet
      // and sits on the hero or the dark inset above page titles, so it takes that surface.
      const header = y <= HEADER_BACKDROP_AT ? (surfaceAt(stops, y + probeY, tone) ?? 'dark') : tone
      const headerTone = isLightTone(header) ? 'light' : 'dark'
      if (root.dataset.headerTone !== headerTone) root.dataset.headerTone = headerTone

      if (!palette) return

      if (immediate || current.length === 0) {
        gsap.ticker.remove(glide)
        gliding = false
        active = tone
        target = palette[tone]
        current = target
        write(true)
        return
      }
      if (tone !== active) {
        // Fade from wherever the colours are now (even mid-fade) to the new tone.
        active = tone
        target = palette[tone]
        from = current
        startedAt = gsap.ticker.time
        if (!gliding) {
          gliding = true
          gsap.ticker.add(glide)
        }
        return
      }
      // Same tone: just give sections that scrolled into view the current colours.
      if (!gliding) write()
    }

    // A re-measure while the page is still (a lazy route rendering after the first measure)
    // lands on its colours straight away. One mid-scroll (a deferred section mounting as it
    // arrives) glides like scrolling does, so it can never flash.
    const measure = () => {
      sections = measureSections()
      stops = sections.map((section) => section.stop)
      apply(gsap.ticker.time - scrolledAt > toneTokens.switch * 2)
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
