import { mount, ReactWrapper } from 'enzyme'
import createMockRaf from 'mock-raf'
import * as React from 'react'
import ReactNProgress, { Props, State } from '../src'

const mockRaf = createMockRaf()
window.requestAnimationFrame = mockRaf.raf
window.cancelAnimationFrame = mockRaf.cancel

const Child = () => <div />

let wrapper: ReactWrapper<Props, State, ReactNProgress>

afterEach(() => wrapper.unmount())

test('does not animate on mount if isAnimating is false', () => {
  wrapper = mount(
    <ReactNProgress>
      {({ ...childProps }) => <Child {...childProps} />}
    </ReactNProgress>
  )

  expect(wrapper.find(Child).props()).toEqual({
    animationDuration: wrapper.prop('animationDuration'),
    isFinished: false,
    progress: 0
  })
})

test('starts animating on mount if isAnimating is true', () => {
  wrapper = mount(
    <ReactNProgress isAnimating>
      {({ ...childProps }) => <Child {...childProps} />}
    </ReactNProgress>
  )

  expect(wrapper.find(Child).props()).toEqual({
    animationDuration: wrapper.prop('animationDuration'),
    isFinished: false,
    progress: 0.1
  })
})

test('starts animating on mount if isAnimating was changed from false to true', () => {
  wrapper = mount(
    <ReactNProgress>
      {({ ...childProps }) => <Child {...childProps} />}
    </ReactNProgress>
  )

  wrapper.setProps({ isAnimating: true })
  wrapper.update()

  expect(wrapper.find(Child).props()).toEqual({
    animationDuration: wrapper.prop('animationDuration'),
    isFinished: false,
    progress: 0.1
  })
})

test('increments correctly', () => {
  wrapper = mount(
    <ReactNProgress isAnimating>
      {({ ...childProps }) => <Child {...childProps} />}
    </ReactNProgress>
  )

  mockRaf.step()
  mockRaf.step({ time: wrapper.prop('animationDuration') + 1 })
  mockRaf.step()
  mockRaf.step({ time: wrapper.prop('incrementDuration') + 1 })

  wrapper.update()

  expect(wrapper.find(Child).props()).toEqual({
    animationDuration: wrapper.prop('animationDuration'),
    isFinished: false,
    progress: 0.2
  })
})

test('animates to finish if isAnimating was changed from true to false', () => {
  wrapper = mount(
    <ReactNProgress isAnimating>
      {({ ...childProps }) => <Child {...childProps} />}
    </ReactNProgress>
  )

  wrapper.setProps({ isAnimating: false })

  // Step through the two callbacks queued from the initial mount.
  mockRaf.step()
  mockRaf.step({ time: wrapper.prop('animationDuration') + 1 })
  mockRaf.step()
  mockRaf.step({ time: wrapper.prop('incrementDuration') + 1 })

  // Step through the callback that handles our finished state.
  mockRaf.step()
  mockRaf.step({ time: wrapper.prop('animationDuration') + 1 })

  wrapper.update()

  expect(wrapper.find(Child).props()).toEqual({
    animationDuration: wrapper.prop('animationDuration'),
    isFinished: true,
    progress: 1
  })
})
