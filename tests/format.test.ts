import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { displayUrl } from '@/lib/format'
import { projects } from '@/data/projects'

describe('displayUrl', () => {
  it('drops the protocol, www and trailing slash', () => {
    assert.equal(displayUrl('https://www.mpgf.org.za/'), 'mpgf.org.za')
    assert.equal(displayUrl('https://salon-friends.web.app'), 'salon-friends.web.app')
  })

  it('keeps a path', () => {
    assert.equal(displayUrl('https://example.com/shop/'), 'example.com/shop')
  })
})

describe('project live URLs', () => {
  it('are real https links, never placeholders', () => {
    for (const project of projects) {
      if (!project.liveUrl) continue
      assert.match(project.liveUrl, /^https:\/\//, project.slug)
      assert.doesNotMatch(project.liveUrl, /example\.com/, project.slug)
    }
  })
})
