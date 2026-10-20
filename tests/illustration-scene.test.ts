import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { bounds, clipPolygon, sceneLayout } from '@/lib/illustration-scene'
import { media } from '@/data/media'
import type { IllustrationPiece, IllustrationPoint, IllustrationSceneAsset } from '@/types'

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

const scenes: Record<string, IllustrationSceneAsset> = {
  'Fix or improve': media.services.fixOrImprove,
  'Start to finish': media.home.startToFinish,
  Studio: media.studio.oneTeam,
  'Proof value': media.studio.values.proof,
  'Craft value': media.studio.values.craft,
  'Clarity value': media.studio.values.clarity,
  'Long run value': media.studio.values.longRun,
}

/** Nonzero winding, the clip-path default, so a ring traced back round its hole is hollow. */
function inside([x, y]: IllustrationPoint, shape: readonly IllustrationPoint[]): boolean {
  let winding = 0
  shape.forEach(([x1, y1], i) => {
    const [x2, y2] = shape[(i + 1) % shape.length] ?? [x1, y1]
    const side = (x2 - x1) * (y - y1) - (x - x1) * (y2 - y1)
    if (y1 <= y && y2 > y && side > 0) winding++
    else if (y1 > y && y2 <= y && side < 0) winding--
  })
  return winding !== 0
}

/** Whether two shapes share any area, sampled on a fine grid over their common box. */
function overlaps(a: readonly IllustrationPoint[], b: readonly IllustrationPoint[]): boolean {
  const p = bounds(a)
  const q = bounds(b)
  const left = Math.max(p.left, q.left)
  const right = Math.min(p.left + p.width, q.left + q.width)
  const top = Math.max(p.top, q.top)
  const bottom = Math.min(p.top + p.height, q.top + q.height)
  for (let x = left + 0.05; x < right; x += 0.1) {
    for (let y = top + 0.05; y < bottom; y += 0.1) {
      if (inside([x, y], a) && inside([x, y], b)) return true
    }
  }
  return false
}

for (const [name, { pieces }] of Object.entries(scenes))
  describe(`the ${name} scene`, () => {
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
      pieces.forEach((a, i) => {
        for (const b of pieces.slice(i + 1)) {
          if (a.parent !== b.parent) continue
          assert.ok(!overlaps(a.shape, b.shape), `${a.id} overlaps ${b.id}`)
        }
      })
    })

    it('has unique ids', () => {
      assert.equal(new Set(pieces.map((p) => p.id)).size, pieces.length)
    })
  })
