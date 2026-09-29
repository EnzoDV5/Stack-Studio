import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { processSteps } from '@/data/process'
import { homeContent } from '@/data/pages'
import {
  barReveal,
  barTiming,
  columnAt,
  columnCentre,
  columnFromX,
  stepState,
  stepsAt,
} from '@/lib/process-timeline'

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

describe('process timeline interaction', () => {
  it('puts the playhead in the middle of a column, clamped', () => {
    assert.equal(columnCentre(0, 4), 0.125)
    assert.equal(columnCentre(3, 4), 0.875)
    assert.equal(columnCentre(9, 4), 0.875)
    assert.equal(columnAt(columnCentre(2, count), count), 2)
  })

  it('draws a bar exactly up to the playhead', () => {
    const span = { from: 2, to: 3 } // columns 2–3 of 4: 0.25 → 0.75
    assert.equal(barReveal(span, 4, 0.1), 0)
    assert.equal(barReveal(span, 4, 0.25), 0)
    assert.equal(barReveal(span, 4, 0.5), 0.5)
    assert.equal(barReveal(span, 4, 0.75), 1)
    assert.equal(barReveal(span, 4, 1), 1)
  })

  it('draws an ongoing bar (last column) in full wherever the playhead rests in it', () => {
    const ongoing = { from: 4, to: 4 } // the last of 4 columns: 0.75 → 1
    assert.equal(barReveal(ongoing, 4, 0.7), 0)
    assert.equal(barReveal(ongoing, 4, columnCentre(3, 4)), 1)
    assert.ok(barReveal(ongoing, 4, 0.78) > 0 && barReveal(ongoing, 4, 0.78) < 1)
    const care = processSteps.find((step) => step.span.from === count)
    assert.ok(care, 'the plan has an ongoing step')
    assert.equal(barReveal(care.span, count, columnCentre(count - 1, count)), 1)
  })

  it('every bar is fully drawn by the end and hidden at the start', () => {
    for (const span of spans) {
      assert.equal(barReveal(span, count, 0), 0)
      assert.equal(barReveal(span, count, 1), 1)
    }
  })

  it('maps a pointer to the column under it', () => {
    assert.equal(columnFromX(0, 700, 7), 0)
    assert.equal(columnFromX(99, 700, 7), 0)
    assert.equal(columnFromX(100, 700, 7), 1)
    assert.equal(columnFromX(699, 700, 7), 6)
    assert.equal(columnFromX(800, 700, 7), 6)
    assert.equal(columnFromX(-5, 700, 7), 0)
  })
})
