import './index.css'

import { NProgress } from '@tanem/react-nprogress'
import PropTypes from 'prop-types'
import React from 'react'
import ReactDOM from 'react-dom'
import {
  BrowserRouter as Router,
  Link,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom'
import { CSSTransition, TransitionGroup } from 'react-transition-group'

import Bar from './Bar'
import Container from './Container'

const styles = {}

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

function NavLink(props) {
  return (
    <li style={styles.navItem}>
      <Link {...props} style={{ color: 'inherit' }} />
    </li>
  )
}

function HSL({ match: { params } }) {
  return (
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
}

HSL.propTypes = {
  match: PropTypes.object.isRequired,
}

function RGB({ match: { params } }) {
  return (
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
}

RGB.propTypes = {
  match: PropTypes.object.isRequired,
}

class AnimationExample extends React.Component {
  state = {
    isLoading: false,
  }

  render() {
    return (
      <Router>
        <Route
          render={({ location }) => (
            <React.Fragment>
              {/*
              Setting a key means that a new NProgress instance is created if
              the location is changing, giving us the UI behaviour we want. See:
              https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key.
              */}
              <NProgress isAnimating={this.state.isLoading} key={location.key}>
                {({ isFinished, progress, animationDuration }) => (
                  <Container
                    animationDuration={animationDuration}
                    isFinished={isFinished}
                  >
                    <Bar
                      animationDuration={animationDuration}
                      progress={progress}
                    />
                    {/*
                    This example doesn't use a spinner component so the UI stays
                    tidy. You're free to render whatever is appropriate for your
                    use-case.
                    */}
                  </Container>
                )}
              </NProgress>
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
                        this.setState(() => ({
                          isLoading: true,
                        }))
                      }}
                      onEntered={() => {
                        this.setState(() => ({
                          isLoading: false,
                        }))
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
            </React.Fragment>
          )}
        />
      </Router>
    )
  }
}

ReactDOM.render(<AnimationExample />, document.getElementById('root'))
