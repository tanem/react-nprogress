import clamp from 'lodash/clamp'
import * as React from 'react'
import { increment } from './increment'
import { clear as clearQueue, queue } from './queue'
import { cancel as cancelCurrentTimeout, timeout } from './timeout'

export interface Props {
  children?: any // TODO: Fix typedef
  minimum: number
  play: boolean
  render?: any // TODO: Fix typedef
  speed: number
  trickleSpeed: number
}

export interface State {
  isFinished: boolean
  progress: number
}

class ReactNProgress extends React.Component<Props, State> {
  static defaultProps = {
    minimum: 0.08,
    play: false,
    speed: 200,
    trickleSpeed: 800
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
        }, this.props.trickleSpeed)
      })
    }

    work()
  }

  trickle() {
    this.set(increment(this.state.progress))
  }

  set(n: number) {
    n = clamp(n, this.props.minimum, 1)

    queue(next => {
      this.setState(
        () => ({ progress: n }),
        () => timeout(next, this.props.speed)
      )
    })

    if (n === 1) {
      queue(() => {
        this.setState(() => ({ isFinished: true }), () => this.cleanup())
      })
    }
  }

  cleanup() {
    cancelCurrentTimeout()
    clearQueue()
  }

  done() {
    this.set(1)
  }

  componentDidMount() {
    if (this.props.play) {
      this.start()
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.play && !this.props.play) {
      this.done()
    }

    if (!prevProps.play && this.props.play) {
      this.setState(() => this.initialState, () => this.start())
    }
  }

  componentWillUnmount() {
    this.cleanup()
  }

  render() {
    const { children, render, speed } = this.props
    const renderArg = { ...this.state, speed }

    return render ? render(renderArg) : children(renderArg)
  }
}

export default ReactNProgress
