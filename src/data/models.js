// One entry per robot on show. Plain data: this also runs in Node through
// scripts/check-content.mjs. To add a robot: put its GLB in public/3d/, add an
// entry here and set `model: 'id'` in the content. The numbers come from
// window.__modelBounds in ?debug, once per file.
//
// scale, offset: the model stands on y = 0, centred on its station.
// rotationY: the angle it is shown at. draco: needs the decoder to load.
export const MODELS = {
  coco1: { file: 'coco1-lite.glb', scale: 2.1, offset: [0.06, 0.542, -0.001], rotationY: -0.5, draco: true },
  scara: { file: 'scara.glb', scale: 1.92, offset: [0.211, 0.067, -0.049], rotationY: -0.3 },
  sp01: { file: 'sp01.glb', scale: 1.3, offset: [0.003, 0.0, 0.001], rotationY: -0.5 },
  humblebeev2: { file: 'humblebeev2.glb', scale: 1.05, offset: [-0.001, 0.0, 0.0], rotationY: 0.9 },
  so101: { file: 'so101.glb', scale: 4.0, offset: [-0.044, -0.008, -0.062], rotationY: 0.9 },
  go2: { file: 'go2.glb', scale: 1.9, offset: [0.001, 0.853, -0.085], rotationY: 1.05 },
}
