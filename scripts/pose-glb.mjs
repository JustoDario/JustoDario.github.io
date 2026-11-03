#!/usr/bin/env node
// Bends the legs of Coco and the Go2 into a standing pose: both models come with
// straight legs, their URDF zero pose. Originals stay intact; this writes derivatives.
// Its dependencies are not part of the project; run it from a throwaway folder:
//   npm i @gltf-transform/core@4 @gltf-transform/extensions@4 @gltf-transform/functions@4 meshoptimizer draco3dgltf three@0.187.0
//   node pose-glb.mjs public/3d
// In both robots the knees point backwards, as on the real ones.
import { NodeIO } from '@gltf-transform/core'
import { ALL_EXTENSIONS } from '@gltf-transform/extensions'
import { draco, meshopt, prune } from '@gltf-transform/functions'
import { MeshoptDecoder, MeshoptEncoder } from 'meshoptimizer'
import draco3d from 'draco3dgltf'
import * as THREE from 'three'

const [dir, cocoHip = '0.6', cocoKnee = '1.05', go2Hip = '0.8', go2Knee = '1.5'] = process.argv.slice(2)
await Promise.all([MeshoptDecoder.ready, MeshoptEncoder.ready])
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({
  'draco3d.decoder': await draco3d.createDecoderModule(),
  'draco3d.encoder': await draco3d.createEncoderModule(),
  'meshopt.decoder': MeshoptDecoder,
  'meshopt.encoder': MeshoptEncoder,
})

// Coco: every link is its own node, but the node origins are not the joints. The hip is
// on the origin of the coax link, and the knee was found by fitting circles to the round
// boss of the femur and the hub of the tibia, which agree within 1.3 mm. Forward is +x,
// the joints turn about z, and the nodes are not parented: the tibia follows by hand.
const COCO_KNEE_FROM_FEMUR = [0.0117, -0.0631]

async function poseCoco() {
  const doc = await io.read(`${dir}/coco1-lite.glb`)
  const nodes = new Map(doc.getRoot().listNodes().map((n) => [n.getName(), n]))
  const about = new THREE.Vector3(0, 0, 1)
  const hip = Number(cocoHip)
  const knee = Number(cocoKnee)
  const turnNode = (node, pivot, turn, pivotTo) => {
    const at = new THREE.Vector3().fromArray(node.getTranslation()).sub(pivot).applyQuaternion(turn).add(pivotTo)
    node.setTranslation(at.toArray())
    node.setRotation(turn.clone().multiply(new THREE.Quaternion().fromArray(node.getRotation())).toArray())
  }
  for (const side of ['left', 'right']) for (const end of ['front', 'back']) {
    const femur = nodes.get(`${side}_${end}_femur`)
    const tibia = nodes.get(`${side}_${end}_tibia`)
    const femurOrigin = femur.getTranslation()
    const coaxOrigin = nodes.get(`${side}_${end}_coax`).getTranslation()
    const hipAt = new THREE.Vector3(coaxOrigin[0], coaxOrigin[1], femurOrigin[2])
    const kneeAt = new THREE.Vector3(femurOrigin[0] + COCO_KNEE_FROM_FEMUR[0], femurOrigin[1] + COCO_KNEE_FROM_FEMUR[1], femurOrigin[2])
    const femurTurn = new THREE.Quaternion().setFromAxisAngle(about, -hip)
    const tibiaTurn = new THREE.Quaternion().setFromAxisAngle(about, knee - hip)
    const kneeNow = kneeAt.clone().sub(hipAt).applyQuaternion(femurTurn).add(hipAt)
    turnNode(femur, hipAt, femurTurn, hipAt)
    turnNode(tibia, kneeAt, tibiaTurn, kneeNow)
  }
  await doc.transform(prune(), draco())
  await io.write(`${dir}/coco1-posed.glb`, doc)
}

// Go2: four merged meshes with no joints. Each connected piece is rigid, so pieces are
// sorted by where they are. Forward is +z and the joints turn about x. Hips are on y = 0
// and knees 0.213 below (the URDF lengths: the model is at real scale, legs straight).
const KNEE_Y = -0.213
const LEG_MIN_X = 0.1
const LEG_MIN_Z = 0.1
const CALF_BELOW_Y = -0.18

