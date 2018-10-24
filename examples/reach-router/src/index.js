import { Link, Location, Router } from '@reach/router'
import NProgress from '@tanem/react-nprogress'
import React from 'react'
import { render } from 'react-dom'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import Bar from './Bar'
import Container from './Container'
import './index.css'

// TODO: Think about to immediately execute the stop
// maybe have to clear up the "dead" time in the increment timer, in other words
// execute immediately after the "animationSpeed" timeout is done, hmm.

const App = () => (
  <div className="app">
    <nav className="nav">
      <Link to="/">Page 1</Link> <Link to="page/2">Page 2</Link>{' '}
      <Link to="page/3">Page 3</Link> <Link to="page/4">Page 4</Link>
    </nav>

    <FadeTransitionRouter>
      <Page path="/" page="1" />
      <Page path="page/:page" />
    </FadeTransitionRouter>
  </div>
)

class FadeTransitionRouter extends React.Component {
  state = {
    isLoading: false
  }

  // TODO: Get derived state from props? We don't want to show the spinner if
  // we just hit the same location again?
  // OR do we even care? github doesn't do that...
  // extract loader then use SCU to determine whether to re-render/re-instance?
  // return { hasPathnameChanged: blah }
  // OR can this be done down in the transition component
  // I.E: CAN WE SAY DONT SET LOADING IF LOCATION NOT CHANGING?

  render() {
    return (
      <Location>
        {({ location }) => (
          <React.Fragment>
            <NProgress isAnimating={this.state.isLoading} key={location.key}>
              {({ isFinished, progress, animationDuration }) => (
                <Container
                  isFinished={isFinished}
                  animationDuration={animationDuration}
                >
                  <Bar
                    progress={progress}
                    animationDuration={animationDuration}
                  />
                </Container>
              )}
            </NProgress>
            <TransitionGroup className="transition-group">
              <CSSTransition
                key={location.key}
                classNames="fade"
                timeout={500}
                onEnter={() => {
                  this.setState(() => ({
                    isLoading: true
                  }))
                }}
                onEntered={() => {
                  this.setState(() => ({
                    isLoading: false
                  }))
                }}
              >
                {/* the only difference between a router animation and
              any other animation is that you have to pass the
              location to the router so the old screen renders
              the "old location" */}
                <Router location={location} className="router">
                  {this.props.children}
                </Router>
              </CSSTransition>
            </TransitionGroup>
          </React.Fragment>
        )}
      </Location>
    )
  }
}

const Page = props => (
  <div
    className="page"
    style={{ background: `hsl(${props.page * 75}, 60%, 60%)` }}
  >
    {props.page}
  </div>
)

render(<App />, document.getElementById('root'))
