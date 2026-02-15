import { useNProgress } from '@tanem/react-nprogress'
import type { FC } from 'react'

import Bar from './Bar'
import Container from './Container'

const Progress: FC<{
  isAnimating: boolean
  position: 'top' | 'bottom'
}> = ({ isAnimating }) => {
  const { animationDuration, isFinished, progress } = useNProgress({
    isAnimating,
  })

  return (
    <Container animationDuration={animationDuration} isFinished={isFinished}>
      <Bar animationDuration={animationDuration} progress={progress} />
    </Container>
  )
}

export default Progress
