import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { plans } from '@/data/plans'
import { BUILD_RATE_PER_HOUR, CARE_RATE_PER_HOUR, getRate } from '@/data/rates'
import { offerings } from '@/data/services'
import { pricingContent } from '@/data/pages'
import { offeringPrice } from '@/lib/offer'
import { estimate } from '@/lib/estimate'

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

  it('offers one fixed Care plan and one fixed Managed plan at their bundled prices', () => {
    const visible = plans.filter((plan) => plan.visibility !== 'hidden')
    const care = visible.filter((plan) => plan.family === 'care')
    const managed = visible.filter((plan) => plan.family === 'managed')
    assert.equal(care.length, 1)
    assert.equal(managed.length, 1)
    assert.equal(care[0]?.pricePerMonth, 450 + CARE_RATE_PER_HOUR + 600 / 12)
    assert.equal(managed[0]?.pricePerMonth, 1_500 + (2 + 3) * CARE_RATE_PER_HOUR)
    assert.equal(managed[0]?.includedHours, 3)
  })

  it('recommends the same plan without asking how often changes happen', () => {
    const website = estimate({ path: 'run', runType: 'website' })
    const app = estimate({ path: 'run', runType: 'app' })
    assert.equal(website.kind, 'plan')
    assert.equal(app.kind, 'plan')
    if (website.kind === 'plan') assert.equal(website.plans[0]?.id, 'care-essential')
    if (app.kind === 'plan') assert.equal(app.plans[0]?.id, 'managed-app')
  })
})
