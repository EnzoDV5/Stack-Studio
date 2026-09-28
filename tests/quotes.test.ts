import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { addOns } from '@/data/addons'
import { plans } from '@/data/plans'
import { getQuotePreset, quotePresets } from '@/data/quotes'
import { offerings } from '@/data/services'
import { prefillFromParams } from '@/lib/brief-prefill'
import { estimate } from '@/lib/estimate'

describe('starting quotes', () => {
  it('have unique ids', () => {
    const ids = quotePresets.map((q) => q.id)
    assert.equal(new Set(ids).size, ids.length)
  })

  it('only use offerings, add-ons and care plans the quote builder offers', () => {
    for (const preset of quotePresets) {
      const { buildType, addOns: chosen = [], carePlan } = preset.answers
      assert.ok(
        offerings.some((o) => o.id === buildType && o.briefCategory && o.visibility !== 'hidden'),
        `${preset.id}: ${buildType}`,
      )
      for (const id of chosen) {
        assert.ok(
          addOns.some((a) => a.id === id && a.briefMode === 'toggle'),
          `${preset.id}: ${id}`,
        )
      }
      if (carePlan && carePlan !== 'none') {
        assert.ok(
          plans.some((p) => p.id === carePlan && p.family === 'care'),
          `${preset.id}: ${carePlan}`,
        )
      }
    }
  })

  it('each produce an indicative range (so the Pricing page can show one)', () => {
    for (const preset of quotePresets) {
      const result = estimate(preset.answers)
      assert.equal(result.kind, 'range', preset.id)
      if (result.kind === 'range') assert.ok(result.low > 0 && result.high > result.low)
    }
  })

  it('pre-fill the quote builder from /start?quote=<id>', () => {
    for (const preset of quotePresets) {
      const prefill = prefillFromParams(new URLSearchParams({ quote: preset.id }), {
        offerings,
        plans,
        quotes: quotePresets,
      })
      assert.deepEqual(prefill.answers, preset.answers)
      assert.equal(prefill.name, preset.name)
      assert.deepEqual(estimate(prefill.answers), estimate(preset.answers))
    }
  })

  it('ignore unknown ids', () => {
    assert.equal(getQuotePreset('nope'), undefined)
    const prefill = prefillFromParams(new URLSearchParams({ quote: 'nope' }), {
      offerings,
      plans,
      quotes: quotePresets,
    })
    assert.deepEqual(prefill.answers, {})
  })
})
