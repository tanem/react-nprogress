import { noop } from 'lodash'
import { useEffect, useRef } from 'react'
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

const initialState: State = {
  isFinished: false,
  progress: 0,
  sideEffect: noop
}

const cleanup = () => {
  cancelCurrentTimeout()
  clearQueue()
}

export const useNProgress = ({
  animationDuration = 200,
  incrementDuration = 800,
  isAnimating = false,
  minimum = 0.08
}: Options = {}) => {
  const [get, setState] = useGetSetState(initialState)

  const trickle = () => {
    set(increment(get().progress))
  }

  const savedTrickle = useRef<typeof trickle | null>(null)

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
  }, [get().sideEffect])

  useUpdateEffect(() => {
    if (!isAnimating) {
      set(1)
    } else {
      setState({ sideEffect: start })
    }
  }, [isAnimating])

  const start = () => {
    const work = () => {
      savedTrickle.current && savedTrickle.current()
      queue(next => {
        timeout(() => {
          work()
          next()
        }, incrementDuration)
      })
    }

    work()
  }

  const set = (n: number) => {
    n = clamp(n, minimum, 1)

    if (n === 1) {
      cleanup()

      queue(next => {
        setState({
          progress: n,
          sideEffect: () => timeout(next, animationDuration)
        })
      })

      queue(() => {
        setState({
          isFinished: true,
          sideEffect: cleanup
        })
      })

      return
    }

    queue(next => {
      setState({
        progress: n,
        sideEffect: () => timeout(next, animationDuration)
      })
    })
  }

  return {
    animationDuration,
    isFinished: get().isFinished,
    progress: get().progress
  }
}
