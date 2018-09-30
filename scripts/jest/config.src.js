module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ['src/index.tsx'],
  globals: {
    'ts-jest': { tsConfigFile: require.resolve('../../tsconfig.test.json') }
  },
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  rootDir: process.cwd(),
  roots: ['<rootDir>/test'],
  setupFiles: ['raf/polyfill', require.resolve('./setupEnvironment')],
  testMatch: ['<rootDir>/test/*.spec.ts?(x)'],
  transform: { '^.+\\.(js|tsx?)$': 'ts-jest' },

  // The following can be removed when a new Jest version is published that
  // contains the following fix:
  // https://github.com/facebook/jest/commit/b6d575287e820bf6a3d9d164bb990177d63f5996
  testURL: 'http://localhost'
}
