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
  expect(mockFn).toHaveBeenCalledTimes(1)
})

test('can cancel a pending callback', () => {
  const mockFn = jest.fn()
  schedule(mockFn, 10)
  mockRaf.step()
  cancel()
  mockRaf.step()
  expect(mockFn).not.toHaveBeenCalled()
})

test('cancels a pending callback when rescheduling', () => {
  const mockFn1 = jest.fn()
  const mockFn2 = jest.fn()
  schedule(mockFn1, 10)
  mockRaf.step()
  schedule(mockFn2, 10)
  mockRaf.step()
  mockRaf.step()
  expect(mockFn1).not.toHaveBeenCalled()
  expect(mockFn2).toHaveBeenCalled()
})
