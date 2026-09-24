/** Fetch only the pinned SVGs referenced by the technology catalogue; no runtime CDN. */
import { mkdir, readFile, writeFile } from 'node:fs/promises'

const root = new URL('../', import.meta.url)
const destination = new URL('public/logos/technologies/', root)
const catalogue = await readFile(new URL('src/data/technologies.ts', root), 'utf8')
const names = [
  ...new Set(
    [...catalogue.matchAll(/\/logos\/technologies\/([a-z0-9]+)\.svg/g)].map((match) => match[1]),
  ),
]
const simpleIcons = 'https://raw.githubusercontent.com/simple-icons/simple-icons/'
const devicon = 'https://raw.githubusercontent.com/devicons/devicon/v2.17.0/'

function source(name) {
  if (name === 'framermotion') return `${devicon}icons/framermotion/framermotion-original.svg`
  // These marks were removed from newer Simple Icons releases.
  const version = name === 'css3' || name === 'openai' ? '14.15.0' : '16.32.0'
  return `${simpleIcons}${version}/icons/${name}.svg`
}

async function download(url) {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`${response.status}: ${url}`)
  return response.text()
}

await mkdir(destination, { recursive: true })
for (let offset = 0; offset < names.length; offset += 6) {
  await Promise.all(
    names.slice(offset, offset + 6).map(async (name) => {
      const svg = await download(source(name))
      if (!svg.trim().startsWith('<svg') || /<script|<image|<foreignObject/i.test(svg)) {
        throw new Error(`Unexpected SVG content: ${name}`)
      }
      await writeFile(new URL(`${name}.svg`, destination), svg)
    }),
  )
}

await writeFile(
  new URL('LICENSE.simple-icons.txt', destination),
  await download(`${simpleIcons}16.32.0/LICENSE.md`),
)
await writeFile(new URL('LICENSE.devicon.txt', destination), await download(`${devicon}LICENSE`))
console.log(`Saved ${names.length} technology SVGs and their source licences.`)
