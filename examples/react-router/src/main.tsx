import './index.css'

import { useNProgress } from '@tanem/react-nprogress'
import type { CSSProperties, FC, ReactNode } from 'react'
import { useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import {
  BrowserRouter as Router,
  Link,
  Route,
  Routes,
  useLocation,
  useParams,
} from 'react-router-dom'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import type { CSSTransitionProps } from 'react-transition-group/CSSTransition'

import Bar from './Bar'
import Container from './Container'

const styles: { [key: string]: CSSProperties } = {}

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

const NavLink: FC<{ children: ReactNode; to: string }> = ({ children, to }) => (
  <li style={styles.navItem}>
    <Link style={{ color: 'inherit' }} to={to}>
      {children}
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

const Progress: FC<{ isAnimating: boolean }> = ({ isAnimating }) => {
  const { animationDuration, isFinished, progress } = useNProgress({
    isAnimating,
  })

  return (
    <Container animationDuration={animationDuration} isFinished={isFinished}>
      <Bar animationDuration={animationDuration} progress={progress} />
    </Container>
  )
}

// `nodeRef` has to resolve to a mounted DOM node, and `<Routes>` cannot take a
// ref, so the transition owns a wrapper element to point at. It also has to be
// a fresh ref per `key`, which is why this is a component rather than a ref
// held by `Home`. With an unresolved ref, react-transition-group ends the
// transition on the next tick: the fade classes never apply and `onEntered`
// fires immediately, so the progress bar completes on click instead of over
// `timeout`. TransitionGroup clones its children with the props it manages, so
// everything else is forwarded through.
const Fade: FC<
  {
    children: ReactNode
    onEnter(): void
    onEntered(): void
  } & Pick<
    CSSTransitionProps<HTMLDivElement>,
    'appear' | 'enter' | 'exit' | 'in' | 'onExited'
  >
> = ({ children, onEnter, onEntered, ...managed }) => {
  const nodeRef = useRef<HTMLDivElement>(null)

  return (
    <CSSTransition
      {...managed}
      classNames="fade"
      nodeRef={nodeRef}
      onEnter={onEnter}
      onEntered={onEntered}
      // Timeout has been increased by 4x from the original version for demo
      // purposes.
      timeout={1200}
    >
      <div ref={nodeRef}>{children}</div>
    </CSSTransition>
  )
}

const Home = () => {
  const [isLoading, setIsLoading] = useState(false)
  const location = useLocation()

  return (
    <>
      {/*
      A key change creates a new NProgress instance, resetting progress
      when the location changes. See:
      https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key.
      Remounting is also what makes the bar re-enter from the left on the
      next navigation, rather than animating backwards from where the last
      one finished.
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
            <Fade
              key={location.key}
              onEnter={() => {
                setIsLoading(true)
              }}
              onEntered={() => {
                setIsLoading(false)
              }}
            >
              <Routes location={location}>
                <Route element={<HSL home={true} />} path="/" />
                <Route element={<HSL />} path="/hsl/:h/:s/:l" />
                <Route element={<RGB />} path="/rgb/:r/:g/:b" />
                <Route element={<div>Not Found</div>} path="*" />
              </Routes>
            </Fade>
          </TransitionGroup>
        </div>
      </div>
    </>
  )
}

const AnimationExample = () => {
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
