const srcConfig = require('./config.src')

// Asserts facts about the contents of `dist`, so it needs a build and has
// nothing to say about the React version under test. Kept out of
// `config.src.js` on both counts: `test:src` stays runnable on a fresh clone,
// and the React matrix does not re-run it once per version.
module.exports = Object.assign({}, srcConfig, {
  collectCoverage: false,
  testEnvironment: 'node',
  testMatch: ['<rootDir>/test/bundles.spec.ts'],
  // `config.src.js` ignores this spec, so the inherited value has to go or
  // there would be nothing left to run.
  testPathIgnorePatterns: ['/node_modules/'],
})
