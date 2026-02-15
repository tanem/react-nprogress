# ReactNProgress Next App Router Example

Demonstrates `@tanem/react-nprogress` with the Next.js App Router. Since the App
Router does not expose `router.events`, this example uses:

- **`onNavigate`** (Next.js 15.3+) on a `<ProgressLink>` wrapper to detect
  navigation start.
- **`usePathname()` / `useSearchParams()`** to detect navigation completion, as
  recommended by the [Next.js
  docs](https://nextjs.org/docs/app/api-reference/functions/use-router#router-events).

To run it:

```
$ npm i && npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) to view it in the
browser.
