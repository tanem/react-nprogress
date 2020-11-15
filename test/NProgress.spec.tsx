import { render } from '@testing-library/react'
import * as React from 'react'
import { NProgress } from '../src'

test('receives render props', () => {
  let animationDuration
  let isFinished
  let progress

  render(
    <NProgress>
      {(props) => {
        animationDuration = props.animationDuration
        isFinished = props.isFinished
        progress = props.progress
        return <></>
      }}
    </NProgress>
  )

  expect(animationDuration).toBe(200)
  expect(isFinished).toBe(true)
  expect(progress).toBe(0)
})
