import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  activeTone,
  isLightTone,
  mixColor,
  parseColor,
  surfaceAt,
  toCss,
  type ToneStop,
} from '@/lib/tone'

describe('parseColor', () => {
  it('reads the hex forms the tokens use', () => {
    assert.deepEqual(parseColor('#0a0a0a'), [10, 10, 10, 1])
    assert.deepEqual(parseColor(' #FFF '), [255, 255, 255, 1])
    assert.deepEqual(parseColor('#ff5a1480'), [255, 90, 20, 128 / 255])
  })

  it('reads rgb() in space and comma syntax, with alpha', () => {
    assert.deepEqual(parseColor('rgb(255 255 255 / 0.12)'), [255, 255, 255, 0.12])
    assert.deepEqual(parseColor('rgba(10, 10, 10, 0.5)'), [10, 10, 10, 0.5])
    assert.deepEqual(parseColor('rgb(10 10 10 / 78%)'), [10, 10, 10, 0.78])
    assert.deepEqual(parseColor('transparent'), [0, 0, 0, 0])
  })

  it('rejects what it cannot parse', () => {
    assert.equal(parseColor('var(--color-ink)'), null)
    assert.equal(parseColor(''), null)
  })
})

describe('mixColor / toCss', () => {
  it('interpolates every channel and clamps progress', () => {
    const ink = parseColor('#0a0a0a')
    const paper = parseColor('#f4f0ea')
    assert.ok(ink && paper)
    assert.deepEqual(mixColor(ink, paper, 0.5), [127, 125, 122, 1])
    assert.deepEqual(mixColor(ink, paper, 2), paper)
    assert.equal(toCss(mixColor(ink, paper, -1)), 'rgb(10 10 10 / 1)')
  })
})

// Hero (dark) → work (paper) → closing band (orange), on a 1000px-tall viewport.
const stops: ToneStop[] = [
  { tone: 'dark', top: 0, bottom: 1000 },
  { tone: 'paper', top: 1000, bottom: 2000 },
  { tone: 'orange', top: 2000, bottom: 2600 },
]
describe('activeTone', () => {
  it('is the first section before any boundary is crossed', () => {
    assert.equal(activeTone(stops, -500), 'dark')
    assert.equal(activeTone(stops, 999), 'dark')
  })

  it('switches exactly when a section’s top crosses the line', () => {
    assert.equal(activeTone(stops, 1000), 'paper')
    assert.equal(activeTone(stops, 1999), 'paper')
    assert.equal(activeTone(stops, 2000), 'orange')
  })

  it('ignores sections too short to own the page colour, and solid ones', () => {
    const withShort: ToneStop[] = [
      { tone: 'dark', top: 0, bottom: 1000 },
      { tone: 'paper', top: 1000, bottom: 1300 }, // 300px: too short at minLength 800
      { tone: 'dark', top: 1300, bottom: 2600 },
      { tone: 'orange', top: 2600, bottom: 3600, solid: true },
    ]
    assert.equal(activeTone(withShort, 1200, 800), 'dark')
    assert.equal(activeTone(withShort, 1200), 'paper')
    assert.equal(activeTone(withShort, 3000, 800), 'dark')
  })

  it('counts neighbouring sections in the same tone as one chapter', () => {
    const chapter: ToneStop[] = [
      { tone: 'dark', top: 0, bottom: 1500 },
      { tone: 'paper', top: 1500, bottom: 2000 }, // 500px
      { tone: 'paper', top: 2000, bottom: 2400 }, // 400px: 900px together
      { tone: 'orange', top: 2400, bottom: 3000, solid: true },
    ]
    assert.equal(activeTone(chapter, 1600, 800), 'paper')
    assert.equal(activeTone(chapter, 2100, 800), 'paper')
    assert.equal(activeTone(chapter, 2100, 1000), 'dark')
    // A gap breaks the chapter.
    const apart: ToneStop[] = [...chapter.slice(0, 2), { tone: 'paper', top: 2100, bottom: 2500 }]
    assert.equal(activeTone(apart, 2200, 800), 'dark')
  })

  it('is one tone at a time, never a mix, and dark with no sections', () => {
    assert.equal(activeTone(stops, 5000), 'orange')
    assert.equal(activeTone([], 0), 'dark')
  })
})

describe('surfaceAt', () => {
  const withSolidHero: ToneStop[] = [
    { tone: 'dark', top: 0, bottom: 1000, solid: true },
    { tone: 'paper', top: 1000, bottom: 2000 },
    { tone: 'paper', top: 2072, bottom: 2400 },
  ]

  it('reports a solid section’s own tone whatever the page blend is', () => {
    assert.equal(surfaceAt(withSolidHero, 36, 'paper'), 'dark')
  })

  it('reports the blended page tone over a flowing section', () => {
    assert.equal(surfaceAt(withSolidHero, 1500, 'dark'), 'dark')
    assert.equal(surfaceAt(withSolidHero, 1500, 'paper'), 'paper')
  })

  it('is null in a gap (an ink inset or the footer paints there)', () => {
    assert.equal(surfaceAt(withSolidHero, 2036, 'paper'), null)
  })
})

describe('isLightTone', () => {
  it('treats every tone except dark as light', () => {
    assert.equal(isLightTone('dark'), false)
    assert.equal(isLightTone('paper'), true)
    assert.equal(isLightTone('orange'), true)
  })
})
