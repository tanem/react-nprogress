import './index.css'

import { NProgress } from '@tanem/react-nprogress'
import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'

import Bar from './Bar'
import Container from './Container'
import Spinner from './Spinner'

const callFakeAPI = (delay: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, delay)
  })

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      await callFakeAPI(3000)
      setIsLoading(false)
    })()
  }, [])

  return (
    <>
      <NProgress isAnimating={isLoading}>
        {({ isFinished, progress, animationDuration }) => (
          <Container
            isFinished={isFinished}
            animationDuration={animationDuration}
          >
            <Bar progress={progress} animationDuration={animationDuration} />
            <Spinner />
          </Container>
        )}
      </NProgress>
      <h1>{isLoading ? 'Loading...' : 'Loaded!'}</h1>
    </>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
