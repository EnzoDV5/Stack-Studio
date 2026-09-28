import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  dominantTone,
  isLightTone,
  mixColor,
  parseColor,
  surfaceAt,
  toCss,
  toneAt,
  toneWeights,
  weightedColor,
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
const band = 800
const weight = (weights: { tone: string; weight: number }[], tone: string) =>
  weights.find((w) => w.tone === tone)?.weight ?? 0

describe('toneWeights', () => {
  it('holds a section’s tone until the next one reaches the viewport edge', () => {
    assert.deepEqual(toneWeights(stops, 1000, band), [{ tone: 'dark', weight: 1 }])
  })

  it('is exactly halfway at the middle of the band, and eases at both ends', () => {
    assert.equal(weight(toneWeights(stops, 1400, band), 'paper'), 0.5)
    // A quarter of the way through the band the eased weight is below a quarter.
    assert.ok(weight(toneWeights(stops, 1200, band), 'paper') < 0.25)
  })

  it('finishes the morph once the top has crossed the band', () => {
    assert.deepEqual(toneWeights(stops, 1800, band), [{ tone: 'paper', weight: 1 }])
  })

  it('stays continuous when a short section’s neighbour arrives mid-morph', () => {
    const short: ToneStop[] = [
      { tone: 'dark', top: 0, bottom: 1000 },
      { tone: 'paper', top: 1000, bottom: 1500 },
      { tone: 'dark', top: 1500, bottom: 2500 },
    ]
    const before = toneWeights(short, 1500, band)
    const after = toneWeights(short, 1501, band)
    assert.ok(Math.abs(weight(before, 'paper') - weight(after, 'paper')) < 0.01)
    assert.ok(Math.abs(weight(before, 'dark') - weight(after, 'dark')) < 0.01)
  })

  it('always sums to 1 and falls back to dark with no sections', () => {
    for (const from of [0, 1100, 1450, 2300, 2600, 5000]) {
      const total = toneWeights(stops, from, band).reduce((sum, w) => sum + w.weight, 0)
      assert.ok(Math.abs(total - 1) < 1e-9, String(from))
    }
    assert.deepEqual(toneWeights([], 0, band), [{ tone: 'dark', weight: 1 }])
  })
})

describe('dominantTone / weightedColor', () => {
  it('picks the heaviest tone and averages colours by weight', () => {
    assert.equal(
      dominantTone([
        { tone: 'dark', weight: 0.4 },
        { tone: 'paper', weight: 0.6 },
      ]),
      'paper',
    )
    assert.deepEqual(
      weightedColor([
        { color: [0, 0, 0, 1], weight: 0.25 },
        { color: [200, 100, 40, 1], weight: 0.75 },
      ]),
      [150, 75, 30, 1],
    )
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

describe('toneAt / isLightTone', () => {
  it('finds the section under a point, or null in a gap', () => {
    assert.equal(toneAt(stops, 36), 'dark')
    assert.equal(toneAt(stops, 1500), 'paper')
    assert.equal(toneAt(stops, 3000), null)
  })

  it('treats every tone except dark as light', () => {
    assert.equal(isLightTone('dark'), false)
    assert.equal(isLightTone('paper'), true)
    assert.equal(isLightTone('orange'), true)
  })
})
