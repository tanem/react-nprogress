import React from 'react'
import ReactDOM from 'react-dom'
import ReactNProgress from 'react-nprogress'

const callFakeAPI = delay =>
  new Promise(resolve => {
    setTimeout(resolve, delay)
  })

class App extends React.Component {
  state = {
    isLoaded: false
  }

  async componentDidMount() {
    await callFakeAPI(3000)
    this.setState(() => ({
      isLoaded: true
    }))
  }

  render() {
    return (
      <React.Fragment>
        <ReactNProgress isAnimating={!this.state.isLoaded} />
        <h1>{this.state.isLoaded ? 'Loaded!' : 'Loading...'}</h1>
      </React.Fragment>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'))
