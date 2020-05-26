import { clamp } from './clamp'

export const increment = (progress: number): number => {
  let amount = 0
  if (progress >= 0 && progress < 0.2) {
    amount = 0.1
  } else if (progress >= 0.2 && progress < 0.5) {
    amount = 0.04
  } else if (progress >= 0.5 && progress < 0.8) {
    amount = 0.02
  } else if (progress >= 0.8 && progress < 0.99) {
    amount = 0.005
  }

  return clamp(progress + amount, 0, 0.994)
}
