/**
 * Runs in headless Chrome (served by render.mjs): loads the iPhone model once, puts the site
 * capture on its screen and exposes window.renderFrame({ turn, tilt, roll, width, height }),
 * which returns one transparent WebP as base64.
 */
/* global window, document, FontFace, Image -- runs in headless Chrome */
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'

const config = window.__config

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

/* ---------- the screen: status bar over the site capture ---------- */

// The captures start at the top of the page (390 CSS px wide at 3x). The iPhone 17 Pro screen
// is 402 × 874 pt, with the status bar and Dynamic Island in the top 62 pt.
async function drawScreen() {
  const font = new FontFace('Inter Tight', 'url(/font.woff2)', { weight: '100 900' })
  document.fonts.add(await font.load())
  const capture = await new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = '/screen.png'
  })

  const pt = 3
  const canvas = document.createElement('canvas')
  canvas.width = 402 * pt
  canvas.height = 874 * pt
  const ctx = canvas.getContext('2d')
  const bar = 62 * pt

  // The bar takes the colour of the top of the site, and dark or light glyphs to suit it.
  const probe = document.createElement('canvas')
  probe.width = capture.width
  probe.height = 1
  const probeCtx = probe.getContext('2d')
  probeCtx.drawImage(capture, 0, 0, capture.width, 1, 0, 0, capture.width, 1)
  const row = probeCtx.getImageData(0, 0, capture.width, 1).data
  const sum = [0, 0, 0]
  for (let i = 0; i < row.length; i += 4) for (let c = 0; c < 3; c++) sum[c] += row[i + c]
  const [r, g, b] = sum.map((v) => Math.round(v / (row.length / 4)))
  const light = 0.2126 * r + 0.7152 * g + 0.0722 * b > 150

  ctx.fillStyle = `rgb(${r},${g},${b})`
  ctx.fillRect(0, 0, canvas.width, bar)
  ctx.drawImage(capture, 0, bar, canvas.width, capture.height * (canvas.width / capture.width))

  const ink = light ? '#000' : '#fff'
  ctx.fillStyle = ink
  ctx.strokeStyle = ink
  ctx.font = `600 ${17 * pt}px "Inter Tight"`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('9:41', 72 * pt, 31 * pt)

  // Signal, Wi-Fi and battery, at the right of the island (drawn in pt).
  ctx.save()
  ctx.translate(290 * pt, 25 * pt)
  ctx.scale(pt, pt)
  for (let i = 0; i < 4; i++) {
    const h = 4 + i * 2.6
    ctx.beginPath()
    ctx.roundRect(i * 5, 12 - h, 3.2, h, 1)
    ctx.fill()
  }
  ctx.translate(25, 0)
  ctx.lineWidth = 2.2
  ctx.lineCap = 'round'
  for (const radius of [10, 6.6]) {
    ctx.beginPath()
    ctx.arc(8, 12.5, radius, Math.PI * 1.25, Math.PI * 1.75)
    ctx.stroke()
  }
  ctx.beginPath()
  ctx.arc(8, 11.2, 1.8, 0, Math.PI * 2)
  ctx.fill()
  ctx.translate(24, 0)
  ctx.globalAlpha = 0.4
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.roundRect(0.5, 0.5, 24, 12, 3.8)
  ctx.stroke()
  ctx.beginPath()
  ctx.roundRect(25.6, 4.2, 1.6, 4.6, 0.8)
  ctx.fill()
  ctx.globalAlpha = 1
  ctx.beginPath()
  ctx.roundRect(2.2, 2.2, 20.6, 8.6, 2.4)
  ctx.fill()
  ctx.restore()

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.flipY = false
  texture.anisotropy = renderer.capabilities.getMaxAnisotropy()
  return texture
}

/* ---------- the phone ---------- */

const [gltf, screen] = await Promise.all([new GLTFLoader().loadAsync('/model.glb'), drawScreen()])
const phone = gltf.scene
const finish = new THREE.Color(config.finish)

phone.traverse((object) => {
  if (!object.isMesh) return
  const material = object.material
  switch (material.name) {
    case 'OLED': {
      // The model's screen UVs run right to left: mirror the site back around the centre.
      screen.center.set(0.5, 0.5)
      screen.repeat.set(-1, 1)
      object.material = new THREE.MeshBasicMaterial({
        map: screen,
        toneMapped: false,
        side: THREE.DoubleSide,
        // The screen shares its plane with the black display frame: pull it forward in depth
        // so it always wins instead of z-fighting.
        polygonOffset: true,
        polygonOffsetFactor: -2,
        polygonOffsetUnits: -8,
      })
      break
    }
    case 'Glass':
      // Modelled as a dark tint over a very bright screen; over an unlit screen it only needs
      // to add reflections.
      material.opacity = config.glass
      break
    case 'Anodized aluminum':
      // The body and camera plateau in the chosen finish, keeping the model's brushed normals.
      material.color.copy(finish)
      material.metalness = Math.max(material.metalness, 0.6)
      break
    case 'Glass tint':
      // Accents on the back (the logo): the same finish, a touch deeper.
      material.color.copy(finish).multiplyScalar(0.82)
      break
    case 'Frosted glass':
      // The back glass panel: a paler, frosted take on the finish, like the real phone.
      // (Its roughness lightens it a lot, so the colour stays close to the body's.)
      material.color.copy(finish).multiplyScalar(0.72)
      break
  }
})

// Centre the phone on the pivot so turning it never moves or resizes it in the frame. The
// model's nodes stand it upright with the screen facing -z: face it to the camera.
phone.rotation.y = Math.PI
phone.updateMatrixWorld(true)
const centre = new THREE.Box3().setFromObject(phone).getCenter(new THREE.Vector3())
phone.position.sub(centre)
const pivot = new THREE.Group()
pivot.add(phone)
scene.add(pivot)

const camera = new THREE.PerspectiveCamera(config.fov, 1, 0.001, 10)
const halfHeight = 0.075 * config.margin
camera.position.set(0, 0, halfHeight / Math.tan(THREE.MathUtils.degToRad(config.fov / 2)))
camera.lookAt(0, 0, 0)

const rad = THREE.MathUtils.degToRad

window.renderFrame = async ({ turn, tilt, roll, width, height }) => {
  renderer.setSize(width, height)
  camera.aspect = width / height
  camera.updateProjectionMatrix()
  pivot.rotation.set(rad(tilt), rad(turn), rad(roll), 'YXZ')
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
