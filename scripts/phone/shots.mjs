/**
 * The case study phone turn: one sequence per project, the same motion for each. The phone
 * starts from behind (camera plateau), turns through its side and settles facing the viewer
 * at a slight angle with the project's mobile site on screen.
 *
 * `screen` is a mobile capture in .mockups/raw (without .png). Angles are in degrees: `turn`
 * spins it around its upright axis (0 = facing the viewer, ±180 = its back), `tilt` leans the
 * top away, `roll` rotates it in the picture plane.
 */
export const look = {
  /** Cosmic Orange, the iPhone 17 Pro finish closest to the brand orange. */
  finish: '#e8692a',
  exposure: 1,
  glass: 0.05,
  fov: 22,
  /** Space around the phone's height in the frame. */
  margin: 1.12,
  quality: 0.82,
}

export const turn = {
  frames: 36,
  from: { turn: -158, tilt: 14, roll: -9 },
  to: { turn: -16, tilt: 5, roll: 3 },
  /** Output is width ÷ height; rendered afresh at each width. */
  aspect: 3 / 4,
  widths: [480, 800],
}

export const sequences = [
  { id: 'gc-solar', screen: 'gc-solar-home-mobile' },
  { id: 'mpg-foundation', screen: 'mpg-foundation-home-mobile' },
  { id: 'salon-friend', screen: 'salon-friend-home-mobile' },
]
