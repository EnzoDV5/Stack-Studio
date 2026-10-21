// Draws the Stack mark cursors into public/cursor: tilted like a system arrow, tip at the
// hotspot. default = orange with an ink outline, pointer = ink with an orange outline.
// PNG fallbacks use macOS `sips`. Prints the path and hotspot for components/layout/Cursor.
//   node scripts/cursor/render.mjs
import { execFileSync } from 'node:child_process'
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const OUT = new URL('../../public/cursor/', import.meta.url)

// Traced from public/StackLogo2.png (1254px canvas). The apex is the tip.
const apex = [627, 167]
const outer = [apex, [1175, 1082], [904, 1082], [627, 625], [349, 1082], [78, 1082]]
const inner = [
  [627, 790],
  [805, 1082],
  [449, 1082],
]

const SIZE = 32
const PAD = 2.5
/** Counter-clockwise tilt: the left edge ends up near vertical, like an arrow cursor. */
const TILT = (-28 * Math.PI) / 180

const rotate = ([x, y]) => {
  const dx = x - apex[0]
  const dy = y - apex[1]
  return [dx * Math.cos(TILT) - dy * Math.sin(TILT), dx * Math.sin(TILT) + dy * Math.cos(TILT)]
}

const all = [...outer, ...inner].map(rotate)
const minX = Math.min(...all.map((p) => p[0]))
const minY = Math.min(...all.map((p) => p[1]))
const span = Math.max(...all.map((p) => p[0] - minX), ...all.map((p) => p[1] - minY))
const scale = (SIZE - PAD * 2) / span

const place = (p) => {
  const [x, y] = rotate(p)
  return [+((x - minX) * scale + PAD).toFixed(2), +((y - minY) * scale + PAD).toFixed(2)]
}
const d = (points) => `M${points.map((p) => place(p).join(' ')).join('L')}Z`

const chevron = d(outer)
const triangle = d(inner)
const [hx, hy] = place(apex).map(Math.round)

// Only the chevron is outlined: at 32px an outline round the inner triangle closes the gap.
const svg = (fill, stroke) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}" fill="${fill}"><path d="${chevron}" stroke="${stroke}" stroke-width="2" stroke-linejoin="round" paint-order="stroke"/><path d="${triangle}"/></svg>\n`

const variants = { default: svg('#FF5A14', '#0A0A0A'), pointer: svg('#0A0A0A', '#FF5A14') }
for (const [name, content] of Object.entries(variants)) {
  const file = new URL(`${name}.svg`, OUT)
  writeFileSync(file, content)
  execFileSync(
    'sips',
    [
      '-s',
      'format',
      'png',
      fileURLToPath(file),
      '--out',
      fileURLToPath(new URL(`${name}.png`, OUT)),
    ],
    {
      stdio: 'ignore',
    },
  )
}

console.log(`hotspot: ${hx} ${hy}\nchevron: ${chevron}\ntriangle: ${triangle}`)
