// A log for ?debug, readable on a phone without developer tools. Does nothing otherwise.
export const diagnosticsEnabled = new URLSearchParams(window.location.search).has('debug')

const lines = []
const seconds = () => (performance.now() / 1000).toFixed(2)

export function note(text) {
  if (!diagnosticsEnabled) return
  lines.push(`${seconds()}s ${text}`)
  if (lines.length > 40) lines.shift()
}

export const noted = () => lines
