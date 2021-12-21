import { createQueue } from '../src/createQueue'

const { clear, enqueue } = createQueue()

jest.useFakeTimers()

test('starts running when the first callback is pushed onto the queue', () => {
  const mockFn = jest.fn()

  enqueue((next) => {
    mockFn()
    next()
  })

  expect(mockFn).toHaveBeenCalled()
})

test('executes callbacks in the queue sequentially', () => {
  const mockFn = jest.fn((str) => str)

  enqueue((next) => {
    setTimeout(() => {
      mockFn('first')
      next()
    }, 0)
  })
  enqueue((next) => {
    mockFn('second')
    next()
  })

  jest.runAllTimers()

  expect(mockFn).toHaveBeenNthCalledWith(1, 'first')
  expect(mockFn).toHaveBeenNthCalledWith(2, 'second')
})

test('can clear the queue', () => {
  const mockFn = jest.fn()

  enqueue((next) => setTimeout(next, 0))
  enqueue((next) => {
    mockFn()
    next()
  })

  clear()
  jest.runAllTimers()

  expect(mockFn).not.toHaveBeenCalled()
})
