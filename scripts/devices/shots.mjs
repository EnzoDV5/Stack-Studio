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

  /** MacBook Pro 14", space black: 03 Desktop software (the lid opens as it arrives). */
  laptop: {
    model: 'macbook-pro-14/macbook-pro-14.glb',
    scene: 'laptop-scene.js',
    /** The whole display in pt (menu bar included, drawn by the screen itself), at 1.5x. */
    screen: { width: 1512, height: 982, scale: 1.5 },
    look: {
      exposure: 1.05,
      fov: 18,
      margin: 0.8,
      /** Height above the base the camera aims at (model units, metres). */
      aim: 0.075,
      quality: 0.74,
    },
    /** Shut and seen from above at an angle, then the lid opens and it turns to face you. */
    motion: {
      frames: 90,
      from: { turn: -34, tilt: 38, lid: 0 },
      to: { turn: -8, tilt: 12, lid: 104 },
      aspect: 16 / 10,
      widths: [720, 1280],
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
