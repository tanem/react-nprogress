import { useEffect, useReducer } from 'react'

import { clamp } from './clamp'
import { createTimeout } from './createTimeout'
import { increment } from './increment'
import type { NProgressOptions, NProgressState } from './types'

// A four-phase state machine. `idle` and `finished` both report
// `isFinished: true` and differ only in the progress they hold, so the phase,
// not `isFinished`, is what decides which transitions and timers apply.
type Phase = 'animating' | 'completing' | 'finished' | 'idle'

interface State {
  phase: Phase
  progress: number
}

type Action =
  | { minimum: number; type: 'start' }
  | { minimum: number; type: 'trickle' }
  | { type: 'complete' }
  | { type: 'finish' }

const initialState: State = {
  phase: 'idle',
  progress: 0,
}

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'complete':
      // The original nprogress `done()` computes a random progress jump before
      // animating to 1, but its queue runs both steps in the same tick, so the
      // jump's CSS is overwritten before paint and never renders. Omitting the
      // jump changes nothing visually.
      //
      // Ignored unless an animation is actually running, which is what makes a
      // StrictMode double-mount a no-op rather than a spurious completion.
      return state.phase === 'animating'
        ? { phase: 'completing', progress: 1 }
        : state

    case 'finish':
      return { phase: 'finished', progress: 1 }

    case 'start':
      // Matches the original nprogress `start()`, which calls set(0) and so
      // paints first at `minimum` before any trickle runs.
      //
      // Guarded the same way as `complete`, and for the same reason: a repeat
      // dispatch against a running animation must not rewind the bar. That
      // happens whenever `minimum` changes mid-animation, as well as on a
      // StrictMode double-mount.
      return state.phase === 'animating'
        ? state
        : {
            phase: 'animating',
            progress: clamp(0, action.minimum, 1),
          }

    case 'trickle':
      return {
        ...state,
        progress: clamp(increment(state.progress), action.minimum, 1),
      }
  }
}

export const useNProgress = ({
  animationDuration = 200,
  incrementDuration = 200,
  isAnimating = false,
  minimum = 0.08,
}: NProgressOptions = {}): NProgressState => {
  const [{ phase, progress }, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    dispatch(isAnimating ? { minimum, type: 'start' } : { type: 'complete' })
  }, [isAnimating, minimum])

  // A timer per running phase, rather than one effect branching over both.
  // Each then depends only on the options its own phase reads, so changing an
  // option the running phase ignores cannot cancel its timer. Both are keyed
  // on the phase rather than on progress, so trickling does not tear down and
  // recreate the timer mid-animation.
  useEffect(() => {
    if (phase !== 'animating') {
      return
    }

    const timeout = createTimeout()

    const trickle = () => {
      dispatch({ minimum, type: 'trickle' })
      timeout.schedule(trickle, incrementDuration)
    }
    timeout.schedule(trickle, incrementDuration)

    return () => timeout.cancel()
  }, [incrementDuration, minimum, phase])

  useEffect(() => {
    if (phase !== 'completing') {
      return
    }

    const timeout = createTimeout()
    timeout.schedule(() => dispatch({ type: 'finish' }), animationDuration)

    return () => timeout.cancel()
  }, [animationDuration, phase])

  return {
    animationDuration,
    isFinished: phase === 'finished' || phase === 'idle',
    progress,
  }
}
