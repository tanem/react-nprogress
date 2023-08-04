import './index.css'

import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'

import Progress from './Progress'

const App = () => {
  const [state, setState] = useState({
    isAnimating: false,
    key: 0,
  })

  return (
    <>
      <Progress isAnimating={state.isAnimating} key={state.key} />
      <button
        onClick={() => {
          setState((prevState) => ({
            isAnimating: !prevState.isAnimating,
            key: prevState.isAnimating ? prevState.key : prevState.key ^ 1,
          }))
        }}
      >
        {state.isAnimating ? 'Stop' : 'Start'}
      </button>
    </>
  )
}

const container = document.getElementById('root')
const root = createRoot(container)
root.render(<App />)
