export const clamp = (num: number, lower: number, upper: number): number => {
  num = num <= upper ? num : upper
  num = num >= lower ? num : lower
  return num
}
