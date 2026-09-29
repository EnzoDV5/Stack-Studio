import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { describe, it } from 'node:test'
import { phoneTurnFrames } from '@/data/media'
import { projects } from '@/data/projects'

const publicDir = join(import.meta.dirname, '../public')

describe('case study phone turn', () => {
  it('has every frame on disk for every project that uses it (scripts/phone)', () => {
    for (const project of projects) {
      if (!project.phone) continue
      for (const rendition of project.phone.renditions) {
        assert.equal(rendition.frames.length, phoneTurnFrames, project.slug)
        for (const frame of rendition.frames) {
          assert.ok(existsSync(join(publicDir, frame)), `${project.slug}: ${frame}`)
        }
      }
    }
  })
})
