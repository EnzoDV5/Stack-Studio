/**
 * The screens captured from each live client site for the mockups (scripts/mockups).
 * `path` is relative to the site; `anchor` scrolls a section to the top of the viewport
 * first (one-page sites). Desktop is 1440×900, tablet 1180×820 (iPad landscape), mobile 390×844.
 */
export const sites = {
  'gc-solar': {
    url: 'https://gcsolar-redesign-demo.netlify.app',
    // The demo host has no SPA rewrite, so inner pages 404 on a direct visit: open the
    // homepage and navigate client-side instead.
    spa: true,
    // The host's "Powered by Netlify" badge isn't part of the client's site, and the fixed
    // blur along the bottom of the viewport (a scroll effect) reads as a fault in a still.
    hide: '#nl-badge-frame, [id^="nl-badge"], .gradual-blur-page',
  },
  'mpg-foundation': {
    url: 'https://mpgf.org.za',
    // A dated campaign announcement; hidden (and the nav offset it reserves removed) so the
    // mockups don't go stale.
    hide: '.announce',
    prepare: "document.body.classList.remove('has-announce')",
  },
  'salon-friend': { url: 'https://salon-friends.web.app' },
}

export const shots = [
  // GC Solar
  { project: 'gc-solar', name: 'home', device: 'desktop', path: '/' },
  { project: 'gc-solar', name: 'solutions', device: 'desktop', path: '/solutions' },
  { project: 'gc-solar', name: 'projects', device: 'desktop', path: '/projects' },
  { project: 'gc-solar', name: 'about', device: 'desktop', path: '/about' },
  { project: 'gc-solar', name: 'quote', device: 'desktop', path: '/quote' },
  { project: 'gc-solar', name: 'projects', device: 'tablet', path: '/projects' },
  { project: 'gc-solar', name: 'home', device: 'mobile', path: '/' },
  { project: 'gc-solar', name: 'quote', device: 'mobile', path: '/quote' },
  { project: 'gc-solar', name: 'projects', device: 'mobile', path: '/projects' },

  // MPG Foundation (one page: sections by anchor)
  { project: 'mpg-foundation', name: 'home', device: 'desktop', path: '/' },
  {
    project: 'mpg-foundation',
    name: 'what-we-do',
    device: 'desktop',
    path: '/',
    anchor: '#what-we-do',
  },
  { project: 'mpg-foundation', name: 'story', device: 'desktop', path: '/', anchor: '#story' },
  { project: 'mpg-foundation', name: 'donate', device: 'desktop', path: '/', anchor: '#donate' },
  { project: 'mpg-foundation', name: 'home', device: 'mobile', path: '/' },
  { project: 'mpg-foundation', name: 'home', device: 'tablet', path: '/' },
  { project: 'mpg-foundation', name: 'donate', device: 'mobile', path: '/', anchor: '#donate' },
  {
    project: 'mpg-foundation',
    name: 'what-we-do',
    device: 'mobile',
    path: '/',
    anchor: '#what-we-do',
  },

  // Salon Friend
  { project: 'salon-friend', name: 'home', device: 'desktop', path: '/' },
  { project: 'salon-friend', name: 'products', device: 'desktop', path: '/products' },
  {
    project: 'salon-friend',
    name: 'product',
    device: 'desktop',
    path: '/products/keratinplex-like-olaplex',
  },
  { project: 'salon-friend', name: 'brands', device: 'desktop', path: '/brands' },
  { project: 'salon-friend', name: 'home', device: 'mobile', path: '/' },
  { project: 'salon-friend', name: 'products', device: 'mobile', path: '/products' },
  {
    project: 'salon-friend',
    name: 'product',
    device: 'mobile',
    path: '/products/keratinplex-like-olaplex',
  },
]

export const devices = {
  desktop: { width: 1440, height: 900, deviceScaleFactor: 2 },
  tablet: { width: 1180, height: 820, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
  mobile: { width: 390, height: 844, deviceScaleFactor: 3, isMobile: true, hasTouch: true },
}
