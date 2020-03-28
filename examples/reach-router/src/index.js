import { Link, Location, Router } from '@reach/router'
import { NProgress } from '@tanem/react-nprogress'
import PropTypes from 'prop-types'
import React from 'react'
import { render } from 'react-dom'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import './index.css'

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

const Page = (props) => (
  <div
    className="page"
    style={{ background: `hsl(${props.page * 75}, 60%, 60%)` }}
  >
    {props.page}
  </div>
)

Page.propTypes = {
  page: PropTypes.string.isRequired,
}

const Container = ({ children, isFinished, animationDuration }) => (
  <div
    style={{
      opacity: isFinished ? 0 : 1,
      pointerEvents: 'none',
      transition: `opacity ${animationDuration}ms linear`,
    }}
  >
    {children}
  </div>
)

Container.propTypes = {
  animationDuration: PropTypes.number.isRequired,
  children: PropTypes.node.isRequired,
  isFinished: PropTypes.bool.isRequired,
}

const Bar = ({ progress, animationDuration }) => (
  <div
    style={{
      background: '#29d',
      height: 2,
      left: 0,
      marginLeft: `${(-1 + progress) * 100}%`,
      position: 'fixed',
      top: 0,
      transition: `margin-left ${animationDuration}ms linear`,
      width: '100%',
      zIndex: 1031,
    }}
  >
    <div
      style={{
        boxShadow: '0 0 10px #29d, 0 0 5px #29d',
        display: 'block',
        height: '100%',
        opacity: 1,
        position: 'absolute',
        right: 0,
        transform: 'rotate(3deg) translate(0px, -4px)',
        width: 100,
      }}
    />
  </div>
)

Bar.propTypes = {
  animationDuration: PropTypes.number.isRequired,
  progress: PropTypes.number.isRequired,
}

class FadeTransitionRouter extends React.Component {
  propTypes = {
    children: PropTypes.node,
  }

  state = {
    isLoading: false,
  }

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
                    isLoading: true,
                  }))
                }}
                onEntered={() => {
                  this.setState(() => ({
                    isLoading: false,
                  }))
                }}
              >
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

render(<App />, document.getElementById('root'))
