const srcConfig = require('./config.src')

module.exports = Object.assign({}, srcConfig, {
  collectCoverage: false,
  moduleNameMapper: {
    ...srcConfig.moduleNameMapper,
    '^../src$': `<rootDir>/dist/react-nprogress.cjs`,
  },
  testMatch: ['<rootDir>/test/(use)?NProgress.spec.ts?(x)'],
})
