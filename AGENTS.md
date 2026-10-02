# Agent Instructions for react-nprogress

Keep this file short. Only add what changes agent behaviour and cannot be inferred from the codebase or tooling.

Headless React progress bar logic, exposed as the `useNProgress` hook and the `NProgress` render-props component. There are no runtime dependencies: React and React DOM are peers.

## Commands

```bash
npm run test:src  # source-only tests with coverage: the development loop
npm run format    # fix lint and formatting
npm test          # full suite: checks, lint, build, size gate, every test:*
```

Run `npm test` before finishing a change.

## Conventions

- Comments: `//` line comments only, never `/* */` or `/** */`. Explain why, not what. Wrap at 80 characters and end with a full stop.
- Use New Zealand English ("colour", "behaviour") in prose, comments, and identifiers. Standardised API names such as `color` stay as they are.
- Commits: capitalised imperative subject of at most 50 characters with no type prefix and no trailing full stop, then a blank line and a body wrapped at 72. PR titles are plain sentences too, since they become the release notes.
- Pin `devDependencies` to exact versions. Renovate manages updates: do not add `allowedVersions` to `renovate.json` without a documented reason.
- Strict semver: a breaking change, including a technical refactor, needs a major bump and a MIGRATION.md entry under that major's heading, describing the change and the action required.
- Update related docs (README.md, MIGRATION.md, example READMEs) in the same change as the code.
- Do not modify CHANGELOG.md. It is frozen as of v7.1.0. Later history lives on GitHub Releases.

## Testing

- `src` requires 100% coverage. Only `npm run test:src` collects it, and no `coverageThreshold` is configured, so a drop does not fail the run: read the report.
- `test:cjs`, `test:es` and `test:bundles` run against `dist` and need a build first. `npm test` builds before running them.
- A new spec that reads `dist` belongs in `scripts/jest/config.bundles.js`, not alongside the source specs. `test:src` and the React matrix must stay runnable without a build.
- `size-limit` gates the gzipped size of both bundles, with the limits in `package.json`. Only raise a limit when the added size is intended.

### React version matrix

`npm run test:react` runs the source specs against every version directory in `test/react/`: the first and last minor of each supported major. React 16.14 is the lower bound, since hooks need 16.8 and `@testing-library/react-hooks` needs 16.9.

To add a boundary:

1. Copy the `package.json` from the nearest version directory into `test/react/<version>/` and update the React versions. React 16 and 17 use `@testing-library/react` 12.x with `@testing-library/react-hooks` 8.x and `react-test-renderer`. React 18 and later use `@testing-library/react` 16.x alone.
2. Remove the directory it replaces as the last minor of that major, unless that is also the first minor.
3. Verify a single-version run before the full matrix. Install inside the version directory, but run jest from the repo root: the config sets `rootDir` to the current working directory.
   ```bash
   (cd test/react/<version> && npm i --no-package-lock --quiet --no-progress)
   REACT_VERSION=<version> npx jest --config ./scripts/jest/config.src.js --coverage false
   ```

## Examples

The examples in `examples/` open on CodeSandbox, which resolves `@tanem/react-nprogress` from the registry: keep the `"latest"` pin.

Their platform dependencies (vite, @vitejs/plugin-react, next, typescript, @types/react, @types/react-dom) must match the CodeSandbox [sandbox-templates](https://github.com/codesandbox/sandbox-templates/tree/main): `react-vite` or `react-vite-ts` for the Vite examples, `nextjs` for the Next examples. Never bump them past the template. Renovate ignores `examples/**`, so updates are manual: check the template, update all examples in one commit, and verify at least one still opens on CodeSandbox.

Other example dependencies, such as `@mui/material` and `react-router-dom`, are not governed by the templates. Update them as needed, and test on CodeSandbox before merging.

Before a release that changes packaging, smoke-test the examples against the tarball rather than the registry: `npm run build && npm pack` at the repo root, point each example's `@tanem/react-nprogress` dependency at the tarball, clean-install so it wins over any stale `node_modules`, then run the example and drive its progress bar in a browser. The Next examples also need `next build && next start`, since they resolve the CJS entry on the server. Restore the `"latest"` pin afterwards.

`next-env.d.ts` in the Next examples is deliberately untracked: `next dev` and `next build` write different contents into it.

## Releases

`.github/workflows/release.yml` runs every Monday against master with no content gate: whatever is on master ships. A manual dispatch against any other branch is a no-op, which stops a staged major shipping before it is finished.

[`tanem/release-action`](https://github.com/tanem/release-action) derives the bump from PR labels. Every PR merged since the last tag needs exactly one label, not counting `safe to test`, or the run fails. `breaking` selects a major, `enhancement` a minor, anything else a patch.
