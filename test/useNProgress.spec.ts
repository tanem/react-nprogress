import { act, renderHook } from '@testing-library/react'
import createMockRaf from 'mock-raf'
import { StrictMode } from 'react'

import { useNProgress } from '../src'

const mockRaf = createMockRaf()

// Counted rather than spied on, so the assertion works under the ESM bundle
// config too, where the `jest` global is not injected.
let frameRequests = 0
window.requestAnimationFrame = (callback) => {
  frameRequests += 1
  return mockRaf.raf(callback)
}
window.cancelAnimationFrame = mockRaf.cancel

test('defaults', () => {
  const { result, unmount } = renderHook(() => useNProgress())

  expect(result.current).toEqual({
    animationDuration: 200,
    isFinished: true,
    progress: 0,
  })

  unmount()
})

test('starts animating when isAnimating is true', () => {
  const { result, unmount } = renderHook(() =>
    useNProgress({ isAnimating: true }),
  )

  expect(result.current).toEqual({
    animationDuration: 200,
    isFinished: false,
    progress: 0.1,
  })

  unmount()
})

test('starts animating when isAnimating changes from false to true', () => {
  const { result, rerender, unmount } = renderHook(
    ({ isAnimating }) => useNProgress({ isAnimating }),
    { initialProps: { isAnimating: false } },
  )

  rerender({ isAnimating: true })

  expect(result.current).toEqual({
    animationDuration: 200,
    isFinished: false,
    progress: 0.1,
  })

  unmount()
})

test('increments correctly', () => {
  const { result, unmount } = renderHook(() =>
    useNProgress({ isAnimating: true }),
  )

  act(() => {
    mockRaf.step()
    mockRaf.step({ time: 201 })
  })

  expect(result.current).toEqual({
    animationDuration: 200,
    isFinished: false,
    progress: 0.2,
  })

  unmount()
})

test('animates to finish if isAnimating was changed from true to false', () => {
  const { result, rerender, unmount } = renderHook(
    ({ isAnimating }) => useNProgress({ isAnimating }),
    { initialProps: { isAnimating: true } },
  )

  rerender({ isAnimating: false })

  act(() => {
    mockRaf.step()
    mockRaf.step({ time: 201 })
  })

  expect(result.current).toEqual({
    animationDuration: 200,
    isFinished: true,
    progress: 1,
  })

  unmount()
})

test('correctly restarts a finished animation', () => {
  const { result, rerender, unmount } = renderHook(
    ({ isAnimating }) => useNProgress({ isAnimating }),
    { initialProps: { isAnimating: true } },
  )

  rerender({ isAnimating: false })

  act(() => {
    mockRaf.step()
    mockRaf.step({ time: 201 })
  })

  expect(result.current).toEqual({
    animationDuration: 200,
    isFinished: true,
    progress: 1,
  })

  rerender({ isAnimating: true })

  act(() => {
    mockRaf.step()
    mockRaf.step({ time: 201 })
  })

  expect(result.current).toEqual({
    animationDuration: 200,
    isFinished: false,
    progress: 0.2,
  })

  unmount()
})

test('respects custom minimum', () => {
  const { result, unmount } = renderHook(() =>
    useNProgress({ isAnimating: true, minimum: 0.3 }),
  )

  // increment(0) = 0.1, clamped to minimum of 0.3.
  expect(result.current.progress).toBe(0.3)

  unmount()
})

test('respects custom animationDuration', () => {
  const { result, rerender, unmount } = renderHook(
    ({ isAnimating }) => useNProgress({ animationDuration: 500, isAnimating }),
    { initialProps: { isAnimating: true } },
  )

  expect(result.current.animationDuration).toBe(500)

  rerender({ isAnimating: false })

  // Completion waits animationDuration (500ms) before isFinished.
  act(() => {
    mockRaf.step()
    mockRaf.step({ time: 300 })
  })

  expect(result.current.isFinished).toBe(false)

  act(() => {
    mockRaf.step()
    mockRaf.step({ time: 501 })
  })

  expect(result.current.isFinished).toBe(true)

  unmount()
})

// React 18 and 19 double-invoke renders and double-mount effects under
// StrictMode in development. The hook must behave identically there: the
// double-mount must not start a second animation, double-trickle, or leave a
// timer running.
test('stays idle under StrictMode when isAnimating is false', () => {
  const { result, unmount } = renderHook(() => useNProgress(), {
    wrapper: StrictMode,
  })

  expect(result.current).toEqual({
    animationDuration: 200,
    isFinished: true,
    progress: 0,
  })

  act(() => {
    mockRaf.step()
    mockRaf.step({ time: 201 })
  })

  expect(result.current).toEqual({
    animationDuration: 200,
    isFinished: true,
    progress: 0,
  })

  unmount()
})

