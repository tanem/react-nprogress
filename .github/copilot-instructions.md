# Copilot Instructions for react-nprogress

Keep these instructions concise. Only add information here that meaningfully
changes agent behaviour and cannot be inferred from the codebase or tooling.

## Project

TypeScript React library providing a slim progress bar primitive via three
patterns: `useNProgress` hook, `NProgress` render-props component, and
`withNProgress` HOC. Exports logic only, not rendering. All exports go through
`src/index.tsx`. Types live in `src/types.ts`.

## Key Commands

```bash
npm test          # full suite: type-check, lint, build, all format tests
npm run build     # clean + compile + bundle
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

- **100% code coverage** required across all build formats
- Always run `npm test` after changes; use `npm run test:src` for quick
  source-only feedback during development
- Use `npm run test:react` for the full React version matrix independently.
  It also runs as part of `npm test` (via the `test:*` glob).

### React version matrix

We test boundary versions only: first and last minor of each supported
major. See `test/react/` for current versions.

Current boundaries: 16.14, 17.0, 18.0, 18.3, 19.0.

React 16.14 is the practical lower bound. Hooks require 16.8 and
`@testing-library/react-hooks` requires 16.9.

When adding a new boundary:

1. Add `test/react/<version>/package.json` with correct `react`,
   `react-dom`, and `@testing-library/react` (12.x for React 16–17,
   16.x for React 18+). React 16–17 also need
   `@testing-library/react-hooks` (8.x) and `react-test-renderer`.
2. Replace the previous "latest minor" for that major.
3. Verify with a single-version run before the full matrix:
   ```bash
   cd test/react/<version> && npm i --no-package-lock --quiet --no-progress
   REACT_VERSION=<version> npx jest --config ./scripts/jest/config.src.js --coverage false
   ```
4. Update the boundary list above.

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

## Documentation

- After each code change, update all related docs and markdown files
  (README.md, MIGRATION.md, example READMEs, etc.) in the same pass.
- Do not manually modify CHANGELOG.md. It is auto-generated during
  release.
