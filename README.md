# react-nprogress

[![npm version](https://img.shields.io/npm/v/@tanem/react-nprogress.svg?style=flat-square)](https://www.npmjs.com/package/@tanem/react-nprogress)
[![build status](https://img.shields.io/github/actions/workflow/status/tanem/react-nprogress/ci.yml?style=flat-square)](https://github.com/tanem/react-nprogress/actions?query=workflow%3ACI)
[![coverage status](https://img.shields.io/codecov/c/github/tanem/react-nprogress.svg?style=flat-square)](https://codecov.io/gh/tanem/react-nprogress)
[![npm downloads](https://img.shields.io/npm/dm/@tanem/react-nprogress.svg?style=flat-square)](https://www.npmjs.com/package/@tanem/react-nprogress)
[![minzipped size](https://img.shields.io/bundlephobia/minzip/@tanem/react-nprogress?style=flat-square)](https://bundlephobia.com/result?p=@tanem/react-nprogress)

> A React primitive for building slim progress bars.

[Background](#background) | [When to Use This](#when-to-use-this) | [Usage](#usage) | [Live Examples](#live-examples) | [API](#api) | [Installation](#installation) | [License](#license)

## Background

This is a React port of [rstacruz](https://github.com/rstacruz)'s [`nprogress`](https://github.com/rstacruz/nprogress) module. It exposes an API that encapsulates the logic of `nprogress` and renders nothing, allowing consumers to implement their own rendering.

## When to Use This

This package is a headless primitive. It renders no markup and ships no CSS, supplying only the pacing state: a `progress` value that trickles towards completion, an `isFinished` flag, and the `animationDuration` to transition with. The bar itself is yours to write.

- Use a drop-in bar such as [`nextjs-toploader`](https://github.com/TheSGJ/nextjs-toploader), [`next-nprogress-bar`](https://github.com/Skyleen77/next-nprogress-bar), or [`nprogress`](https://github.com/rstacruz/nprogress) itself when you want a styled bar wired up to your router with no rendering work.
- Use this package when you render the bar yourself, for example with design-system components or custom containers and spinners, and want only the trickle and completion logic handled for you.
- Use this package when you need several progress bars on one page, each tracking its own state.

## Usage

In the following examples, `Container`, `Bar` and `Spinner` are custom components.

**Hook**

```jsx
import { useNProgress } from '@tanem/react-nprogress'

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
```

**Render Props**

```jsx
import { NProgress } from '@tanem/react-nprogress'

import Bar from './Bar'
import Container from './Container'
import Spinner from './Spinner'

const Progress = ({ isAnimating }) => (
  <NProgress isAnimating={isAnimating}>
    {({ animationDuration, isFinished, progress }) => (
      <Container animationDuration={animationDuration} isFinished={isFinished}>
        <Bar animationDuration={animationDuration} progress={progress} />
        <Spinner />
      </Container>
    )}
  </NProgress>
)
```

## Live Examples

- Material UI: [Source](https://github.com/tanem/react-nprogress/tree/master/examples/material-ui) | [Sandbox](https://codesandbox.io/p/devbox/github/tanem/react-nprogress/tree/master/examples/material-ui)
- Multiple Instances: [Source](https://github.com/tanem/react-nprogress/tree/master/examples/multiple-instances) | [Sandbox](https://codesandbox.io/p/devbox/github/tanem/react-nprogress/tree/master/examples/multiple-instances)
- Next App Router: [Source](https://github.com/tanem/react-nprogress/tree/master/examples/next-app-router) | [Sandbox](https://codesandbox.io/p/devbox/github/tanem/react-nprogress/tree/master/examples/next-app-router)
- Next Pages Router: [Source](https://github.com/tanem/react-nprogress/tree/master/examples/next-pages-router) | [Sandbox](https://codesandbox.io/p/devbox/github/tanem/react-nprogress/tree/master/examples/next-pages-router)
- Original Design: [Source](https://github.com/tanem/react-nprogress/tree/master/examples/original-design) | [Sandbox](https://codesandbox.io/p/devbox/github/tanem/react-nprogress/tree/master/examples/original-design)
- Plain JS: [Source](https://github.com/tanem/react-nprogress/tree/master/examples/plain-js) | [Sandbox](https://codesandbox.io/p/devbox/github/tanem/react-nprogress/tree/master/examples/plain-js)
- React Router: [Source](https://github.com/tanem/react-nprogress/tree/master/examples/react-router) | [Sandbox](https://codesandbox.io/p/devbox/github/tanem/react-nprogress/tree/master/examples/react-router)
- Render Props: [Source](https://github.com/tanem/react-nprogress/tree/master/examples/render-props) | [Sandbox](https://codesandbox.io/p/devbox/github/tanem/react-nprogress/tree/master/examples/render-props)

## API

**Props**

- `animationDuration` - _Optional_ Number indicating the animation duration in `ms`. Defaults to `200`.
- `incrementDuration` - _Optional_ Number indicating the length of time between progress bar increments in `ms`. Defaults to `200`.
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

## Installation

```
$ npm install @tanem/react-nprogress
```

## License

MIT
