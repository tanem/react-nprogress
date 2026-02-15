# Copilot Instructions for react-nprogress

## Project Overview

**react-nprogress** is a React primitive for building slim progress bars. It's a TypeScript-based React port of rstacruz/nprogress that provides three API patterns:

- **Hook**: `useNProgress` for functional components
- **Render Props**: `NProgress` component with children function
- **HOC**: `withNProgress` higher-order component

The library exports only logic and renders nothing, allowing consumers to implement their own styling and presentation.

## Tech Stack & Dependencies

### Core Technologies

- **TypeScript** (v5.9.2) - Strict mode enabled, targeting ES modules
- **React** (v19+) - Supports React 16.8+ (hooks required), 17, 18, and 19
- **Rollup** - Multi-format bundling (CJS, ES, UMD dev/prod)

### Key Dependencies

- `@babel/runtime` - Runtime helpers for transpiled code
- `hoist-non-react-statics` - HOC static property preservation

### Development Tools

- **ESLint** (flat config) - TypeScript, React, and import sorting rules
- **Jest + @testing-library/react** - Unit testing with jsdom
- **Prettier** - Code formatting
- **mock-raf** - Animation frame mocking for tests

## Project Structure

```
src/
├── index.tsx              # Main exports (NProgress, useNProgress, withNProgress)
├── types.ts               # Options interface
├── useNProgress.tsx       # Core hook implementation
├── NProgress.tsx          # Render props component
├── withNProgress.tsx      # HOC implementation
├── clamp.ts               # Utility: clamp numbers between min/max
├── increment.ts           # Utility: progress increment logic
├── createQueue.ts         # Utility: async queue management
├── createTimeout.ts       # Utility: timeout management
├── useGetSetState.ts      # Custom hook for object state (from react-use)
├── useEffectOnce.ts       # Custom hook for mount-only effects
└── useUpdateEffect.ts     # Custom hook for skipping first effect run

test/                      # Jest tests with 100% coverage requirement
examples/                  # Usage examples (HOC, Material-UI, Next.js, etc.)
scripts/jest/              # Jest configurations for different build formats
```

## Development Workflow

### Essential Commands

```bash
# Install dependencies
npm install

# Full test suite (checks, lint, build, all format tests)
npm test

# Development commands
npm run check:types        # TypeScript type checking
npm run check:format       # Check Prettier formatting
npm run lint               # ESLint with TypeScript rules
npm run format             # Fix linting and format code

# Build process
npm run clean              # Remove compiled/dist/coverage
npm run compile            # TypeScript compilation to compiled/
npm run bundle             # Rollup bundling to dist/
npm run build              # Full clean + compile + bundle

# Individual format testing
npm run test:src           # Test source TypeScript
npm run test:cjs           # Test CommonJS build
npm run test:es            # Test ES modules build
npm run test:umd           # Test UMD dev build
npm run test:umdprod       # Test UMD prod build
```

### Build Process Details

1. **Clean**: Removes `compiled/`, `dist/`, `coverage/`
2. **Compile**: TypeScript → `compiled/` (ES modules, declarations → `dist/`)
3. **Bundle**: Rollup creates 5 builds in `dist/`:
   - `react-nprogress.cjs.development.js`
   - `react-nprogress.cjs.production.js`
   - `react-nprogress.esm.js` (main module export)
   - `react-nprogress.umd.development.js`
   - `react-nprogress.umd.production.js`

## Code Standards & Guidelines

### TypeScript Configuration

- **Strict mode** enabled with comprehensive flags
- **ES modules** as primary target (`esnext`)
- **React JSX** transform
- **Declaration files** generated for `dist/`

### ESLint Rules (Key Enforcements)

- Import sorting with `simple-import-sort`
- React hooks rules enforcement
- JSX prop sorting
- Key sorting in object literals
- No React import required (automatic JSX transform)

### Testing Requirements

- **100% code coverage** enforced across all build formats
- Tests use `@testing-library/react` with `jsdom`
- Mock `requestAnimationFrame` with `mock-raf`
- Test all three API patterns (hook, render props, HOC)

### File Naming & Organisation

