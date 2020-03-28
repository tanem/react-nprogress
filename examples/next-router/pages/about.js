import React, { Component } from 'react'

export default class About extends Component {
  static async getInitialProps() {
    await new Promise((resolve) => {
      setTimeout(resolve, 500)
    })
    return {}
  }

  render() {
    return <p>This is about Next!</p>
  }
}
