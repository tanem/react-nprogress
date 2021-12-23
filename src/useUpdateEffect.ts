// Hat-tip:
// https://github.com/streamich/react-use/blob/master/src/useUpdateEffect.ts.
//
// `react-use` appears to be unmaintained, so moving the required code into
// this project for now.

import { useEffect, useRef } from 'react'

const useFirstMountState = (): boolean => {
  const isFirst = useRef(true)

  if (isFirst.current) {
    isFirst.current = false
    return true
  }

  return isFirst.current
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
