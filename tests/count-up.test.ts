import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { formatCountable, parseCountable } from '@/lib/count-up'
import { formatPrice } from '@/lib/format'

describe('parseCountable / formatCountable', () => {
  it('round-trips an en-ZA price, keeping its no-break-space grouping', () => {
    const price = formatPrice(18_000)
    const parts = parseCountable(price)
    assert.ok(parts)
    assert.equal(parts.value, 18_000)
    assert.equal(formatCountable(parts, parts.value), price)
  })

  it('formats intermediate values with the same prefix, grouping and suffix', () => {
    const parts = parseCountable('R 1,250/month')
    assert.ok(parts)
    assert.equal(parts.prefix, 'R ')
    assert.equal(parts.suffix, '/month')
    assert.equal(formatCountable(parts, 0), 'R 0/month')
    assert.equal(formatCountable(parts, 999.6), 'R 1,000/month')
  })

  it('keeps decimals and symbols around the number', () => {
    const load = parseCountable('< 2.1s')
    assert.ok(load)
    assert.equal(load.decimals, 1)
    assert.equal(formatCountable(load, 1.04), '< 1.0s')

    const growth = parseCountable('+38%')
    assert.ok(growth)
    assert.equal(formatCountable(growth, 12.4), '+12%')

    const weeks = parseCountable('6 wks')
    assert.ok(weeks)
    assert.equal(weeks.value, 6)
    assert.equal(formatCountable(weeks, 6), '6 wks')
  })

  it('never formats below zero', () => {
    const parts = parseCountable('100')
    assert.ok(parts)
    assert.equal(formatCountable(parts, -5), '0')
  })

  it('returns null when there is nothing to count', () => {
    assert.equal(parseCountable('Quoted per project'), null)
  })
})
