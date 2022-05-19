// Hat-tip:
// https://github.com/streamich/react-use/blob/master/tests/useGetSetState.test.ts.
//
// `react-use` appears to be unmaintained, so moving the required code into
// this project for now.

import { act, renderHook } from '@testing-library/react'

import { useGetSetState } from '../src/useGetSetState'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const setUp = (initialState: any) =>
  renderHook(() => useGetSetState(initialState))

beforeEach(() => {
  jest.useFakeTimers()
})

it('should init getter and setter', () => {
  const { result } = setUp({ foo: 'initialValue' })
  const [get, set] = result.current

  expect(get).toBeInstanceOf(Function)
  expect(set).toBeInstanceOf(Function)
})

it('should get current state', () => {
  const { result } = setUp({ bar: 'z', foo: 'a' })
  const [get] = result.current

  const currentState = get()

  expect(currentState).toEqual({ bar: 'z', foo: 'a' })
})

it('should set new state by applying patch with existing keys', () => {
  const { result } = setUp({ bar: 'z', foo: 'a' })
  const [get, set] = result.current

  act(() => set({ bar: 'y' }))

  const currentState = get()
  expect(currentState).toEqual({ bar: 'y', foo: 'a' })
})

it('should set new state by applying patch with new keys', () => {
  const { result } = setUp({ bar: 'z', foo: 'a' })
  const [get, set] = result.current

  act(() => set({ qux: 'f' }))

  const currentState = get()
  expect(currentState).toEqual({ bar: 'z', foo: 'a', qux: 'f' })
})

it('should set new state by applying patch with both new and old keys', () => {
  const { result } = setUp({ bar: 'z', foo: 'a' })
  const [get, set] = result.current

  act(() => set({ bar: 'y', qux: 'f' }))

  const currentState = get()
  expect(currentState).toEqual({ bar: 'y', foo: 'a', qux: 'f' })
})

it('should NOT set new state if empty patch received', () => {
  const { result } = setUp({ bar: 'z', foo: 'a' })
  const [get, set] = result.current

  act(() => set({}))

  const currentState = get()
  expect(currentState).toEqual({ bar: 'z', foo: 'a' })
})

it('should NOT set new state if no patch received', () => {
  const { result } = setUp({ bar: 'z', foo: 'a' })
  const [get, set] = result.current

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  act(() => set())

  const currentState = get()
  expect(currentState).toEqual({ bar: 'z', foo: 'a' })
})

it('should get and set expected state when used in nested functions', () => {
  const onClick = jest.fn(() => {
    setTimeout(() => {
      set({ counter: get().counter + 1 })
    }, 1000)
  })

  const { result } = setUp({ counter: 0 })
  const [get, set] = result.current

  // Simulate 3 clicks.
  onClick()
  onClick()
  onClick()

  // Fast-forward until all timers have been executed.
  act(() => {
    jest.runAllTimers()
  })

  const currentState = get()
  expect(currentState).toEqual({ counter: 3 })
  expect(onClick).toHaveBeenCalledTimes(3)
})
