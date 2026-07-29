import { useCallback, useRef } from 'react'

import { clamp } from './clamp'
import { createQueue } from './createQueue'
import { createTimeout } from './createTimeout'
import { increment } from './increment'
import type { Options } from './types'
import { useEffectOnce } from './useEffectOnce'
import { useGetSetState } from './useGetSetState'
import { useUpdateEffect } from './useUpdateEffect'

/* istanbul ignore next */
const noop = () => undefined

// State includes a `sideEffect` callback that bridges imperative queue
// operations into React's declarative model. Each `setState` stores a callback;
// `useUpdateEffect` fires it after React commits the update. This lets the
// queue drive animations and schedule follow-up work without breaking React's
// rendering lifecycle.
const initialState: {
  isFinished: boolean
  progress: number
  sideEffect: () => void
} = {
  isFinished: true,
  progress: 0,
  sideEffect: noop,
}

export const useNProgress = ({
  animationDuration = 200,
  incrementDuration = 200,
  isAnimating = false,
  minimum = 0.08,
}: Options = {}): {
  animationDuration: number
  isFinished: boolean
  progress: number
} => {
  const [get, setState] = useGetSetState(initialState)

  const queueRef = useRef<ReturnType<typeof createQueue> | null>(null)
  const timeoutRef = useRef<ReturnType<typeof createTimeout> | null>(null)

  useEffectOnce(() => {
    queueRef.current = createQueue()
    timeoutRef.current = createTimeout()
  })

  const cleanup = useCallback(() => {
    timeoutRef.current?.cancel()
    queueRef.current?.clear()
  }, [])

  const set = useCallback(
    (n: number) => {
      n = clamp(n, minimum, 1)

      // Unlike the original nprogress `done()`, completion does not include a
      // random progress jump before animating to 1. This keeps the primitive
      // predictable; consumers can set a higher progress value before stopping
      // the animation if they want that effect.
      if (n === 1) {
        cleanup()

        queueRef.current?.enqueue((next) => {
          setState({
            progress: n,
            sideEffect: () =>
              timeoutRef.current?.schedule(next, animationDuration),
          })
        })

        queueRef.current?.enqueue(() => {
          setState({ isFinished: true, sideEffect: cleanup })
        })

        return
      }

      queueRef.current?.enqueue((next) => {
        setState({
          isFinished: false,
          progress: n,
          sideEffect: next,
        })
      })
    },
    [animationDuration, cleanup, minimum, queueRef, setState, timeoutRef],
  )

  const trickle = useCallback(() => {
    set(increment(get().progress))
  }, [get, set])

  const start = useCallback(() => {
    // The original nprogress calls set(0) - which clamps to `minimum` - before
    // the first trickle. Here, the first trickle starts from increment(0) =
    // 0.1, so the bar appears at max(0.1, minimum) rather than exactly
    // `minimum`. The difference is negligible at the default minimum of 0.08.
    const work = () => {
      trickle()
      queueRef.current?.enqueue((next) => {
        timeoutRef.current?.schedule(() => {
          work()
          next()
        }, incrementDuration)
      })
    }

    work()
  }, [incrementDuration, queueRef, timeoutRef, trickle])

  const sideEffect = get().sideEffect

  useEffectOnce(() => {
    if (isAnimating) {
      start()
    }
    return cleanup
  })

  useUpdateEffect(() => {
    get().sideEffect()
  }, [get, sideEffect])

  useUpdateEffect(() => {
    if (!isAnimating) {
      set(1)
    } else {
      setState({
        ...initialState,
        sideEffect: start,
      })
    }
  }, [isAnimating, set, setState, start])

  return {
    animationDuration,
    isFinished: get().isFinished,
    progress: get().progress,
  }
}
