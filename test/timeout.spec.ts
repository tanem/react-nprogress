import createMockRaf from 'mock-raf'
import { cancel, timeout } from '../src/timeout'

const mockRaf = createMockRaf()

window.requestAnimationFrame = mockRaf.raf
window.cancelAnimationFrame = mockRaf.cancel

test('executes a callback after a delay', () => {
  const mockFn = jest.fn()
  timeout(mockFn, 10)
  mockRaf.step()
  mockRaf.step()
  expect(mockFn).toHaveBeenCalled()
})

test('can cancel a pending callback', () => {
  const mockFn = jest.fn()
  timeout(mockFn, 10)
  mockRaf.step()
  cancel()
  mockRaf.step()
  expect(mockFn).not.toHaveBeenCalled()
})
