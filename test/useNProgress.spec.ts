import { act, renderHook } from '@testing-library/react-hooks'
import createMockRaf from 'mock-raf'
import { useNProgress } from '../src/useNProgress'

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
    useNProgress({ isAnimating: true })
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
    { initialProps: { isAnimating: false } }
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
    useNProgress({ isAnimating: true })
  )

  act(() => {
    mockRaf.step()
    mockRaf.step({ time: 201 })
    mockRaf.step()
    mockRaf.step({ time: 801 })
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
    { initialProps: { isAnimating: true } }
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
    { initialProps: { isAnimating: true } }
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
    mockRaf.step()
    mockRaf.step({ time: 801 })
  })

  expect(result.current).toEqual({
    animationDuration: 200,
    isFinished: false,
    progress: 0.2,
  })

  unmount()
})
