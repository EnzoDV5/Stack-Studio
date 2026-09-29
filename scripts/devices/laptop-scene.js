/**
 * Runs in headless Chrome (served by render.mjs): loads the MacBook Pro model once, puts the
 * screen on its display and exposes window.renderFrame({ turn, tilt, lid, width, height }),
 * which returns one transparent WebP as base64. The lid swings on a hinge, and the display
 * wakes as the lid rises.
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
  if (object.isMesh && object.material.name === parts.screenMaterial) object.material = display
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

// Frame the open laptop: its bounding sphere (the same at every pose), with a margin, fits the
// frame, so it never changes size as it turns and opens.
const sphere = new THREE.Box3().setFromObject(pivot).getBoundingSphere(new THREE.Sphere())
const camera = new THREE.PerspectiveCamera(config.fov, 1, 0.001, 20)
const rad = THREE.MathUtils.degToRad

/** 0 below `from`, 1 above `to`, smooth between. */
const smooth = (from, to, value) => {
  const t = Math.min(Math.max((value - from) / (to - from), 0), 1)
  return t * t * (3 - 2 * t)
}

window.renderFrame = async ({ turn = 0, tilt = 0, lid: open = MODEL_LID, width, height }) => {
  renderer.setSize(width, height)
  camera.aspect = width / height
  // Fit the sphere to whichever of the frame's height or width is tighter.
  const halfV = rad(config.fov / 2)
  const halfH = Math.atan(Math.tan(halfV) * camera.aspect)
  const radius = sphere.radius * config.margin
  // Aimed a little above the base: the shut laptop sits low in the frame, the open one fills it.
  camera.position.set(0, config.aim, radius / Math.sin(Math.min(halfV, halfH)))
  camera.lookAt(0, config.aim, 0)
  camera.updateProjectionMatrix()
  pivot.rotation.set(rad(tilt), rad(turn), 0, 'YXZ')
  // Positive rotation swings the lid forward, shut onto the keyboard.
  hinge.rotation.x = rad(MODEL_LID - open)
  // The display wakes as the lid comes up.
  display.color.setScalar(smooth(35, 95, open))
  renderer.render(scene, camera)
  const blob = await new Promise((resolve) =>
    renderer.domElement.toBlob(resolve, 'image/webp', config.quality),
  )
  const bytes = new Uint8Array(await blob.arrayBuffer())
  let binary = ''
  for (let i = 0; i < bytes.length; i += 0x8000)
    binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000))
  return { type: blob.type, base64: btoa(binary) }
}
window.__ready = true
