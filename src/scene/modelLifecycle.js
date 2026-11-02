// Removes export helpers from a loaded glTF once per load: instanced marker
// cubes and duplicated *_collision meshes. Hidden objects would still count in
// Box3 and in the draw calls, so they are removed rather than hidden.
const sanitized = new WeakSet()

export function sanitize(gltf) {
  if (sanitized.has(gltf)) return gltf
  sanitized.add(gltf)

  const helpers = []
  gltf.scene.traverse((node) => {
    if (node.isInstancedMesh || /_collision$/.test(node.name)) helpers.push(node)
  })
  helpers.forEach((node) => node.removeFromParent())
  return gltf
}
