#!/usr/bin/env node
// Puts two robots side by side in one GLB, for the Publications station: one model to the
// scene, so the shadow, the turntable and the memory handling work unchanged. Originals stay
// intact. Its dependencies are not part of the project; run it from a throwaway folder:
//   npm i @gltf-transform/core@4 @gltf-transform/extensions@4 @gltf-transform/functions@4 meshoptimizer draco3dgltf three@0.187.0
//   node compose-glb.mjs public/3d
import { NodeIO } from '@gltf-transform/core'
import { ALL_EXTENSIONS } from '@gltf-transform/extensions'
import { mergeDocuments, meshopt, prune, unpartition } from '@gltf-transform/functions'
import { MeshoptDecoder, MeshoptEncoder } from 'meshoptimizer'
import draco3d from 'draco3dgltf'

const [dir] = process.argv.slice(2)
await Promise.all([MeshoptDecoder.ready, MeshoptEncoder.ready])
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({
  'draco3d.decoder': await draco3d.createDecoderModule(),
  'meshopt.decoder': MeshoptDecoder,
  'meshopt.encoder': MeshoptEncoder,
})

// scale and offset as in src/data/models.js; x and yaw place each robot in the pair.
const SIZE = 0.62
const ROBOTS = [
  { file: 'coco1-posed.glb', scale: 2.795, offset: [0.08, 0.66, -0.001], x: -0.55, yaw: -0.25 },
  { file: 'go2-posed.glb', scale: 2.09, offset: [0.001, 0.698, 0.036], x: 0.55, yaw: 0.75 },
]

const pair = await io.read(`${dir}/${ROBOTS[0].file}`)
const scene = pair.getRoot().getDefaultScene() ?? pair.getRoot().listScenes()[0]

// Wraps what a scene holds in a node that places it.
function place(target, children, { scale, offset, x, yaw }) {
  const inner = pair.createNode().setTranslation(offset.map((v) => v * SIZE)).setScale([scale * SIZE, scale * SIZE, scale * SIZE])
  children.forEach((child) => {
    target.removeChild(child)
    inner.addChild(child)
  })
  const outer = pair.createNode().setTranslation([x, 0, 0]).setRotation([0, Math.sin(yaw / 2), 0, Math.cos(yaw / 2)]).addChild(inner)
  target.addChild(outer)
}

place(scene, scene.listChildren(), ROBOTS[0])

const merged = await io.read(`${dir}/${ROBOTS[1].file}`)
const map = mergeDocuments(pair, merged)
const added = map.get(merged.getRoot().getDefaultScene() ?? merged.getRoot().listScenes()[0])
place(scene, added.listChildren(), ROBOTS[1])
added.dispose()
pair.getRoot().setDefaultScene(scene)

// Coco came with Draco: meshopt replaces it, so the page needs no decoder for the pair.
pair.getRoot().listExtensionsUsed().find((extension) => extension.extensionName === 'KHR_draco_mesh_compression')?.dispose()
await pair.transform(unpartition(), prune(), meshopt({ encoder: MeshoptEncoder, level: 'high' }))
await io.write(`${dir}/coco-go2.glb`, pair)
const root = pair.getRoot()
console.log(`coco-go2.glb: meshes ${root.listMeshes().length}, materials ${root.listMaterials().length}`)
