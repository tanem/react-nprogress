import './index.css'

import React, { useState } from 'react'
import ReactDOM from 'react-dom'

import Progress from './Progress'

const App: React.FC = () => {
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

ReactDOM.render(<App />, document.getElementById('root'))
