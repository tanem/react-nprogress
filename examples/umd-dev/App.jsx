const callFakeAPI = delay =>
  new Promise(resolve => {
    setTimeout(resolve, delay)
  })

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: true
    }
  }

  componentDidMount() {
    callFakeAPI(3000).then(() => {
      this.setState(() => ({
        isLoading: false
      }))
    })
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

window.App = App
