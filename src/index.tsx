import clamp from 'lodash/clamp'
import * as React from 'react'
import { polyfill } from 'react-lifecycles-compat'
import { Transition } from 'react-transition-group'
import Bar from './Bar'
import Container from './Container'
import Peg from './Peg'
import { clear as clearQueue, queue } from './queue'
import Spinner from './Spinner'
import { cancel as cancelCurrentTimeout, timeout } from './timeout'

// TODO: `set` API.

interface Props {
  ease: string
  isAnimating?: boolean
  minimum: number
  speed: number
  trickleSpeed: number
}

interface State {
  barStyle: React.CSSProperties
  containerStyle: React.CSSProperties
  lastNumber: number
}

class ReactNProgress extends React.Component<Props, State> {
  static defaultProps = {
    ease: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
    isAnimating: false,
    minimum: 0.08,
    speed: 200,
    trickleSpeed: 800
  }

  state = {
    barStyle: {
      marginLeft: 'auto'
    },
    containerStyle: {
      opacity: 1
    },
    lastNumber: 0
  }

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

  stop() {
    cancelCurrentTimeout()
    clearQueue()
  }

  trickle() {
    this.inc()
  }

  inc(amount?: number) {
    let { lastNumber } = this.state

    if (typeof amount !== 'number') {
      if (lastNumber >= 0 && lastNumber < 0.2) {
        amount = 0.1
      } else if (lastNumber >= 0.2 && lastNumber < 0.5) {
        amount = 0.04
      } else if (lastNumber >= 0.5 && lastNumber < 0.8) {
        amount = 0.02
      } else if (lastNumber >= 0.8 && lastNumber < 0.99) {
        amount = 0.005
      } else {
        amount = 0
      }
    }

    lastNumber = clamp(lastNumber + amount, 0, 0.994)

    this.set(lastNumber)
  }

  set(n: number) {
    const { minimum, speed } = this.props

    n = clamp(n, minimum, 1)

    queue(next => {
      this.setState(
        () => ({
          barStyle: {
            marginLeft: `${(-1 + n) * 100}%`
          },
          lastNumber: n
        }),
        () => timeout(next, speed)
      )
    })

    if (n === 1) {
      queue(() => {
        this.setState(
          () => ({
            containerStyle: {
              opacity: 0
            },
            lastNumber: n
          }),
          () => this.stop()
        )
      })
    }
  }

  done() {
    this.set(1)
  }

  componentDidUpdate(prevProps: Props) {
    if (!prevProps.isAnimating && this.props.isAnimating) {
      this.start()
    }

    /*
    if (prevProps.isAnimating && !this.props.isAnimating) {
      this.done()
    }
    */
  }

  componentDidMount() {
    if (this.props.isAnimating) {
      this.start()
    }
  }

  componentWillUnmount() {
    this.stop()
  }

  render() {
    return (
      <Transition
        in={this.props.isAnimating}
        timeout={this.props.speed}
        onExit={() => {
          this.done()
        }}
      >
        <Container
          ease={this.props.ease}
          opacity={this.state.containerStyle.opacity}
          speed={this.props.speed}
        >
          <Bar
            ease={this.props.ease}
            marginLeft={this.state.barStyle.marginLeft}
            speed={this.props.speed}
          >
            <Peg />
          </Bar>
          <Spinner />
        </Container>
      </Transition>
    )
  }
}

polyfill(ReactNProgress)

export default ReactNProgress
