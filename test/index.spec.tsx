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

test('handles render prop', () => {
  wrapper = mount(
    <ReactNProgress render={({ ...childProps }) => <Child {...childProps} />} />
  )

  expect(wrapper.find(Child).props()).toEqual({
    isFinished: false,
    progress: 0,
    speed: wrapper.prop('speed')
  })
})

test('does not animate on mount if play is false', () => {
  wrapper = mount(
    <ReactNProgress>
      {({ ...childProps }) => <Child {...childProps} />}
    </ReactNProgress>
  )

  expect(wrapper.find(Child).props()).toEqual({
    isFinished: false,
    progress: 0,
    speed: wrapper.prop('speed')
  })
})

test('starts animating on mount if play is true', () => {
  wrapper = mount(
    <ReactNProgress play>
      {({ ...childProps }) => <Child {...childProps} />}
    </ReactNProgress>
  )

  expect(wrapper.find(Child).props()).toEqual({
    isFinished: false,
    progress: 0.1,
    speed: wrapper.prop('speed')
  })
})

test('starts animating on mount if play was changed from false to true', () => {
  wrapper = mount(
    <ReactNProgress>
      {({ ...childProps }) => <Child {...childProps} />}
    </ReactNProgress>
  )

  wrapper.setProps({ play: true })
  wrapper.update()

  expect(wrapper.find(Child).props()).toEqual({
    isFinished: false,
    progress: 0.1,
    speed: wrapper.prop('speed')
  })
})

test('increments correctly', () => {
  wrapper = mount(
    <ReactNProgress play>
      {({ ...childProps }) => <Child {...childProps} />}
    </ReactNProgress>
  )

  mockRaf.step()
  mockRaf.step({ time: wrapper.prop('speed') + 1 })
  mockRaf.step()
  mockRaf.step({ time: wrapper.prop('trickleSpeed') + 1 })

  wrapper.update()

  expect(wrapper.find(Child).props()).toEqual({
    isFinished: false,
    progress: 0.2,
    speed: wrapper.prop('speed')
  })
})

test('animates to finish if play was changed from true to false', () => {
  wrapper = mount(
    <ReactNProgress play>
      {({ ...childProps }) => <Child {...childProps} />}
    </ReactNProgress>
  )

  wrapper.setProps({ play: false })

  // Step through the two callbacks queued from the initial mount.
  mockRaf.step()
  mockRaf.step({ time: wrapper.prop('speed') + 1 })
  mockRaf.step()
  mockRaf.step({ time: wrapper.prop('trickleSpeed') + 1 })

  // Step through the callback that handles our finished state.
  mockRaf.step()
  mockRaf.step({ time: wrapper.prop('speed') + 1 })

  wrapper.update()

  expect(wrapper.find(Child).props()).toEqual({
    isFinished: true,
    progress: 1,
    speed: wrapper.prop('speed')
  })
})
