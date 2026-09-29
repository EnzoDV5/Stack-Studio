/**
 * The phone turn on the Services page ("Apps and software"): a clean product spin. The phone
 * turns only around its upright axis, from behind (camera plateau), through its side, to face
 * the viewer almost straight on with an app on screen. Frames are evenly spaced (the same
 * small step each); the slow start and settle come from the scroll easing (phoneTurn).
 *
 * `screen` is an HTML page in screens/ (`*.html`) or a mobile capture in .mockups/raw
 * (without .png). Angles are in degrees: `turn`
 * spins it around its upright axis (0 = facing the viewer, ±180 = its back), `tilt` leans the
 * top away, `roll` rotates it in the picture plane.
 */
export const look = {
  /** Cosmic Orange, the iPhone 17 Pro finish closest to the brand orange. */
  finish: '#e8692a',
  exposure: 1,
  glass: 0.05,
  /** A long lens: flatter, like a product shot, with little perspective skew. */
  fov: 14,
  /** Space around the phone's height in the frame. */
  margin: 1.12,
  quality: 0.74,
}

export const turn = {
  frames: 80,
  from: { turn: -165, tilt: 0, roll: 0 },
  /** A hint of the right-hand edge, so it still reads as a solid object. */
  to: { turn: -10, tilt: 0, roll: 0 },
  /** Output is width ÷ height; rendered afresh at each width. */
  aspect: 3 / 4,
  widths: [480, 800],
}

export const sequences = [
  /** An illustrative bookings app, not a client's: most client work is websites. */
  { id: 'app', screen: 'bookings.html' },
]
