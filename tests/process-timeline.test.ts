import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { processSteps } from '@/data/process'
import { homeContent } from '@/data/pages'
import { barTiming, columnAt, stepState, stepsAt } from '@/lib/process-timeline'

const count = homeContent.process.columns.length
const spans = processSteps.map((step) => step.span)

describe('process timeline', () => {
  it('maps progress to a column, clamped to the ends', () => {
    assert.equal(columnAt(-0.2, count), 0)
    assert.equal(columnAt(0, count), 0)
    assert.equal(columnAt(0.5, count), Math.floor(count / 2))
    assert.equal(columnAt(1, count), count - 1)
    assert.equal(columnAt(1.4, count), count - 1)
  })

  it('every step span fits inside the columns', () => {
    for (const step of processSteps) {
      assert.ok(step.span.from >= 1 && step.span.to <= count, step.id)
      assert.ok(step.span.from <= step.span.to, step.id)
    }
  })

  it('every column has a step running, and never more than the readout shows (two)', () => {
    for (let column = 0; column < count; column++) {
      const running = stepsAt(spans, column)
      assert.ok(running.length >= 1, `column ${column} is empty`)
      assert.ok(running.length <= 2, `column ${column} has ${running.length} steps`)
    }
  })

  it('draws each bar exactly while the playhead crosses it', () => {
    assert.deepEqual(barTiming({ from: 1, to: 1 }, 7), { position: 0, duration: 1 / 7 })
    assert.deepEqual(barTiming({ from: 3, to: 6 }, 7), { position: 2 / 7, duration: 4 / 7 })
    const last = barTiming({ from: 7, to: 7 }, 7)
    assert.equal(last.position + last.duration, 1)
  })

  it('reports a step as upcoming, active or done', () => {
    const span = { from: 2, to: 4 }
    assert.equal(stepState(span, 0), 'upcoming')
    assert.equal(stepState(span, 1), 'active')
    assert.equal(stepState(span, 3), 'active')
    assert.equal(stepState(span, 4), 'done')
  })
})