test('starts and trickles once under StrictMode', () => {
  const { result, unmount } = renderHook(
    () => useNProgress({ isAnimating: true }),
    { wrapper: StrictMode },
  )

  expect(result.current).toEqual({
    animationDuration: 200,
    isFinished: false,
    progress: 0.1,
  })

  // A duplicate timer from the dev double-mount would trickle twice here,
  // taking progress to increment(0.2) = 0.24.
  act(() => {
    mockRaf.step()
    mockRaf.step({ time: 201 })
  })

  expect(result.current).toEqual({
    animationDuration: 200,
    isFinished: false,
    progress: 0.2,
  })

  unmount()
})

test('completes under StrictMode when isAnimating flips to false', () => {
  const { result, rerender, unmount } = renderHook(
    ({ isAnimating }) => useNProgress({ isAnimating }),
    { initialProps: { isAnimating: true }, wrapper: StrictMode },
  )

  rerender({ isAnimating: false })

  act(() => {
    mockRaf.step()
    mockRaf.step({ time: 201 })
  })

  expect(result.current).toEqual({
    animationDuration: 200,
    isFinished: true,
    progress: 1,
  })

  unmount()
})

test('leaves no timer running after unmount under StrictMode', () => {
  const { unmount } = renderHook(() => useNProgress({ isAnimating: true }), {
    wrapper: StrictMode,
  })

  act(() => {
    mockRaf.step()
    mockRaf.step({ time: 201 })
  })

  unmount()

  const requestsAfterUnmount = frameRequests

  act(() => {
    mockRaf.step()
    mockRaf.step({ time: 401 })
  })

  expect(frameRequests).toBe(requestsAfterUnmount)
})

test('respects custom incrementDuration', () => {
  const { result, unmount } = renderHook(() =>
    useNProgress({ incrementDuration: 500, isAnimating: true }),
  )

  expect(result.current.progress).toBe(0.1)

  // Not enough time for a second trickle.
  act(() => {
    mockRaf.step()
    mockRaf.step({ time: 201 })
  })

  expect(result.current.progress).toBe(0.1)

  // Enough time for the second trickle.
  act(() => {
    mockRaf.step()
    mockRaf.step({ time: 501 })
  })

  expect(result.current.progress).toBe(0.2)

  unmount()
})

// Options can change while an animation is running, for example when a
// consumer derives one from state. Doing so must not rewind the bar or stall
// the trickle.
test('keeps its place when minimum changes mid-animation', () => {
  const { result, rerender, unmount } = renderHook(
    ({ minimum }) => useNProgress({ isAnimating: true, minimum }),
    { initialProps: { minimum: 0.08 } },
  )

  act(() => {
    mockRaf.step()
    mockRaf.step({ time: 201 })
  })

  expect(result.current.progress).toBe(0.2)

  rerender({ minimum: 0.09 })

  // A `start` dispatch against a running animation is ignored, so progress
  // holds rather than dropping back to increment(0).
  expect(result.current.progress).toBe(0.2)

  unmount()
})

test('keeps trickling when animationDuration changes mid-animation', () => {
  const { result, rerender, unmount } = renderHook(
    ({ animationDuration }) =>
      useNProgress({ animationDuration, isAnimating: true }),
    { initialProps: { animationDuration: 200 } },
  )

  act(() => {
    mockRaf.step()
    mockRaf.step({ time: 201 })
  })

  expect(result.current.progress).toBe(0.2)

  // The animating phase does not read `animationDuration`, so changing it just
  // before the next trickle is due must not cancel the pending timer.
  act(() => {
    mockRaf.step({ time: 399 })
  })
  rerender({ animationDuration: 999 })
  act(() => {
    mockRaf.step({ time: 401 })
  })

  // increment(0.2) is 0.24 in decimal but 0.24000000000000002 in binary
  // floating point, so this is the one assertion in the file that cannot use
  // an exact match.
  expect(result.current.progress).toBeCloseTo(0.24, 10)

  unmount()
})

test('applies a new animationDuration to the completion it owns', () => {
  const { result, rerender, unmount } = renderHook(
    ({ animationDuration, isAnimating }) =>
      useNProgress({ animationDuration, isAnimating }),
    { initialProps: { animationDuration: 200, isAnimating: true } },
  )

  rerender({ animationDuration: 500, isAnimating: false })

  expect(result.current.progress).toBe(1)

  // The old 200ms duration would have finished by now.
  act(() => {
    mockRaf.step()
    mockRaf.step({ time: 201 })
  })

  expect(result.current.isFinished).toBe(false)

  act(() => {
    mockRaf.step()
    mockRaf.step({ time: 501 })
  })

  expect(result.current.isFinished).toBe(true)

  unmount()
})
