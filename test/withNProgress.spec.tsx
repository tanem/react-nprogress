import { mount } from 'enzyme'
import createMockRaf from 'mock-raf'
import * as React from 'react'
import { NProgress, RenderProps, withNProgress } from '../src'

const mockRaf = createMockRaf()
window.requestAnimationFrame = mockRaf.raf
window.cancelAnimationFrame = mockRaf.cancel

// TODO: use test cases to prevent duplicating render prop tests?
// is it only the render method that will change?

const Child: React.SFC<RenderProps> = () => <div />

let wrapper: any
let EnhancedComponent: any

beforeEach(() => {
  EnhancedComponent = withNProgress(Child)
})

afterEach(() => wrapper.unmount())

test('does not animate on mount if isAnimating is false', () => {
  wrapper = mount(<EnhancedComponent />)

  expect(wrapper.find(Child).props()).toEqual({
    animationDuration: wrapper.find(NProgress).prop('animationDuration'),
    isFinished: false,
    progress: 0
  })
})

test('starts animating on mount if isAnimating is true', () => {
  wrapper = mount(<EnhancedComponent isAnimating />)

  expect(wrapper.find(Child).props()).toEqual({
    animationDuration: wrapper.find(NProgress).prop('animationDuration'),
    isAnimating: true,
    isFinished: false,
    progress: 0.1
  })
})

test('starts animating on mount if isAnimating was changed from false to true', () => {
  wrapper = mount(<EnhancedComponent />)

  wrapper.setProps({ isAnimating: true })
  wrapper.update()

  expect(wrapper.find(Child).props()).toEqual({
    animationDuration: wrapper.find(NProgress).prop('animationDuration'),
    isAnimating: true,
    isFinished: false,
    progress: 0.1
  })
})

test('increments correctly', () => {
  wrapper = mount(<EnhancedComponent isAnimating />)

  mockRaf.step()
  mockRaf.step({ time: wrapper.find(NProgress).prop('animationDuration') + 1 })
  mockRaf.step()
  mockRaf.step({ time: wrapper.find(NProgress).prop('incrementDuration') + 1 })

  wrapper.update()

  expect(wrapper.find(Child).props()).toEqual({
    animationDuration: wrapper.find(NProgress).prop('animationDuration'),
    isAnimating: true,
    isFinished: false,
    progress: 0.2
  })
})

test('animates to finish if isAnimating was changed from true to false', () => {
  wrapper = mount(<EnhancedComponent isAnimating />)

  wrapper.setProps({ isAnimating: false })

  mockRaf.step()
  mockRaf.step({ time: wrapper.find(NProgress).prop('animationDuration') + 1 })

  wrapper.update()

  expect(wrapper.find(Child).props()).toEqual({
    animationDuration: wrapper.find(NProgress).prop('animationDuration'),
    isAnimating: false,
    isFinished: true,
    progress: 1
  })
})
