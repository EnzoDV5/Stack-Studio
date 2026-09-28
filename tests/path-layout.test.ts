import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { accordionLayout, nextIndex } from '@/lib/path-layout'

describe('accordionLayout', () => {
  it('opens the active panel and packs the rest as strips', () => {
    const layout = accordionLayout(5, 2, 1000, 80)
    assert.equal(layout.expanded, 680)
    assert.deepEqual(
      layout.panels.map((p) => p.x),
      [0, 80, 160, 840, 920],
    )
    assert.deepEqual(
      layout.panels.map((p) => p.clipRight),
      [600, 600, 0, 600, 600],
    )
  })

  it('tiles the container exactly, with no gaps or overlaps, whichever panel is open', () => {
    const width = 1344
    const collapsed = 88
    for (let active = 0; active < 5; active++) {
      const { expanded, panels } = accordionLayout(5, active, width, collapsed)
      let edge = 0
      for (const panel of panels) {
        assert.equal(panel.x, edge)
        edge += expanded - panel.clipRight
      }
      assert.equal(edge, width)
    }
  })

  it('never makes the open panel narrower than a strip', () => {
    assert.equal(accordionLayout(5, 0, 200, 80).expanded, 80)
  })
})

describe('nextIndex', () => {
  it('moves with the arrow keys and wraps', () => {
    assert.equal(nextIndex('ArrowRight', 4, 5), 0)
    assert.equal(nextIndex('ArrowLeft', 0, 5), 4)
    assert.equal(nextIndex('ArrowDown', 1, 5), 2)
    assert.equal(nextIndex('Home', 3, 5), 0)
    assert.equal(nextIndex('End', 0, 5), 4)
  })

  it('ignores other keys (Enter and Space open the focused panel natively)', () => {
    assert.equal(nextIndex('Enter', 1, 5), null)
    assert.equal(nextIndex(' ', 1, 5), null)
  })
})
