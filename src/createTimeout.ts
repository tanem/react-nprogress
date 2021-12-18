export const createTimeout = () => {
  let handle: number | undefined

  const cancel = (): void => {
    if (handle) {
      window.cancelAnimationFrame(handle)
    }
  }

  const schedule = (callback: () => void, delay: number): void => {
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

  return {
    cancel,
    schedule,
  }
}
