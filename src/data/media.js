// Helpers shared by the content files. Plain data only: this also runs in Node
// through scripts/check-content.mjs.
export const L = (en, es) => ({ en, es })

// `still`: what to show instead of an animated image when motion is reduced.
export const image = (file, en, es, still) => ({ type: 'image', file, alt: L(en, es), ...(still && { still }) })

// Served from public/video/ in AV1, with H.264 only for browsers without AV1: hardware
// H.264 decoding takes down the GPU process on some machines, and WebGL with it,
// which a YouTube embed cannot avoid. `youtube` is the fallback if a file fails.
export const video = (slug, youtube, title, options = {}) => ({
  type: 'video',
  slug,
  youtube,
  poster: `video-${slug}.jpg`,
  name: L(title, title),
  title: L(`Video: ${title}`, `Vídeo: ${title}`),
  ...options,
})
