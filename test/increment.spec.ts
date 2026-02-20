import { increment } from '../src/increment'

test('increments correctly', () => {
  // Below zero.
  expect(increment(-1)).toBeCloseTo(0)

  // [0, 0.2): amount = 0.1.
  expect(increment(0)).toBeCloseTo(0.1)
  expect(increment(0.19)).toBeCloseTo(0.29)

  // [0.2, 0.5): amount = 0.04.
  expect(increment(0.2)).toBeCloseTo(0.24)
  expect(increment(0.49)).toBeCloseTo(0.53)

  // [0.5, 0.8): amount = 0.02.
  expect(increment(0.5)).toBeCloseTo(0.52)
  expect(increment(0.79)).toBeCloseTo(0.81)

  // [0.8, 0.99): amount = 0.005.
  expect(increment(0.8)).toBeCloseTo(0.805)
  expect(increment(0.989)).toBeCloseTo(0.994)

  // >= 0.99: amount = 0, clamped to 0.994.
  expect(increment(0.99)).toBeCloseTo(0.99)
  expect(increment(0.994)).toBeCloseTo(0.994)
  expect(increment(1)).toBeCloseTo(0.994)
})
