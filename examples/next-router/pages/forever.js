import React, { Component } from 'react'

export default class Forever extends Component {
  static async getInitialProps() {
    await new Promise((resolve) => {
      setTimeout(resolve, 3000)
    })
    return {}
  }

  render() {
    return <p>This page was rendered for a while!</p>
  }
}
