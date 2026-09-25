/**
 * The ONLY place GSAP plugins are imported and registered. Import from here everywhere else:
 *   import { gsap, ScrollTrigger, SplitText, useGSAP } from '@/lib/gsap'
 */
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { Flip } from 'gsap/Flip'
import { duration, ease } from './motion-tokens'

gsap.registerPlugin(ScrollTrigger, SplitText, Flip, useGSAP)

gsap.defaults({ duration: duration.base, ease: ease.out })

// Don't recalculate on mobile address-bar show/hide; it causes jumpy pins.
ScrollTrigger.config({ ignoreMobileResize: true })

export { gsap, ScrollTrigger, SplitText, Flip, useGSAP }
