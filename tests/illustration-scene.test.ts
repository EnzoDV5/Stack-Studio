import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { bounds, clipPolygon, sceneLayout } from '@/lib/illustration-scene'
import { media } from '@/data/media'
import type { IllustrationPiece, IllustrationPoint } from '@/types'

const rect = (l: number, t: number, r: number, b: number): IllustrationPoint[] => [
  [l, t],
  [r, t],
  [r, b],
  [l, b],
]

describe('clipPolygon', () => {
  it('is a plain polygon without holes', () => {
    assert.equal(clipPolygon(rect(0, 0, 50, 50)), 'polygon(0% 0%, 50% 0%, 50% 50%, 0% 50%)')
  })

  it('cuts holes with the even-odd rule, bridged from the first corner', () => {
    assert.equal(
      clipPolygon(rect(0, 0, 100, 100), [rect(10, 10, 20, 20)]),
      'polygon(evenodd, 0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%, ' +
        '10% 10%, 20% 10%, 20% 20%, 10% 20%, 10% 10%, 0% 0%)',
    )
  })
})

describe('sceneLayout', () => {
  const pieces: IllustrationPiece[] = [
    { id: 'card', shape: rect(20, 40, 60, 80), enter: 'left' },
    { id: 'icon', shape: rect(30, 50, 40, 60), parent: 'card', enter: 'pop', origin: [35, 55] },
  ]
  const layout = sceneLayout(pieces)
  const card = layout.pieces[0]
  const icon = card?.children[0]
  if (!card || !icon) throw new Error('The layout lost a piece')

  it('cuts only top-level pieces out of the base image', () => {
    assert.equal(layout.pieces.length, 1)
    assert.equal(layout.base, clipPolygon(rect(0, 0, 100, 100), [rect(20, 40, 60, 80)]))
  })

  it('sizes each layer to its piece, inside its parent', () => {
    assert.deepEqual(card.box, { left: 20, top: 40, width: 40, height: 40 })
    assert.deepEqual(icon.box, { left: 25, top: 25, width: 25, height: 25 })
  })

  it('lines the image copy up with the scene', () => {
    // The image's left edge sits at scene x 0 and its width spans the whole scene.
    const { image } = card
    assert.equal(20 + (image.left / 100) * 40, 0)
    assert.equal((image.width / 100) * 40, 100)
    assert.equal(30 + (icon.image.left / 100) * 10, 0)
  })

  it('cuts children out of their parent and pivots on the origin', () => {
    assert.equal(card.clip, clipPolygon(rect(0, 0, 100, 100), [rect(25, 25, 50, 50)]))
    assert.equal(icon.origin, '50% 50%')
    assert.equal(card.origin, '50% 50%')
  })

  it('starts a draw-in squeezed to the left edge, with the same points', () => {
    assert.equal(
      card.clipFrom,
      'polygon(evenodd, 0% 0%, 0% 0%, 0% 100%, 0% 100%, 0% 0%, 0% 25%, 0% 25%, 0% 50%, 0% 50%, 0% 25%, 0% 0%)',
    )
    assert.equal(card.clipFrom.split(',').length, card.clip.split(',').length)
  })
})

describe('the Fix or improve scene', () => {
  const { pieces } = media.services.fixOrImprove

  it('keeps every piece inside the image and every child inside its parent', () => {
    for (const piece of pieces) {
      const box = bounds(piece.shape)
      assert.ok(box.left >= 0 && box.top >= 0, piece.id)
      assert.ok(box.left + box.width <= 100 && box.top + box.height <= 100, piece.id)
      if (!piece.parent) continue
      const parent = pieces.find((p) => p.id === piece.parent)
      assert.ok(parent, `${piece.id} has no parent ${piece.parent}`)
      const outer = bounds(parent.shape)
      assert.ok(box.left >= outer.left && box.top >= outer.top, piece.id)
      assert.ok(box.left + box.width <= outer.left + outer.width, piece.id)
      assert.ok(box.top + box.height <= outer.top + outer.height, piece.id)
    }
  })

  it('never overlaps two pieces at the same level', () => {
    const overlaps = (a: IllustrationPiece, b: IllustrationPiece) => {
      const p = bounds(a.shape)
      const q = bounds(b.shape)
      return (
        p.left < q.left + q.width &&
        q.left < p.left + p.width &&
        p.top < q.top + q.height &&
        q.top < p.top + p.height
      )
    }
    for (const a of pieces) {
      for (const b of pieces) {
        if (a === b || a.parent !== b.parent) continue
        // The plant is L-shaped around the card above it; its boxes overlap but its shape doesn't.
        if (a.id === 'plant' || b.id === 'plant') continue
        assert.ok(!overlaps(a, b), `${a.id} overlaps ${b.id}`)
      }
    }
  })

  it('has unique ids', () => {
    assert.equal(new Set(pieces.map((p) => p.id)).size, pieces.length)
  })
})
