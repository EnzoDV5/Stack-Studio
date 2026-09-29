import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { pickVideoSource } from '@/lib/video-source'
import type { VideoAsset } from '@/types'

const clip: VideoAsset = {
  src: '/clip-1080.mp4',
  label: 'A clip',
  width: 1920,
  height: 1080,
  renditions: [{ src: '/clip-720.mp4', width: 1280 }],
}

describe('pickVideoSource', () => {
  it('uses the small encode for small wide boxes', () => {
    assert.equal(pickVideoSource(clip, { width: 390, height: 219 }, 3), '/clip-720.mp4') // phone
    assert.equal(pickVideoSource(clip, { width: 600, height: 338 }, 1), '/clip-720.mp4')
  })

  it('uses the full encode for large boxes', () => {
    assert.equal(pickVideoSource(clip, { width: 883, height: 497 }, 2), '/clip-1080.mp4')
  })

  it('accounts for cover cropping in tall boxes', () => {
    // 421 × 526 (4:5) shows the 16:9 video ~935 px wide: at 2× that needs 1080p.
    assert.equal(pickVideoSource(clip, { width: 421, height: 526 }, 2), '/clip-1080.mp4')
    // The same box at 1× is fine with 720p.
    assert.equal(pickVideoSource(clip, { width: 421, height: 526 }, 1), '/clip-720.mp4')
  })

  it('falls back to the largest when nothing is big enough', () => {
    assert.equal(pickVideoSource(clip, { width: 2560, height: 1440 }, 2), '/clip-1080.mp4')
  })

  it('works without renditions', () => {
    const single = { ...clip, renditions: undefined }
    assert.equal(pickVideoSource(single, { width: 200, height: 112 }), '/clip-1080.mp4')
  })
})
