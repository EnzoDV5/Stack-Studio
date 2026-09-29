import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { describe, it } from 'node:test'
import { deviceMotion, media } from '@/data/media'
import { servicesContent } from '@/data/pages'
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

  it('group real, visible Build offerings under Desktop software', () => {
    for (const id of servicesContent.desktop.offerings) {
      const offering = offerings.find((o) => o.id === id)
      assert.ok(offering, id)
      assert.equal(offering.stage, 'build', id)
      assert.notEqual(offering.visibility, 'hidden', id)
    }
  })
})
