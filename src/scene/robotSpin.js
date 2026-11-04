// How far the visitor has turned the robot of each station. Mutable and outside React:
// it changes on every pointer move and is only read when drawing a frame.
const FLING_DECAY_SECONDS = 0.45
const FLING_STOPS_BELOW = 0.02 // radians per second
const LONGEST_STEP_SECONDS = 0.05 // the first frame after a pause must not jump

const spins = new Map()

export function spinOf(stationId) {
  if (!spins.has(stationId)) spins.set(stationId, { yaw: 0, velocity: 0 })
  return spins.get(stationId)
}

// What a release leaves behind keeps turning and slows down. Returns whether it still does.
export function advanceSpin(spin, delta) {
  if (spin.velocity === 0) return false
  const step = Math.min(delta, LONGEST_STEP_SECONDS)
  spin.yaw += spin.velocity * step
  spin.velocity *= Math.exp(-step / FLING_DECAY_SECONDS)
  if (Math.abs(spin.velocity) < FLING_STOPS_BELOW) spin.velocity = 0
  return spin.velocity !== 0
}
