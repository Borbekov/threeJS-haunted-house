import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

// DOOR
const doorColorTexture = textureLoader.load('/textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load(
    '/textures/door/ambientOcclusion.jpg'
)
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg')
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg')
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg')

// WALLS
const bricksColorTexture = textureLoader.load('/textures/bricks/color.jpg')
const bricksAmbientOcclusionTexture = textureLoader.load(
    '/textures/bricks/ambientOcclusion.jpg'
)
const bricksNormalTexture = textureLoader.load('/textures/bricks/normal.jpg')
const bricksRoughnessTexture = textureLoader.load(
    '/textures/bricks/roughness.jpg'
)

// FLOOR
const grassColorTexture = textureLoader.load('/textures/grass/color.jpg')
const grassAmbientOcclusionTexture = textureLoader.load(
    '/textures/grass/ambientOcclusion.jpg'
)
const grassNormalTexture = textureLoader.load('/textures/grass/normal.jpg')
const grassRoughnessTexture = textureLoader.load(
    '/textures/grass/roughness.jpg'
)

grassColorTexture.repeat.set(10, 10)
grassAmbientOcclusionTexture.repeat.set(10, 10)
grassNormalTexture.repeat.set(10, 10)
grassRoughnessTexture.repeat.set(10, 10)

grassColorTexture.wrapS = THREE.RepeatWrapping
grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping
grassNormalTexture.wrapS = THREE.RepeatWrapping
grassRoughnessTexture.wrapS = THREE.RepeatWrapping

grassColorTexture.wrapT = THREE.RepeatWrapping
grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping
grassNormalTexture.wrapT = THREE.RepeatWrapping
grassRoughnessTexture.wrapT = THREE.RepeatWrapping

/**
 * House
 */
// House Container
const house = new THREE.Group()
house.position.y = 0.01
scene.add(house)

// Walls
const wallsGeometry = new THREE.BoxGeometry(4, 2.5, 4)
const wallsMaterial = new THREE.MeshStandardMaterial({
    side: THREE.DoubleSide,
    map: bricksColorTexture,
    aoMap: bricksAmbientOcclusionTexture,
    normalMap: bricksNormalTexture,
    roughnessMap: bricksRoughnessTexture,
})
const walls = new THREE.Mesh(wallsGeometry, wallsMaterial)
walls.position.y = 1.25
walls.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2)
)
house.add(walls)

// Roof
const roofGeometry = new THREE.ConeGeometry(3.5, 1.5, 4)
const roofMaterial = new THREE.MeshStandardMaterial({ color: '#b35f45' })
const roof = new THREE.Mesh(roofGeometry, roofMaterial)
roof.position.y = 3
roof.rotation.y = Math.PI * 0.25
house.add(roof)

// Door
const doorGeometry = new THREE.PlaneGeometry(2.2, 2.2, 100, 100)
const doorMaterial = new THREE.MeshStandardMaterial({
    map: doorColorTexture,
    transparent: true,
    alphaMap: doorAlphaTexture,
    aoMap: doorAmbientOcclusionTexture,
    displacementMap: doorHeightTexture,
    displacementScale: 0.1,
    normalMap: doorNormalTexture,
    // metalnessMap: doorMetalnessTexture,
    roughnessMap: doorRoughnessTexture,
})
const door = new THREE.Mesh(doorGeometry, doorMaterial)
door.position.y = 1
door.position.z = 2 + 0.01
door.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
)
house.add(door)

// Bushes
const bushes = new THREE.Group()
const bushGeometry = new THREE.SphereGeometry(1, 16, 16)
const bushMaterial = new THREE.MeshStandardMaterial({ color: 'green' })

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial)
const bush2 = new THREE.Mesh(bushGeometry, bushMaterial)
const bush3 = new THREE.Mesh(bushGeometry, bushMaterial)
const bush4 = new THREE.Mesh(bushGeometry, bushMaterial)

bush1.scale.set(0.5, 0.5, 0.5)
bush1.position.set(1, -1, 0)

bush2.scale.set(0.25, 0.25, 0.25)
bush2.position.set(1.5, -1, 0.25)

bush3.scale.set(0.5, 0.5, 0.5)
bush3.position.set(-1, -1, 0.25)

bush4.scale.set(0.25, 0.25, 0.25)
bush4.position.set(-1.5, -1, 0)

bushes.position.y = 1
bushes.position.z = 2
bushes.add(bush1, bush2, bush3, bush4)
house.add(bushes)

// Graves
const graves = new THREE.Group()
const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2)
const graveMaterial = new THREE.MeshStandardMaterial({ color: 'grey' })

for (let i = 0; i < 50; i++) {
    const angle = Math.random() * Math.PI * 2
    const radius = Math.random() * 6 + 3
    const x = Math.sin(angle) * radius
    const z = Math.cos(angle) * radius
    const grave = new THREE.Mesh(graveGeometry, graveMaterial)
    grave.position.set(x, 0.3, z)
    grave.rotation.y = (Math.random() - 0.5) * 0.4
    grave.rotation.z = (Math.random() - 0.5) * 0.4
    // shadow
    grave.castShadow = true
    graves.add(grave)
}

scene.add(graves)

// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({
        map: grassColorTexture,
        aoMap: grassAmbientOcclusionTexture,
        normalMap: grassNormalTexture,
        roughnessMap: grassRoughnessTexture,
    })
)
floor.rotation.x = -Math.PI * 0.5
floor.position.y = 0
floor.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2)
)
scene.add(floor)

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#ffffff', 0.1)
gui.add(ambientLight, 'intensity')
    .min(0)
    .max(1)
    .step(0.001)
    .name('ambientLight intensity')
scene.add(ambientLight)

// Directional light
const moonLight = new THREE.DirectionalLight('#ffffff', 0.1)
moonLight.position.set(4, 5, -2)
gui.add(moonLight, 'intensity')
    .min(0)
    .max(1)
    .step(0.001)
    .name('moonLight intencity')
gui.add(moonLight.position, 'x').min(-5).max(5).step(0.001).name('moonLight X')
gui.add(moonLight.position, 'y').min(-5).max(5).step(0.001).name('moonLight Y')
gui.add(moonLight.position, 'z').min(-5).max(5).step(0.001).name('moonLight Z')
scene.add(moonLight)

// Point light
const doorLight = new THREE.PointLight('#ff7d46', 1, 7)
doorLight.position.set(0, 2.2, 2.7)
scene.add(doorLight)

/* Fog */
const fog = new THREE.Fog('grey', 0.5, 15)
// scene.fog = fog

/* Shadows */
moonLight.castShadow = true
doorLight.castShadow = true
walls.castShadow = true
roof.castShadow = true
bush1.castShadow = true
bush2.castShadow = true
bush3.castShadow = true
bush4.castShadow = true

floor.receiveShadow = true

// Shadow
moonLight.shadow.mapSize.width = 256
moonLight.shadow.mapSize.height = 256
moonLight.shadow.camera.far = 15

doorLight.shadow.mapSize.width = 256
doorLight.shadow.mapSize.height = 256
doorLight.shadow.camera.far = 3

const moonLightCameraHelper = new THREE.CameraHelper(moonLight.shadow.camera)
scene.add(moonLightCameraHelper)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    100
)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.maxPolarAngle = 1.5

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor('grey')
renderer.shadowMap.enabled = true

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
