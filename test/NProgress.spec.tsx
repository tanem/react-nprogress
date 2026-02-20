import { render } from '@testing-library/react'

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
    </NProgress>,
  )

  expect(animationDuration).toBe(200)
  expect(isFinished).toBe(true)
  expect(progress).toBe(0)
})

test('passes animating state to children', () => {
  let isFinished
  let progress

  render(
    <NProgress isAnimating>
      {(props) => {
        isFinished = props.isFinished
        progress = props.progress
        return <></>
      }}
    </NProgress>,
  )

  expect(isFinished).toBe(false)
  expect(progress).toBe(0.1)
})
