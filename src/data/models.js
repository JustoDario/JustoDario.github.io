// One entry per robot on show. Plain data: this also runs in Node through
// scripts/check-content.mjs. To add a robot: put its GLB in public/3d/, add an
// entry here and set `model: 'id'` in the content. The numbers come from
// window.__modelBounds in ?debug, once per file.
//
// scale, offset: the model stands on y = 0, centred on its station.
// height: how tall it stands once scaled, to centre it in the upright layout.
// radius: how far it reaches from its axis once scaled, to know where it can be grabbed.
// rotationY: the angle it is shown at. draco: needs the decoder to load.
// Files ending in -posed come from scripts/pose-glb.mjs: same model, legs bent. Files
// ending in -lite from scripts/compress-glb.mjs: same shapes, smaller and fewer draw calls.
// legged: touches the floor at small points, so it gets a contact shadow.
//
// Sources: go2 is "Robot dog Unitree Go2" by C. Yamahata, CC BY 4.0, legs posed,
// https://sketchfab.com/3d-models/robot-dog-unitree-go2-7af84eb9ba834f27bbac818a8b96e2da
export const MODELS = {
  coco1: { file: 'coco1-posed.glb', scale: 2.795, offset: [0.08, 0.66, -0.001], rotationY: -0.5, height: 1.05, radius: 0.9, draco: true, legged: true },
  scara: { file: 'scara.glb', scale: 2.112, offset: [0.232, 0.074, -0.054], rotationY: -0.3, height: 0.98, radius: 0.74 },
  sp01: { file: 'sp01.glb', scale: 1.573, offset: [0.004, 0.0, 0.001], rotationY: -0.5, height: 0.45, radius: 0.97 },
  humblebeev2: { file: 'humblebeev2.glb', scale: 1.271, offset: [-0.001, 0.0, 0.0], rotationY: 0.9, height: 0.50, radius: 0.9 },
  so101: { file: 'so101-lite.glb', scale: 4.4, offset: [-0.048, -0.009, -0.068], rotationY: 0.9, height: 1.23, radius: 0.55 },
  go2: { file: 'go2-posed.glb', scale: 2.09, offset: [0.001, 0.698, 0.036], rotationY: 1.05, height: 0.88, radius: 0.81, legged: true },
}
