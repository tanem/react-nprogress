// Uses requestAnimationFrame rather than setTimeout for smoother animation
// timing. Note that rAF is throttled or paused in background tabs, so progress
// will stall when the tab is hidden and resume when it regains focus.
export const createTimeout = () => {
  let handle: number | undefined

  const cancel = (): void => {
    if (handle !== undefined) {
      window.cancelAnimationFrame(handle)
    }
  }

  const schedule = (callback: () => void, delay: number): void => {
    cancel()

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
