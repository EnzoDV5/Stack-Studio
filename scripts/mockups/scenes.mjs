/**
 * The mockup images rendered for each project (scripts/mockups/render.mjs), written to
 * public/media/projects/mockups/{project}-{name}-{width}.webp at every width of its shape.
 * `desktop`, `tablet` and `mobile` name captures from shots.mjs. Shapes match their slot
 * in src/data/media.ts (keep `mockupShapes` there in sync with `shapes` here).
 *
 * Each project gets its own composition for its Work card and its Home showcase, so no two
 * projects (and no two pages) repeat the same mockup:
 *   laptop-phone, laptop-phones, devices-trio, tablet-phone, phones-trio, browser-phone, perspective
 *   (three windows on a tilted plane), browser, browser-stack (first name in front), phone.
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

/**
 * Output sizes. Each width is rendered separately (not downscaled), largest first. The
 * largest covers a full-bleed retina screen: the Home hero and reel are 100vw.
 */
export const shapes = {
  card: { aspect: 3 / 4, widths: [2400, 1600, 800] }, // Work cards, next-project card
  showcase: { aspect: 9 / 16, widths: [3840, 2560, 1280] }, // Home hero, work reel, case hero
  wide: { aspect: 9 / 16, widths: [3840, 2560, 1280] }, // full-width gallery images
  tall: { aspect: 5 / 4, widths: [2000, 1200, 600] }, // half-width gallery images
}

export const scenes = [
  // GC Solar: the classic laptop and phone on the card; the device family (tablet, laptop,
  // phone) on Home, each on a different page.
  {
    project: 'gc-solar',
    name: 'card',
    shape: 'card',
    layout: 'laptop-phone',
    desktop: ['home'],
    mobile: ['home'],
  },
  {
    project: 'gc-solar',
    name: 'showcase',
    shape: 'showcase',
    layout: 'devices-trio',
    desktop: ['solutions'],
    tablet: 'projects',
    mobile: ['home'],
  },
  {
    project: 'gc-solar',
    name: 'solutions',
    shape: 'wide',
    layout: 'browser',
    desktop: ['solutions'],
  },
  { project: 'gc-solar', name: 'quote-mobile', shape: 'tall', layout: 'phone', mobile: ['quote'] },
  {
    project: 'gc-solar',
    name: 'projects-mobile',
    shape: 'tall',
    layout: 'phone',
    mobile: ['projects'],
  },
  {
    project: 'gc-solar',
    name: 'company',
    shape: 'wide',
    layout: 'browser-stack',
    desktop: ['quote', 'about'],
  },

  // MPG Foundation: a tablet and phone on the card; a browser and phone on Home.
  {
    project: 'mpg-foundation',
    name: 'card',
    shape: 'card',
    layout: 'tablet-phone',
    tablet: 'home',
    mobile: ['what-we-do'],
  },
  {
    project: 'mpg-foundation',
    name: 'showcase',
    shape: 'showcase',
    layout: 'browser-phone',
    desktop: ['story'],
    mobile: ['donate'],
  },
  {
    project: 'mpg-foundation',
    name: 'what-we-do',
    shape: 'wide',
    layout: 'browser',
    desktop: ['what-we-do'],
  },
  {
    project: 'mpg-foundation',
    name: 'donate-mobile',
    shape: 'tall',
    layout: 'phone',
    mobile: ['donate'],
  },
  {
    project: 'mpg-foundation',
    name: 'what-we-do-mobile',
    shape: 'tall',
    layout: 'phone',
    mobile: ['what-we-do'],
  },
  {
    project: 'mpg-foundation',
    name: 'story',
    shape: 'wide',
    layout: 'browser-stack',
    desktop: ['donate', 'story'],
  },

  // Salon Friend: three phones on the card (it's a shop people use on the go); a laptop
  // between two phones on Home.
  {
    project: 'salon-friend',
    name: 'card',
    shape: 'card',
    layout: 'phones-trio',
    mobile: ['home', 'products', 'product'],
  },
  {
    project: 'salon-friend',
    name: 'showcase',
    shape: 'showcase',
    layout: 'laptop-phones',
    desktop: ['home'],
    mobile: ['products', 'product'],
  },
  {
    project: 'salon-friend',
    name: 'catalogue',
    shape: 'wide',
    layout: 'browser',
    desktop: ['products'],
  },
  {
    project: 'salon-friend',
    name: 'product-mobile',
    shape: 'tall',
    layout: 'phone',
    mobile: ['product'],
  },
  {
    project: 'salon-friend',
    name: 'catalogue-mobile',
    shape: 'tall',
    layout: 'phone',
    mobile: ['products'],
  },
  {
    project: 'salon-friend',
    name: 'brands',
    shape: 'wide',
    layout: 'browser-stack',
    desktop: ['product', 'brands'],
  },
]
