// Which models failed to load, shared between the scene and the HTML interface.
// No three.js here: the interface must not pull the 3D chunk in.
let snapshot = { errors: {}, attempts: {}, loaded: {} }
const listeners = new Set()
let clearCache = () => {}

const publish = (next) => {
  snapshot = next
  listeners.forEach((listener) => listener())
}

export const subscribeModelStatus = (listener) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}
export const getModelStatus = () => snapshot

// A failed load stays in the loader's cache, so it has to leave before the retry.
export const setModelCacheClear = (fn) => {
  clearCache = fn
}

// kind: 'retry' can try again; 'reload' needs a new page.
export const reportModelError = (file, kind) => {
  if (snapshot.errors[file] === kind) return
  publish({ ...snapshot, errors: { ...snapshot.errors, [file]: kind } })
}

export const retryModel = (file) => {
  clearCache(file)
  const { [file]: _removed, ...errors } = snapshot.errors
  publish({ ...snapshot, errors, attempts: { ...snapshot.attempts, [file]: (snapshot.attempts[file] ?? 0) + 1 } })
}

// Ready to draw, for the loading indicator.
export const reportModelLoaded = (file) => {
  if (!snapshot.loaded[file]) publish({ ...snapshot, loaded: { ...snapshot.loaded, [file]: true } })
}

export const reportModelReleased = (file) => {
  if (!snapshot.loaded[file]) return
  const { [file]: _removed, ...loaded } = snapshot.loaded
  publish({ ...snapshot, loaded })
}
