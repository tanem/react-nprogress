# Migrating

## v7.0.0

### `withNProgress` removed

React's docs treat higher-order components as a legacy pattern, and the HOC
was the package's only reason to depend on `hoist-non-react-statics`.

**Action required:** wrap the component yourself:

```jsx
const Enhanced = (props) => <Inner {...props} {...useNProgress(props)} />
```

Statics hoisting goes with it. If the wrapped component has statics that
consumers read off the wrapper, copy them across yourself.

### UMD builds removed

`dist/react-nprogress.umd.development.js` and
`dist/react-nprogress.umd.production.js` are no longer published. React 19
does not ship a UMD build of its own, so the script-tag path already only
worked with React 18 and earlier.

**Action required:** for script-tag usage, pin
`@tanem/react-nprogress@^6`. Otherwise install the package and consume it
through a bundler.

### `exports` map added

`@tanem/react-nprogress` and `@tanem/react-nprogress/package.json` are the
only entry points. Paths into `dist` are no longer reachable, even though the
top-level `main`, `module` and `types` fields are still set for webpack 4 and
TypeScript `node10` resolution. Node ESM consumers now get the ES module
build rather than falling back to CommonJS, which Node did previously because
it ignores `module`.

**Action required:** import from the package name. `src` is now published
alongside `dist` so the declaration maps resolve.

### Build output filenames changed

The build moved from TypeScript plus Rollup and Babel to
[tsdown](https://tsdown.dev). The CommonJS build is
`dist/react-nprogress.cjs` (was `dist/index.js` switching between
`dist/react-nprogress.cjs.development.js` and
`dist/react-nprogress.cjs.production.js`) and the ES module build is
`dist/react-nprogress.mjs` (was `dist/react-nprogress.esm.js`). Type
declarations are `dist/react-nprogress.d.cts` and
`dist/react-nprogress.d.mts`, replacing `dist/index.d.ts` plus one file per
source module. Output still targets ES2019.

**Action required:** none if you import `@tanem/react-nprogress`.

### Separate development and production CommonJS builds removed

`process.env.NODE_ENV` is no longer read at require time. The two builds
differed only by minification, which bundlers apply themselves.

**Action required:** none. Tooling that shimmed `process.env` solely to
require this package can drop the shim.

### `@babel/runtime` no longer a dependency

The package now has no runtime dependencies, only peers.

**Action required:** none, unless you depended on `@babel/runtime` being
installed transitively, in which case depend on it directly.

## v6.0.0

Trickle pacing was adjusted to more closely match the original
[nprogress](https://github.com/rstacruz/nprogress) behaviour.

### `incrementDuration` default changed from `800` to `200`

The previous default of `800` meant each trickle took roughly one second
(animation wait plus increment delay). The new default of `200` matches
the original library's `trickleSpeed` and results in faster trickle
pacing.

**Action required:** if you were relying on the old default pacing,
explicitly pass `incrementDuration={800}` to restore the previous
behaviour.

### Intermediate progress updates no longer wait for `animationDuration`

Intermediate progress updates previously waited `animationDuration`
(200 ms) before the next one could be scheduled. This wait has been
removed for intermediate updates so that only `incrementDuration`
controls trickle pacing. Completion still waits `animationDuration`
before marking the bar as finished, giving consumers time to animate
the bar to 100% before it disappears.

**Action required:** none in most cases. If your rendering code relied
on intermediate progress updates being spaced at least
`animationDuration` apart, you may need to adjust your
transition/animation timing.

## v5.0.0

The prop-types package is no longer required for using the UMD builds.

## v4.0.0

Allows multiple instances of `react-nprogress` on a page. Technically this isn't a breaking change, but it was decided to bump the major version in order to reduce the chance of bugs slipping into consuming code.

## v3.0.0

The source code was refactored to use [hooks](https://reactjs.org/docs/hooks-intro.html). A `useNProgress` hook was also exposed. As a result, the `react` and `react-dom` peer dependency requirements are now `^16.8.0`.

## v2.0.0

The build process was refactored in this version. Technically this isn't a breaking change, but it was decided to bump the major version in order to reduce the chance of bugs slipping into consuming code.
