import './index.css'

import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'

import Progress from './Progress'

const callFakeAPI = (delay) =>
  new Promise((resolve) => {
    setTimeout(resolve, delay)
  })

const App = () => {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      await callFakeAPI(3000)
      setIsLoading(false)
    })()
  }, [])

  return (
    <React.Fragment>
      <Progress isAnimating={isLoading} />
      <h1>{isLoading ? 'Loading...' : 'Loaded!'}</h1>
    </React.Fragment>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
