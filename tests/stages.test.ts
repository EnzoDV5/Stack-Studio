import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { homeContent, pricingContent } from '@/data/pages'
import { plans } from '@/data/plans'
import { offerings, serviceStages } from '@/data/services'
import { prefillFromParams } from '@/lib/brief-prefill'
import { familyFrom, familyMin, isVisible } from '@/lib/offer'

describe('PathChooser stages', () => {
  it('maps every stage to a brief path the quote builder accepts', () => {
    for (const stage of serviceStages) {
      const { answers } = prefillFromParams(new URLSearchParams({ path: stage.briefPath }), {
        offerings,
        plans,
      })
      assert.equal(answers.path, stage.briefPath, stage.id)
    }
  })

  it('keeps each stage CTA on the same path as its estimate link', () => {
    for (const stage of serviceStages) {
      const params = new URL(stage.cta.to, 'https://example.com').searchParams
      assert.equal(params.get('path'), stage.briefPath, stage.id)
    }
  })

  it('has a self-select prompt for every stage', () => {
    for (const stage of serviceStages) {
      assert.ok(homeContent.paths.prompts[stage.id].length > 0, stage.id)
    }
  })
})

describe('familyMin', () => {
  it('is the cheapest visible plan in the family', () => {
    const care = plans.filter((p) => p.family === 'care' && isVisible(p))
    assert.ok(care.length > 0)
    assert.equal(familyMin('care', plans), Math.min(...care.map((p) => p.pricePerMonth)))
  })

  it('is null for a family without plans, and familyFrom is then empty', () => {
    assert.equal(familyMin('care', []), null)
    assert.equal(familyFrom('care', [], pricingContent.priceLabels), '')
  })
})
