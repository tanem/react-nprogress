import './index.css'

import { Link, Location, RouteComponentProps, Router } from '@reach/router'
import { NProgress } from '@tanem/react-nprogress'
import React, { useState } from 'react'
import { render } from 'react-dom'
import { CSSTransition, TransitionGroup } from 'react-transition-group'

const App: React.FC = () => (
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

const Page: React.FC<RouteComponentProps<{ page: string }>> = ({ page }) => (
  <div
    className="page"
    style={{
      ...(typeof page === 'string'
        ? { background: `hsl(${parseInt(page, 10) * 75}, 60%, 60%)` }
        : {}),
    }}
  >
    {page}
  </div>
)

const Container: React.FC<{
  animationDuration: number
  isFinished: boolean
}> = ({ animationDuration, children, isFinished }) => (
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

const Bar: React.FC<{ animationDuration: number; progress: number }> = ({
  animationDuration,
  progress,
}) => (
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

const FadeTransitionRouter: React.FC = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false)

  return (
    <Location>
      {({ location }) => (
        <React.Fragment>
          <NProgress isAnimating={isLoading} key={location.key}>
            {({ animationDuration, isFinished, progress }) => (
              <Container
                animationDuration={animationDuration}
                isFinished={isFinished}
              >
                <Bar
                  animationDuration={animationDuration}
                  progress={progress}
                />
              </Container>
            )}
          </NProgress>
          <TransitionGroup className="transition-group">
            <CSSTransition
              classNames="fade"
              key={location.key}
              onEnter={() => {
                setIsLoading(true)
              }}
              onEntered={() => {
                setIsLoading(false)
              }}
              timeout={500}
            >
              <Router className="router" location={location}>
                {children}
              </Router>
            </CSSTransition>
          </TransitionGroup>
        </React.Fragment>
      )}
    </Location>
  )
}

render(<App />, document.getElementById('root'))
