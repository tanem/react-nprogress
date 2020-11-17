import { withNProgress } from '@tanem/react-nprogress'
import React from 'react'

import Bar from './Bar'
import Container from './Container'
import Spinner from './Spinner'

const Progress: React.FC<{
  animationDuration: number
  isFinished: boolean
  progress: number
}> = ({ isFinished, progress, animationDuration }) => (
  <Container isFinished={isFinished} animationDuration={animationDuration}>
    <Bar progress={progress} animationDuration={animationDuration} />
    <Spinner />
  </Container>
)

export default withNProgress(Progress)
