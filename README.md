# react-nprogress

[![npm version](https://img.shields.io/npm/v/@tanem/react-nprogress.svg?style=flat-square)](https://www.npmjs.com/package/@tanem/react-nprogress)
[![build status](https://img.shields.io/travis/tanem/react-nprogress/master.svg?style=flat-square)](https://travis-ci.org/tanem/react-nprogress)
[![coverage status](https://img.shields.io/codecov/c/github/tanem/react-nprogress.svg?style=flat-square)](https://codecov.io/gh/tanem/react-nprogress)
[![npm downloads](https://img.shields.io/npm/dm/@tanem/react-nprogress.svg?style=flat-square)](https://www.npmjs.com/package/@tanem/react-nprogress)
[![gzip size](http://img.badgesize.io/https://unpkg.com/@tanem/react-nprogress/umd/react-nprogress.production.min.js?style=flat-square&compression=gzip)](https://unpkg.com/@tanem/react-nprogress/umd/react-nprogress.production.min.js) [![Greenkeeper badge](https://badges.greenkeeper.io/tanem/react-nprogress.svg)](https://greenkeeper.io/)

> A React primitive for building slim progress bars.

## Background

This is a React port of [rstacruz](https://github.com/rstacruz)'s [`nprogress`](https://github.com/rstacruz/nprogress) module. It exposes an API that encapsulates the logic of `nprogress` and renders nothing, giving you complete control over rendering.

## Usage

### Render Props

```jsx
import Bar from './Bar'
import Container from './Container'
import React from 'react'
import Spinner from './Spinner'
import { NProgress } from '@tanem/react-nprogress'
import { render } from 'react-dom'

render(
  <NProgress isAnimating>
    {({ animationDuration, isFinished, progress }) => (
      <Container animationDuration={animationDuration} isFinished={isFinished}>
        <Bar animationDuration={animationDuration} progress={progress} />
        <Spinner />
      </Container>
    )}
  </NProgress>,
  document.getElementById('root')
)
```

`Container`, `Bar` and `Spinner` are custom components. `NProgress` doesn't render anything itself, it just calls the render function and renders that:

```jsx
<NProgress>
  {({/* parameters here */}) => (/* your render code here */)}
</NProgress>
```

### HOC

```jsx
import Bar from './Bar'
import Container from './Container'
import React from 'react'
import Spinner from './Spinner'
import { render } from 'react-dom'
import { withNProgress } from '@tanem/react-nprogress'

const Inner = ({ animationDuration, isFinished, progress }) => (
  <Container animationDuration={animationDuration} isFinished={isFinished}>
    <Bar animationDuration={animationDuration} progress={progress} />
    <Spinner />
  </Container>
)

const Enhanced = withNProgress(Inner)

render(<Enhanced isAnimating />, document.getElementById('root'))
```

## Live Examples

- Original Design: [Source](https://github.com/tanem/react-nprogress/tree/master/examples/original-design) | [Sandbox](https://codesandbox.io/s/github/tanem/react-nprogress/tree/master/examples/original-design)
- HOC: [Source](https://github.com/tanem/react-nprogress/tree/master/examples/hoc) | [Sandbox](https://codesandbox.io/s/github/tanem/react-nprogress/tree/master/examples/hoc)
- React Router: [Source](https://github.com/tanem/react-nprogress/tree/master/examples/react-router) | [Sandbox](https://codesandbox.io/s/github/tanem/react-nprogress/tree/master/examples/react-router)
- Reach Router: [Source](https://github.com/tanem/react-nprogress/tree/master/examples/reach-router) | [Sandbox](https://codesandbox.io/s/github/tanem/react-nprogress/tree/master/examples/reach-router)
- Next Router: [Source](https://github.com/tanem/react-nprogress/tree/add-next-example/examples/next-router) | [Sandbox](https://codesandbox.io/s/github/tanem/react-nprogress/tree/add-next-example/examples/next-router)
- UMD Build (Development): [Source](https://github.com/tanem/react-nprogress/tree/master/examples/umd-dev) | [Sandbox](https://codesandbox.io/s/github/tanem/react-nprogress/tree/master/examples/umd-dev)
- UMD Build (Production): [Source](https://github.com/tanem/react-nprogress/tree/master/examples/umd-prod) | [Sandbox](https://codesandbox.io/s/github/tanem/react-nprogress/tree/master/examples/umd-prod)

## API

**Props**

- `animationDuration` - _Optional_ Number indicating the animation duration in `ms`. Defaults to `200`.
- `incrementDuration` - _Optional_ Number indicating the length of time between progress bar increments in `ms`. Defaults to `800`.
- `isAnimating` - _Optional_ Boolean indicating if the progress bar is animating. Defaults to `false`.
- `minimum` - _Optional_ Number between `0` and `1` indicating the minimum value of the progress bar. Defaults to `0.08`.

**Render Props Example**

```jsx
<NProgress
  animationDuration={300}
  incrementDuration={500}
  isAnimating
  minimum={0.1}
>
  {({ animationDuration, isFinished, progress }) => (
    <Container animationDuration={animationDuration} isFinished={isFinished}>
      <Bar animationDuration={animationDuration} progress={progress} />
      <Spinner />
    </Container>
  )}
</NProgress>
```

**HOC Example**

```jsx
const Inner = ({ animationDuration, isFinished, progress }) => (
  <Container animationDuration={animationDuration} isFinished={isFinished}>
    <Bar animationDuration={animationDuration} progress={progress} />
    <Spinner />
  </Container>
)

const Enhanced = withNProgress(Inner)

<Enhanced
  animationDuration={300}
  incrementDuration={500}
  isAnimating
  minimum={0.1}
/>
```

## Installation

```
$ npm install @tanem/react-nprogress
```

There are also UMD builds available via [unpkg](https://unpkg.com/):

- https://unpkg.com/@tanem/react-nprogress/umd/react-nprogress.development.js
- https://unpkg.com/@tanem/react-nprogress/umd/react-nprogress.production.min.js

For the non-minified development version, make sure you have already included:

- [`React`](https://unpkg.com/react/umd/react.development.js)
- [`ReactDOM`](https://unpkg.com/react-dom/umd/react-dom.development.js)
- [`PropTypes`](https://unpkg.com/prop-types/prop-types.js)

For the minified production version, make sure you have already included:

- [`React`](https://unpkg.com/react/umd/react.production.min.js)
- [`ReactDOM`](https://unpkg.com/react-dom/umd/react-dom.production.min.js)

## License

MIT