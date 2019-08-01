import { withNProgress } from '@tanem/react-nprogress'
import PropTypes from 'prop-types'
import React from 'react'
import Bar from './Bar'
import Container from './Container'
import './index.css'
import Spinner from './Spinner'

const Progress = ({ isFinished, progress, animationDuration }) => (
  <Container isFinished={isFinished} animationDuration={animationDuration}>
    <Bar progress={progress} animationDuration={animationDuration} />
    <Spinner />
  </Container>
)

Progress.propTypes = {
  animationDuration: PropTypes.number.isRequired,
  isFinished: PropTypes.bool.isRequired,
  progress: PropTypes.number.isRequired
}

export default withNProgress(Progress)
