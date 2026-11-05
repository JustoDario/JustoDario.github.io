#!/usr/bin/env node
// The G1 file is saved on a frame of its dance animation, leaning backwards, and its bind
// pose does not hold together. This keeps a frame of the animation where it stands, feet
// flat, chosen by eye, and drops the animation. The original stays intact. Its dependencies are not part of the project; run it from a throwaway folder:
//   npm i @gltf-transform/core@4 @gltf-transform/extensions@4 @gltf-transform/functions@4 meshoptimizer draco3dgltf three@0.187.0
//   node stand-g1.mjs 3d/unitreeg1.glb public/3d/unitreeg1-standing.glb [time]
import { readFileSync } from 'node:fs'
import { NodeIO } from '@gltf-transform/core'
import { ALL_EXTENSIONS } from '@gltf-transform/extensions'
import { meshopt, prune } from '@gltf-transform/functions'
import { MeshoptDecoder, MeshoptEncoder } from 'meshoptimizer'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

const [input, output, time = '3.43'] = process.argv.slice(2)
await Promise.all([MeshoptDecoder.ready, MeshoptEncoder.ready])

const file = readFileSync(input)
const gltf = await new Promise((resolve, reject) => {
  new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).parse(file.buffer.slice(file.byteOffset, file.byteOffset + file.length), '', resolve, reject)
})
const clip = gltf.animations[0]
const mixer = new THREE.AnimationMixer(gltf.scene)
mixer.clipAction(clip).play()

mixer.setTime(Number(time))
gltf.scene.updateMatrixWorld(true)

const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({
  'meshopt.decoder': MeshoptDecoder,
  'meshopt.encoder': MeshoptEncoder,
})
const doc = await io.read(input)
const nodes = doc.getRoot().listNodes()
gltf.scene.traverse((object) => {
  const index = gltf.parser.associations.get(object)?.nodes
  if (index === undefined) return
  nodes[index].setTranslation(object.position.toArray()).setRotation(object.quaternion.toArray()).setScale(object.scale.toArray())
})
doc.getRoot().listAnimations().forEach((animation) => animation.dispose())
await doc.transform(prune(), meshopt({ encoder: MeshoptEncoder, level: 'high' }))
await io.write(output, doc)

const box = new THREE.Box3().setFromObject(gltf.scene, true)
console.log(`kept t=${time}, from`, box.min.toArray().map((v) => +v.toFixed(3)), 'to', box.max.toArray().map((v) => +v.toFixed(3)))
