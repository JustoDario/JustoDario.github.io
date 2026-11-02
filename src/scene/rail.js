// Camera framing shared by every station of the exhibition rail.
export const CAMERA_OFFSET = [0, 0.95, 4.4]
export const LOOK_AT_HEIGHT = 0.42

// Temporary stations for the Hito 1 test. The real list arrives in Hito 4.
export const TEST_STATIONS = [0, 6]
export const RAIL_LENGTH = TEST_STATIONS[TEST_STATIONS.length - 1]

// Objects on this layer are invisible to the shadow bake, which renders every
// object on layer 0 with a depth material.
export const NO_SHADOW_LAYER = 1
