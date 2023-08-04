import './index.css'

import { useNProgress } from '@tanem/react-nprogress'
import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'
import {
  BrowserRouter as Router,
  Link,
  NavLinkProps,
  Route,
  Routes,
  useLocation,
  useParams,
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
    <Link style={{ color: 'inherit' }} to={props.to}>
      {props.children}
    </Link>
  </li>
)

const HSL = ({ home = false }: { home?: boolean }) => {
  const params = useParams()
  return (
    <div
      style={{
        ...styles.fill,
        ...styles.hsl,
        background: home
          ? `hsl(10, 90%, 50%)`
          : `hsl(${params.h}, ${params.s}%, ${params.l}%)`,
      }}
    >
      {home
        ? `hsl( 10, 90 %, 50 %)`
        : `hsl(
			${params.h}, ${params.s}
			%, ${params.l}
			%)`}
    </div>
  )
}

const RGB = () => {
  const params = useParams()
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

const Home = () => {
  const [isLoading, setIsLoading] = useState(false)
  const location = useLocation()

  return (
    <>
      {/*
      Setting a key means that a new NProgress instance is created if
      the location is changing, giving us the UI behaviour we want. See:
      https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key.
      */}
      <Progress isAnimating={isLoading} key={location.key} />
      <div style={styles.fill}>
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
              <Routes location={location}>
                <Route element={<HSL home={true} />} path="/" />
                <Route element={<HSL />} path="/hsl/:h/:s/:l" />
                <Route element={<RGB />} path="/rgb/:r/:g/:b" />
                <Route element={<div>Not Found</div>} path="*" />
              </Routes>
            </CSSTransition>
          </TransitionGroup>
        </div>
      </div>
    </>
  )
}

const AnimationExample: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route element={<Home />} path="*" />
      </Routes>
    </Router>
  )
}

const container = document.getElementById('root')
const root = createRoot(container!)
root.render(<AnimationExample />)
