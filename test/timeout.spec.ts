import createMockRaf from 'mock-raf'

import { createTimeout } from '../src/createTimeout'

const { cancel, schedule } = createTimeout()

const mockRaf = createMockRaf()

window.requestAnimationFrame = mockRaf.raf
window.cancelAnimationFrame = mockRaf.cancel

test('executes a callback after a delay', () => {
  const mockFn = jest.fn()
  schedule(mockFn, 10)
  mockRaf.step()
  mockRaf.step()
  expect(mockFn).toHaveBeenCalled()
})

test('can cancel a pending callback', () => {
  const mockFn = jest.fn()
  schedule(mockFn, 10)
  mockRaf.step()
  cancel()
  mockRaf.step()
  expect(mockFn).not.toHaveBeenCalled()
})
