type Next = () => void
type Callback = (next: Next) => void

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

export const clear = (): void => {
  isRunning = false
  pending = []
}

export const queue = (cb: Callback): void => {
  pending.push(cb)
  if (!isRunning && pending.length === 1) {
    next()
  }
}
