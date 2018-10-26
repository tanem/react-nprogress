import * as PropTypes from 'prop-types'
import * as React from 'react'
import { clamp } from './clamp'
import { increment } from './increment'
import { clear as clearQueue, queue } from './queue'
import { cancel as cancelCurrentTimeout, timeout } from './timeout'

export interface Props {
  animationDuration: number
  children: (renderProps: RenderProps) => React.ReactNode
  incrementDuration: number
  isAnimating: boolean
  minimum: number
}

export interface State {
  isFinished: boolean
  progress: number
}

export type RenderProps = State & Pick<Props, 'animationDuration'>

class ReactNProgress extends React.Component<Props, State> {
  static defaultProps = {
    animationDuration: 200,
    incrementDuration: 800,
    isAnimating: false,
    minimum: 0.08
  }

  static propTypes = {
    animationDuration: PropTypes.number,
    children: PropTypes.func,
    incrementDuration: PropTypes.number,
    isAnimating: PropTypes.bool,
    minimum: PropTypes.number
  }

  initialState = {
    isFinished: false,
    progress: 0
  }

  state = this.initialState

  start() {
    const work = () => {
      this.trickle()
      queue(next => {
        timeout(() => {
          work()
          next()
        }, this.props.incrementDuration)
      })
    }

    work()
  }

  trickle() {
    this.set(increment(this.state.progress))
  }

  set(n: number) {
    n = clamp(n, this.props.minimum, 1)

    if (n === 1) {
      this.cleanup()

      queue(next => {
        this.setState(
          () => ({ progress: n }),
          () => timeout(next, this.props.animationDuration)
        )
      })

      queue(() => {
        this.setState(() => ({ isFinished: true }), this.cleanup)
      })

      return
    }

    queue(next => {
      this.setState(
        () => ({ progress: n }),
        () => timeout(next, this.props.animationDuration)
      )
    })
  }

  cleanup() {
    cancelCurrentTimeout()
    clearQueue()
  }

  done() {
    this.set(1)
  }

  componentDidMount() {
    if (this.props.isAnimating) {
      this.start()
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.isAnimating && !this.props.isAnimating) {
      this.done()
    }

    if (!prevProps.isAnimating && this.props.isAnimating) {
      this.setState(() => this.initialState, () => this.start())
    }
  }

  componentWillUnmount() {
    this.cleanup()
  }

  render() {
    return this.props.children({
      ...this.state,
      animationDuration: this.props.animationDuration
    })
  }
}

export default ReactNProgress
