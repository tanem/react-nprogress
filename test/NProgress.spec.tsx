import { mount, ReactWrapper } from 'enzyme'
import createMockRaf from 'mock-raf'
import * as React from 'react'
import { NProgress, Props, RenderProps, State } from '../src'

const mockRaf = createMockRaf()
window.requestAnimationFrame = mockRaf.raf
window.cancelAnimationFrame = mockRaf.cancel

const Child: React.SFC<RenderProps> = () => <div />

let wrapper: ReactWrapper<Props, State, NProgress>

afterEach(() => wrapper.unmount())

test('does not animate on mount if isAnimating is false', () => {
  wrapper = mount(
    <NProgress>{({ ...childProps }) => <Child {...childProps} />}</NProgress>
  )

  expect(wrapper.find(Child).props()).toEqual({
    animationDuration: wrapper.prop('animationDuration'),
    isFinished: false,
    progress: 0
  })
})

test('starts animating on mount if isAnimating is true', () => {
  wrapper = mount(
    <NProgress isAnimating>
      {({ ...childProps }) => <Child {...childProps} />}
    </NProgress>
  )

  expect(wrapper.find(Child).props()).toEqual({
    animationDuration: wrapper.prop('animationDuration'),
    isFinished: false,
    progress: 0.1
  })
})

test('starts animating on mount if isAnimating was changed from false to true', () => {
  wrapper = mount(
    <NProgress>{({ ...childProps }) => <Child {...childProps} />}</NProgress>
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
    <NProgress isAnimating>
      {({ ...childProps }) => <Child {...childProps} />}
    </NProgress>
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
    <NProgress isAnimating>
      {({ ...childProps }) => <Child {...childProps} />}
    </NProgress>
  )

  wrapper.setProps({ isAnimating: false })

  mockRaf.step()
  mockRaf.step({ time: wrapper.prop('animationDuration') + 1 })

  wrapper.update()

  expect(wrapper.find(Child).props()).toEqual({
    animationDuration: wrapper.prop('animationDuration'),
    isFinished: true,
    progress: 1
  })
})
