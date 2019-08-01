import App, { Container } from 'next/app'
import Link from 'next/link'
import React from 'react'
import uuidv4 from 'uuid/v4'
import Loading from '../components/Loading'

const linkStyle = {
  margin: '0 10px 0 0'
}

export default class MyApp extends App {
  state = {
    isRouteChanging: false,
    loadingKey: null
  }

  static async getInitialProps({ Component, ctx }) {
    let pageProps = {}

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    return { pageProps }
  }

  componentDidMount() {
    const { router } = this.props

    const routeChangeStartHandler = () => {
      this.setState(() => ({
        isRouteChanging: true,
        loadingKey: uuidv4().substr(0, 8)
      }))
    }

    const routeChangeEndHandler = () => {
      this.setState(() => ({
        isRouteChanging: false
      }))
    }

    router.events.on('routeChangeStart', routeChangeStartHandler)
    router.events.on('routeChangeComplete', routeChangeEndHandler)
    router.events.on('routeChangeError', routeChangeEndHandler)
  }

  render() {
    const { Component, pageProps } = this.props
    return (
      <Container>
        <Loading {...this.state} />
        <div style={{ marginBottom: 20 }}>
          <Link href="/">
            <a style={linkStyle}>Home</a>
          </Link>
          <Link href="/about">
            <a style={linkStyle}>About</a>
          </Link>
          <Link href="/forever">
            <a style={linkStyle}>Forever</a>
          </Link>
          <Link href="/non-existing">
            <a style={linkStyle}>Non Existing Page</a>
          </Link>
        </div>
        <Component {...pageProps} />
      </Container>
    )
  }
}
