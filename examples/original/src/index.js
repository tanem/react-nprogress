import React from 'react'
import ReactDOM from 'react-dom'
import NProgress from 'react-nprogress'
import Bar from './Bar'
import Container from './Container'
import Spinner from './Spinner'

const callFakeAPI = delay =>
  new Promise(resolve => {
    setTimeout(resolve, delay)
  })

class App extends React.Component {
  state = {
    isLoading: true
  }

  async componentDidMount() {
    await callFakeAPI(3000)
    this.setState(() => ({
      isLoading: false
    }))
  }

  render() {
    return (
      <React.Fragment>
        <NProgress isAnimating={this.state.isLoading}>
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
        <h1>{this.state.isLoading ? 'Loading...' : 'Loaded!'}</h1>
      </React.Fragment>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'))
