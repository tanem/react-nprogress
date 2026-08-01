# ReactNProgress Classic 0.2.0 Example

Reproduces the pacing of nprogress `0.2.0`, the npm release the nprogress demo
page loads: the bar appears near the minimum and creeps up in small eased steps
every 800ms.

The library defaults follow the nprogress master branch instead, which trickles
tiered amounts every 200ms with `linear` easing. The [Original
Design](../original-design) example shows that. This one changes three things
to get back to `0.2.0`.

| nprogress `0.2.0` setting | Here                                                          |
| ------------------------- | ------------------------------------------------------------- |
| `trickleRate: 0.02`       | `increment: (p) => Math.min(p + Math.random() * 0.02, 0.994)` |
| `trickleSpeed: 800`       | `incrementDuration: 800`                                      |
| `easing: 'ease'`          | the bar's CSS `transition` in `src/Bar.tsx`                   |

The remaining `0.2.0` settings already match the defaults: `minimum: 0.08`, and
`speed: 200`, which is `animationDuration`. The `0.994` ceiling is part of the
increment function here, because the option's return value is only clamped to
between `minimum` and `1`.

Easing is not an option: this package renders nothing, so transitions live in
your own CSS. Only the bar position is eased in `0.2.0`. The fade-out stays
`linear`.

## Available Scripts

### `npm run dev`

Runs the app in development mode.

### `npm run build`

Builds the app for production.

### `npm run preview`

Previews the production build locally.
