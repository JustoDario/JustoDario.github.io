// Runs the callback just after the browser has painted. Returns a function to cancel it.
export function afterFirstPaint(callback) {
  let timeout
  const frame = requestAnimationFrame(() => {
    timeout = setTimeout(callback)
  })
  return () => {
    cancelAnimationFrame(frame)
    clearTimeout(timeout)
  }
}
