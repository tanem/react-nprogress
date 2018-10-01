import { identity } from 'lodash'
import { clear, queue } from '../src/queue'

jest.useFakeTimers()

test('starts running when the first callback is pushed onto the queue', () => {
  const mockFn = jest.fn()

  queue(next => {
    mockFn()
    next()
  })

  expect(mockFn).toHaveBeenCalled()
})

test('executes callbacks in the queue sequentially', () => {
  const mockFn = jest.fn(identity)

  queue(next => {
    setTimeout(() => {
      mockFn('first')
      next()
    }, 0)
  })
  queue(next => {
    mockFn('second')
    next()
  })

  jest.runAllTimers()

  expect(mockFn).toHaveBeenNthCalledWith(1, 'first')
  expect(mockFn).toHaveBeenNthCalledWith(2, 'second')
})

test('can clear the queue', () => {
  const mockFn = jest.fn()

  queue(next => setTimeout(next, 0))
  queue(next => {
    mockFn()
    next()
  })

  clear()
  jest.runAllTimers()

  expect(mockFn).not.toHaveBeenCalled()
})