async function poseGo2() {
  const doc = await io.read(`${dir}/go2.glb`)
  const hip = Number(go2Hip)
  const calfAngle = Number(go2Hip) - Number(go2Knee)
  const axis = new THREE.Vector3(1, 0, 0)
  for (const node of doc.getRoot().listNodes()) {
    const mesh = node.getMesh()
    if (!mesh) continue
    const matrix = new THREE.Matrix4().fromArray(node.getWorldMatrix())
    const rotation = new THREE.Matrix3().setFromMatrix4(matrix).multiplyScalar(1 / node.getScale()[0])
    for (const prim of mesh.listPrimitives()) {
      const position = prim.getAttribute('POSITION')
      const normal = prim.getAttribute('NORMAL')
      const index = prim.getIndices().getArray()
      const count = position.getCount()
      const world = new Float32Array(count * 3)
      const normals = new Float32Array(count * 3)
      const parent = new Int32Array(count).map((_, i) => i)
      const find = (a) => { while (parent[a] !== a) { parent[a] = parent[parent[a]]; a = parent[a] } return a }
      const seen = new Map()
      const v = new THREE.Vector3()
      for (let i = 0; i < count; i++) {
        const raw = position.getElement(i, [])
        const key = raw.map((c) => c.toFixed(5)).join()
        if (seen.has(key)) parent[find(i)] = find(seen.get(key))
        else seen.set(key, i)
        v.fromArray(raw).applyMatrix4(matrix).toArray(world, i * 3)
        v.fromArray(normal.getElement(i, [])).applyMatrix3(rotation).normalize().toArray(normals, i * 3)
      }
      for (let i = 0; i < index.length; i += 3) {
        parent[find(index[i])] = find(index[i + 1])
        parent[find(index[i])] = find(index[i + 2])
      }
      const boxes = new Map()
      for (let i = 0; i < count; i++) {
        const root = find(i)
        const box = boxes.get(root) ?? boxes.set(root, new THREE.Box3()).get(root)
        box.expandByPoint(v.fromArray(world, i * 3))
      }
      const pieces = new Map()
      const middle = new THREE.Vector3()
      for (const [root, box] of boxes) {
        box.getCenter(middle)
        if (Math.abs(middle.x) < LEG_MIN_X || Math.abs(middle.z) < LEG_MIN_Z) { pieces.set(root, null); continue }
        const hipZ = Math.sign(middle.z) * 0.1935
        pieces.set(root, { kind: middle.y < CALF_BELOW_Y ? 'calf' : 'thigh', hipZ })
      }
      const thighTurn = new THREE.Quaternion().setFromAxisAngle(axis, hip)
      const calfTurn = new THREE.Quaternion().setFromAxisAngle(axis, calfAngle)
      const n = new THREE.Vector3()
      for (let i = 0; i < count; i++) {
        const piece = pieces.get(find(i))
        if (!piece) continue
        const hipAt = new THREE.Vector3(0, 0, piece.hipZ)
        const kneeAt = new THREE.Vector3(0, KNEE_Y, piece.hipZ)
        v.fromArray(world, i * 3)
        n.fromArray(normals, i * 3)
        if (piece.kind === 'thigh') {
          v.sub(hipAt).applyQuaternion(thighTurn).add(hipAt)
          n.applyQuaternion(thighTurn)
        } else {
          const kneeNow = kneeAt.clone().sub(hipAt).applyQuaternion(thighTurn).add(hipAt)
          v.sub(kneeAt).applyQuaternion(calfTurn).add(kneeNow)
          n.applyQuaternion(calfTurn)
        }
        v.toArray(world, i * 3)
        n.toArray(normals, i * 3)
      }
      const buffer = position.getBuffer()
      prim.setAttribute('POSITION', doc.createAccessor().setType('VEC3').setArray(world).setBuffer(buffer))
      prim.setAttribute('NORMAL', doc.createAccessor().setType('VEC3').setArray(normals).setBuffer(buffer))
    }
    node.setTranslation([0, 0, 0]).setRotation([0, 0, 0, 1]).setScale([1, 1, 1])
  }
  await doc.transform(prune(), meshopt({ encoder: MeshoptEncoder, level: 'medium' }))
  await io.write(`${dir}/go2-posed.glb`, doc)
}

await poseCoco()
await poseGo2()
