// Hat-tip:
// https://github.com/streamich/react-use/blob/master/tests/useEffectOnce.test.ts.
//
// `react-use` appears to be unmaintained, so moving the required code into
// this project for now.

import { renderHook } from '@testing-library/react-hooks'

import { useEffectOnce } from '../src/useEffectOnce'

it('should run provided effect only once', () => {
  const mockEffect = jest.fn()
  const { rerender } = renderHook(() => useEffectOnce(mockEffect))
  expect(mockEffect).toHaveBeenCalledTimes(1)
  rerender()
  expect(mockEffect).toHaveBeenCalledTimes(1)
})

it('should run clean-up provided on unmount', () => {
  const mockCleanup = jest.fn()
  const { unmount } = renderHook(() => useEffectOnce(() => mockCleanup))
  expect(mockCleanup).not.toHaveBeenCalled()
  unmount()
  expect(mockCleanup).toHaveBeenCalledTimes(1)
})
