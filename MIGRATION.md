# Migrating

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

Non-completion `set()` calls previously waited `animationDuration`
(200 ms) before advancing the internal queue. This wait has been
removed for intermediate updates so that only `incrementDuration`
controls trickle pacing. The completion path (`set(1)`) still waits
`animationDuration` before marking the bar as finished, giving
consumers time to animate the bar to 100% before it disappears.

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
