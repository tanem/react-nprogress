import { NProgress } from '@tanem/react-nprogress'
import React from 'react'
import ReactDOM from 'react-dom'
import {
  BrowserRouter as Router,
  Link,
  Redirect,
  Route,
  Switch
} from 'react-router-dom'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import Bar from './Bar'
import Container from './Container'
import './index.css'

class AnimationExample extends React.Component {
  state = {
    isLoading: false
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
                    isFinished={isFinished}
                    animationDuration={animationDuration}
                  >
                    <Bar
                      progress={progress}
                      animationDuration={animationDuration}
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
                      key={location.key}
                      classNames="fade"
                      timeout={1200}
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
                      <Switch location={location}>
                        <Route exact path="/hsl/:h/:s/:l" component={HSL} />
                        <Route exact path="/rgb/:r/:g/:b" component={RGB} />
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
        background: `hsl(${params.h}, ${params.s}%, ${params.l}%)`
      }}
    >
      hsl(
      {params.h}, {params.s}
      %, {params.l}
      %)
    </div>
  )
}

function RGB({ match: { params } }) {
  return (
    <div
      style={{
        ...styles.fill,
        ...styles.rgb,
        background: `rgb(${params.r}, ${params.g}, ${params.b})`
      }}
    >
      rgb(
      {params.r}, {params.g}, {params.b})
    </div>
  )
}

const styles = {}

styles.fill = {
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0
}

styles.content = {
  ...styles.fill,
  top: '40px',
  textAlign: 'center'
}

styles.nav = {
  padding: 0,
  margin: 0,
  position: 'absolute',
  top: 0,
  height: '40px',
  width: '100%',
  display: 'flex'
}

styles.navItem = {
  textAlign: 'center',
  flex: 1,
  listStyleType: 'none',
  padding: '10px'
}

styles.hsl = {
  ...styles.fill,
  color: 'white',
  paddingTop: '20px',
  fontSize: '30px'
}

styles.rgb = {
  ...styles.fill,
  color: 'white',
  paddingTop: '20px',
  fontSize: '30px'
}

ReactDOM.render(<AnimationExample />, document.getElementById('root'))
