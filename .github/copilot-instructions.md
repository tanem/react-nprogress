# Copilot Instructions for react-nprogress

Keep these instructions concise. Only add information here that meaningfully
changes agent behaviour and cannot be inferred from the codebase or tooling.

## Project

TypeScript React library providing a slim progress bar primitive via three
patterns: `useNProgress` hook, `NProgress` render-props component, and
`withNProgress` HOC. Exports logic only — no rendering. All exports go through
`src/index.tsx`. Types live in `src/types.ts`.

## Key Commands

```bash
npm test          # full suite: type-check, lint, build, all format tests
npm run build     # clean + compile + bundle
npm run format    # fix lint and formatting
```

## Code Standards

### Comments

- Use `//` line comments only — never `/* */` or `/** */`
- Explain _why_, not _what_; wrap at 80 characters

### Language

Use **New Zealand English** in all user-facing text, variable names, and
comments (e.g. "colour", "behaviour", "organisation"). Standardised API names
(`color`, `textAlign`) are fixed — leave them unchanged.

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

- `devDependencies` — pinned exact versions (no `^` or `~`)
- `dependencies` — caret ranges (`^`)
- `peerDependencies` — explicit OR ranges (e.g. `^16.8.0 || ^17.0.0 || ^18.0.0 || ^19.0.0`)
- Do **not** add `allowedVersions` to `renovate.json` without a documented reason

## Testing

- **100% code coverage** required across all build formats
- Always run `npm test` after changes; use `npm run test:src` for quick
  source-only feedback during development

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

## Versioning

Strict semver — no breaking changes without a major version bump, including
technical refactors.
