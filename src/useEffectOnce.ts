// Hat-tip:
// https://github.com/streamich/react-use/blob/master/src/useEffectOnce.ts.
//
// `react-use` appears to be unmaintained, so moving the required code into
// this project for now.

import { EffectCallback, useEffect } from 'react'

export const useEffectOnce = (effect: EffectCallback) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(effect, [])
}
