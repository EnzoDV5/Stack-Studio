import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { describe, it } from 'node:test'
import { sectionDropdowns, sectionPreviews } from '../src/data/navigation'

describe('section navigation previews', () => {
  it('has a working preview for every Services and Process link', () => {
    for (const sections of Object.values(sectionDropdowns)) {
      for (const section of sections) {
        const preview = sectionPreviews[section.to]
        assert.ok(preview, `Missing preview for ${section.to}`)
        assert.ok(preview.description)

        if (preview.visual) {
          assert.ok(preview.steps.length > 0, `Empty diagram for ${section.to}`)
        } else if (preview.device) {
          const folder = preview.device === 'phone' ? 'phone/app' : 'laptop/desktop'
          const width = preview.device === 'phone' ? 480 : 800
          assert.ok(
            existsSync(join(process.cwd(), 'public/media', folder, `frame-68-${width}.webp`)),
            `Missing device frames for ${section.to}`,
          )
        } else {
          assert.ok(
            existsSync(join(process.cwd(), 'public', preview.image.slice(1))),
            `Missing preview image for ${section.to}`,
          )
          if (preview.video)
            assert.ok(
              existsSync(join(process.cwd(), 'public', preview.video.slice(1))),
              `Missing preview video for ${section.to}`,
            )
        }
      }
    }
  })
})
