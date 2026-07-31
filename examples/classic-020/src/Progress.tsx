import { useNProgress } from '@tanem/react-nprogress'
import type { FC } from 'react'

import Bar from './Bar'
import Container from './Container'
import Spinner from './Spinner'

// nprogress 0.2.0 trickles by `Math.random() * trickleRate`, then clamps the
// result to 0.994 so the bar never looks complete before it is.
const trickle = (progress: number) =>
  Math.min(progress + Math.random() * 0.02, 0.994)

const Progress: FC<{ isAnimating: boolean }> = ({ isAnimating }) => {
  const { animationDuration, isFinished, progress } = useNProgress({
    increment: trickle,
    // 0.2.0's trickleSpeed. The default of 200 is the master branch's.
    incrementDuration: 800,
    isAnimating,
  })

  return (
    <Container animationDuration={animationDuration} isFinished={isFinished}>
      <Bar animationDuration={animationDuration} progress={progress} />
      <Spinner />
    </Container>
  )
}

export default Progress
