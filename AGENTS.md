# Agent Instructions for react-nprogress

Keep these instructions concise. Only add information here that meaningfully
changes agent behaviour and cannot be inferred from the codebase or tooling.

## Project

TypeScript React library providing a slim progress bar primitive via two
patterns: `useNProgress` hook and `NProgress` render-props component. Exports
logic only, not rendering. All exports go through `src/index.tsx`. Types live
in `src/types.ts`. There are no runtime dependencies: React and React DOM are
peers.

## Key Commands

```bash
npm test          # full suite: format and type checks, lint, build, size
                  # gate, then every test:* script
npm run build     # clean, then bundle with tsdown; the postbuild hook runs
                  # publint and arethetypeswrong over the packed tarball
npm run test:src  # source-only tests, the loop to use while developing
npm run format    # fix lint and formatting
```

## Code Standards

### Comments

- Use `//` line comments only, never `/* */` or `/** */`
- Explain _why_, not _what_; wrap at 80 characters
- End every comment with a full stop, even single-line comments

### Language

Use **New Zealand English** in all user-facing text, variable names, and
comments (e.g. "colour", "behaviour", "organisation"). Standardised API names
(`color`, `textAlign`) are fixed: leave them unchanged.

```javascript
const progressColour = '#0066cc'
const centredLayout = { textAlign: 'center' } // API name stays 'center'
```

### Commits

```
Subject line (max 50 chars)

Body wrapped at 72 chars. Present tense, imperative mood. Capitalise
subject, no trailing period, blank line between subject and body.
```

### Dependencies

Managed by Renovate (`config:js-lib` preset):

- `devDependencies`: pinned exact versions (no `^` or `~`)
- `dependencies`: caret ranges (`^`)
- `peerDependencies`: explicit OR ranges (e.g. `^16.8.0 || ^17.0.0 || ^18.0.0 || ^19.0.0`)
- Do **not** add `allowedVersions` to `renovate.json` without a documented reason

## Testing

- **100% code coverage** of `src` is required. Coverage is collected by
  `npm run test:src` only. No `coverageThreshold` is configured, so a drop
  will not fail the run: read the report.
- `npm run test:cjs` and `npm run test:es` re-run the hook and component
  specs against `dist/react-nprogress.cjs` and `dist/react-nprogress.mjs`,
  and `npm run test:bundles` asserts what the build emits, so all three need
  a build first. `npm test` builds before running them.
- `test/bundles.spec.ts` is excluded from `config.src.js` so that `test:src`
  and the React matrix stay runnable without a build. A new spec that reads
  `dist` belongs in `config.bundles.js`, not alongside the source specs.
- Always run `npm test` after changes; use `npm run test:src` for quick
  source-only feedback during development.
- Use `npm run test:react` for the full React version matrix independently.
  It also runs as part of `npm test` (via the `test:*` glob).

### React version matrix

We test boundary versions only: first and last minor of each supported
major. See `test/react/` for current versions.

Current boundaries: 16.14, 17.0, 18.0, 18.3, 19.0, 19.2.

React 16.14 is the practical lower bound. Hooks require 16.8 and
`@testing-library/react-hooks` requires 16.9.

When adding a new boundary:

1. Add `test/react/<version>/package.json` with correct `react`,
   `react-dom`, and `@testing-library/react` (12.x for React 16–17,
   16.x for React 18+). React 16–17 also need
   `@testing-library/react-hooks` (8.x) and `react-test-renderer`.
2. Replace the previous "latest minor" for that major.
3. Verify with a single-version run before the full matrix. Install inside
   the version directory, but run jest from the repo root: the config sets
   `rootDir` to the current working directory.
   ```bash
   (cd test/react/<version> && npm i --no-package-lock --quiet --no-progress)
   REACT_VERSION=<version> npx jest --config ./scripts/jest/config.src.js --coverage false
   ```
4. Update the boundary list above.

## Packaging

`size-limit` gates the gzipped size of both bundles, configured in
`package.json`. Treat a limit bump as a decision, not a fix: only raise it
when the added size is intended.

## Examples

Examples live in `examples/` and are designed to open on CodeSandbox. Their
"platform" dependencies (vite, @vitejs/plugin-react, next, typescript,
@types/react, @types/react-dom) must match the official CodeSandbox
sandbox-templates at
https://github.com/codesandbox/sandbox-templates/tree/main.

Reference templates:

- Vite-based examples → `react-vite` / `react-vite-ts`
- Next.js examples → `nextjs`

Renovate is disabled for `examples/**` (via `ignorePaths` in
`renovate.json`). Updates are manual: check the reference template, update all
examples in one commit, and verify at least one example still opens correctly
on CodeSandbox.

Example-specific deps (e.g. `@mui/material`, `react-router-dom`,
`react-transition-group`) are not governed by the templates: update these as
needed but test on CodeSandbox before merging.

Do not bump vite, @vitejs/plugin-react, next, or typescript in examples
beyond the versions in the reference templates.

Before a release that changes packaging, smoke-test the examples against the
tarball rather than the registry: `npm run build && npm pack` at the repo
root, point each example's `@tanem/react-nprogress` dependency at the tarball,
clean-install so it wins over any stale `node_modules`, then run the example
and drive its progress bar in a browser. The Next examples also need
`next build && next start`, since they resolve the CJS entry on the server.
Restore the `"latest"` pin afterwards: CodeSandbox resolves the registry.

`next-env.d.ts` in the Next examples is generated, and `next dev` and
`next build` write different contents into it, so it is gitignored and listed
in `.prettierignore` rather than tracked.

## Writing Style

- Avoid marketing or promotional language. State facts plainly.
- Follow best practices for technical writing: be clear, direct, and
  concise.
- Avoid em dashes. Use colons, commas, or separate sentences instead.
- Use present tense and active voice where practical.
- Keep sentences short. One idea per sentence.

## Versioning

Strict semver: no breaking changes without a major version bump, including
technical refactors.

Every breaking change needs a MIGRATION.md entry under the target major's
heading, describing the change and the action required.

## Releases

`.github/workflows/release.yml` runs on a Monday cron against master with no
content gate: whatever is on master ships in the next release. It runs against
master only — a manual dispatch aimed at a version branch is a no-op, which is
what stops a staged major shipping before it is finished.

[`tanem/release-action`](https://github.com/tanem/release-action) derives the
bump from PR labels. Every PR merged since the last tag must carry exactly one
label, ignoring `safe to test`. It fails the run on unlabelled and on
multi-labelled PRs. `breaking` selects a major, `enhancement` a minor, anything
else a patch. Renovate labels its own PRs `internal`. A week with no merged PRs
is a clean skip, not a failure.

Release notes are published to
[GitHub Releases](https://github.com/tanem/react-nprogress/releases),
categorised by those same labels via `.github/release.yml`.

## Documentation

- After each code change, update all related docs and markdown files
  (README.md, MIGRATION.md, example READMEs, etc.) in the same pass.
- Do not modify CHANGELOG.md. It is frozen history as of v7.1.0; everything
  after that lives on GitHub Releases.
