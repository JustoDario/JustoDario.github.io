// One entry per robot on show. Plain data: this also runs in Node through
// scripts/check-content.mjs. To add a robot: put its GLB in public/3d/, add an
// entry here and set `model: 'id'` in the content. The numbers come from
// window.__modelBounds in ?debug, once per file.
//
// scale, offset: the model stands on y = 0, centred on its station.
// height: how tall it stands once scaled, to centre it in the upright layout.
// radius: how far it reaches from its axis once scaled, to know where it can be grabbed.
// rotationY: the angle it is shown at. draco: needs the decoder to load.
// rotation: stands it upright, for files that are not Y-up.
// Files ending in -posed come from scripts/pose-glb.mjs: same model, legs bent. Files
// ending in -lite from scripts/compress-glb.mjs: same shapes, smaller and fewer draw calls.
// legged: touches the floor at small points, so it gets a contact shadow.
//
// Sources of the models made by others:
// go2: "Robot dog Unitree Go2" by C. Yamahata, CC BY 4.0, legs posed,
//   https://sketchfab.com/3d-models/robot-dog-unitree-go2-7af84eb9ba834f27bbac818a8b96e2da
// g1: "Unitree G1 Humanoid Robot Animated" by geyges, Sketchfab Standard,
//   https://sketchfab.com/3d-models/unitree-g1-humanoid-robot-animated-6f2b77ca86f1456fab9b8f471da77ba7
// drone: "animated drone with camera (FREE)" by ulunkwulunk, CC BY 4.0,
//   https://sketchfab.com/3d-models/animated-drone-with-camera-free-a8e2c50f69264e75bb6277779fb5028b
// f1car: "Fórmula 1 Genérico 3" by LuizZed36, CC BY 4.0,
//   https://sketchfab.com/3d-models/formula-1-generico-3-a1c824eb220c4fd49e3f4a60e936e233
// linefollower: "BoE Bot" by DCEngineer, CC BY 4.0,
//   https://sketchfab.com/3d-models/boe-bot-91d4aebaf0df4e19a4a24201563e24a2
// robotaxi: "Ford Mondeo TAXI" by TSB3DMODELS, CC BY-NC 4.0,
//   https://sketchfab.com/3d-models/ford-mondeo-taxi-8bc1c46fe0334d03a5eb927b6a129dc8
// roomba: "Roomba Low Poly / Vacuum Cleaner" by Matvey Elkin, CC BY 4.0, compressed,
//   https://sketchfab.com/3d-models/roomba-low-poly-vacuum-cleaner-4fff076d04da413da55109a4e92e7b53
//
// uprightScale: this much bigger in the upright layout. upright: values of its own there.
// dance: the wide layout plays the file's animation, or holds it at standAt seconds when
// motion is reduced; elsewhere the model rests in the pose saved in the file.
export const MODELS = {
  coco1: { file: 'coco1-posed.glb', scale: 2.795, offset: [0.08, 0.66, -0.001], rotationY: -0.5, height: 1.05, radius: 0.9, draco: true, legged: true },
  scara: { file: 'scara.glb', scale: 2.112, offset: [0.232, 0.074, -0.054], rotationY: -0.3, height: 0.98, radius: 0.74 },
  sp01: { file: 'sp01.glb', scale: 1.573, offset: [0.004, 0.0, 0.001], rotationY: -0.5, height: 0.45, radius: 0.97, uprightScale: 1.15 },
  humblebeev2: { file: 'humblebeev2.glb', scale: 1.271, offset: [-0.001, 0.0, 0.0], rotationY: 0.9, height: 0.50, radius: 0.9, uprightScale: 1.15 },
  so101: { file: 'so101-lite.glb', scale: 4.4, offset: [-0.048, -0.009, -0.068], rotationY: 0.9, height: 1.23, radius: 0.55 },
  go2: { file: 'go2-posed.glb', scale: 2.09, offset: [0.001, 0.698, 0.036], rotationY: 1.05, height: 0.88, radius: 0.81, legged: true },
  g1: { file: 'unitreeg1-sitting.glb', scale: 0.44, offset: [0.13, -0.006, -0.25], rotationY: -0.3, height: 1.25, radius: 0.65, lift: -0.3, legged: true, dance: { standAt: 3.43 }, upright: { scale: 0.6, offset: [-0.139, -0.643, -0.45], rotationY: -0.5, height: 1.04, radius: 0.66 } },
  stairclimber: { file: 'stairclimber-lite.glb', scale: 4.7, offset: [-0.345, 1.245, -0.404], rotationY: -0.5, height: 1.19, radius: 0.77, legged: true },
  ur5: { file: 'UR5.glb', scale: 0.0021, offset: [-0.105, 0, -0.036], rotation: [Math.PI / 2, 0, 0], rotationY: -0.5, height: 1.21, radius: 0.76 },
  kobuki: { file: 'kobuki.glb', scale: 2.2, offset: [0, 0.257, 0], rotationY: -0.5, height: 1.19, radius: 0.55 },
  linefollower: { file: 'linefollower.glb', scale: 8, offset: [0.572, 0, 0], rotationY: -0.5, height: 0.63, radius: 0.75, uprightScale: 1.15 },
  turtlerover: { file: 'turtlerover.glb', scale: 0.29, offset: [0.12, -0.088, -0.023], rotationY: -0.5, height: 1.19, radius: 0.84 },
  drone: { file: 'drone.glb', scale: 1.4, offset: [0, 0, -0.014], rotationY: -0.5, height: 0.38, radius: 0.9, uprightScale: 1.15 },
  roomba: { file: 'roomba-lite.glb', scale: 0.62, offset: [0, 0.23, -0.149], rotationY: -0.5, height: 0.41, radius: 0.9 },
  robotaxi: { file: 'robotaxi.glb', scale: 0.0085, offset: [0, 0.219, 0.017], rotationY: 0.9, height: 0.55, radius: 0.9, uprightScale: 1.15 },
  // Coco and the Go2 together, from scripts/compose-glb.mjs: already placed and sized.
  cocoGo2: { file: 'coco-go2.glb', scale: 1, offset: [0, 0, 0], rotationY: 0, height: 0.65, radius: 1.15, legged: true, uprightScale: 1.2 },
  f1car: { file: 'f1car.glb', scale: 0.67, offset: [0, 0.203, 0], rotationY: 0.9, height: 0.41, radius: 0.9, uprightScale: 1.15 },
}

// The values for a layout. A new object each time in the upright one: not for a tight loop.
export function forLayout(model, upright) {
  if (!upright || !model) return model
  const size = model.uprightScale ?? 1
  return {
    ...model,
    scale: model.scale * size,
    offset: model.offset.map((value) => value * size),
    height: model.height * size,
    radius: model.radius * size,
    ...model.upright,
  }
}
