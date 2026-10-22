import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { briefReducer, emptyAnswers, initBriefState } from '@/lib/brief-reducer'

describe('brief failure recovery', () => {
  const answers = {
    ...emptyAnswers,
    contact: { ...emptyAnswers.contact, name: 'Enzo Test', email: 'enzo@example.com' },
  }
  const failed = briefReducer(initBriefState(answers, 'review'), { type: 'failure' })

  it('clears delivery and validation errors when moving back to another step', () => {
    const invalid = briefReducer(failed, { type: 'errors', errors: { 'contact.email': 'Invalid' } })
    const next = briefReducer(invalid, { type: 'goTo', stepId: 'contact', direction: -1 })
    assert.equal(next.status, 'editing')
    assert.deepEqual(next.errors, {})
    assert.equal(next.answers, answers)
  })

  it('dismisses an error without losing answers or moving the visitor', () => {
    const next = briefReducer(failed, { type: 'dismissError' })
    assert.equal(next.status, 'editing')
    assert.equal(next.stepId, 'review')
    assert.equal(next.answers, answers)
    assert.deepEqual(next.errors, {})
  })

  it('keeps a pending send locked while it is being delivered', () => {
    const sending = briefReducer(failed, { type: 'submit' })
    assert.equal(briefReducer(sending, { type: 'goTo', stepId: 'contact', direction: -1 }), sending)
    assert.equal(briefReducer(sending, { type: 'dismissError' }).status, 'submitting')
  })
})
