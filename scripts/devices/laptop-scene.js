/**
 * Runs in headless Chrome (served by render.mjs): loads the MacBook Pro model once, puts the
 * screen on its display and exposes:
 * - window.fit(poses, aspect): frames the camera tightly around the laptop across every pose
 *   of the motion, once, so it fills the frame without ever being cropped or changing size.
 * - window.renderFrame({ turn, tilt, lid, width, height }): one transparent WebP as base64,
 *   supersampled (rendered larger, then scaled down) for clean edges and a sharp screen.
 * The lid swings on a hinge, and the display wakes as the lid rises.
 */
/* global window, document -- runs in headless Chrome */
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'

const config = window.__config

/** The model's parts (its names are scrambled by the export). */
const parts = {
  /** The display surface (it showed the wallpaper). */
  screenMaterial: 'HlQwFCAPWzetDQy',
  /** Everything in the lid: display, bezel, camera, outer shell. */
  lid: 'RcexTyyhpuJYATQ',
  /** The base: keyboard deck and bottom case. */
  base: 'EhCmdLAMoLoXcIA',
}
/** How far the lid is open in the model as it comes, in degrees from shut. */
const MODEL_LID = 112

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,
  preserveDrawingBuffer: true,
})
renderer.setPixelRatio(1)
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = config.exposure
renderer.setClearColor(0x000000, 0)
document.body.appendChild(renderer.domElement)

const scene = new THREE.Scene()
const pmrem = new THREE.PMREMGenerator(renderer)
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
scene.environmentIntensity = config.environment
// A soft key light from the upper left and a rim from behind, so the edges and the lid catch
// the light instead of reading as flat grey.
const key = new THREE.DirectionalLight(0xffffff, config.key)
key.position.set(-0.6, 1, 0.9)
const rim = new THREE.DirectionalLight(0xffffff, config.rim)
rim.position.set(0.8, 0.5, -1)
scene.add(key, rim)

const [gltf, screen] = await Promise.all([
  new GLTFLoader().loadAsync('/model.glb'),
  new THREE.TextureLoader().loadAsync('/screen.png'),
])
screen.colorSpace = THREE.SRGBColorSpace
screen.flipY = false
screen.anisotropy = renderer.capabilities.getMaxAnisotropy()

const laptop = gltf.scene
const display = new THREE.MeshBasicMaterial({
  map: screen,
  toneMapped: false,
  side: THREE.DoubleSide,
  polygonOffset: true,
  polygonOffsetFactor: -2,
  polygonOffsetUnits: -8,
})
laptop.traverse((object) => {
  if (!object.isMesh) return
  const material = object.material
  if (material.name === parts.screenMaterial) {
    object.material = display
    return
  }
  // The anodised aluminium comes fully rough (flat, chalky): give it a satin sheen.
  if (material.metalness > 0.9 && material.roughness > 0.9) material.roughness = config.satin
})

// Pivot on the middle of the base, so it turns and tilts where it sits (the lid rises above).
const pivot = new THREE.Group()
scene.add(pivot)
pivot.add(laptop)
laptop.updateMatrixWorld(true)
const centre = new THREE.Box3()
  .setFromObject(laptop.getObjectByName(parts.base))
  .getCenter(new THREE.Vector3())
laptop.position.sub(centre)
laptop.updateMatrixWorld(true)

// A hinge along the back edge of the base, at the bottom of the lid. The lid is re-parented
// onto it without moving (attach keeps its world transform).
const lid = laptop.getObjectByName(parts.lid)
const lidBox = new THREE.Box3().setFromObject(lid)
const hinge = new THREE.Group()
// On the top of the base, so the shut lid rests on it rather than sinking into it.
const baseTop = new THREE.Box3().setFromObject(laptop.getObjectByName(parts.base)).max.y
hinge.position.set(0, baseTop + 0.003, lidBox.max.z - 0.002)
laptop.parent.add(hinge)
hinge.attach(lid)

const camera = new THREE.PerspectiveCamera(config.fov, 1, 0.001, 20)
const rad = THREE.MathUtils.degToRad

/** 0 below `from`, 1 above `to`, smooth between. */
const smooth = (from, to, value) => {
  const t = Math.min(Math.max((value - from) / (to - from), 0), 1)
  return t * t * (3 - 2 * t)
}

function pose({ turn = 0, tilt = 0, lid: open = MODEL_LID }) {
  pivot.rotation.set(rad(tilt), rad(turn), 0, 'YXZ')
  // Positive rotation swings the lid forward, shut onto the keyboard.
  hinge.rotation.x = rad(MODEL_LID - open)
  // The display wakes as the lid comes up.
  display.color.setScalar(smooth(35, 95, open))
  pivot.updateMatrixWorld(true)
}

/**
 * Points the camera (looking straight down -z) at the middle of everything the laptop covers
 * across the poses, and backs it off just far enough for all of it to fit `config.fill` of the
 * frame. Exact (every vertex), so the laptop fills the frame as much as it can.
 */
window.fit = (poses, aspect) => {
  camera.aspect = aspect
  const tanV = Math.tan(rad(config.fov / 2))
  const tanH = tanV * aspect
  const points = []
  const v = new THREE.Vector3()
  for (const p of poses) {
    pose(p)
    pivot.traverse((object) => {
      if (!object.isMesh) return
      const position = object.geometry.attributes.position
      // Every 3rd vertex is plenty for bounds and keeps this quick.
      for (let i = 0; i < position.count; i += 3) {
        points.push(v.fromBufferAttribute(position, i).applyMatrix4(object.matrixWorld).clone())
      }
    })
  }
  const box = new THREE.Box3().setFromPoints(points)
  const target = box.getCenter(new THREE.Vector3())
  let distance = 0
  for (const p of points) {
    const dx = Math.abs(p.x - target.x) / (tanH * config.fill)
    const dy = Math.abs(p.y - target.y) / (tanV * config.fill)
    distance = Math.max(distance, p.z - target.z + Math.max(dx, dy))
  }
  camera.position.set(target.x, target.y, target.z + distance)
  camera.lookAt(target)
  camera.updateProjectionMatrix()
}

// Scales the supersampled render down to the frame's size (drawImage averages the pixels).
const output = document.createElement('canvas')
const outputContext = output.getContext('2d')

window.renderFrame = async ({ width, height, ...angles }) => {
  const scale = config.supersample
  renderer.setSize(width * scale, height * scale)
  pose(angles)
  renderer.render(scene, camera)
  output.width = width
  output.height = height
  outputContext.imageSmoothingEnabled = true
  outputContext.imageSmoothingQuality = 'high'
  outputContext.clearRect(0, 0, width, height)
  outputContext.drawImage(renderer.domElement, 0, 0, width, height)
  const blob = await new Promise((resolve) => output.toBlob(resolve, 'image/webp', config.quality))
  const bytes = new Uint8Array(await blob.arrayBuffer())
  let binary = ''
  for (let i = 0; i < bytes.length; i += 0x8000)
    binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000))
  return { type: blob.type, base64: btoa(binary) }
}
window.__ready = true
