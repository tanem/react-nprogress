const srcConfig = require('./config.src')

// The ES module bundle is a `.mjs` file, which TypeScript always emits as ESM
// regardless of the `module` setting, so this config runs Jest in ESM mode
// rather than transpiling the suite down to CommonJS like the others.
module.exports = Object.assign({}, srcConfig, {
  collectCoverage: false,
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  moduleNameMapper: {
    ...srcConfig.moduleNameMapper,
    '^../src$': `<rootDir>/dist/react-nprogress.mjs`,
  },
  testMatch: ['<rootDir>/test/(use)?NProgress.spec.ts?(x)'],
  transform: {
    '^.+\\.([cm]?js|tsx?)$': [
      'ts-jest',
      { tsconfig: { module: 'esnext' }, useESM: true },
    ],
  },
})
