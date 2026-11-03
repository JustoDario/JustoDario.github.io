// One entry per robot on show. Plain data: this also runs in Node through
// scripts/check-content.mjs. To add a robot: put its GLB in public/3d/, add an
// entry here and set `model: 'id'` in the content. The numbers come from
// window.__modelBounds in ?debug, once per file.
//
// scale, offset: the model stands on y = 0, centred on its station.
// rotationY: the angle it is shown at. draco: needs the decoder to load.
// legged: touches the floor at small points, so it gets a contact shadow.
export const MODELS = {
  coco1: { file: 'coco1-lite.glb', scale: 2.31, offset: [0.066, 0.596, -0.001], rotationY: -0.5, draco: true, legged: true },
  scara: { file: 'scara.glb', scale: 2.112, offset: [0.232, 0.074, -0.054], rotationY: -0.3 },
  sp01: { file: 'sp01.glb', scale: 1.43, offset: [0.004, 0.0, 0.001], rotationY: -0.5 },
  humblebeev2: { file: 'humblebeev2.glb', scale: 1.155, offset: [-0.001, 0.0, 0.0], rotationY: 0.9 },
  so101: { file: 'so101.glb', scale: 4.4, offset: [-0.048, -0.009, -0.068], rotationY: 0.9 },
  go2: { file: 'go2.glb', scale: 2.09, offset: [0.001, 0.938, -0.094], rotationY: 1.05, legged: true },
}