- `.tsx` for React components, `.ts` for utilities
- Small, focused utility functions in separate files
- Custom hooks follow `use*` naming convention
- Export everything through main `index.tsx`

### Language & Documentation Standards

- **Use New Zealand English** at all times (e.g., "colour", "behaviour", "centre", "organisation")
- **In code examples**: Use NZ English for variable names, comments, and user-defined properties where possible
- **Exception**: Standardised API names (CSS properties like `color`, `textAlign: 'center'`, JavaScript APIs) must remain unchanged as they are fixed specifications
- **Avoid marketing speak** - keep documentation simple, grammatically correct, and technically accurate
- Focus on clarity and precision rather than promotional language
- Use proper technical terminology consistently

Example:

```javascript
// Good: NZ English in user code
const progressColour = '#0066cc'
const centredLayout = { textAlign: 'center' } // API name stays 'center'

// Comments and documentation
// Centres the progress bar with custom colour
```

### Commit Message Best Practices

Follow strict line length limits and clear formatting:

```
Subject line (max 50 characters)

Optional body text wrapped at 72 characters. Explain what and why,
not how. Reference any relevant issues.

- Use present tense ("add feature" not "added feature")
- Use imperative mood ("move cursor to..." not "moves cursor to...")
- Capitalise subject line
- No period at end of subject line
- Separate subject from body with blank line
```

### Dependency Management

This project uses **Renovate** for automated dependency updates. The `config:js-lib` preset governs versioning strategy — respect these conventions when adding or modifying dependencies:

- **devDependencies**: Always use **pinned exact versions** (no `^` or `~` prefix). Renovate pins devDependencies for reproducible builds.
- **Production dependencies** (`dependencies`): Use **`^` (caret) ranges**. Renovate applies a `bump` strategy, raising the minimum version in the range.
- **Peer dependencies**: Use explicit range expressions (e.g., `^16.8.0 || ^17.0.0 || ^18.0.0 || ^19.0.0`) to document supported versions.

Example:

```json
{
  "dependencies": {
    "@babel/runtime": "^7.28.6"
  },
  "devDependencies": {
    "jest": "30.2.0",
    "typescript": "5.9.3"
  }
}
```

Do **not** add `allowedVersions` constraints to `renovate.json` unless there is a clear, documented reason (e.g., a confirmed incompatibility). Stale constraints silently block updates.

## Architecture Patterns

### State Management

- Uses custom `useGetSetState` hook for complex state updates
- Refs for managing imperative APIs (queue, timeout)
- Side effects pattern for coordinating async operations

### Animation Strategy

- Queue-based approach for managing progress updates
- Timeout management for animation timing
- Automatic cleanup on component unmount

### Multi-Format Testing

The project tests against **6 different formats** to ensure broad compatibility:

- Source TypeScript (development)
- CommonJS (dev & prod)
- ES modules
- UMD (dev & prod)

## Common Development Tasks

### Adding New Features

1. Implement in `src/` with TypeScript
2. Export from `index.tsx`
3. Add comprehensive tests covering all API patterns
4. Update types in `types.ts` if needed
5. Run full test suite: `npm test`

### Working with Examples

- Examples are complete applications showing real usage
- Each has its own `package.json` and can be run independently
- Reference for integration patterns and styling approaches

### Debugging Build Issues

- Check TypeScript compilation: `npm run check:types`
- Test specific format: `npm run test:cjs` (or es, umd, etc.)
- Examine `dist/` contents after `npm run build`
- Verify coverage with `npm run test:src`

## Important Notes

### Peer Dependencies

React and ReactDOM are peer dependencies (not bundled). Support matrix:

- React 16.8+ (hooks required), 17, 18, 19
- Matching ReactDOM versions

### No Breaking Changes Without Major Version

This project follows semantic versioning strictly. Even technical refactors bump major versions to prevent consumer issues.

### UMD Builds for Legacy Support

UMD builds support pre-React 19 environments via unpkg CDN with specific React/ReactDOM version requirements.

### State Management Anti-patterns

- Don't use multiple instances without understanding queue isolation
- Always call cleanup functions in effect cleanup
- Be cautious with rapid start/stop toggling

This library is production-ready with extensive testing and serves as a reference for building TypeScript React libraries with multiple distribution formats.
