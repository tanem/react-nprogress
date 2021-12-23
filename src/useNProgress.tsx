import { useCallback, useEffect, useRef } from 'react'

import { clamp } from './clamp'
import { createQueue } from './createQueue'
import { createTimeout } from './createTimeout'
import { increment } from './increment'
import { Options } from './types'
import { useEffectOnce } from './useEffectOnce'
import { useGetSetState } from './useGetSetState'
import { useUpdateEffect } from './useUpdateEffect'

/* istanbul ignore next */
const noop = () => undefined

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
  incrementDuration = 800,
  isAnimating = false,
  minimum = 0.08,
}: Options = {}): {
  animationDuration: number
  isFinished: boolean
  progress: number
} => {
  const [get, setState] = useGetSetState(initialState)

  const queue = useRef<ReturnType<typeof createQueue> | null>(null)
  const timeout = useRef<ReturnType<typeof createTimeout> | null>(null)

  useEffectOnce(() => {
    queue.current = createQueue()
    timeout.current = createTimeout()
  })

  const cleanup = useCallback(() => {
    timeout.current?.cancel()
    queue.current?.clear()
  }, [])

  const set = useCallback(
    (n: number) => {
      n = clamp(n, minimum, 1)

      if (n === 1) {
        cleanup()

        queue.current?.enqueue((next) => {
          setState({
            progress: n,
            sideEffect: () =>
              timeout.current?.schedule(next, animationDuration),
          })
        })

        queue.current?.enqueue(() => {
          setState({ isFinished: true, sideEffect: cleanup })
        })

        return
      }

      queue.current?.enqueue((next) => {
        setState({
          isFinished: false,
          progress: n,
          sideEffect: () => timeout.current?.schedule(next, animationDuration),
        })
      })
    },
    [animationDuration, cleanup, minimum, queue, setState, timeout]
  )

  const trickle = useCallback(() => {
    set(increment(get().progress))
  }, [get, set])

  const start = useCallback(() => {
    const work = () => {
      trickle()
      queue.current?.enqueue((next) => {
        timeout.current?.schedule(() => {
          work()
          next()
        }, incrementDuration)
      })
    }

    work()
  }, [incrementDuration, queue, timeout, trickle])

  const savedTrickle = useRef<() => void>(noop)

  const sideEffect = get().sideEffect

  useEffect(() => {
    savedTrickle.current = trickle
  })

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
