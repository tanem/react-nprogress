import { increment } from '../src/increment'

test('increments corrrectly', () => {
  expect(increment(-1)).toBeCloseTo(0)
  expect(increment(0)).toBeCloseTo(0.1)
  expect(increment(0.2)).toBeCloseTo(0.24)
  expect(increment(0.5)).toBeCloseTo(0.52)
  expect(increment(0.8)).toBeCloseTo(0.805)
  expect(increment(1)).toBeCloseTo(0.994)
})
