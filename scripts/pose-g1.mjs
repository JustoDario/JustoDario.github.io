#!/usr/bin/env node
// The G1 for the site: keeps its dance animation, which the wide layout plays, and rests in a
// pose sitting on the floor, which the upright layout shows because it takes little height.
// The pose is built from directions in the world, not joint angles: the file's bind pose does
// not hold together, so each limb is turned from a frame of the animation where it stands. The
// original stays intact. Its dependencies are not part of the project; run it from a throwaway folder:
//   npm i @gltf-transform/core@4 @gltf-transform/extensions@4 @gltf-transform/functions@4 meshoptimizer draco3dgltf three@0.187.0
//   node pose-g1.mjs 3d/unitreeg1.glb public/3d/unitreeg1-sitting.glb
import { readFileSync } from 'node:fs'
import { NodeIO } from '@gltf-transform/core'
import { ALL_EXTENSIONS } from '@gltf-transform/extensions'
import { meshopt, prune } from '@gltf-transform/functions'
import { MeshoptDecoder, MeshoptEncoder } from 'meshoptimizer'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

const STANDING_AT = 3.43 // seconds into the animation: nearly upright, feet flat

// Where each segment points once seated, with the robot facing +Z and its left on +X.
// `side` is +1 for the left limb, -1 for the right.
const THIGH = (side) => [side * 0.2, 0.42, 0.88]
const SHIN = (side) => [side * 0.04, -0.8, 0.6]
const UPPER_ARM = (side) => [side * 0.2, -0.86, 0.46]
const FOREARM = (side) => [side * -0.06, -0.32, 0.95]

const [input, output] = process.argv.slice(2)
await Promise.all([MeshoptDecoder.ready, MeshoptEncoder.ready])

const file = readFileSync(input)
const gltf = await new Promise((resolve, reject) => {
  new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).parse(file.buffer.slice(file.byteOffset, file.byteOffset + file.length), '', resolve, reject)
})
const mixer = new THREE.AnimationMixer(gltf.scene)
mixer.clipAction(gltf.animations[0]).play()
mixer.setTime(STANDING_AT)
gltf.scene.updateMatrixWorld(true)

const bone = (prefix) => {
  let found
  gltf.scene.traverse((node) => {
    if (!found && node.name.startsWith(prefix)) found = node
  })
  if (!found) throw new Error(`no bone ${prefix}`)
  return found
}
const at = (node) => node.getWorldPosition(new THREE.Vector3())
const rotationOf = (node) => node.getWorldQuaternion(new THREE.Quaternion())

// Turns a bone in world space, whatever its parents are doing.
function turn(node, worldTurn) {
  const parent = rotationOf(node.parent)
  node.quaternion.copy(parent.clone().invert().multiply(worldTurn).multiply(parent).multiply(node.quaternion))
  gltf.scene.updateMatrixWorld(true)
}

// Points the segment from `node` to `end` along `direction`.
function aim(node, end, direction) {
  const from = at(end()).sub(at(node)).normalize()
  turn(node, new THREE.Quaternion().setFromUnitVectors(from, new THREE.Vector3(...direction).normalize()))
}

// Gives a bone a rotation in world space.
const setRotation = (node, target) => turn(node, target.clone().multiply(rotationOf(node).invert()))

const pelvis = bone('pelvis_52')
const hips = { left: bone('left_hip_pitch_link'), right: bone('right_hip_pitch_link') }
const shoulders = { left: bone('left_shoulder_pitch_link'), right: bone('right_shoulder_pitch_link') }
const mid = (a, b) => ({ getWorldPosition: (v) => v.copy(at(a)).add(at(b)).multiplyScalar(0.5) })

// Square the pelvis with the world: facing +Z, left on +X, upright.
const left = at(hips.left).sub(at(hips.right)).normalize()
const up = at(mid(shoulders.left, shoulders.right)).sub(at(pelvis)).normalize()
const forward = new THREE.Vector3().crossVectors(left, up).normalize()
const trueUp = new THREE.Vector3().crossVectors(forward, left)
const current = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(left, trueUp, forward))
turn(pelvis, current.clone().invert())

// The feet keep the way they sat on the floor, turned with the pelvis.
const feet = { left: bone('left_ankle_roll_link'), right: bone('right_ankle_roll_link') }
const flat = { left: rotationOf(feet.left), right: rotationOf(feet.right) }

aim(bone('waist_yaw_link'), () => mid(shoulders.left, shoulders.right), [0, 1, 0.05])

for (const [name, side] of [['left', 1], ['right', -1]]) {
  aim(hips[name], () => bone(`${name}_knee_link`), THIGH(side))
  aim(bone(`${name}_knee_link`), () => bone(`${name}_ankle_pitch_link`), SHIN(side))
  setRotation(bone(`${name}_ankle_pitch_link`), flat[name])

  aim(shoulders[name], () => bone(`${name}_elbow_link`), UPPER_ARM(side))
  aim(bone(`${name}_elbow_link`), () => bone(`${name}_wrist_roll_link`), FOREARM(side))
}

// Copy the pose to the file, as the rest pose of every joint. The animation stays.
const pose = new Map()
gltf.scene.traverse((object) => {
  const index = gltf.parser.associations.get(object)?.nodes
  if (index !== undefined) pose.set(index, object)
})
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({
  'meshopt.decoder': MeshoptDecoder,
  'meshopt.encoder': MeshoptEncoder,
})
const doc = await io.read(input)
doc.getRoot().listNodes().forEach((node, index) => {
  const object = pose.get(index)
  if (object) node.setTranslation(object.position.toArray()).setRotation(object.quaternion.toArray()).setScale(object.scale.toArray())
})
await doc.transform(prune({ keepLeaves: true }), meshopt({ encoder: MeshoptEncoder, level: 'high' }))
await io.write(output, doc)

const box = new THREE.Box3().setFromObject(gltf.scene, true)
console.log('seated bounds', box.min.toArray().map((v) => +v.toFixed(3)), box.max.toArray().map((v) => +v.toFixed(3)))
