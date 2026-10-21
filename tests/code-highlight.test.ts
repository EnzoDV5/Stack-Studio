import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { highlightLine } from '@/lib/code-highlight'

const kinds = (line: string) => highlightLine(line).map(({ kind, text }) => [kind, text])

describe('highlightLine', () => {
  it('keeps every character, in order', () => {
    const line = '  return hosting.launch(site, { care: true }) // done'
    assert.equal(
      highlightLine(line)
        .map((t) => t.text)
        .join(''),
      line,
    )
  })

  it('colours keywords, strings and punctuation', () => {
    assert.deepEqual(kinds("import { ux } from './design'"), [
      ['keyword', 'import'],
      ['plain', ' '],
      ['punctuation', '{'],
      ['plain', ' ux '],
      ['punctuation', '}'],
      ['plain', ' '],
      ['keyword', 'from'],
      ['plain', ' '],
      ['string', "'./design'"],
    ])
  })

  it('tells calls, object keys and members apart', () => {
    const tokens = highlightLine('  base: ux(story).then(visual), n: 2')
    const kindOf = (text: string) => tokens.find((t) => t.text === text)?.kind
    assert.equal(kindOf('base'), 'property')
    assert.equal(kindOf('ux'), 'function')
    assert.equal(kindOf('then'), 'function')
    assert.equal(kindOf('2'), 'number')
  })

  it('reads a member access as a property', () => {
    const tokens = highlightLine('business.difference')
    assert.deepEqual(tokens.at(-1), { kind: 'property', text: 'difference' })
  })

  it('treats the rest of the line after // as a comment', () => {
    assert.deepEqual(kinds('// one team'), [['comment', '// one team']])
  })

  it('returns nothing for an empty line', () => {
    assert.deepEqual(highlightLine(''), [])
  })
})
