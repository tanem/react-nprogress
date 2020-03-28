import { render } from '@testing-library/react'
import * as React from 'react'
import { withNProgress } from '../src'

test('wrapped component receives props', () => {
  let animationDuration
  let isFinished
  let progress

  const EnhancedComponent = withNProgress((props) => {
    animationDuration = props.animationDuration
    isFinished = props.isFinished
    progress = props.progress
    return <></>
  })

  render(<EnhancedComponent />)

  expect(animationDuration).toBe(200)
  expect(isFinished).toBe(false)
  expect(progress).toBe(0)
})
