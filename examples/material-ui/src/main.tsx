import { GlobalStyles } from '@mui/material'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import { useState } from 'react'
import { createRoot } from 'react-dom/client'

import Progress from './Progress'

const App = () => {
  const [state, setState] = useState({
    isAnimating: false,
    key: 0,
  })

  return (
    <>
      <GlobalStyles
        styles={{
          body: {
            margin: 0,
          },
        }}
      />
      <Progress isAnimating={state.isAnimating} key={state.key} />
      <Container
        sx={{
          alignItems: 'center',
          display: 'flex',
          height: '100vh',
          justifyContent: 'center',
        }}
      >
        <Button
          onClick={() => {
            setState((prevState) => ({
              isAnimating: !prevState.isAnimating,
              key: prevState.isAnimating ? prevState.key : prevState.key ^ 1,
            }))
          }}
          variant="contained"
        >
          {state.isAnimating ? 'Stop' : 'Start'}
        </Button>
      </Container>
    </>
  )
}

const container = document.getElementById('root')
const root = createRoot(container!)
root.render(<App />)
