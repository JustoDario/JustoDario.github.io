// Health of the WebGL scene, shared with the HTML interface. If the GPU process
// falls, the browser may refuse new contexts for about two minutes ("Web page caused
// context loss and was blocked") and no restored event arrives: the scene has to
// find out by itself.
const GIVE_UP_MS = 5000 // a lost context usually comes back well before this
const PROBE_EVERY_MS = 5000
const MAX_PROBES = 48 // four minutes, about twice the browser's block

// sceneUnavailable: null, 'paused' (the browser's block, it comes back) or 'failed'.
let snapshot = { sceneUnavailable: null }
let giveUpTimer
const listeners = new Set()

const publish = (changes) => {
  snapshot = { ...snapshot, ...changes }
  listeners.forEach((listener) => listener())
}

export const subscribeSceneHealth = (listener) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}
export const getSceneHealth = () => snapshot

export const reportSceneUnavailable = (kind = 'paused') => publish({ sceneUnavailable: kind })

export function reportContextLost() {
  clearTimeout(giveUpTimer)
  giveUpTimer = setTimeout(() => reportSceneUnavailable('paused'), GIVE_UP_MS)
}

function webglAvailable() {
  const gl = document.createElement('canvas').getContext('webgl2')
  gl?.getExtension('WEBGL_lose_context')?.loseContext() // browsers limit live contexts
  return !!gl
}

// Calls back once when new contexts work again. Returns a function that cancels it.
export function watchForWebGL(onAvailable) {
  let probes = 0
  const timer = setInterval(() => {
    probes++
    if (webglAvailable()) {
      clearInterval(timer)
      onAvailable()
    } else if (probes >= MAX_PROBES) {
      clearInterval(timer)
    }
  }, PROBE_EVERY_MS)
  return () => clearInterval(timer)
}

export function reportContextRestored() {
  clearTimeout(giveUpTimer)
  publish({ sceneUnavailable: null })
}
