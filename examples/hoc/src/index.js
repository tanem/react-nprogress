import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import Progress from './Progress'

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
        <Progress isAnimating={this.state.isLoading} />
        <h1>{this.state.isLoading ? 'Loading...' : 'Loaded!'}</h1>
      </React.Fragment>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'))
