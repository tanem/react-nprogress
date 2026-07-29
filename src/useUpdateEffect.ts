// Hat-tip:
// https://github.com/streamich/react-use/blob/master/src/useUpdateEffect.ts.
//
// `react-use` appears to be unmaintained, so moving the required code into
// this project for now.

import { useEffect, useRef } from 'react'

const useFirstMountState = (): boolean => {
  const isFirstRef = useRef(true)

  // Read and mutated directly during render (rather than in an effect) so
  // the first-mount result is available synchronously on the very first
  // render, before any effect has run.
  /* eslint-disable react-hooks/refs -- intentional, see comment above */
  if (isFirstRef.current) {
    isFirstRef.current = false
    return true
  }

  return isFirstRef.current
  /* eslint-enable react-hooks/refs */
}

export const useUpdateEffect: typeof useEffect = (effect, deps) => {
  const isFirstMount = useFirstMountState()

  useEffect(() => {
    if (!isFirstMount) {
      return effect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
