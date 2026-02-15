import { useNProgress } from '@tanem/react-nprogress'
import type { FC } from 'react'

import Bar from './Bar'
import Container from './Container'
import Spinner from './Spinner'

const Progress: FC<{ isAnimating: boolean }> = ({ isAnimating }) => {
  const { animationDuration, isFinished, progress } = useNProgress({
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
