/**
 * The mockup images rendered for each project (scripts/mockups/render.mjs), written to
 * public/media/projects/mockups/{project}-{name}.webp plus a half-size -small.webp.
 * `desktop` and `mobile` name captures from shots.mjs. Sizes match their slot in
 * src/data/media.ts: thumbnails 4:3, heroes and full gallery images 16:9, half gallery 4:5.
 *
 * Layouts: 'laptop-phone' (a laptop with a phone in front), 'browser' (one browser window),
 * 'browser-stack' (two overlapping windows; `desktop` then `back`), 'phone' (one phone).
 */
export const themes = {
  // Deep green studio, after GC Solar's own dark greens.
  'gc-solar': {
    bg: '#0d1310',
    glowA: 'rgba(132, 176, 112, 0.30)',
    glowB: 'rgba(52, 86, 66, 0.55)',
    spot: 'rgba(255, 255, 255, 0.06)',
    shadow: 0.6,
    grain: 0.08,
  },
  // Warm paper with MPG's green and orange as soft light.
  'mpg-foundation': {
    bg: '#f3efe6',
    glowA: 'rgba(92, 170, 60, 0.22)',
    glowB: 'rgba(240, 130, 40, 0.20)',
    spot: 'rgba(255, 255, 255, 0.7)',
    shadow: 0.24,
    grain: 0.05,
  },
  // Sand and gold, after Salon Friend's cream, black and gold.
  'salon-friend': {
    bg: '#ebe4d8',
    glowA: 'rgba(201, 162, 98, 0.38)',
    glowB: 'rgba(44, 32, 22, 0.14)',
    spot: 'rgba(255, 255, 255, 0.55)',
    shadow: 0.28,
    grain: 0.05,
  },
}

const thumb = [1600, 1200]
const wide = [2400, 1350]
const tall = [1200, 1500]

export const scenes = [
  // GC Solar
  {
    project: 'gc-solar',
    name: 'thumb',
    size: thumb,
    layout: 'laptop-phone',
    desktop: 'home',
    mobile: 'home',
  },
  {
    project: 'gc-solar',
    name: 'hero',
    size: wide,
    layout: 'laptop-phone',
    desktop: 'solutions',
    mobile: 'projects',
  },
  { project: 'gc-solar', name: 'solutions', size: wide, layout: 'browser', desktop: 'solutions' },
  { project: 'gc-solar', name: 'quote-mobile', size: tall, layout: 'phone', mobile: 'quote' },
  { project: 'gc-solar', name: 'projects-mobile', size: tall, layout: 'phone', mobile: 'projects' },
  {
    project: 'gc-solar',
    name: 'company',
    size: wide,
    layout: 'browser-stack',
    desktop: 'quote',
    back: 'about',
  },

  // MPG Foundation
  {
    project: 'mpg-foundation',
    name: 'thumb',
    size: thumb,
    layout: 'laptop-phone',
    desktop: 'home',
    mobile: 'what-we-do',
  },
  {
    project: 'mpg-foundation',
    name: 'hero',
    size: wide,
    layout: 'laptop-phone',
    desktop: 'story',
    mobile: 'donate',
  },
  {
    project: 'mpg-foundation',
    name: 'what-we-do',
    size: wide,
    layout: 'browser',
    desktop: 'what-we-do',
  },
  {
    project: 'mpg-foundation',
    name: 'donate-mobile',
    size: tall,
    layout: 'phone',
    mobile: 'donate',
  },
  {
    project: 'mpg-foundation',
    name: 'what-we-do-mobile',
    size: tall,
    layout: 'phone',
    mobile: 'what-we-do',
  },
  {
    project: 'mpg-foundation',
    name: 'story',
    size: wide,
    layout: 'browser-stack',
    desktop: 'donate',
    back: 'story',
  },

  // Salon Friend
  {
    project: 'salon-friend',
    name: 'thumb',
    size: thumb,
    layout: 'laptop-phone',
    desktop: 'home',
    mobile: 'home',
  },
  {
    project: 'salon-friend',
    name: 'hero',
    size: wide,
    layout: 'laptop-phone',
    desktop: 'products',
    mobile: 'product',
  },
  {
    project: 'salon-friend',
    name: 'catalogue',
    size: wide,
    layout: 'browser',
    desktop: 'products',
  },
  {
    project: 'salon-friend',
    name: 'product-mobile',
    size: tall,
    layout: 'phone',
    mobile: 'product',
  },
  {
    project: 'salon-friend',
    name: 'catalogue-mobile',
    size: tall,
    layout: 'phone',
    mobile: 'products',
  },
  {
    project: 'salon-friend',
    name: 'brands',
    size: wide,
    layout: 'browser-stack',
    desktop: 'product',
    back: 'brands',
  },
]
