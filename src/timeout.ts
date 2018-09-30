let handle: number

export const cancel = () => {
  if (handle) {
    window.cancelAnimationFrame(handle)
  }
}

export const timeout = (cb: () => void, delay: number) => {
  let deltaTime
  let now
  let start: number | undefined

  const frame = () => {
    start = start || window.performance.now()
    now = window.performance.now()
    deltaTime = now - start
    if (deltaTime > delay) {
      cb()
      return
    }
    handle = window.requestAnimationFrame(frame)
  }

  handle = window.requestAnimationFrame(frame)
}
