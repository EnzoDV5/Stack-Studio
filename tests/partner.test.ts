import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { briefSteps } from '@/data/brief'
import { plans } from '@/data/plans'
import { offerings } from '@/data/services'
import { prefillFromParams } from '@/lib/brief-prefill'
import { emptyAnswers } from '@/lib/brief-reducer'
import { firstOpenStepId, visibleSteps } from '@/lib/brief-steps'
import { validateBrief, validateStep } from '@/lib/brief-schema'
import { estimate } from '@/lib/estimate'

const contact = {
  name: 'Test Client',
  email: 'client@example.com',
  phone: '',
  company: '',
  message: '',
}

describe('Partner enquiries', () => {
  const data = { offerings, plans }

  it('is a short enquiry: what we would work on, then contact details', () => {
    const steps = visibleSteps(briefSteps, { path: 'develop' }, data)
    assert.deepEqual(
      steps.map((step) => step.id),
      ['path', 'partnerIdea', 'contact', 'review'],
    )
  })

  it('opens the enquiry from the Partner card, the stage and old links', () => {
    for (const query of ['path=develop', 'partner=discuss', 'partner=custom', 'plan=partner-20']) {
      const prefill = prefillFromParams(new URLSearchParams(query), data)
      assert.deepEqual(prefill.answers, { path: 'develop' }, query)
      assert.equal(
        firstOpenStepId(briefSteps, { ...emptyAnswers, ...prefill.answers }, data),
        'partnerIdea',
        query,
      )
    }
  })

  it('keeps Partner out of fixed-price plan data', () => {
    assert.equal(plans.filter((plan) => plan.family === 'partner').length, 0)
  })

  it('never calculates a Partner price', () => {
    assert.deepEqual(estimate({ path: 'develop' }), { kind: 'consult', topic: 'partner' })
  })

  it('asks for a description and accepts a brief with one', () => {
    const step = briefSteps.find((s) => s.id === 'partnerIdea')
    assert.ok(step)
    assert.ok('partnerIdea' in validateStep(step, { ...emptyAnswers, path: 'develop' }))

    const result = validateBrief({
      ...emptyAnswers,
      path: 'develop',
      partnerIdea: 'Two websites and a booking app that need one team.',
      contact,
      consent: true,
    })
    assert.equal(result.ok, true)
  })
})
