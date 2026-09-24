// Generates PLACEHOLDER brand images into /public with no dependencies (Node zlib only):
//   favicon.ico (32), apple-touch-icon.png (180), icon-192.png, icon-512.png, og-image.png (1200×630)
// Replace them with designed artwork when available. Run: node scripts/generate-placeholders.mjs
import { writeFileSync } from 'node:fs'
import { deflateSync } from 'node:zlib'

const INK = [10, 10, 10]
const ORANGE = [255, 90, 20]
const GRID = [26, 26, 26]

// The Stack "A" chevron mark in a 100×100 box (same paths as src/components/ui/Logo).
const MARK = [
  [[50, 2], [99, 98], [78, 98], [50, 42], [22, 98], [1, 98]],
  [[50, 64], [62, 98], [38, 98]],
]

function inPolygon(x, y, poly) {
  let inside = false
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i]
    const [xj, yj] = poly[j]
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside
  }
  return inside
}

/** Draws the mark at (ox, oy) with size s, 4×4 supersampled. */
function drawMark(px, w, ox, oy, s) {
  const SS = 4
  for (let y = Math.floor(oy); y < Math.ceil(oy + s); y++) {
    for (let x = Math.floor(ox); x < Math.ceil(ox + s); x++) {
      let hits = 0
      for (let sy = 0; sy < SS; sy++)
        for (let sx = 0; sx < SS; sx++) {
          const mx = ((x + (sx + 0.5) / SS - ox) / s) * 100
          const my = ((y + (sy + 0.5) / SS - oy) / s) * 100
          if (MARK.some((p) => inPolygon(mx, my, p))) hits++
        }
      if (!hits) continue
      const a = hits / (SS * SS)
      const i = (y * w + x) * 4
      for (let c = 0; c < 3; c++) px[i + c] = Math.round(px[i + c] * (1 - a) + ORANGE[c] * a)
    }
  }
}

function canvas(w, h, fill) {
  const px = new Uint8Array(w * h * 4)
  for (let i = 0; i < w * h; i++) px.set([...fill, 255], i * 4)
  return px
}

function rect(px, w, x0, y0, rw, rh, color) {
  for (let y = y0; y < y0 + rh; y++)
    for (let x = x0; x < x0 + rw; x++) px.set([...color, 255], (y * w + x) * 4)
}

const CRC_TABLE = Array.from({ length: 256 }, (_, n) => {
  let c = n
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
  return c >>> 0
})
function crc32(buf) {
  let c = 0xffffffff
  for (const b of buf) c = CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}
function chunk(type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  const body = Buffer.concat([Buffer.from(type), data])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(body))
  return Buffer.concat([len, body, crc])
}
function png(w, h, px) {
  const raw = Buffer.alloc((w * 4 + 1) * h)
  for (let y = 0; y < h; y++) {
    raw[y * (w * 4 + 1)] = 0
    Buffer.from(px.buffer, y * w * 4, w * 4).copy(raw, y * (w * 4 + 1) + 1)
  }
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(w, 0)
  ihdr.writeUInt32BE(h, 4)
  ihdr.set([8, 6, 0, 0, 0], 8)
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

function icon(size, padding = 0.18) {
  const px = canvas(size, size, INK)
  const s = size * (1 - padding * 2)
  drawMark(px, size, size * padding, size * padding, s)
  return png(size, size, px)
}

function ico(pngBuf, size) {
  const header = Buffer.alloc(22)
  header.writeUInt16LE(0, 0)
  header.writeUInt16LE(1, 2)
  header.writeUInt16LE(1, 4)
  header[6] = size
  header[7] = size
  header.writeUInt16LE(1, 10)
  header.writeUInt16LE(32, 12)
  header.writeUInt32LE(pngBuf.length, 14)
  header.writeUInt32LE(22, 18)
  return Buffer.concat([header, pngBuf])
}

function ogImage() {
  const w = 1200
  const h = 630
  const px = canvas(w, h, INK)
  for (let x = 0; x < w; x += 72) rect(px, w, x, 0, 1, h, GRID)
  for (let y = 0; y < h; y += 72) rect(px, w, 0, y, w, 1, GRID)
  drawMark(px, w, 72, 72, 216)
  rect(px, w, 0, h - 14, 200, 14, ORANGE)
  return png(w, h, px)
}

writeFileSync('public/favicon.ico', ico(icon(32, 0.08), 32))
writeFileSync('public/apple-touch-icon.png', icon(180))
writeFileSync('public/icon-192.png', icon(192))
writeFileSync('public/icon-512.png', icon(512))
writeFileSync('public/og-image.png', ogImage())
console.log('Placeholder icons and OG image written to /public')
