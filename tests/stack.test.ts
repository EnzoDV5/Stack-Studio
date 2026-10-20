import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { stackBuilds, technologies, technologyLayers } from '@/data/technologies'
import { buildsUsing, stackRows, usesTechnology } from '@/lib/stack'

describe('stackRows', () => {
  const rows = stackRows(technologies, technologyLayers)

  it('places every technology exactly once, in its primary layer', () => {
    const placed = rows.flatMap((row) => row.technologies.map((t) => t.id))
    assert.equal(placed.length, technologies.length)
    assert.equal(new Set(placed).size, technologies.length)
    for (const row of rows) {
      for (const technology of row.technologies) {
        assert.equal(technology.categories[0], row.layer.id, technology.id)
      }
    }
  })

  it('has a layer for every category used, and no empty layers', () => {
    const layerIds = new Set(technologyLayers.map((layer) => layer.id))
    for (const technology of technologies) {
      for (const category of technology.categories) assert.ok(layerIds.has(category), category)
    }
    for (const row of rows) assert.ok(row.technologies.length > 0, row.layer.id)
  })
})

describe('stack builds', () => {
  it('only name technologies that exist, once each', () => {
    const ids = new Set(technologies.map((t) => t.id))
    for (const build of stackBuilds) {
      assert.equal(new Set(build.technologies).size, build.technologies.length, build.id)
      for (const id of build.technologies) assert.ok(ids.has(id), `${build.id}: ${id}`)
    }
  })

  it('treats an empty list as everything', () => {
    const everything = stackBuilds.find((build) => build.technologies.length === 0)
    assert.ok(everything)
    assert.ok(technologies.every((t) => usesTechnology(everything, t.id)))
    assert.equal(buildsUsing(stackBuilds, 'figma').includes(everything), false)
  })

  it('lists the builds that use a technology', () => {
    const builds = buildsUsing(stackBuilds, 'expo').map((build) => build.id)
    assert.deepEqual(builds, ['mobile'])
  })
})
