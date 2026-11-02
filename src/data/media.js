// Helpers shared by the content files. Plain data only: this also runs in Node
// through scripts/check-content.mjs.
export const L = (en, es) => ({ en, es })

export const image = (file, en, es) => ({ type: 'image', file, alt: L(en, es) })

// The URL is kept exactly as in the original portfolio, parameters included.
export const video = (url, title) => ({ type: 'video', url, title: L(`Video: ${title}`, `Vídeo: ${title}`) })
