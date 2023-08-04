// Hat-tip:
// https://github.com/streamich/react-use/blob/master/src/useGetSetState.ts.
//
// `react-use` appears to be unmaintained, so moving the required code into
// this project for now.

import { useCallback, useRef, useState } from 'react'

const incrementParameter = (num: number): number => ++num % 1_000_000

const useUpdate = () => {
  const [, setState] = useState(0)
  return useCallback(() => setState(incrementParameter), [])
}

export const useGetSetState = <T extends object>(
  /* istanbul ignore next */
  initialState: T = {} as T,
): [() => T, (patch: Partial<T>) => void] => {
  const update = useUpdate()
  const state = useRef<T>({ ...(initialState as object) } as T)
  const get = useCallback(() => state.current, [])
  const set = useCallback((patch: Partial<T>) => {
    if (!patch) {
      return
    }
    Object.assign(state.current, patch)
    update()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return [get, set]
}
