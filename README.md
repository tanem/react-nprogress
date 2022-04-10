# react-nprogress

[![npm version](https://img.shields.io/npm/v/@tanem/react-nprogress.svg?style=flat-square)](https://www.npmjs.com/package/@tanem/react-nprogress)
[![build status](https://img.shields.io/github/workflow/status/tanem/react-nprogress/CI?style=flat-square)](https://github.com/tanem/react-nprogress/actions?query=workflow%3ACI)
[![coverage status](https://img.shields.io/codecov/c/github/tanem/react-nprogress.svg?style=flat-square)](https://codecov.io/gh/tanem/react-nprogress)
[![npm downloads](https://img.shields.io/npm/dm/@tanem/react-nprogress.svg?style=flat-square)](https://www.npmjs.com/package/@tanem/react-nprogress)
[![minzipped size](https://img.shields.io/bundlephobia/minzip/@tanem/react-nprogress?style=flat-square)](https://bundlephobia.com/result?p=@tanem/react-nprogress)

> A React primitive for building slim progress bars.

[Background](#background) | [Usage](#usage) | [Live Examples](#live-examples) | [API](#api) | [Installation](#installation) | [License](#license)

## Background

This is a React port of [rstacruz](https://github.com/rstacruz)'s [`nprogress`](https://github.com/rstacruz/nprogress) module. It exposes an API that encapsulates the logic of `nprogress` and renders nothing, giving you complete control over rendering.

## Usage

In the following examples, `Container`, `Bar` and `Spinner` are custom components.

**Hook**

```jsx
import { useNProgress } from '@tanem/react-nprogress'
import React from 'react'
import { render } from 'react-dom'

import Bar from './Bar'
import Container from './Container'
import Spinner from './Spinner'

const Progress = ({ isAnimating }) => {
  const { animationDuration, isFinished, progress } = useNProgress({
    isAnimating,
  })

  return (
    <Container animationDuration={animationDuration} isFinished={isFinished}>
      <Bar animationDuration={animationDuration} progress={progress} />
      <Spinner />
    </Container>
  )
}

render(<Progress isAnimating />, document.getElementById('root'))
```

**Render Props**

```jsx
import { NProgress } from '@tanem/react-nprogress'
import React from 'react'
import { render } from 'react-dom'

import Bar from './Bar'
import Container from './Container'
import Spinner from './Spinner'

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

**HOC**

```jsx
import { withNProgress } from '@tanem/react-nprogress'
import React from 'react'
import { render } from 'react-dom'

import Bar from './Bar'
import Container from './Container'
import Spinner from './Spinner'

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

- HOC: [Source](https://github.com/tanem/react-nprogress/tree/master/examples/hoc) | [Sandbox](https://codesandbox.io/s/github/tanem/react-nprogress/tree/master/examples/hoc)
- Material UI: [Source](https://github.com/tanem/react-nprogress/tree/master/examples/material-ui) | [Sandbox](https://codesandbox.io/s/github/tanem/react-nprogress/tree/master/examples/material-ui)
- Multiple Instances: [Source](https://github.com/tanem/react-nprogress/tree/master/examples/multiple-instances) | [Sandbox](https://codesandbox.io/s/github/tanem/react-nprogress/tree/master/examples/multiple-instances)
- Next Router: [Source](https://github.com/tanem/react-nprogress/tree/master/examples/next-router) | [Sandbox](https://codesandbox.io/s/github/tanem/react-nprogress/tree/master/examples/next-router)
- Original Design: [Source](https://github.com/tanem/react-nprogress/tree/master/examples/original-design) | [Sandbox](https://codesandbox.io/s/github/tanem/react-nprogress/tree/master/examples/original-design)
- Plain JS: [Source](https://github.com/tanem/react-nprogress/tree/master/examples/plain-js) | [Sandbox](https://codesandbox.io/s/github/tanem/react-nprogress/tree/master/examples/plain-js)
- Reach Router: [Source](https://github.com/tanem/react-nprogress/tree/master/examples/reach-router) | [Sandbox](https://codesandbox.io/s/github/tanem/react-nprogress/tree/master/examples/reach-router)
- React Router V5: [Source](https://github.com/tanem/react-nprogress/tree/master/examples/react-router-v5) | [Sandbox](https://codesandbox.io/s/github/tanem/react-nprogress/tree/master/examples/react-router-v5)
- React Router V6: [Source](https://github.com/tanem/react-nprogress/tree/master/examples/react-router-v6) | [Sandbox](https://codesandbox.io/s/github/tanem/react-nprogress/tree/master/examples/react-router-v6)
- Render Props: [Source](https://github.com/tanem/react-nprogress/tree/master/examples/render-props) | [Sandbox](https://codesandbox.io/s/github/tanem/react-nprogress/tree/master/examples/render-props)
- UMD Build (Development): [Source](https://github.com/tanem/react-nprogress/tree/master/examples/umd-dev) | [Sandbox](https://codesandbox.io/s/github/tanem/react-nprogress/tree/master/examples/umd-dev)
- UMD Build (Production): [Source](https://github.com/tanem/react-nprogress/tree/master/examples/umd-prod) | [Sandbox](https://codesandbox.io/s/github/tanem/react-nprogress/tree/master/examples/umd-prod)

## API

**Props**

- `animationDuration` - _Optional_ Number indicating the animation duration in `ms`. Defaults to `200`.
- `incrementDuration` - _Optional_ Number indicating the length of time between progress bar increments in `ms`. Defaults to `800`.
- `isAnimating` - _Optional_ Boolean indicating if the progress bar is animating. Defaults to `false`.
- `minimum` - _Optional_ Number between `0` and `1` indicating the minimum value of the progress bar. Defaults to `0.08`.

**Hook Example**

```jsx
const Progress = ({
  animationDuration,
  incrementDuration,
  isAnimating,
  minimum
}) => {
  const { isFinished, progress } = useNProgress({
    animationDuration,
    incrementDuration,
    isAnimating,
    minimum
  })

  return (
    <Container animationDuration={animationDuration} isFinished={isFinished}>
      <Bar animationDuration={animationDuration} progress={progress} />
      <Spinner />
    </Container>
  )
}

<Progress
  animationDuration={300}
  incrementDuration={500}
  isAnimating
  minimum={0.1}
/>
```

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

- https://unpkg.com/@tanem/react-nprogress/dist/react-nprogress.umd.development.js
- https://unpkg.com/@tanem/react-nprogress/dist/react-nprogress.umd.production.js

For the non-minified development version, make sure you have already included:

- [`React`](https://unpkg.com/react/umd/react.development.js)
- [`ReactDOM`](https://unpkg.com/react-dom/umd/react-dom.development.js)

For the minified production version, make sure you have already included:

- [`React`](https://unpkg.com/react/umd/react.production.min.js)
- [`ReactDOM`](https://unpkg.com/react-dom/umd/react-dom.production.min.js)

## License

MIT
