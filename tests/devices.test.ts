import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { describe, it } from 'node:test'
import { deviceMotion, media } from '@/data/media'
import { offerings } from '@/data/services'

const publicDir = join(import.meta.dirname, '../public')

describe('Services device sequences (scripts/devices)', () => {
  const sequences = [
    ['phone', media.apps.phone],
    ['laptop', media.desktop.laptop],
  ] as const

  it('have every frame on disk', () => {
    for (const [device, sequence] of sequences) {
      for (const rendition of sequence.renditions) {
        assert.equal(rendition.frames.length, deviceMotion[device].frames, device)
        for (const frame of rendition.frames) {
          assert.ok(existsSync(join(publicDir, frame)), frame)
        }
      }
    }
  })

  it('have real, visible Build offerings under Desktop software', () => {
    const desktop = offerings.filter((o) => o.briefKind === 'software')
    assert.ok(desktop.length > 0)
    for (const offering of desktop) {
      assert.equal(offering.stage, 'build', offering.id)
      assert.notEqual(offering.visibility, 'hidden', offering.id)
    }
  })
})
