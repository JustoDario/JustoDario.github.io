#!/usr/bin/env node
// Lighter derivatives for slow connections and phones: same shapes and materials.
// Originals stay intact. Its dependencies are not part of the project; run it from a
// throwaway folder:
//   npm i @gltf-transform/core@4 @gltf-transform/extensions@4 @gltf-transform/functions@4 meshoptimizer draco3dgltf three@0.187.0
//   node compress-glb.mjs public/3d/so101.glb public/3d/so101-lite.glb [join]
// `join` also merges meshes by material, which removes most of the draw calls.
import { NodeIO } from '@gltf-transform/core'
import { ALL_EXTENSIONS } from '@gltf-transform/extensions'
import { dedup, flatten, join, meshopt, prune, weld } from '@gltf-transform/functions'
import { MeshoptDecoder, MeshoptEncoder } from 'meshoptimizer'
import draco3d from 'draco3dgltf'

const [input, output, mode] = process.argv.slice(2)
await Promise.all([MeshoptDecoder.ready, MeshoptEncoder.ready])
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({
  'draco3d.decoder': await draco3d.createDecoderModule(),
  'meshopt.decoder': MeshoptDecoder,
  'meshopt.encoder': MeshoptEncoder,
})
const doc = await io.read(input)
const steps = [dedup(), weld()]
if (mode === 'join') steps.push(flatten(), join({ keepNamed: false }))
steps.push(prune(), meshopt({ encoder: MeshoptEncoder, level: 'high' }))
await doc.transform(...steps)
await io.write(output, doc)
const root = doc.getRoot()
console.log(`${output.split('/').pop()}: meshes ${root.listMeshes().length}, materials ${root.listMaterials().length}, textures ${root.listTextures().length}`)
