import './index.css'

import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'

import Progress from './Progress'

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
      <Progress isAnimating={isLoading} />
      <h1>{isLoading ? 'Loading...' : 'Loaded!'}</h1>
    </>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
