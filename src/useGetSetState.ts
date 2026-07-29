// Hat-tip:
// https://github.com/streamich/react-use/blob/master/src/useGetSetState.ts.
//
// `react-use` appears to be unmaintained, so moving the required code into
// this project for now.

import { useCallback, useReducer, useRef } from 'react'

const useUpdate = () => {
  const [, update] = useReducer((num: number) => (num + 1) % 1_000_000, 0)
  return update
}

export const useGetSetState = <T extends object>(
  /* istanbul ignore next */
  initialState: T = {} as T,
): [() => T, (patch: Partial<T>) => void] => {
  const update = useUpdate()
  const stateRef = useRef<T>({ ...(initialState as object) } as T)
  const get = useCallback(() => stateRef.current, [])
  const set = useCallback((patch: Partial<T>) => {
    if (!patch) {
      return
    }
    Object.assign(stateRef.current, patch)
    update()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return [get, set]
}
