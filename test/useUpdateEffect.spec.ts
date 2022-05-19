// Hat-tip:
// https://github.com/streamich/react-use/blob/master/tests/useUpdateEffect.test.ts.
//
// `react-use` appears to be unmaintained, so moving the required code into
// this project for now.

import { renderHook } from '@testing-library/react'

import { useUpdateEffect } from '../src/useUpdateEffect'

it('should run effect on update', () => {
  const mockEffect = jest.fn()
  const { rerender } = renderHook(() => useUpdateEffect(mockEffect))
  expect(mockEffect).not.toHaveBeenCalled()
  rerender()
  expect(mockEffect).toHaveBeenCalledTimes(1)
})

it('should run cleanup on unmount', () => {
  const mockCleanup = jest.fn()
  const hook = renderHook(() => useUpdateEffect(() => mockCleanup))
  hook.rerender()
  hook.unmount()
  expect(mockCleanup).toHaveBeenCalledTimes(1)
})
