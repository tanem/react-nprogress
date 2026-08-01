export interface NProgressOptions {
  animationDuration?: number
  increment?: (progress: number) => number
  incrementDuration?: number
  isAnimating?: boolean
  minimum?: number
}

export interface NProgressState {
  animationDuration: number
  isFinished: boolean
  progress: number
}
