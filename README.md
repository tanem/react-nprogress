# react-nprogress

[![npm version](https://img.shields.io/npm/v/@tanem/react-nprogress.svg?style=flat-square)](https://www.npmjs.com/package/@tanem/react-nprogress)
[![build status](https://img.shields.io/travis/tanem/react-nprogress/master.svg?style=flat-square)](https://travis-ci.org/tanem/react-nprogress)
[![coverage status](https://img.shields.io/codecov/c/github/tanem/react-nprogress.svg?style=flat-square)](https://codecov.io/gh/tanem/react-nprogress)
[![npm downloads](https://img.shields.io/npm/dm/@tanem/react-nprogress.svg?style=flat-square)](https://www.npmjs.com/package/@tanem/react-nprogress)

> A React primitive for building slim progress bars inspired by Google, YouTube, and Medium.

## Background

This is a React port of [rstacruz](https://github.com/rstacruz)'s nifty [`nprogress`](https://github.com/rstacruz/nprogress) module. It exposes an API that encapsulates the logic of `nprogress` and renders nothing, giving you complete control over rendering.

## Basic Usage

> Note: `Container`, `Bar` and `Spinner` are function components that you
> create. You're free to create and style whatever components suit your context.
> Refer to the Live Examples to see this approach in action.

```jsx
import Bar from './Bar'
import Container from './Container'
import NProgress from '@tanem/react-nprogress';
import React from 'react'
import Spinner from './Spinner'
import { render } from 'react-dom'

render(
  <NProgress isAnimating>
    {({ isFinished, progress, animationDuration }) => (
      <Container isFinished={isFinished} animationDuration={animationDuration}>
        <Bar progress={progress} animationDuration={animationDuration} />
        <Spinner />
      </Container>
    )}
  </NProgress>,
  document.getElementById('root')
)
```

## Live Examples

- Original: [Source](https://github.com/tanem/react-nprogress/tree/master/examples/original) | [Sandbox](https://codesandbox.io/s/github/tanem/react-nprogress/tree/master/examples/original)
- UMD Build (Development): [Source](https://github.com/tanem/react-nprogress/tree/master/examples/umd-dev) | [Sandbox](https://codesandbox.io/s/github/tanem/react-nprogress/tree/master/examples/umd-dev)
- UMD Build (Production): [Source](https://github.com/tanem/react-nprogress/tree/master/examples/umd-prod) | [Sandbox](https://codesandbox.io/s/github/tanem/react-nprogress/tree/master/examples/umd-prod)

## API

**Props**

- `animationDuration` - _Optional_ Number indicating the animation duration in `ms`. Defaults to `200`.
- `incrementDuration` - _Optional_ Number indicating the length of time between progress bar increments in `ms`. Defaults to `800`.
- `isAnimating` - _Optional_ Boolean indicating if the progress bar is animating. Defaults to `false`.
- `minimum` - _Optional_ Number between `0` and `1` indicating the minimum value of the progress bar. Defaults to `0.08`.

**Example**

```jsx
<NProgress
  animationDuration={300}
  incrementDuration={500}
  isAnimating
  minimum={0.1}
>
  {({ isFinished, progress, animationDuration }) => (
    <Container isFinished={isFinished} animationDuration={animationDuration}>
      <Bar progress={progress} animationDuration={animationDuration} />
      <Spinner />
    </Container>
  )}
</NProgress>
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