#!/usr/bin/env node
// Lighter derivative of a GLB, used for coco1-lite.glb. The original stays intact.
// Its dependencies are not part of the project; run it from a throwaway folder:
//   npm i @gltf-transform/core@4 @gltf-transform/extensions@4 @gltf-transform/functions@4 meshoptimizer draco3dgltf three@0.187.0
//   node simplify-glb.mjs public/3d/coco1.glb public/3d/coco1-lite.glb 0.35 0.001
// recomputed with a crease angle after simplifying positions only.
import { NodeIO } from '@gltf-transform/core'
import { ALL_EXTENSIONS } from '@gltf-transform/extensions'
import { weld, simplifyPrimitive, draco, prune, dedup } from '@gltf-transform/functions'
import { MeshoptSimplifier } from 'meshoptimizer'
import draco3d from 'draco3dgltf'
import * as THREE from 'three'
import { toCreasedNormals, mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

const [input, output, ratio, error, minTris = 2000, creaseDeg = 35] = process.argv.slice(2)
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({
  'draco3d.decoder': await draco3d.createDecoderModule(),
  'draco3d.encoder': await draco3d.createEncoderModule(),
})
const doc = await io.read(input)
await MeshoptSimplifier.ready
let before = 0, after = 0

// The textures are palettes: each island of a mesh has one flat colour, so every
// surviving vertex keeps a valid UV and only the normals have to be rebuilt.
for (const mesh of doc.getRoot().listMeshes()) for (const prim of mesh.listPrimitives()) {
  const count = (prim.getIndices()?.getCount() ?? prim.getAttribute('POSITION').getCount()) / 3
  before += count
  if (count < Number(minTris)) { after += count; continue }
  prim.setAttribute('NORMAL', null)
}
await doc.transform(weld())
for (const mesh of doc.getRoot().listMeshes()) for (const prim of mesh.listPrimitives()) {
  if (prim.getAttribute('NORMAL')) continue
  simplifyPrimitive(prim, { simplifier: MeshoptSimplifier, ratio: Number(ratio), error: Number(error), lockBorder: false })
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(prim.getAttribute('POSITION').getArray().slice(), 3))
  const uv = prim.getAttribute('TEXCOORD_0')
  if (uv) geometry.setAttribute('uv', new THREE.BufferAttribute(uv.getArray().slice(), 2))
  geometry.setIndex(new THREE.BufferAttribute(prim.getIndices().getArray().slice(), 1))
  const creased = mergeVertices(toCreasedNormals(geometry, THREE.MathUtils.degToRad(Number(creaseDeg))), 1e-5)
  const buffer = prim.getAttribute('POSITION').getBuffer()
  prim.setAttribute('POSITION', doc.createAccessor().setType('VEC3').setArray(new Float32Array(creased.attributes.position.array)).setBuffer(buffer))
  prim.setAttribute('NORMAL', doc.createAccessor().setType('VEC3').setArray(new Float32Array(creased.attributes.normal.array)).setBuffer(buffer))
  if (uv) prim.setAttribute('TEXCOORD_0', doc.createAccessor().setType('VEC2').setArray(new Float32Array(creased.attributes.uv.array)).setBuffer(buffer))
  prim.setIndices(doc.createAccessor().setType('SCALAR').setArray(new Uint32Array(creased.index.array)).setBuffer(buffer))
  after += creased.index.count / 3
}
await doc.transform(prune(), dedup(), draco())
await io.write(output, doc)
console.log(`${output.split('/').pop()}: ${Math.round(before / 1000)}k -> ${Math.round(after / 1000)}k triangles`)
