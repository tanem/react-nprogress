const path = require('path')

// When REACT_VERSION is set (e.g. "18.0"), resolve react, react-dom and
// @testing-library/react from the matching test/react/<version> directory so
// the test suite runs against that specific React version.
const generateReactVersionMappings = (reactVersion) => {
  if (!reactVersion) {
    return {}
  }

  const testDir = path.join(process.cwd(), 'test', 'react', reactVersion)
  const [major] = reactVersion.split('.').map(Number)

  const reactDir = path.dirname(
    require.resolve('react/package.json', { paths: [testDir] }),
  )
  const reactDomDir = path.dirname(
    require.resolve('react-dom/package.json', { paths: [testDir] }),
  )

  const mappings = {
    '^react$': require.resolve('react', { paths: [testDir] }),
    '^react-dom$': require.resolve('react-dom', { paths: [testDir] }),
    '^react-dom/(.*)$': `${reactDomDir}/$1`,
    '^react/(.*)$': `${reactDir}/$1`,
  }

  // React 16 and 17 use @testing-library/react 12.x which does not export
  // renderHook. A shim re-exports it from @testing-library/react-hooks instead.
  if (major < 18) {
    mappings['^@testing-library/react$'] = path.join(
      testDir,
      '..',
      'testing-library-shim.js',
    )
  } else {
    mappings['^@testing-library/react$'] = require.resolve(
      '@testing-library/react',
      { paths: [testDir] },
    )
  }

  return mappings
}

// React 16 and 17 boundary tests produce harmless "wrong act()" warnings from
// @testing-library/react-hooks. A setup file suppresses them.
const generateSetupFiles = (reactVersion) => {
  if (!reactVersion) {
    return []
  }

  const [major] = reactVersion.split('.').map(Number)
  if (major < 18) {
    return [path.join(__dirname, 'setupReact.js')]
  }

  return []
}

module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ['src/*.{ts,tsx}'],
  coverageReporters: ['lcov', 'text'],
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  moduleNameMapper: {
    ...generateReactVersionMappings(process.env.REACT_VERSION),
  },
  preset: 'ts-jest',
  rootDir: process.cwd(),
  roots: ['<rootDir>/test'],
  setupFilesAfterEnv: generateSetupFiles(process.env.REACT_VERSION),
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/test/*.spec.ts?(x)'],
  transform: { '^.+\\.(js|tsx?)$': 'ts-jest' },
}
