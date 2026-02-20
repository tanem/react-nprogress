import { act, renderHook } from '@testing-library/react'
import createMockRaf from 'mock-raf'

import { useNProgress } from '../src'

const mockRaf = createMockRaf()
window.requestAnimationFrame = mockRaf.raf
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
