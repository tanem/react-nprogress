type Next = () => void
type Callback = (next: Next) => void

export const createQueue = () => {
  let isRunning = false
  let pending: Callback[] = []

  const next: Next = () => {
    isRunning = true
    const cb = pending.shift()
    if (cb) {
      return cb(next)
    }
    isRunning = false
  }

  const clear = (): void => {
    isRunning = false
    pending = []
  }

  const enqueue = (cb: Callback): void => {
    pending.push(cb)
    if (!isRunning && pending.length === 1) {
      next()
    }
  }

  return {
    clear,
    enqueue,
  }
}
