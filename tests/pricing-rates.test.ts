import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { plans } from '@/data/plans'
import { BUILD_RATE_PER_HOUR, CARE_RATE_PER_HOUR, getRate } from '@/data/rates'
import { offerings } from '@/data/services'
import { pricingContent } from '@/data/pages'
import { offeringPrice } from '@/lib/offer'

describe('public pricing rates', () => {
  it('calculates every Build estimate at R400/hour and displays the total', () => {
    const builds = offerings.filter((offering) => offering.stage === 'build')
    assert.ok(builds.length > 0)
    assert.equal(getRate('feature').pricePerHour, BUILD_RATE_PER_HOUR)
    for (const offering of builds) {
      assert.ok(offering.estimatedHours, offering.id)
      assert.equal(offering.fromPrice, offering.estimatedHours * BUILD_RATE_PER_HOUR, offering.id)
      const displayed = offeringPrice(offering, pricingContent.priceLabels)
      assert.match(displayed, /^From R/)
      assert.doesNotMatch(displayed, /\/hour/)
    }
  })

  it('uses R200/hour for care and support', () => {
    assert.equal(getRate('care').pricePerHour, CARE_RATE_PER_HOUR)
    for (const offering of offerings.filter((item) => item.stage === 'takeover')) {
      assert.ok(offering.estimatedHours, offering.id)
      assert.equal(offering.fromPrice, offering.estimatedHours * CARE_RATE_PER_HOUR, offering.id)
    }
  })

  it('builds monthly plans from their correct hourly rate', () => {
    for (const plan of plans.filter(
      (item) =>
        (item.family === 'care' || item.family === 'managed') && item.visibility !== 'hidden',
    )) {
      assert.ok(plan.includedHours !== undefined, plan.id)
      assert.equal(plan.pricePerMonth, plan.includedHours * CARE_RATE_PER_HOUR, plan.id)
    }

    for (const plan of plans.filter(
      (item) => item.family === 'partner' && item.visibility !== 'hidden',
    )) {
      assert.ok(plan.includedHours !== undefined, plan.id)
      assert.equal(plan.pricePerMonth, plan.includedHours * BUILD_RATE_PER_HOUR, plan.id)
    }
  })
})
