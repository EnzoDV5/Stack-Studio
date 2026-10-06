import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { briefSteps } from '@/data/brief'
import { plans } from '@/data/plans'
import { offerings } from '@/data/services'
import { prefillFromParams } from '@/lib/brief-prefill'
import { emptyAnswers } from '@/lib/brief-reducer'
import { visibleSteps } from '@/lib/brief-steps'
import { validateBrief } from '@/lib/brief-schema'
import { estimate } from '@/lib/estimate'
import { BUILD_RATE_PER_HOUR } from '@/data/rates'

describe('Partner enquiries', () => {
  const data = { offerings, plans }

  it('keeps old package links working by opening a discussion', () => {
    const prefill = prefillFromParams(new URLSearchParams('plan=partner-20'), data)
    assert.deepEqual(prefill.answers, { path: 'develop', hours: 'discuss' })
    assert.equal(prefill.stepId, 'contact')
  })

  it('shows one starting Partner card while keeping larger examples out of the comparison', () => {
    assert.deepEqual(
      plans
        .filter((plan) => plan.family === 'partner' && plan.visibility === 'pricing')
        .map((plan) => plan.id),
      ['partner-10'],
    )
  })

  it('lets clients choose their own hours or ask to discuss them', () => {
    const custom = prefillFromParams(new URLSearchParams('partner=custom'), data)
    const discuss = prefillFromParams(new URLSearchParams('partner=discuss'), data)
    assert.equal(custom.stepId, 'customHours')
    assert.deepEqual(custom.answers, { path: 'develop', hours: 'custom' })
    assert.equal(discuss.stepId, 'contact')
    assert.deepEqual(discuss.answers, { path: 'develop', hours: 'discuss' })

    const steps = visibleSteps(briefSteps, { path: 'develop', hours: 'custom' }, data)
    assert.deepEqual(
      steps.map((step) => step.id),
      ['path', 'hours', 'customHours', 'contact', 'review'],
    )
  })

  it('calculates custom hours and accepts a discussion without an estimate', () => {
    assert.deepEqual(estimate({ path: 'develop', hours: 'custom', customHours: 9 }), {
      kind: 'none',
    })
    const result = estimate({ path: 'develop', hours: 'custom', customHours: 12 })
    assert.equal(result.kind, 'plan')
    if (result.kind === 'plan') {
      assert.equal(result.plans[0]?.includedHours, 12)
      assert.equal(result.plans[0]?.pricePerMonth, 12 * BUILD_RATE_PER_HOUR)
    }
    assert.deepEqual(estimate({ path: 'develop', hours: 'discuss' }), {
      kind: 'consult',
      topic: 'partner',
    })
  })

  it('accepts a direct discussion brief without work categories', () => {
    const result = validateBrief({
      ...emptyAnswers,
      path: 'develop',
      hours: 'discuss',
      contact: {
        name: 'Test Client',
        email: 'client@example.com',
        phone: '',
        company: '',
        message: '',
      },
      consent: true,
    })
    assert.equal(result.ok, true)
  })
})
