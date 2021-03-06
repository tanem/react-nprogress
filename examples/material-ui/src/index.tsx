import Button from '@material-ui/core/Button'
import Container from '@material-ui/core/Container'
import { makeStyles } from '@material-ui/core/styles'
import React, { useState } from 'react'
import ReactDOM from 'react-dom'

import Progress from './Progress'

const useStyles = makeStyles({
  '@global': {
    body: {
      margin: 0,
    },
  },
  container: {
    alignItems: 'center',
    display: 'flex',
    height: '100vh',
    justifyContent: 'center',
  },
})

const App: React.FC = () => {
  const classes = useStyles()
  const [state, setState] = useState({
    isAnimating: false,
    key: 0,
  })

  return (
    <>
      <Progress isAnimating={state.isAnimating} key={state.key} />
      <Container classes={{ root: classes.container }}>
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

ReactDOM.render(<App />, document.getElementById('root'))
