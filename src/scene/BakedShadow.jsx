import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { HorizontalBlurShader } from 'three/examples/jsm/shaders/HorizontalBlurShader.js'
import { VerticalBlurShader } from 'three/examples/jsm/shaders/VerticalBlurShader.js'

const FLOOR_Y = 0.002

// Soft contact shadow on the invisible floor, rendered from below once and then
// reused as a texture. Own version instead of drei's ContactShadows: that one
// blurs on a plane fixed at the world origin, so it comes out empty at any
// station away from x = 0, and it never frees its render targets.
export default function BakedShadow({ x, size = 5, far = 1.6, blur = 2.2, opacity = 0.55, color = '#2a3550', resolution = 512 }) {
  const gl = useThree((state) => state.gl)
  const scene = useThree((state) => state.scene)
  const plane = useRef()
  const baked = useRef(false)

  const res = useMemo(() => {
    const target = new THREE.WebGLRenderTarget(resolution, resolution, { generateMipmaps: false })
    const targetBlur = new THREE.WebGLRenderTarget(resolution, resolution, { generateMipmaps: false })

    const depth = new THREE.MeshDepthMaterial({ depthTest: false, depthWrite: false })
    depth.onBeforeCompile = (shader) => {
      shader.uniforms.uColor = { value: new THREE.Color(color) }
      shader.fragmentShader = shader.fragmentShader
        .replace('void main() {', 'uniform vec3 uColor;\nvoid main() {')
        .replace('vec4( vec3( 1.0 - fragCoordZ ), opacity );', 'vec4( uColor, 1.0 - fragCoordZ );')
    }

    const horizontal = new THREE.ShaderMaterial({ ...HorizontalBlurShader, depthTest: false, transparent: false })
    const vertical = new THREE.ShaderMaterial({ ...VerticalBlurShader, depthTest: false, transparent: false })
    horizontal.uniforms = THREE.UniformsUtils.clone(HorizontalBlurShader.uniforms)
    vertical.uniforms = THREE.UniformsUtils.clone(VerticalBlurShader.uniforms)

    const quadGeometry = new THREE.PlaneGeometry(2, 2)
    const quad = new THREE.Mesh(quadGeometry)
    quad.frustumCulled = false
    const quadCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)

    const half = size / 2
    const camera = new THREE.OrthographicCamera(-half, half, half, -half, 0, far)
    camera.up.set(0, 0, 1)

    return { target, targetBlur, depth, horizontal, vertical, quad, quadGeometry, quadCamera, camera }
  }, [resolution, size, far, color])

  useEffect(
    () => () => {
      res.target.dispose()
      res.targetBlur.dispose()
      res.depth.dispose()
      res.horizontal.dispose()
      res.vertical.dispose()
      res.quadGeometry.dispose()
    },
    [res],
  )

  // A new set of resources, or a new position, needs a new bake.
  useEffect(() => {
    baked.current = false
  }, [res, x])

  const blurPass = (amount) => {
    res.quad.material = res.horizontal
    res.horizontal.uniforms.tDiffuse.value = res.target.texture
    res.horizontal.uniforms.h.value = amount / 256
    gl.setRenderTarget(res.targetBlur)
    gl.render(res.quad, res.quadCamera)

    res.quad.material = res.vertical
    res.vertical.uniforms.tDiffuse.value = res.targetBlur.texture
    res.vertical.uniforms.v.value = amount / 256
    gl.setRenderTarget(res.target)
    gl.render(res.quad, res.quadCamera)
  }

  useFrame(() => {
    if (baked.current) return
    baked.current = true

    res.camera.position.set(x, 0, 0)
    res.camera.lookAt(x, 1, 0)
    res.camera.updateMatrixWorld()

    const previousTarget = gl.getRenderTarget()
    const previousOverride = scene.overrideMaterial
    plane.current.visible = false
    scene.overrideMaterial = res.depth

    gl.setRenderTarget(res.target)
    gl.render(scene, res.camera)

    scene.overrideMaterial = previousOverride
    plane.current.visible = true

    blurPass(blur)
    blurPass(blur * 0.4)
    gl.setRenderTarget(previousTarget)
  })

  // The bake camera looks up with +X right and +Z up, so the plane is mirrored
  // in Y to line the texture up with the floor. DoubleSide compensates for it.
  return (
    <mesh ref={plane} position={[x, FLOOR_Y, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[1, -1, 1]}>
      <planeGeometry args={[size, size]} />
      <meshBasicMaterial
        map={res.target.texture}
        transparent
        opacity={opacity}
        depthWrite={false}
        side={THREE.DoubleSide}
        toneMapped={false}
      />
    </mesh>
  )
}
