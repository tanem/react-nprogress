'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./react-nprogress.cjs.production.js')
} else {
  module.exports = require('./react-nprogress.cjs.development.js')
}
