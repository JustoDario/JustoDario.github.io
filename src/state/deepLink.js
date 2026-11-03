// Public link format, kept from the original site because the CV links to it:
// #section/entry/media. Anything invalid is ignored; out-of-range indices clamp.
const clamp = (value, length) => Math.min(value, Math.max(length - 1, 0))
const toIndex = (part) => (/^\d+$/.test(part ?? '') ? Number(part) : null)

export function parseHash(hash, sections) {
  let parts
  try {
    parts = decodeURIComponent(hash).replace(/^#/, '').split('/')
  } catch {
    return null // malformed percent-encoding
  }

  const [id, entryPart, mediaPart] = parts
  if (!id) return null

  const section = sections.find((candidate) => candidate.id === id)
  const entryIndex = toIndex(entryPart)
  if (!section || entryIndex === null) return { id }

  const entry = clamp(entryIndex, section.entries.length)
  const mediaIndex = toIndex(mediaPart)
  if (mediaIndex === null) return { id, entry }

  return { id, entry, media: clamp(mediaIndex, section.entries[entry].media.length) }
}
