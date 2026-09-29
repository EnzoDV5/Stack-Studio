import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { describe, it } from 'node:test'
import { media, phoneTurnFrames } from '@/data/media'

const publicDir = join(import.meta.dirname, '../public')

describe('apps phone turn (Services)', () => {
  it('has every frame on disk (scripts/phone)', () => {
    for (const rendition of media.apps.phone.renditions) {
      assert.equal(rendition.frames.length, phoneTurnFrames)
      for (const frame of rendition.frames) {
        assert.ok(existsSync(join(publicDir, frame)), frame)
      }
    }
  })
})
