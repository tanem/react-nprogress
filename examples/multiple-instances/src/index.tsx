import './index.css'

import React, { useState } from 'react'
import ReactDOM from 'react-dom'

import Progress from './Progress'

const A: React.FC = () => {
  const [state, setState] = useState({
    isAnimating: false,
    key: 0,
  })

  return (
    <div style={{ left: 0, position: 'absolute', right: 0, top: 0 }}>
      <Progress
        isAnimating={state.isAnimating}
        key={state.key}
        position="top"
      />
      <button
        onClick={() => {
          setState((prevState) => ({
            isAnimating: !prevState.isAnimating,
            key: prevState.isAnimating ? prevState.key : prevState.key ^ 1,
          }))
        }}
      >
        {state.isAnimating ? 'Stop A' : 'Start A'}
      </button>
    </div>
  )
}

const B: React.FC = () => {
  const [state, setState] = useState({
    isAnimating: false,
    key: 0,
  })

  return (
    <div style={{ left: 0, position: 'absolute', right: 0, top: 100 }}>
      <Progress
        isAnimating={state.isAnimating}
        key={state.key}
        position="bottom"
      />
      <button
        onClick={() => {
          setState((prevState) => ({
            isAnimating: !prevState.isAnimating,
            key: prevState.isAnimating ? prevState.key : prevState.key ^ 1,
          }))
        }}
      >
        {state.isAnimating ? 'Stop B' : 'Start B'}
      </button>
    </div>
  )
}

const App: React.FC = () => (
  <>
    <A />
    <B />
  </>
)

ReactDOM.render(<App />, document.getElementById('root'))
