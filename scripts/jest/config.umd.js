const srcConfig = require('./config.src')

module.exports = Object.assign({}, srcConfig, {
  collectCoverage: false,
  moduleNameMapper: {
    '^../src$': `<rootDir>/dist/react-nprogress.umd.development.js`,
  },
  testMatch: ['<rootDir>/test/(use|with)?NProgress.spec.ts?(x)'],
})
