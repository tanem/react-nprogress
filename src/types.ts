export interface NProgressOptions {
  animationDuration?: number
  incrementDuration?: number
  isAnimating?: boolean
  minimum?: number
}

export interface NProgressState {
  animationDuration: number
  isFinished: boolean
  progress: number
}
