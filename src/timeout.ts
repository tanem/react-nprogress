let handle: number | undefined

export const cancel = () => {
  if (handle) {
    window.cancelAnimationFrame(handle)
  }
}

export const timeout = (callback: () => void, delay: number) => {
  let deltaTime
  let start: number | undefined
  const frame: FrameRequestCallback = (time) => {
    start = start || time
    deltaTime = time - start
    if (deltaTime > delay) {
      callback()
      return
    }
    handle = window.requestAnimationFrame(frame)
  }

  handle = window.requestAnimationFrame(frame)
}
