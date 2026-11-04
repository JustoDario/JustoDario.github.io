// Takes only the opacity from the texture, with the material's colour for every pixel. Very
// dark colours stored in 8 bits round differently per channel, which on some GPUs (seen in
// Safari on iPhone) would otherwise show as coloured specks.
export function alphaOnlyMap(shader) {
  shader.fragmentShader = shader.fragmentShader.replace(
    '#include <map_fragment>',
    'diffuseColor.a *= texture2D( map, vMapUv ).a;',
  )
}
