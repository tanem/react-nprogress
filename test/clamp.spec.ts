import { clamp } from '../src/clamp'

test('clamps between lower and upper', () => {
  expect(clamp(-1, 0, 1)).toBe(0)
  expect(clamp(0.5, 0, 1)).toBe(0.5)
  expect(clamp(2, 0, 1)).toBe(1)
})
