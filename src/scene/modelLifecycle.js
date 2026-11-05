import { useGLTF } from '@react-three/drei'
import { assetUrl } from '../lib/assetUrl.js'
import { getModelStatus, reportModelReleased, retryModel } from '../state/modelStatus.js'

export const modelUrl = (file) => assetUrl(`3d/${file}`)

// Removes export helpers from a loaded glTF once per load: instanced marker
// cubes and duplicated *_collision meshes. Hidden objects would still count in
// Box3 and in the draw calls, so they are removed rather than hidden. Only cubes:
// instancing also holds real parts, like the wheels of the rover.
const MARKER_VERTICES = 24
const sanitized = new WeakSet()

export function sanitize(gltf) {
  if (sanitized.has(gltf)) return gltf
  sanitized.add(gltf)

  const helpers = []
  gltf.scene.traverse((node) => {
    const marker = node.isInstancedMesh && node.geometry.attributes.position.count <= MARKER_VERTICES
    if (marker || /_collision$/.test(node.name)) helpers.push(node)
  })
  helpers.forEach((node) => node.removeFromParent())
  return gltf
}

// What is on the GPU or on its way. There is no reference count: the window is the
// only source of truth, so Coco on two stations and StrictMode need no special care.
const requested = new Set()
const loaded = new Map()

export const noteModelRequested = (file) => requested.add(file)
export const noteModelLoaded = (file, gltf) => loaded.set(file, gltf)

function disposeModel({ scene }) {
  scene.traverse(({ geometry, material }) => {
    geometry?.dispose()
    for (const item of [material].flat()) {
      if (!item) continue
      for (const value of Object.values(item)) {
        if (value?.isTexture) {
          value.dispose()
          value.source?.data?.close?.() // decoded image kept outside the GPU
        }
      }
      item.dispose()
    }
  })
}

// Frees everything outside `wanted`. A download in flight cannot be cancelled, but
// leaving the cache means its result is never kept or uploaded.
export function releaseModels(wanted) {
  const { errors } = getModelStatus()
  for (const file of [...requested]) {
    if (wanted.has(file)) continue
    requested.delete(file)
    reportModelReleased(file)
    const gltf = loaded.get(file)
    if (gltf) disposeModel(gltf)
    loaded.delete(file)
    if (errors[file]) retryModel(file) // a failed model gets a new try when it returns
    else useGLTF.clear(modelUrl(file))
  }
}
