import './index.css'

import { useNProgress } from '@tanem/react-nprogress'
import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import {
  BrowserRouter as Router,
  Link,
  NavLinkProps,
  Redirect,
  Route,
  RouteComponentProps,
  Switch,
} from 'react-router-dom'
import { CSSTransition, TransitionGroup } from 'react-transition-group'

import Bar from './Bar'
import Container from './Container'

const styles: { [key: string]: React.CSSProperties } = {}

styles.fill = {
  bottom: 0,
  left: 0,
  position: 'absolute',
  right: 0,
  top: 0,
}

styles.content = {
  ...styles.fill,
  textAlign: 'center',
  top: '40px',
}

styles.nav = {
  display: 'flex',
  height: '40px',
  margin: 0,
  padding: 0,
  position: 'absolute',
  top: 0,
  width: '100%',
}

styles.navItem = {
  flex: 1,
  listStyleType: 'none',
  padding: '10px',
  textAlign: 'center',
}

styles.hsl = {
  ...styles.fill,
  color: 'white',
  fontSize: '30px',
  paddingTop: '20px',
}

styles.rgb = {
  ...styles.fill,
  color: 'white',
  fontSize: '30px',
  paddingTop: '20px',
}

const NavLink: React.FC<NavLinkProps> = (props) => (
  <li style={styles.navItem}>
    <Link {...props} style={{ color: 'inherit' }} />
  </li>
)

const HSL: React.FC<
  RouteComponentProps<{
    h: string
    s: string
    l: string
  }>
> = ({ match: { params } }) => (
  <div
    style={{
      ...styles.fill,
      ...styles.hsl,
      background: `hsl(${params.h}, ${params.s}%, ${params.l}%)`,
    }}
  >
    hsl(
    {params.h}, {params.s}
    %, {params.l}
    %)
  </div>
)

const RGB: React.FC<
  RouteComponentProps<{
    r: string
    g: string
    b: string
  }>
> = ({ match: { params } }) => (
  <div
    style={{
      ...styles.fill,
      ...styles.rgb,
      background: `rgb(${params.r}, ${params.g}, ${params.b})`,
    }}
  >
    rgb(
    {params.r}, {params.g}, {params.b})
  </div>
)

const Progress: React.FC<{ isAnimating: boolean }> = ({ isAnimating }) => {
  const { animationDuration, isFinished, progress } = useNProgress({
    isAnimating,
  })

  return (
    <Container animationDuration={animationDuration} isFinished={isFinished}>
      <Bar animationDuration={animationDuration} progress={progress} />
      {/*
      This example doesn't use a spinner component so the UI stays
      tidy. You're free to render whatever is appropriate for your
      use-case.
      */}
    </Container>
  )
}

const AnimationExample: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false)

  return (
    <Router>
      <Route
        render={({ location }) => (
          <>
            {/*
            Setting a key means that a new NProgress instance is created if
            the location is changing, giving us the UI behaviour we want. See:
            https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key.
            */}
            <Progress isAnimating={isLoading} key={location.key} />
            <div style={styles.fill}>
              <Route
                exact
                path="/"
                render={() => <Redirect to="/hsl/10/90/50" />}
              />
              <ul style={styles.nav}>
                <NavLink to="/hsl/10/90/50">Red</NavLink>
                <NavLink to="/hsl/120/100/40">Green</NavLink>
                <NavLink to="/rgb/33/150/243">Blue</NavLink>
                <NavLink to="/rgb/240/98/146">Pink</NavLink>
              </ul>
              <div style={styles.content}>
                <TransitionGroup>
                  {/*
                  Timeout has been increased by 4x from the original version
                  for demo purposes.
                  */}
                  <CSSTransition
                    classNames="fade"
                    key={location.key}
                    onEnter={() => {
                      setIsLoading(true)
                    }}
                    onEntered={() => {
                      setIsLoading(false)
                    }}
                    timeout={1200}
                  >
                    <Switch location={location}>
                      <Route component={HSL} exact path="/hsl/:h/:s/:l" />
                      <Route component={RGB} exact path="/rgb/:r/:g/:b" />
                      <Route render={() => <div>Not Found</div>} />
                    </Switch>
                  </CSSTransition>
                </TransitionGroup>
              </div>
            </div>
          </>
        )}
      />
    </Router>
  )
}

ReactDOM.render(<AnimationExample />, document.getElementById('root'))
