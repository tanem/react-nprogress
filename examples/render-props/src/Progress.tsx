import { NProgress } from '@tanem/react-nprogress'
import type { FC } from 'react'

import Bar from './Bar'
import Container from './Container'
import Spinner from './Spinner'

const Progress: FC<{ isAnimating: boolean }> = ({ isAnimating }) => (
  <NProgress isAnimating={isAnimating}>
    {({ animationDuration, isFinished, progress }) => (
      <Container animationDuration={animationDuration} isFinished={isFinished}>
        <Bar animationDuration={animationDuration} progress={progress} />
        <Spinner />
      </Container>
    )}
  </NProgress>
)

export default Progress
