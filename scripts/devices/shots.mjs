/**
 * Device renders for the Services page: each device (a 3D model in assets/models) with its own
 * scene, screen size, look and motion, and the sequences rendered with it.
 *
 * A motion interpolates every key from `from` to `to` over evenly spaced frames (the same small
 * step each); the easing lives where the frames are played (src/lib/motion-tokens.ts). Angles
 * are in degrees: `turn` spins around the upright axis (0 = facing the viewer), `tilt` leans
 * the top toward the viewer, `roll` rotates in the picture plane, and `lid` (laptop) is how far
 * the lid is open (0 = shut).
 */
export const devices = {
  /** iPhone 17 Pro, Cosmic Orange: 02 Apps and software (scrubbed turn). */
  phone: {
    model: 'iphone-17-pro/iphone-17-pro.glb',
    scene: 'phone-scene.js',
    /** The screen below the status bar, in pt, rendered at 3x (the scene adds the bar). */
    screen: { width: 402, height: 812, scale: 3 },
    look: {
      /** Cosmic Orange, the iPhone 17 Pro finish closest to the brand orange. */
      finish: '#e8692a',
      exposure: 1,
      glass: 0.05,
      /** A long lens: flatter, like a product shot, with little perspective skew. */
      fov: 14,
      /** Space around the phone's height in the frame. */
      margin: 1.12,
      quality: 0.74,
    },
    /** A clean product spin from behind to almost straight on. */
    motion: {
      frames: 80,
      from: { turn: -165, tilt: 0, roll: 0 },
      /** A hint of the right-hand edge, so it still reads as a solid object. */
      to: { turn: -10, tilt: 0, roll: 0 },
      /** Output is width ÷ height; rendered afresh at each width. */
      aspect: 3 / 4,
      widths: [480, 800],
    },
  },

  /** MacBook Pro 14", space black: 03 Desktop software (scrubbed: the lid opens as it scrolls). */
  laptop: {
    model: 'macbook-pro-14/macbook-pro-14.glb',
    scene: 'laptop-scene.js',
    /** The whole display in pt (menu bar included, drawn by the screen itself), at 2x. */
    screen: { width: 1512, height: 982, scale: 2 },
    look: {
      exposure: 1,
      fov: 20,
      /** Share of the frame the laptop's extent across the whole motion fills (window.fit). */
      fill: 0.96,
      /** Reflections from the room, a key light (upper left) and a rim light (behind). */
      environment: 0.9,
      key: 1.6,
      rim: 1.2,
      /** Roughness for the anodised aluminium (the model has it fully rough and flat). */
      satin: 0.42,
      /** Render this many times larger, then scale down: clean edges, a crisp screen. */
      supersample: 2,
      quality: 0.8,
    },
    /**
     * Shut and seen from above, angled away; the lid opens as it turns to face the content on
     * its right (positive `turn` shows the laptop's left side).
     */
    motion: {
      frames: 72,
      from: { turn: 26, tilt: 32, lid: 0 },
      to: { turn: 12, tilt: 10, lid: 104 },
      aspect: 4 / 3,
      widths: [800, 1200, 1800],
    },
  },
}

/** Each sequence renders to public/media/{device}/{id}/frame-{nn}-{width}.webp. */
export const sequences = [
  /** An illustrative bookings app, not a client's: most client work is websites. */
  { id: 'app', device: 'phone', screen: 'bookings.html' },
  /** An illustrative stock and orders desktop app, not a client's. */
  { id: 'desktop', device: 'laptop', screen: 'desktop.html' },
]
