# react-nprogress

[![npm version](https://img.shields.io/npm/v/@tanem/react-nprogress.svg?style=flat-square)](https://www.npmjs.com/package/@tanem/react-nprogress)
[![build status](https://img.shields.io/github/actions/workflow/status/tanem/react-nprogress/ci.yml?style=flat-square)](https://github.com/tanem/react-nprogress/actions?query=workflow%3ACI)
[![coverage status](https://img.shields.io/codecov/c/github/tanem/react-nprogress.svg?style=flat-square)](https://codecov.io/gh/tanem/react-nprogress)
[![npm downloads](https://img.shields.io/npm/dm/@tanem/react-nprogress.svg?style=flat-square)](https://www.npmjs.com/package/@tanem/react-nprogress)
[![minzipped size](https://img.shields.io/bundlephobia/minzip/@tanem/react-nprogress?style=flat-square)](https://bundlephobia.com/result?p=@tanem/react-nprogress)

> A React primitive for building slim progress bars.

[Background](#background) | [When to Use This](#when-to-use-this) | [Usage](#usage) | [API](#api) | [Live Examples](#live-examples) | [Installation](#installation) | [Contributing](#contributing) | [License](#license)

## Background

This is a React port of [rstacruz](https://github.com/rstacruz)'s [`nprogress`](https://github.com/rstacruz/nprogress) module. It exposes an API that encapsulates the logic of `nprogress` and renders nothing, allowing consumers to implement their own rendering.

## When to Use This

This package is a headless primitive. It renders no markup and ships no CSS, supplying only the pacing state: a `progress` value that trickles towards completion, an `isFinished` flag, and the `animationDuration` to transition with. The bar itself is yours to write.

- Use a drop-in bar such as [`nextjs-toploader`](https://github.com/TheSGJ/nextjs-toploader), [`next-nprogress-bar`](https://github.com/Skyleen77/next-nprogress-bar), or [`nprogress`](https://github.com/rstacruz/nprogress) itself when you want a styled bar wired up to your router with no rendering work.
- Use this package when you render the bar yourself, for example with design-system components or custom containers and spinners, and want only the trickle and completion logic handled for you.
- Use this package when you need several progress bars on one page, each tracking its own state.

## Usage

`Container`, `Bar` and `Spinner` are components you write: this package renders nothing itself. Every entry in [Live Examples](#live-examples) contains a working implementation of all three.

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

## API

The package exports one hook and one component. Both take the same [options](#options) and produce the same [values](#return-value), so the choice between them is a matter of which pattern suits the calling code. Both shapes are exported as types, for typing code that wraps either entry point:

```ts
import type { NProgressOptions, NProgressState } from '@tanem/react-nprogress'
```

### `useNProgress`

Returns the state of one progress bar. Call it once per bar: two calls, or two mounted `NProgress` components, track their progress independently.

```jsx
const { animationDuration, isFinished, progress } = useNProgress({
  animationDuration: 300,
  increment: (progress) => progress + 0.01,
  incrementDuration: 500,
  isAnimating: true,
  minimum: 0.1,
})
```

### `NProgress`

Takes the options as props and calls `children` with the values the hook returns. `children` is required and must return a React element.

```jsx
<NProgress
  animationDuration={300}
  increment={(progress) => progress + 0.01}
  incrementDuration={500}
  isAnimating
  minimum={0.1}
>
  {({ animationDuration, progress }) => (
    <Bar animationDuration={animationDuration} progress={progress} />
  )}
</NProgress>
```

### Options

All five options are optional. The type is `NProgressOptions`.

| Option                                    | Type                           | Default        |
| ----------------------------------------- | ------------------------------ | -------------- |
| [`animationDuration`](#animationduration) | `number`                       | `200`          |
| [`increment`](#increment)                 | `(progress: number) => number` | tiered trickle |
| [`incrementDuration`](#incrementduration) | `number`                       | `200`          |
| [`isAnimating`](#isanimating)             | `boolean`                      | `false`        |
| [`minimum`](#minimum)                     | `number`                       | `0.08`         |

#### `animationDuration`

Milliseconds the bar is given to animate out once it completes. `progress` reaches `1` as soon as `isAnimating` goes `false`, and `isFinished` follows this many milliseconds later, leaving that window for the exit transition. The value is also returned unchanged, so a single number drives both the timing and the CSS transitions.

#### `increment`

Size of each trickle step. The function is called with the current `progress` and returns the next value. The default is the tiered curve nprogress uses: `+0.1` below `0.2`, then `+0.04`, `+0.02`, and `+0.005` as `progress` grows, held at a ceiling of `0.994` so the bar never looks complete before it is.

The return value is clamped to between `minimum` and `1`, and nothing else. A custom function therefore owns its own ceiling. Leave it short of `1`, since reaching `1` is what completion means, and let `isAnimating` going `false` take the bar the rest of the way.

Returning a random amount is fine, but keep the function free of other side effects. It runs inside a React state update, and StrictMode calls it twice per increment in development. This trickles a random amount of at most `0.02` every 800ms, which is how nprogress 0.2.0 paces itself:

```jsx
const { progress } = useNProgress({
  increment: (progress) => Math.min(progress + Math.random() * 0.02, 0.994),
  incrementDuration: 800,
  isAnimating,
})
```

A new function identity on every render is fine too: passing an inline function does not restart the trickle timer. The next increment uses the latest function.

#### `incrementDuration`

Milliseconds between increments while the bar is animating. It controls the trickle pacing only. Step size is [`increment`](#increment).

#### `isAnimating`

Whether the bar is running. Going `true` starts it, going `false` completes it. Completion is what drives the final state: `progress` is set to `1`, and `isFinished` becomes `true` `animationDuration` milliseconds later.

#### `minimum`

Lower bound for `progress`, between `0` and `1`. The bar first appears at this value, then trickles up from there. Changing it while the bar is animating does not rewind the bar. Progress holds where it is, and the new bound applies from the next increment.

### Return Value

`useNProgress` returns these values, and `NProgress` passes the same object to `children`. The type is `NProgressState`.

| Value               | Type      | Description                                                                                                                                                   |
| ------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `animationDuration` | `number`  | The `animationDuration` option, passed through so rendering code can transition with it.                                                                      |
| `isFinished`        | `boolean` | `true` before the bar starts and again once it has animated out. `false` from when `isAnimating` goes `true` until `animationDuration` after it goes `false`. |
| `progress`          | `number`  | Starts at `0`, appears at `minimum` when the bar starts, then trickles up by [`increment`](#increment) and goes to `1` on completion.                         |

## Live Examples

| Example                                                                                                | Sandbox                                                                                                      |
| ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| [Material UI](https://github.com/tanem/react-nprogress/tree/master/examples/material-ui)               | [Open](https://codesandbox.io/p/devbox/github/tanem/react-nprogress/tree/master/examples/material-ui)        |
| [Multiple Instances](https://github.com/tanem/react-nprogress/tree/master/examples/multiple-instances) | [Open](https://codesandbox.io/p/devbox/github/tanem/react-nprogress/tree/master/examples/multiple-instances) |
| [Next App Router](https://github.com/tanem/react-nprogress/tree/master/examples/next-app-router)       | [Open](https://codesandbox.io/p/devbox/github/tanem/react-nprogress/tree/master/examples/next-app-router)    |
| [Next Pages Router](https://github.com/tanem/react-nprogress/tree/master/examples/next-pages-router)   | [Open](https://codesandbox.io/p/devbox/github/tanem/react-nprogress/tree/master/examples/next-pages-router)  |
| [Original Design](https://github.com/tanem/react-nprogress/tree/master/examples/original-design)       | [Open](https://codesandbox.io/p/devbox/github/tanem/react-nprogress/tree/master/examples/original-design)    |
| [Plain JS](https://github.com/tanem/react-nprogress/tree/master/examples/plain-js)                     | [Open](https://codesandbox.io/p/devbox/github/tanem/react-nprogress/tree/master/examples/plain-js)           |
| [React Router](https://github.com/tanem/react-nprogress/tree/master/examples/react-router)             | [Open](https://codesandbox.io/p/devbox/github/tanem/react-nprogress/tree/master/examples/react-router)       |
| [Render Props](https://github.com/tanem/react-nprogress/tree/master/examples/render-props)             | [Open](https://codesandbox.io/p/devbox/github/tanem/react-nprogress/tree/master/examples/render-props)       |

## Installation

```
$ npm install @tanem/react-nprogress
```

## Contributing

Issues and pull requests are welcome. The development loop is `npm run test:src`, and `npm test` runs the full suite. Repository conventions, for humans and coding agents alike, live in [`AGENTS.md`](AGENTS.md).

## License

MIT
