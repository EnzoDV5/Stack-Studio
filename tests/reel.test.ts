import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { coverFrom, insetPath, pinDistance, scrollForOffset, type Box } from '@/lib/reel'

/** Where the clipped, scaled card's visible edges land in section coordinates. */
function visibleEdges(card: Box, area: { width: number; height: number }) {
  const t = coverFrom(card, area)
  const origin = { x: card.x + t.x, y: card.y + t.y }
  return {
    left: origin.x + t.scale * t.inset.left,
    top: origin.y + t.scale * t.inset.top,
    right: origin.x + t.scale * (card.width - t.inset.right),
    bottom: origin.y + t.scale * (card.height - t.inset.bottom),
  }
}

const close = (a: number, b: number) => assert.ok(Math.abs(a - b) < 1e-6, `${a} ≈ ${b}`)

describe('coverFrom', () => {
  const area = { width: 1440, height: 900 }
  const cards: Box[] = [
    { x: 48, y: 210, width: 893, height: 520 }, // wider than the area's ratio
    { x: 48, y: 210, width: 600, height: 560 }, // taller
    { x: 0, y: 0, width: 1440, height: 900 }, // already covering
  ]

  for (const card of cards) {
    it(`makes a ${card.width}×${card.height} card cover the section exactly`, () => {
      const edges = visibleEdges(card, area)
      close(edges.left, 0)
      close(edges.top, 0)
      close(edges.right, area.width)
      close(edges.bottom, area.height)
    })
  }

  it('only ever clips on one axis', () => {
    const t = coverFrom(cards[0] as Box, area)
    assert.ok(t.inset.left === 0 || t.inset.top === 0)
    assert.ok(t.scale >= 1)
  })

  it('is the identity for an unmeasured card', () => {
    assert.deepEqual(coverFrom({ x: 10, y: 10, width: 0, height: 0 }, area), {
      scale: 1,
      x: 0,
      y: 0,
      inset: { top: 0, right: 0, bottom: 0, left: 0 },
    })
  })
})

describe('insetPath', () => {
  it('writes a clip-path GSAP can interpolate', () => {
    assert.equal(
      insetPath({ top: 1.234, right: 0, bottom: 1.234, left: 0 }, 16),
      'inset(1.23px 0px 1.23px 0px round 16px)',
    )
  })
})

describe('pinDistance', () => {
  it('grows with every panel after the first', () => {
    assert.equal(pinDistance(4, 1000, 0.5), 1500)
    assert.equal(pinDistance(5, 1000, 0.5), 2000)
    assert.equal(pinDistance(1, 1000, 0.5), 0)
    assert.equal(pinDistance(0, 1000, 0.5), 0)
  })
})

describe('scrollForOffset', () => {
  it('maps horizontal travel onto the pinned scroll range, clamped', () => {
    assert.equal(scrollForOffset(500, 1000, 2000, 1500), 2750)
    assert.equal(scrollForOffset(-50, 1000, 2000, 1500), 2000)
    assert.equal(scrollForOffset(4000, 1000, 2000, 1500), 3500)
    assert.equal(scrollForOffset(100, 0, 2000, 1500), 2000)
  })
})
