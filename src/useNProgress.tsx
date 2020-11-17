import { useCallback, useEffect, useRef } from 'react'
import { useEffectOnce, useGetSetState, useUpdateEffect } from 'react-use'

import { clamp } from './clamp'
import { increment } from './increment'
import { clear as clearQueue, queue } from './queue'
import { cancel as cancelCurrentTimeout, timeout } from './timeout'
import { Options } from './types'

interface State {
  isFinished: boolean
  progress: number
  sideEffect: () => void
}

interface ReturnType {
  animationDuration: number
  isFinished: boolean
  progress: number
}

/* istanbul ignore next */
const noop = () => undefined

const initialState: State = {
  isFinished: true,
  progress: 0,
  sideEffect: noop,
}

const cleanup = () => {
  cancelCurrentTimeout()
  clearQueue()
}

export const useNProgress = ({
  animationDuration = 200,
  incrementDuration = 800,
  isAnimating = false,
  minimum = 0.08,
}: Options = {}): ReturnType => {
  const [get, setState] = useGetSetState(initialState)

  const set = useCallback(
    (n: number) => {
      n = clamp(n, minimum, 1)

      if (n === 1) {
        cleanup()

        queue((next) => {
          setState({
            progress: n,
            sideEffect: () => timeout(next, animationDuration),
          })
        })

        queue(() => {
          setState({ isFinished: true, sideEffect: cleanup })
        })

        return
      }

      queue((next) => {
        setState({
          isFinished: false,
          progress: n,
          sideEffect: () => timeout(next, animationDuration),
        })
      })
    },
    [animationDuration, minimum, setState]
  )

  const trickle = useCallback(() => {
    set(increment(get().progress))
  }, [get, set])

  const start = useCallback(() => {
    const work = () => {
      trickle()
      queue((next) => {
        timeout(() => {
          work()
          next()
        }, incrementDuration)
      })
    }

    work()
  }, [incrementDuration, trickle])

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
