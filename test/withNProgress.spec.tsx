import { mount } from 'enzyme'
import createMockRaf from 'mock-raf'
import * as React from 'react'
import { withNProgress } from '../src'

const mockRaf = createMockRaf()
window.requestAnimationFrame = mockRaf.raf
window.cancelAnimationFrame = mockRaf.cancel

const Child: React.SFC = () => <div />

let wrapper: any
const EnhancedComponent = withNProgress(Child)

afterEach(() => wrapper.unmount())

test('does not animate on mount if isAnimating is false', () => {
  wrapper = mount(<EnhancedComponent />)

  expect(wrapper.find(Child).props()).toEqual({
    animationDuration: wrapper.find(Child).prop('animationDuration'),
    isFinished: false,
    progress: 0
  })
})

test('starts animating on mount if isAnimating is true', () => {
  wrapper = mount(<EnhancedComponent isAnimating />)

  expect(wrapper.find(Child).props()).toEqual({
    animationDuration: 200,
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
    animationDuration: 200,
    isAnimating: true,
    isFinished: false,
    progress: 0.1
  })
})

test('increments correctly', () => {
  wrapper = mount(<EnhancedComponent isAnimating />)

  mockRaf.step()
  mockRaf.step({ time: 201 })
  mockRaf.step()
  mockRaf.step({ time: 801 })

  wrapper.update()

  expect(wrapper.find(Child).props()).toEqual({
    animationDuration: 200,
    isAnimating: true,
    isFinished: false,
    progress: 0.2
  })
})

test('animates to finish if isAnimating was changed from true to false', () => {
  wrapper = mount(<EnhancedComponent isAnimating />)

  wrapper.setProps({ isAnimating: false })

  mockRaf.step()
  mockRaf.step({ time: 201 })

  wrapper.update()

  expect(wrapper.find(Child).props()).toEqual({
    animationDuration: 200,
    isAnimating: false,
    isFinished: true,
    progress: 1
  })
})
