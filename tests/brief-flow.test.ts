import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { briefSteps } from '@/data/brief'
import { addOns } from '@/data/addons'
import { plans } from '@/data/plans'
import { offerings } from '@/data/services'
import { timelineOptions } from '@/data/brief'
import { prefillFromParams } from '@/lib/brief-prefill'
import { emptyAnswers } from '@/lib/brief-reducer'
import {
  briefOfferings,
  firstOpenStepId,
  resolveOptions,
  visibleSteps,
  type OptionData,
} from '@/lib/brief-steps'
import { validateBrief } from '@/lib/brief-schema'
import { estimate } from '@/lib/estimate'
import type { BriefAnswers } from '@/types'

const data = { offerings, plans }
const optionData: OptionData = {
  offerings,
  plans,
  addOns,
  timelines: timelineOptions,
  labels: { perMonth: '/month' },
}
const contact = {
  name: 'Test Client',
  email: 'client@example.com',
  phone: '',
  company: '',
  message: '',
}
const stepIds = (answers: Partial<BriefAnswers>) =>
  visibleSteps(briefSteps, answers, data).map((s) => s.id)
const buildTypeStep = briefSteps.find((s) => s.id === 'buildType')

describe('Build: website, app or software', () => {
  it('asks the kind before the project type, and never asks for a budget', () => {
    assert.deepEqual(stepIds({ path: 'build' }), [
      'path',
      'buildKind',
      'timeline',
      'contact',
      'review',
    ])
    assert.deepEqual(stepIds({ path: 'build', buildKind: 'website', buildType: 'ecommerce' }), [
      'path',
      'buildKind',
      'buildType',
      'pages',
      'addOns',
      'languages',
      'carePlan',
      'timeline',
      'contact',
      'review',
    ])
    assert.deepEqual(stepIds({ path: 'build', buildKind: 'app', buildType: 'web-app' }), [
      'path',
      'buildKind',
      'buildType',
      'audience',
      'needs',
      'timeline',
      'contact',
      'review',
    ])
    assert.ok(!briefSteps.some((s) => s.id === 'budget'))
  })

  it('files every brief offering under a kind, and offers only that kind next', () => {
    assert.ok(buildTypeStep)
    for (const kind of ['website', 'app', 'software'] as const) {
      const options = resolveOptions(buildTypeStep, optionData, { path: 'build', buildKind: kind })
      assert.ok(options.length > 0, kind)
      for (const option of options) {
        assert.equal(offerings.find((o) => o.id === option.value)?.briefKind, kind, option.value)
      }
    }
    const all = briefOfferings(offerings)
    const byKind = ['website', 'app', 'software'].flatMap((k) => briefOfferings(offerings, k))
    assert.equal(byKind.length, all.length)
  })

  it('opens at the project type from the Services groups (?kind=)', () => {
    for (const kind of ['website', 'app', 'software'] as const) {
      const prefill = prefillFromParams(new URLSearchParams({ kind }), data)
      assert.deepEqual(prefill.answers, { path: 'build', buildKind: kind })
      assert.equal(
        firstOpenStepId(briefSteps, { ...emptyAnswers, ...prefill.answers }, data),
        'buildType',
      )
    }
  })

  it('sets the kind too when a service is picked (?type=)', () => {
    const prefill = prefillFromParams(new URLSearchParams({ type: 'desktop-app' }), data)
    assert.equal(prefill.answers.buildKind, 'software')
    assert.equal(prefill.answers.buildType, 'desktop-app')
  })

  it('offers a complete AI system as its own app project', () => {
    const aiSystem = offerings.find((offering) => offering.id === 'ai-systems')
    assert.ok(aiSystem)
    assert.equal(aiSystem.name, 'AI Systems & Apps')
    assert.equal(aiSystem.briefKind, 'app')
    assert.equal(aiSystem.requiresDiscovery, true)
    const prefill = prefillFromParams(new URLSearchParams('type=ai-systems'), data)
    assert.deepEqual(prefill.answers, {
      path: 'build',
      buildKind: 'app',
      buildType: 'ai-systems',
    })
    assert.equal(estimate({ ...prefill.answers, timeline: 'standard' }).kind, 'discovery')
  })

  it('still prices websites as a range and software through Discovery', () => {
    const base = { path: 'build', timeline: 'standard' } as const
    assert.equal(
      estimate({ ...base, buildKind: 'website', buildType: 'business-website', pages: 5 }).kind,
      'range',
    )
    assert.equal(estimate({ ...base, buildKind: 'app', buildType: 'web-app' }).kind, 'discovery')
  })
})

describe('Care plan for something that already exists', () => {
  it('asks what we would look after', () => {
    assert.deepEqual(stepIds({ path: 'run' }), [
      'path',
      'runType',
      'builtBy',
      'currentSetup',
      'contact',
      'review',
    ])
  })

  it('opens from a plan card with the plan chosen, then asks who built it', () => {
    const prefill = prefillFromParams(new URLSearchParams('plan=care-essential'), data)
    assert.deepEqual(prefill.answers, { path: 'run', runType: 'website' })
    assert.equal(
      firstOpenStepId(briefSteps, { ...emptyAnswers, ...prefill.answers }, data),
      'builtBy',
    )
  })

  it('can be sent', () => {
    const result = validateBrief({
      ...emptyAnswers,
      path: 'run',
      runType: 'website',
      builtBy: 'other',
      currentSetup: 'mybusiness.co.za on WordPress',
      contact,
      consent: true,
    })
    assert.equal(result.ok, true)
  })
})
